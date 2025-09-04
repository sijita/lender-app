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

  // Reset pagination when status filter changes
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

      // All filtering, sorting, and pagination is now handled after getting loan data

      // Get all clients with their loan data first (without pagination for filtering)
      const { data: allClientsData, error: allClientsError } = await supabase
        .from('clients')
        .select('*');

      if (allClientsError) throw allClientsError;

      const clientsWithLoans = await Promise.all(
        allClientsData.map(async client => {
          const { data: loans, error: loansError } = await supabase
            .from('loans')
            .select('status, outstanding')
            .eq('client_id', client.id);

          if (loansError) throw loansError;

          const outstanding = loans.reduce(
            (total, loan) => total + parseFloat(loan.outstanding),
            0
          );

          const hasActiveLoansWithoutDefaulted = loans.some(
            loan => loan.status === 'active'
          );
          const hasActiveLoansWithDefaulted = loans.some(
            loan => loan.status === 'defaulted'
          );

          const clientStatus = hasActiveLoansWithoutDefaulted
            ? 'pending'
            : hasActiveLoansWithDefaulted
              ? 'defaulted'
              : 'completed';

          return {
            ...client,
            outstanding,
            status: clientStatus,
          };
        })
      );

      // Filter by status first
      let filteredClients = clientsWithLoans;
      if (status && status !== 'all') {
        filteredClients = clientsWithLoans.filter(
          client => client.status === status
        );
      }

      // Apply search filter if provided
      if (searchQuery && searchQuery.trim() !== '') {
        const isNumeric = /^\d+$/.test(searchQuery);
        filteredClients = filteredClients.filter(client => {
          if (isNumeric) {
            return client.document_number === searchQuery;
          } else {
            const searchLower = searchQuery.toLowerCase();
            return (
              client.name.toLowerCase().includes(searchLower) ||
              client.last_name.toLowerCase().includes(searchLower) ||
              client.email.toLowerCase().includes(searchLower) ||
              client.phone.toLowerCase().includes(searchLower)
            );
          }
        });
      }

      // Apply sorting
      if (orderBy) {
        filteredClients.sort((a, b) => {
          const aValue = orderBy === 'name' ? a.name : a.document_number;
          const bValue = orderBy === 'name' ? b.name : b.document_number;

          if (orderDirection === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        });
      }

      // Set total count after filtering
      setTotalClients(filteredClients.length);

      // Apply pagination
      const from = (currentPage - 1) * currentPageSize;
      const to = from + currentPageSize;
      const paginatedClients = filteredClients.slice(from, to);

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
