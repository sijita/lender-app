import { supabase } from '@/lib/supabase';
import { Client } from '@/schemas/clients/client-schema';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function useFetchClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'defaulted' | 'completed'
  >('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const fetchClients = async (queryParams?: {
    searchQuery?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    status?: 'pending' | 'defaulted' | 'completed' | 'all';
    page?: number;
    pageSize?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const activeParams = queryParams || {};
      const { searchQuery, orderBy, orderDirection, status } = activeParams;
      const currentPage = activeParams.page ?? page;
      const currentPageSize = activeParams.pageSize ?? pageSize;

      const applySearchFilters = (query: any) => {
        if (searchQuery && searchQuery.trim() !== '') {
          const isNumeric = /^\d+$/.test(searchQuery);
          if (isNumeric) {
            return query.eq('document_number', searchQuery);
          } else {
            const terms = searchQuery
              .trim()
              .split(' ')
              .filter(term => term.length > 0);

            if (terms.length === 1) {
              return query.or(
                `name.ilike.%${terms[0]}%,last_name.ilike.%${terms[0]}%,email.ilike.%${terms[0]}%,phone.ilike.%${terms[0]}%`
              );
            } else if (terms.length === 2) {
              return query
                .ilike('name', `%${terms[0]}%`)
                .ilike('last_name', `%${terms[1]}%`);
            } else if (terms.length > 2) {
              const firstName = terms[0];
              const lastName = terms.slice(1).join(' ');
              return query
                .ilike('name', `%${firstName}%`)
                .ilike('last_name', `%${lastName}%`);
            }
          }
        }
        return query;
      };

      if (status && status !== 'all') {
        let allClientsQuery = supabase.from('clients').select(`
            *,
            loans(
              status,
              outstanding
            )
          `);

        allClientsQuery = applySearchFilters(allClientsQuery);

        // Apply sorting
        if (orderBy) {
          const column = orderBy === 'name' ? 'name' : 'document_number';
          allClientsQuery = allClientsQuery.order(column, {
            ascending: orderDirection === 'asc',
          });
        }

        const { data: allClientsData, error: allClientsError } =
          await allClientsQuery;
        if (allClientsError) throw allClientsError;

        // Process all clients and filter by status
        const allProcessedClients = allClientsData.map(client => {
          const loans = client.loans || [];
          const outstanding = loans.reduce(
            (total: number, loan: any) =>
              total + parseFloat(loan.outstanding || 0),
            0
          );
          const hasActiveLoans = loans.some(
            (loan: any) => loan.status === 'active'
          );
          const hasDefaultedLoans = loans.some(
            (loan: any) => loan.status === 'defaulted'
          );
          const clientStatus = hasActiveLoans
            ? 'pending'
            : hasDefaultedLoans
              ? 'defaulted'
              : 'completed';

          return {
            ...client,
            outstanding,
            status: clientStatus,
          };
        });

        const filteredByStatus = allProcessedClients.filter(
          client => client.status === status
        );

        // Set total count
        setTotalClients(filteredByStatus.length);

        // Apply pagination to filtered results
        const from = (currentPage - 1) * currentPageSize;
        const paginatedClients = filteredByStatus.slice(
          from,
          from + currentPageSize
        );

        setClients(
          paginatedClients.map(client => ({
            id: client.id,
            name: client.name,
            lastName: client.last_name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            subAddress: client.sub_address,
            documentType: client.document_type,
            documentNumber: client.document_number,
            notes: client.notes,
            outstanding: client.outstanding,
            status: client.status,
          }))
        );

        return; // Exit early for status filtering
      }

      // For 'all' status or no status filter, use optimized pagination
      let query = supabase.from('clients').select(`
          *,
          loans(
            status,
            outstanding
          )
        `);

      query = applySearchFilters(query);

      // Apply sorting at database level
      if (orderBy) {
        const column = orderBy === 'name' ? 'name' : 'document_number';
        query = query.order(column, { ascending: orderDirection === 'asc' });
      }

      // Get total count for pagination
      let countQuery = supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });
      countQuery = applySearchFilters(countQuery);
      const { count, error: countError } = await countQuery;
      if (countError) throw countError;

      // Apply pagination at database level
      const from = (currentPage - 1) * currentPageSize;
      query = query.range(from, from + currentPageSize - 1);

      const { data: clientsData, error: clientsError } = await query;
      if (clientsError) throw clientsError;

      // Process clients with their loan data
      const processedClients = clientsData.map(client => {
        const loans = client.loans || [];

        const outstanding = loans.reduce(
          (total: number, loan: any) =>
            total + parseFloat(loan.outstanding || 0),
          0
        );

        const hasActiveLoans = loans.some(
          (loan: any) => loan.status === 'active'
        );
        const hasDefaultedLoans = loans.some(
          (loan: any) => loan.status === 'defaulted'
        );

        const clientStatus = hasActiveLoans
          ? 'pending'
          : hasDefaultedLoans
            ? 'defaulted'
            : 'completed';

        return {
          ...client,
          outstanding,
          status: clientStatus,
        };
      });

      setTotalClients(count || 0);
      setClients(
        processedClients.map(client => ({
          id: client.id,
          name: client.name,
          lastName: client.last_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          subAddress: client.sub_address,
          documentType: client.document_type,
          documentNumber: client.document_number,
          notes: client.notes,
          outstanding: client.outstanding,
          status: client.status,
        }))
      );
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients({
      searchQuery: debouncedSearchQuery,
      orderBy,
      orderDirection,
      status: statusFilter,
      page,
      pageSize,
    });
  }, [
    page,
    pageSize,
    debouncedSearchQuery,
    orderBy,
    orderDirection,
    statusFilter,
  ]);

  return {
    clients,
    loading,
    error,
    orderBy,
    orderDirection,
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    setOrderBy,
    setOrderDirection,
    refetch: fetchClients,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalClients,
  };
}
