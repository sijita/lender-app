import { useState, useEffect } from 'react';
import { Client, clientSchema } from '@/schemas/clients/client-schema';
import { ZodError } from 'zod';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useToast } from '@/components/ui/toast-context';

export default function useHandleEditClientForm(clientId: number) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Client, string>>>(
    {}
  );
  const [formData, setFormData] = useState<Client>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    subAddress: '',
    documentType: '',
    documentNumber: '',
    notes: '',
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            id: data.id,
            name: data.name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            subAddress: data.sub_address || '',
            documentType: data.document_type,
            documentNumber: data.document_number.toString(),
            notes: data.notes || '',
          });
        }
      } catch (error: any) {
        console.error('Error fetching client data:', error);
        showToast({
          message: 'Error al cargar los datos del cliente',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const handleChange = (field: keyof Client, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      clientSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof Client, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof Client;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const updateClient = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Por favor, complete todos los campos correctamente.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        sub_address: formData.subAddress,
        document_type: formData.documentType,
        document_number: Number(formData.documentNumber),
        notes: formData.notes,
      };

      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      showToast({
        message: 'Cliente actualizado correctamente',
        type: 'success',
      });

      router.push(`/client/${clientId}`);
    } catch (error: any) {
      console.error('Error updating client:', error);
      showToast({
        message:
          error.message ??
          'Error al actualizar el cliente, inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    errors,
    formData,
    handleChange,
    validateForm,
    updateClient,
  };
}
