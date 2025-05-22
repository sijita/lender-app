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

      let query = supabase.from('clients').select('*', { count: 'exact' });

      if (searchQuery && searchQuery.trim() !== '') {
        const isNumeric = /^\d+$/.test(searchQuery);

        if (isNumeric) {
          query = query.or(`document_number.eq.${searchQuery}`);
        } else {
          query = query.or(
            `name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`
          );
        }
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      // Paginación
      const from = (currentPage - 1) * currentPageSize;
      const to = from + currentPageSize - 1;
      query = query.range(from, to);

      const { data: clientsData, error: clientsError, count } = await query;

      if (clientsError) throw clientsError;
      setTotalClients(count ?? 0);

      const clientsWithLoans = await Promise.all(
        clientsData.map(async (client) => {
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
            (loan) => loan.status === 'active'
          );
          const hasActiveLoansWithDefaulted = loans.some(
            (loan) => loan.status === 'defaulted'
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

      let filteredClients = clientsWithLoans;
      if (status && status !== 'all') {
        filteredClients = clientsWithLoans.filter(
          (client) => client.status === status
        );
      }

      setClients(
        filteredClients.map((client) => ({
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
    fetchClients({ page, pageSize });
  }, [page, pageSize]);

  useEffect(() => {
    fetchClients({
      searchQuery: debouncedSearchQuery,
    });
  }, [debouncedSearchQuery]);

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
