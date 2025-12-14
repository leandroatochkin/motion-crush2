// PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button } from '@mui/material';
import { useVerifyPaymentMutation } from '../../api/paymentsApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePlan } from '../../store/slices/User';
import { BarLoader } from 'react-spinners';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'pending' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Capturar preapproval_id (parámetro de MercadoPago para suscripciones)
    const preapprovalId = searchParams.get('preapproval_id') || 
                          searchParams.get('preapprovalid');
    
    // Fallback a payment_id por si acaso
    const paymentId = searchParams.get('payment_id');
    const collectionStatus = searchParams.get('collection_status');
    
    const subscriptionId = preapprovalId || paymentId;

    console.log('📋 Payment callback params:', {
      preapprovalId,
      paymentId,
      collectionStatus,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Verificar el estado con tu backend
    const handleVerifyPayment = async () => {
      if (!subscriptionId) {
        setStatus('error');
        setMessage('No se encontró el ID de suscripción en la URL');
        setLoading(false);
        return;
      }

      try {
        const response = await verifyPayment({
          userId: user.id,
          preapprovalId: subscriptionId, // ✅ Usar preapprovalId
        });
        
        console.log('✅ Verification response:', response);
        
        if (response.data?.status === 'authorized') {
          setStatus('success');
          setMessage('¡Tu suscripción ha sido activada exitosamente!');
          
          // Actualizar el estado del usuario localmente
          if (response.data?.plan) {
            dispatch(updatePlan({
              plan: response.data.plan,
              subscriptionId: subscriptionId
            }));
          }
          
          setTimeout(() => {
            navigate('/draw');
          }, 3000);
          
        } else if (response.data?.status === 'pending') {
          setStatus('pending');
          setMessage('Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.');
          
        } else {
          setStatus('error');
          setMessage('Hubo un problema con tu pago. Por favor, contacta a soporte.');
        }
      } catch (error: any) {
        console.error('❌ Error verifying payment:', error);
        setStatus('error');
        setMessage('Error al verificar el pago. Por favor, contacta a soporte.');
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) {
      handleVerifyPayment();
    } else {
      setStatus('error');
      setMessage('No se encontró información del pago');
      setLoading(false);
    }
  }, [searchParams, verifyPayment, user.id, dispatch, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        p: 4
      }}
    >
      {isVerifying && (
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500
          }}
        >
          <Typography variant="h5" gutterBottom>
            Verificando pago...
          </Typography>
          <Box sx={{ mt: 3 }}>
            <BarLoader color={theme.colors.primary} width="100%" />
          </Box>
        </Paper>
      )}

      {!isVerifying && status === 'success' && (
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500
          }}
        >
          <Box sx={{ fontSize: '80px', mb: 2 }}>✅</Box>
          <Typography variant="h4" gutterBottom color="success.main">
            ¡Pago exitoso!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Redirigiendo al panel...
          </Typography>
        </Paper>
      )}

      {!isVerifying && status === 'pending' && (
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500
          }}
        >
          <Box sx={{ fontSize: '80px', mb: 2 }}>⏳</Box>
          <Typography variant="h4" gutterBottom color="warning.main">
            Pago en proceso
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/draw')}
            sx={{ mt: 2 }}
          >
            Ir al panel
          </Button>
        </Paper>
      )}

      {!isVerifying && status === 'error' && (
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500
          }}
        >
          <Box sx={{ fontSize: '80px', mb: 2 }}>❌</Box>
          <Typography variant="h4" gutterBottom color="error.main">
            Error
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Contacta a soporte en: {import.meta.env.VITE_REACH_EMAIL}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/planes')}
            >
              Intentar nuevamente
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/draw')}
            >
              Volver al panel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentSuccess;