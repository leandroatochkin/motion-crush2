import React, {useEffect, useState, useRef} from 'react'
import { Paper, Divider, Typography, Button, Box, Chip } from '@mui/material'
import { PaymentData } from '../../api/paymentsApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useValidateCaptchaMutation } from '../../api/userApi'
import { useCreateSubscriptionMutation, useCancelSubscriptionMutation } from '../../api/paymentsApi'
import { useMobile } from '../../utils/hooks/hooks'


const Plans = () => {
const user = useSelector((state: RootState) => state.user);
const theme = useSelector((state: RootState) => state.theme);
const captchaRef = useRef<HCaptcha>(null);
const [validateCaptcha, {isLoading: validatingCaptcha}] = useValidateCaptchaMutation()
const [createSubscription, {isLoading: creatingSubscription}] = useCreateSubscriptionMutation()
const [cancelSubscription, {isLoading: cancellingSubscription}] = useCancelSubscriptionMutation()
const [captchaToken, setCaptchaToken] = useState<string | null>(null)
const [selectedPlan, setSelectedPlan] = useState<PaymentData>({
    userId: user.id,
    email: user.email,
    amount: 0,
    plan: 'free'
})

const isMobile = useMobile()

useEffect(()=>console.log(isMobile),[isMobile])

const handleCaptchaVerify = (token: string) => {
        setCaptchaToken(token);
    }

const captchaSiteKey = import.meta.env.VITE_CAPTCHA_SITEKEY

const isCurrentPlan = (name: string) => user.plan === name;

const handlePlanSelection = (amount: number, plan: 'free' | 'premium' | 'pro') => {
        // Reset captcha cuando cambian de plan
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
        
        setSelectedPlan(prevPlan => ({
            ...prevPlan,
            amount: amount,
            plan: plan
        }))
    }
  
    // const handlePayment = async () => {
    //     if (!captchaToken) {
    //         alert('Por favor completa el captcha');
    //         return;
    //     }

    //     try {
    //         // Validar captcha en el backend
    //         const captchaResponse = await validateCaptcha({token: captchaToken});
            
    //         console.log(captchaResponse)

    //         if (captchaResponse.data?.message?.includes("Captcha ok") === false) {
    //             alert('Captcha inválido');
    //             captchaRef.current?.resetCaptcha();
    //             setCaptchaToken(null);
    //             return;
    //         }

    //         if(user.plan !== 'free' && selectedPlan.plan === 'free') {
    //             if(confirm('¿Está seguro que quiere cancelar su subscripción?')){
    //                 const cancellingResponse = cancelSubscription({
    //                 userId: user.id,
    //                 subscriptionId: user.subscriptionId
    //             })
                
    //             const result = await cancellingResponse

    //             if(result?.data?.success) {
    //                 alert(`Subscripción cancelada`)
    //                 captchaRef.current?.resetCaptcha();
    //                 setCaptchaToken(null);
    //             } else {
    //                 alert(`Error al cancelar subscripción. Contactese con ${import.meta.env.VITE_REACH_EMAIL}`);
    //             // Reset captcha en caso de error
    //                 captchaRef.current?.resetCaptcha();
    //                 setCaptchaToken(null);
    //             }
    //             } else return

    //         } else {
    //             const paymentResponse = createSubscription({
    //              userId: selectedPlan.userId || '1',
    //              email: selectedPlan.email || 'motioncrushapp@gmail.com',
    //              amount: selectedPlan.amount,
    //              plan: selectedPlan.plan,
       
    //         })

    //         const result = await paymentResponse;
     
    //         if (result.data?.checkoutUrl && result.data?.checkoutUrl.includes("https://www.mercadopago.com.ar/")) {
    //             // Redirigir a MercadoPago
    //             window.location.href = result.data?.checkoutUrl;
    //         } else {
    //             alert('Error al procesar el pago');
    //             // Reset captcha en caso de error
    //             captchaRef.current?.resetCaptcha();
    //             setCaptchaToken(null);
    //         }
    //         }

            

    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('Error al procesar el pago');
    //         captchaRef.current?.resetCaptcha();
    //         setCaptchaToken(null);
    //     }
    // }

    const handlePayment = async () => {
    // 1. Centralized CAPTCHA reset logic
    const resetCaptchaState = () => {
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
    };

    // --- Helper Functions ---

    // Handles the subscription cancellation logic
    const handleCancellation = async () => {
        if (!confirm('¿Está seguro que quiere cancelar su subscripción?')) {
            return false; // Exit if the user cancels the confirmation
        }

        try {
            const cancellingResponse = cancelSubscription({
                userId: user.id,
                subscriptionId: user.subscriptionId
            });

            const result = await cancellingResponse;

            if (result?.data?.success) {
                alert(`Subscripción cancelada`);
                return true;
            } else {
                alert(`Error al cancelar subscripción. Contactese con ${import.meta.env.VITE_REACH_EMAIL}`);
                return false;
            }
        } catch (error) {
            console.error('Error al cancelar subscripción:', error);
            alert(`Error al cancelar subscripción. Contactese con ${import.meta.env.VITE_REACH_EMAIL}`);
            return false;
        }
    };

    // Handles the new subscription/payment logic
    const handleNewSubscription = async () => {
        try {
            const paymentResponse = createSubscription({
                userId: selectedPlan.userId || user.id, // Use actual user ID if available
                email: selectedPlan.email || user.email, // Use actual user email if available
                amount: selectedPlan.amount,
                plan: selectedPlan.plan,
            });

            const result = await paymentResponse;

            if (result.data?.checkoutUrl && result.data?.checkoutUrl.includes("https://www.mercadopago.com.ar/")) {
                // Redirigir a MercadoPago
                window.location.href = result.data.checkoutUrl;
                return true;
            } else {
                alert('Error al procesar el pago. Inténtalo de nuevo.');
                return false;
            }
        } catch (error) {
            console.error('Error al crear subscripción:', error);
            alert('Error al procesar el pago. Por favor, inténtalo más tarde.');
            return false;
        }
    };
    
    // --- Main Logic ---

    // 2. Initial CAPTCHA check
    if (!captchaToken) {
        alert('Por favor completa el captcha');
        return;
    }

    try {
        // 3. CAPTCHA Validation
        const captchaResponse = await validateCaptcha({ token: captchaToken });
        
        console.log(captchaResponse);

        // Check for specific success message (use more robust check if possible)
        const isCaptchaValid = captchaResponse.data?.message?.includes("Captcha ok");

        if (!isCaptchaValid) {
            alert('Captcha inválido');
            resetCaptchaState();
            return;
        }

        // 4. Handle Subscription Logic
        let success = false;
        
        // Scenario 1: Downgrade to 'free' (Cancellation)
        if (user.plan !== 'free' && selectedPlan.plan === 'free') {
            success = await handleCancellation();
        // Scenario 2: New/Upgrade Subscription (Payment)
        } else if (selectedPlan.plan !== 'free') { 
            success = await handleNewSubscription();
        } 
        // Note: If user.plan is 'free' and selectedPlan.plan is 'free', no action is taken.

        // 5. Final CAPTCHA Reset on success or specific failure cases
        if (success) {
            resetCaptchaState();
        } else if (!success) {
            // Reset CAPTCHA on failure for user to try again
            resetCaptchaState(); 
        }

    } catch (error) {
        // 6. General Error Handling
        console.error('Error inesperado durante el proceso:', error);
        alert('Error inesperado al procesar la solicitud.');
        resetCaptchaState();
    }
};



  return (
    <Paper
    elevation={4}
    sx={{
        p: isMobile ? 0 : 4,
        height: isMobile ? '100dvh' : 'auto'
    }}
    >
        <Typography
        variant='h1'
        gutterBottom
        >
            Planes
        </Typography>
        <Divider orientation='horizontal'/>
        <Box
        sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
        }}
        >
            <Paper
            elevation={6}
            sx={{
                p: 4,
                cursor: 'pointer',
                transition: '0.2s scale ease-in',
                scale: selectedPlan.plan === 'free' ? 1.05 : 1,
                '&:hover': {
                    scale: 1.05
                  },
                border: isCurrentPlan('free') ? '3px solid green' : 'none',
            }}
            onClick={()=>handlePlanSelection(0, 'free')}
            >
                <Typography
                variant='h3'
                gutterBottom
                >
                    Free
                </Typography>
                <Divider orientation='horizontal' />
                <Typography>
                    Incluye:
                </Typography>
                <ul>
                    <li>
                        10 esquemas por mes
                    </li>
                </ul>
                <Divider orientation='horizontal'/>
                <Box
                sx={{
                    display: 'flex',
                    gap: 1
                }}
                >
                <Typography
                variant='h6'
                >
                    Precio:
                </Typography>
                <Typography
                variant='h2'
                >
                    $0
                </Typography>
                </Box>
                {isCurrentPlan('free') && (
                                <Chip label="Plan actual" color="success" sx={{ position: 'absolute', bottom: 10, left: 10 }} />
                            )}
            </Paper>
            <Paper
            elevation={6}
             sx={{
                p: 4,
                cursor: 'pointer',
                transition: '0.2s scale ease-in',
                scale: selectedPlan.plan === 'premium' ? 1.05 : 1,
                color: selectedPlan.plan === 'premium' ? '#fff' : theme.colors.text,
                background: selectedPlan.plan === 'premium' ? 'rgba(131, 58, 180, 1)' : '#fff',
                border: isCurrentPlan('premium') ? '3px solid green' : 'none',
                '&:hover': {
                    scale: 1.05,
                    background: 'rgba(131, 58, 180, 1)',
                    color: '#fff'
                  },
            }}
            onClick={()=>handlePlanSelection(5999, 'premium')}
            >
                <Typography
                variant='h3'
                gutterBottom
                >
                    Premium
                </Typography>
                 <Divider orientation='horizontal' />
                <Typography>
                    Incluye:
                </Typography>
                <ul>
                    <li>
                        <Typography>
                            1000 esquemas por mes
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Adición de texto personalizado
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Adición de imagenes personalizadas
                        </Typography>
                    </li>
                </ul>
                <Divider orientation='horizontal'/>
                <Box
                sx={{
                    display: 'flex',
                    gap: 1
                }}
                >
                <Typography
                variant='h6'
                >
                    Precio:
                </Typography>
                <Typography
                variant='h2'
                >
                    AR$5999/mes
                </Typography>
                </Box>
                {isCurrentPlan('premium') && (
                                <Chip label="Plan actual" color="success" sx={{ position: 'absolute', bottom: 10, left: 10 }} />
                            )}
            </Paper>
            <Paper
            elevation={6}
            sx={{
                p: 4,
                cursor: 'pointer',
                transition: '0.2s scale ease-in',
                scale: selectedPlan.plan === 'pro' ? 1.05 : 1,
                color: selectedPlan.plan === 'pro' ? '#fff' : theme.colors.text,
                border: isCurrentPlan('pro') ? '3px solid green' : 'none',
                background: selectedPlan.plan === 'pro' ? 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)' : '#fff',
                '&:hover': {
                    scale: 1.05,
                    background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)',
                    color: '#fff'
                  },
            }}
            onClick={()=>handlePlanSelection(1, 'pro')}
            >
                <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
                >
                    <Typography
                    variant='h3'
                    gutterBottom
                    >
                        Pro
                    </Typography>
                    <Chip 
                    color='success'
                    label={'mejor valor'}
                    sx={{
                        mb: 1
                    }}
                    />                
                </Box>
   
                <Divider orientation='horizontal' />
                <Typography>
                    Incluye:
                </Typography>
                 <ul>
                    <li>
                        <Typography>
                            Esquemas sin límites
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Adición de texto personalizado
                        </Typography>
                    </li>
                    <li>
                        <Typography>
                            Adición de imagenes personalizadas
                        </Typography>
                    </li>
                     <li>
                        <Typography>
                            Función de quitar fondo a imagenes personalizadas
                        </Typography>
                    </li>
                </ul>
                <Divider orientation='horizontal'/>
                <Box
                sx={{
                    display: 'flex',
                    gap: 1
                }}
                >
                <Typography
                variant='h6'
                >
                    Precio:
                </Typography>
                <Typography
                variant='h2'
                >
                    AR$9999/mes
                </Typography>
                </Box>
                {isCurrentPlan('pro') && (
                                <Chip label="Plan actual" color="success" sx={{ position: 'absolute', bottom: 10, left: 10 }} />
                            )}
            </Paper>
        </Box>
        {
            selectedPlan.plan !== "free" &&
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                gap: 3
            }}
            >
                <HCaptcha
                sitekey={captchaSiteKey}
                onVerify={handleCaptchaVerify}
                />
                 <Button
                        variant='contained'
                        sx={{
                            background: theme.colors.primary
                        }}
                        disabled={!captchaToken || validatingCaptcha || creatingSubscription}
                        fullWidth
                        onClick={handlePayment}
                    >
                        {validatingCaptcha ? 'PROCESANDO...' : 'CAMBIAR PLAN'}
                    </Button>
            </Box>
        }
    </Paper>
  )
}

export default Plans