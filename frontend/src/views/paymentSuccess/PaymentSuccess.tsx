// PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useVerifyPaymentMutation } from '../../api/paymentsApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updatePlan } from '../../store/slices/User';
import { BarLoader } from 'react-spinners';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'pending' | 'error'>('success');
  const [verifyPayment, {isLoading: isVerifying}] = useVerifyPaymentMutation()
  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user);
  const dispatch =  useDispatch()

  useEffect(() => {
    const collectionStatus = searchParams.get('collection_status');
    const paymentId = searchParams.get('payment_id');
    
    // Verificar el estado con tu backend
    const handleVerifyPayment = async () => {
      try {
        // Map or validate collectionStatus to the allowed type
        const allowedStatuses = ['approved', 'pending', 'rejected'] as const;
        const safeCollectionStatus = allowedStatuses.includes(collectionStatus as any)
          ? (collectionStatus as 'approved' | 'pending' | 'rejected')
          : 'pending';

        const response = await verifyPayment({
          userId: user.id,
          subscriptionId: paymentId,
          collectionStatus: safeCollectionStatus
        })
        
        
        if (response.data?.status === 'approved' || response.data?.status === 'authorized') {
          setStatus('success');
          // Actualizar el estado del usuario localmente
          dispatch(updatePlan({
            plan: response.data?.plan,
            subscriptionId: paymentId
          }))
          // dispatch(updateUserPlan(data.plan));
          
          setTimeout(() => {
            navigate('/draw');
          }, 3000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      handleVerifyPayment();
    } else {
      setStatus('pending');
    }
  }, [searchParams, verifyPayment]);

  return (
    <div>
      {isVerifying && <Paper
      elevation={4}
        sx={{
          p: 4,
          textAlign: 'center'
        }}
      >
          <Typography
          gutterBottom
          >Verificando pago...</Typography>
          <BarLoader />
        </Paper>}
      {status === 'success' && (
        <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center'
        }}
        >
          <Typography
          variant='h2'
          gutterBottom
          >✅ ¡Pago exitoso!</Typography>
          <Typography>Tu suscripción ha sido activada. Redirigiendo...</Typography>
        </Paper>
      )}
      {status === 'pending' && (
        <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center'
        }}
        >
          <Typography
           variant='h2'
           gutterBottom
          >⏳ Pago en proceso</Typography>
          <Typography>Estamos procesando tu pago. Te notificaremos por email.</Typography>
        </Paper>
      )}
      {status === 'error' && (
        <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center'
        }}
        >
          <Typography
           variant='h2'
           gutterBottom
          >❌ Error</Typography>
          <Typography>{`Hubo un problema. Contacta a soporte en .${import.meta.env.VITE_REACH_EMAIL}`}</Typography>
        </Paper>
      )}
    </div>
  );
};

export default PaymentSuccess;