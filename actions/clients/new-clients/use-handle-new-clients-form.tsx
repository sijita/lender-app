import { useState } from 'react';
import { Client, clientSchema } from '@/schemas/clients/client-schema';
import { ZodError } from 'zod';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useToast } from '@/components/ui/toast-context';

export default function useHandleNewClientsForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const saveClient = async () => {
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
        document_number: formData.documentNumber,
        notes: formData.notes,
      };

      const { error } = await supabase
        .from('clients')
        .insert(clientData)
        .select();

      if (error) {
        throw error;
      }

      setFormData({
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

      showToast({
        message: 'Cliente guardado correctamente',
        type: 'success',
      });

      router.push('/clients');
    } catch (error: any) {
      console.error('Error saving client:', error);
      showToast({
        message:
          error.message ?? 'Error al guardar el cliente, inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errors,
    formData,
    handleChange,
    validateForm,
    saveClient,
  };
}
