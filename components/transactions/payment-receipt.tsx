import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { format } from '@formkit/tempo';
import { formatCurrency } from '@/utils';
import {
  Download,
  Mail,
  MessageCircle,
  Receipt,
  CheckCircle,
  Calendar,
  User,
  CreditCard,
  DollarSign,
  Share as ShareIcon,
} from 'lucide-react-native';
import { getLoanStatusText, getPaymentMethodText } from '@/utils/loans';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import CustomSafeScreen from '../ui/custom-safe-screen';

// Types
export interface PaymentReceiptProps {
  transactionId?: string;
  amount: number;
  date: Date;
  method: string;
  notes?: string;
  status: string;
  quotasCovered?: number;
  client: {
    name: string;
    lastName: string;
    documentNumber: string;
    email?: string;
    phone?: string;
  };
  loan: {
    id?: number;
    previousBalance: number;
    currentBalance: number;
    quota: number;
    partialQuota?: number;
  };
}

export default function PaymentReceipt({
  receiptData,
  onClose,
}: {
  receiptData?:
    | PaymentReceiptProps
    | {
        paymentData: {
          id?: string;
          amount: number;
          date: Date;
          method: string;
          notes?: string;
          status: string;
          quotas: number;
          reference?: string;
        };
        clientData: {
          id: number;
          name: string;
          lastName: string;
          documentNumber: string;
          email?: string;
          phone?: string;
        };
        loanData: {
          id: number;
          outstanding: number;
          previousOutstanding: number;
          quota: number;
        };
      };
  onClose: () => void;
}) {
  const viewShotRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  if (!receiptData) {
    return null;
  }

  // Determine data structure
  const isNewFormat = 'paymentData' in receiptData;
  const paymentData = isNewFormat ? receiptData.paymentData : receiptData;
  const clientData = isNewFormat ? receiptData.clientData : receiptData.client;
  const loanData = isNewFormat ? receiptData.loanData : receiptData.loan;

  const currentDate = new Date();
  const receiptNumber = `${'paymentData' in receiptData ? receiptData.paymentData.id : receiptData.transactionId}`;

  const hasContactInfo = clientData.email || clientData.phone;

  // Función para capturar screenshot mejorada
  const captureReceipt = async (): Promise<string | null> => {
    try {
      setIsCapturing(true);

      if (Platform.OS === 'web') {
        // Código para web
        try {
          const html2canvas = require('html2canvas');
          const receiptElement = document.getElementById('payment-receipt');
          if (receiptElement) {
            const canvas = await html2canvas(receiptElement, {
              backgroundColor: '#ffffff',
              scale: 2,
              useCORS: true,
              allowTaint: true,
            });
            setIsCapturing(false);
            return canvas.toDataURL('image/png');
          }
        } catch (requireError) {
          console.warn('html2canvas not available');
        }
        setIsCapturing(false);
        return null;
      } else {
        // Para móvil - Usar captureRef con el ref del View
        console.log('Iniciando captura en móvil...');

        if (!viewShotRef.current) {
          console.error('ViewShot ref is null');
          setIsCapturing(false);
          return null;
        }

        try {
          // Usar captureRef que es una función importada
          const uri = await captureRef(viewShotRef.current, {
            format: 'png',
            quality: 0.95,
            result: 'tmpfile',
          });
          console.log('Captura exitosa:', uri);
          setIsCapturing(false);
          return uri;
        } catch (captureError) {
          console.error('Error en captureRef():', captureError);
          setIsCapturing(false);
          return null;
        }
      }
    } catch (error) {
      console.error('Error general capturing receipt:', error);
      setIsCapturing(false);
      Alert.alert('Error', 'No se pudo capturar el recibo');
      return null;
    }
  };

  // Función para guardar en galería
  const saveToGallery = async (uri: string) => {
    try {
      // Solicitar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        // No mostrar alert aquí, solo retornar false
        console.log('Permisos de galería no otorgados');
        return false;
      }

      // Crear asset y guardarlo en un álbum
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Recibos');

      if (album == null) {
        await MediaLibrary.createAlbumAsync('Recibos', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Éxito', 'Recibo guardado en la galería');
      return true;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      // No mostrar alert de error aquí
      return false;
    }
  };

  const handleEmailSend = async () => {
    try {
      const imageUri = await captureReceipt();

      if (!imageUri) {
        Alert.alert('Error', 'No se pudo generar el recibo');
        return;
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `recibo-${receiptNumber}.png`;

        const subject = encodeURIComponent(`Recibo de Pago - ${receiptNumber}`);
        const body = encodeURIComponent(
          `Adjunto encontrarás el recibo de pago por ${formatCurrency(paymentData.amount)}.\n\nGracias por tu pago.`
        );
        const emailUrl = `mailto:${clientData.email}?subject=${subject}&body=${body}`;

        window.open(emailUrl);
        link.click();
      } else {
        // Guardar primero en galería
        await saveToGallery(imageUri);

        // Abrir cliente de email
        const subject = `Recibo de Pago - ${receiptNumber}`;
        const body = `Recibo de pago por ${formatCurrency(paymentData.amount)}\n\nCliente: ${clientData.name} ${clientData.lastName}\nFecha: ${format(paymentData.date, 'DD/MM/YYYY', 'es')}\n\nPor favor adjunta el recibo desde tu galería.`;

        const emailUrl = `mailto:${clientData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        const canOpen = await Linking.canOpenURL(emailUrl);
        if (canOpen) {
          await Linking.openURL(emailUrl);
        } else {
          // Si no puede abrir el cliente de email, usar compartir
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(imageUri, {
              mimeType: 'image/png',
              dialogTitle: subject,
            });
          } else {
            await Share.share({
              message: body,
              title: subject,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sharing receipt via email:', error);
      Alert.alert('Error', 'No se pudo enviar el recibo por email');
    }
  };

  const handleWhatsAppSend = async () => {
    try {
      const imageUri = await captureReceipt();

      if (!imageUri) {
        Alert.alert('Error', 'No se pudo generar el recibo');
        return;
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `recibo-${receiptNumber}.png`;
        link.click();

        const message = `Recibo de pago por ${formatCurrency(paymentData.amount)}`;
        const phoneNumber = clientData.phone?.replace(/[^\d]/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 500);
      } else {
        // Para móvil - Compartir directamente la imagen
        const message = `Recibo de pago por ${formatCurrency(paymentData.amount)}\n\nCliente: ${clientData.name} ${clientData.lastName}\nFecha: ${format(paymentData.date, 'DD/MM/YYYY', 'es')}`;

        // Usar Sharing API para compartir la imagen
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(imageUri, {
            mimeType: 'image/png',
            dialogTitle: 'Enviar recibo por WhatsApp',
            UTI: 'image/png', // Para iOS
          });
        } else {
          // Fallback a Share nativo
          await Share.share({
            message: message,
            url: imageUri,
            title: 'Recibo de Pago',
          });
        }
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      Alert.alert('Error', 'No se pudo compartir el recibo');
    }
  };

  const handleDownload = async () => {
    try {
      const imageUri = await captureReceipt();

      if (!imageUri) {
        Alert.alert('Error', 'No se pudo generar el recibo');
        return;
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `recibo-${receiptNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para móvil - Intentar guardar en galería primero, si falla, compartir
        const saved = await saveToGallery(imageUri);

        // Si no se pudo guardar en galería (por permisos o error), compartir directamente
        if (!saved) {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(imageUri, {
              mimeType: 'image/png',
              dialogTitle: 'Guardar recibo',
            });
          } else {
            await Share.share({
              title: `Recibo de Pago - ${receiptNumber}`,
              url: imageUri,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      Alert.alert('Error', 'No se pudo descargar el recibo');
    }
  };

  // Función unificada para compartir en móvil
  const handleMobileShare = async () => {
    try {
      const imageUri = await captureReceipt();

      if (!imageUri) {
        Alert.alert('Error', 'No se pudo generar el recibo');
        return;
      }

      const message = `Recibo de pago por ${formatCurrency(paymentData.amount)}\n\nCliente: ${clientData.name} ${clientData.lastName}\nFecha: ${format(paymentData.date, 'DD/MM/YYYY', 'es')}`;

      // Usar Sharing API para mostrar el diálogo nativo de compartir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartir recibo',
          UTI: 'image/png', // Para iOS
        });
      } else {
        // Fallback a Share nativo
        await Share.share({
          message: message,
          url: imageUri,
          title: 'Recibo de Pago',
        });
      }
    } catch (error) {
      console.error('Error sharing receipt:', error);
      Alert.alert('Error', 'No se pudo compartir el recibo');
    }
  };

  // Contenido del recibo
  const ReceiptContent = () => (
    <View>
      <View className="items-center p-6 bg-green-500 rounded-t-2xl">
        <Receipt size={40} color="white" />
        <Text className="mt-2 text-xl text-white font-geist-bold">
          Recibo de Pago
        </Text>
        <Text className="text-green-100 font-geist-medium">
          {receiptNumber}
        </Text>
      </View>
      <View className="gap-6 p-6 bg-white">
        <View className="flex-row justify-center items-center p-4 bg-green-50 rounded-xl">
          <CheckCircle size={24} color="#22c55e" />
          <Text className="ml-2 text-green-700 font-geist-medium">
            Pago registrado exitosamente
          </Text>
        </View>
        <View className="gap-3">
          <Text className="text-lg text-gray-800 font-geist-bold">
            Información del Cliente
          </Text>
          <View className="gap-2 p-4 bg-gray-50 rounded-xl">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-800 font-geist-medium">
                {clientData.name} {clientData.lastName}
              </Text>
            </View>
            <View className="flex-row items-center">
              <CreditCard size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-600">
                CC: {clientData.documentNumber}
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-3">
          <Text className="text-lg text-gray-800 font-geist-bold">
            Detalles del Pago
          </Text>
          <View className="gap-3 p-4 bg-gray-50 rounded-xl">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Fecha:</Text>
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" />
                <Text className="ml-1 text-gray-800 font-geist-medium">
                  {format(paymentData.date, 'DD/MM/YYYY', 'es')}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Monto:</Text>
              <View className="flex-row items-center">
                <DollarSign size={16} color="#22c55e" />
                <Text className="ml-1 text-green-600 font-geist-bold">
                  {formatCurrency(paymentData.amount).split('$')[1]}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Método:</Text>
              <Text className="text-gray-800 font-geist-medium">
                {getPaymentMethodText(paymentData.method)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Estado:</Text>
              <Text
                className={`font-geist-medium ${
                  paymentData.status === 'completed'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                {getLoanStatusText(paymentData.status)}
              </Text>
            </View>
            {((isNewFormat &&
              'quotas' in paymentData &&
              paymentData.quotas > 0) ||
              (!isNewFormat &&
                'quotasCovered' in receiptData &&
                receiptData.quotasCovered &&
                receiptData.quotasCovered > 0)) && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Cuotas cubiertas:</Text>
                <Text className="text-gray-800 font-geist-medium">
                  {isNewFormat && 'quotas' in paymentData
                    ? paymentData.quotas
                    : !isNewFormat && 'quotasCovered' in receiptData
                      ? receiptData.quotasCovered
                      : 0}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="gap-3">
          <Text className="text-lg text-gray-800 font-geist-bold">
            Estado de la Cuenta
          </Text>
          <View className="gap-2 p-4 bg-blue-50 rounded-xl">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Saldo anterior:</Text>
              <Text className="text-gray-800 font-geist-medium">
                {formatCurrency(
                  isNewFormat
                    ? 'previousOutstanding' in loanData
                      ? loanData.previousOutstanding
                      : 0
                    : 'previousBalance' in loanData
                      ? loanData.previousBalance
                      : 0
                )}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Saldo actual:</Text>
              <Text className="text-blue-600 font-geist-bold">
                {formatCurrency(
                  isNewFormat
                    ? 'outstanding' in loanData
                      ? loanData.outstanding
                      : 0
                    : 'currentBalance' in loanData
                      ? loanData.currentBalance
                      : 0
                )}
              </Text>
            </View>
          </View>
        </View>
        {paymentData.notes && (
          <View className="gap-2">
            <Text className="text-lg text-gray-800 font-geist-bold">Notas</Text>
            <Text className="p-3 text-gray-600 bg-gray-50 rounded-xl">
              {paymentData.notes}
            </Text>
          </View>
        )}
        <View className="pt-4 border-t border-gray-200">
          <Text className="text-xs text-center text-gray-500">
            Recibo generado el {format(currentDate, 'DD/MM/YYYY HH:mm', 'es')}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <CustomSafeScreen>
      {/* ViewShot para capturar en todas las plataformas */}
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 0.95,
          result: Platform.OS === 'web' ? 'base64' : 'tmpfile',
        }}
        style={{
          width: Platform.OS === 'web' ? '100%' : '100%',
          maxWidth: 448,
        }}
      >
        {Platform.OS === 'web' ? (
          <View id="payment-receipt">
            <ReceiptContent />
          </View>
        ) : (
          <ReceiptContent />
        )}
      </ViewShot>
      <View className="gap-4 mt-4 w-full max-w-md">
        {Platform.OS === 'web' ? (
          // Botones para web - mantener funcionalidad específica
          <>
            {hasContactInfo && (
              <>
                <Text className="text-lg text-center text-black font-geist-semibold">
                  Enviar recibo
                </Text>
                <View className="flex-row gap-3">
                  {clientData.email && (
                    <TouchableOpacity
                      onPress={handleEmailSend}
                      disabled={isCapturing}
                      className={`flex-row flex-1 justify-center items-center p-3 rounded-xl ${
                        isCapturing ? 'bg-blue-300' : 'bg-blue-500'
                      }`}
                    >
                      <Mail size={18} color="white" />
                      <Text className="ml-2 text-white font-geist-medium">
                        {isCapturing ? 'Procesando...' : 'Email'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {clientData.phone && (
                    <TouchableOpacity
                      onPress={handleWhatsAppSend}
                      disabled={isCapturing}
                      className={`flex-row flex-1 justify-center items-center p-3 rounded-xl ${
                        isCapturing ? 'bg-green-300' : 'bg-green-500'
                      }`}
                    >
                      <MessageCircle size={18} color="white" />
                      <Text className="ml-2 text-white font-geist-medium">
                        {isCapturing ? 'Procesando...' : 'WhatsApp'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
            <TouchableOpacity
              onPress={handleDownload}
              disabled={isCapturing}
              className={`flex-row justify-center items-center p-4 rounded-xl ${
                isCapturing ? 'bg-gray-600' : 'bg-gray-800'
              }`}
            >
              <Download size={18} color="white" />
              <Text className="ml-2 text-white font-geist-medium">
                {isCapturing ? 'Generando...' : 'Descargar Recibo'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          // Botón único para móvil - diálogo nativo de compartir
          <TouchableOpacity
            onPress={handleMobileShare}
            disabled={isCapturing}
            className={`flex-row justify-center items-center p-4 rounded-xl ${
              isCapturing ? 'bg-blue-300' : 'bg-blue-500'
            }`}
          >
            <ShareIcon size={18} color="white" />
            <Text className="ml-2 text-white font-geist-medium">
              {isCapturing ? 'Generando...' : 'Compartir Recibo'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onClose}
          className="flex-row justify-center items-center p-4 bg-gray-200 rounded-xl"
        >
          <Text className="text-gray-800 font-geist-medium">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeScreen>
  );
}
