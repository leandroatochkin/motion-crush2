import React, { useState, useRef } from 'react'
import { Paper, Divider, Typography, Button, Box, Chip, Checkbox } from '@mui/material'
import { PaymentData } from '../../api/paymentsApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useValidateCaptchaMutation } from '../../api/userApi'
import { useCreateSubscriptionMutation, useCancelSubscriptionMutation } from '../../api/paymentsApi'
import { useMobile } from '../../utils/hooks/hooks'
import { notify } from '../../lib/notifications/notify'
import TermsModal from '../../components/TermsConditions/TermsAndConditions'


const Plans = () => {
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme);
    const captchaRef = useRef<HCaptcha>(null);
    const [validateCaptcha, { isLoading: validatingCaptcha }] = useValidateCaptchaMutation()
    const [createSubscription, { isLoading: creatingSubscription }] = useCreateSubscriptionMutation()
    const [cancelSubscription, { isLoading: cancellingSubscription }] = useCancelSubscriptionMutation()
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [termsRead, setTermsRead] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<PaymentData>({
        userId: user.id,
        email: user.email,
        amount: 0,
        plan: 'free'
    })

    const isMobile = useMobile()

    const handleCaptchaVerify = (token: string) => {
        setCaptchaToken(token);
    }

    const captchaSiteKey = import.meta.env.VITE_CAPTCHA_SITEKEY

    const isCurrentPlan = (name: string) => user.plan === name;

    const handlePlanSelection = (amount: number, plan: 'free' | 'premium' | 'pro') => {
        // Reset captcha when changing plans
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();

        setSelectedPlan(prevPlan => ({
            ...prevPlan,
            amount: amount,
            plan: plan
        }))
    }

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
                    notify(`Subscripción cancelada`, 'info');
                    return true;
                } else {
                    notify(`Error al cancelar subscripción. Contactese con ${import.meta.env.VITE_REACH_EMAIL}`, 'error');
                    return false;
                }
            } catch (error) {
                // Removed console.error
                notify(`Error al cancelar subscripción. Contactese con ${import.meta.env.VITE_REACH_EMAIL}`, 'error');
                return false;
            }
        };

        // Handles the new subscription/payment logic
        const handleNewSubscription = async () => {
            try {
                const paymentResponse = createSubscription({
                    userId: selectedPlan.userId || user.id, 
                    email: selectedPlan.email || user.email, 
                    amount: selectedPlan.amount,
                    plan: selectedPlan.plan,
                });

                const result = await paymentResponse;

                if (result.data?.checkoutUrl && result.data?.checkoutUrl.includes("https://www.mercadopago.com.ar/")) {
                    // Redirigir a MercadoPago
                    window.location.href = result.data.checkoutUrl;
                    return true;
                } else {
                    notify('Error al procesar el pago. Inténtalo de nuevo.', 'error');
                    return false;
                }
            } catch (error) {
                // Removed console.error
                notify('Error al procesar el pago. Por favor, inténtalo más tarde.', 'error');
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

            // console.log(captchaResponse); // Removed console.log

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

            // 5. Final CAPTCHA Reset on specific failure cases
            if (!success) {
                // Reset CAPTCHA on failure for user to try again
                resetCaptchaState();
            }

        } catch (error) {
            // 6. General Error Handling
            // console.error('Error inesperado durante el proceso:', error); // Removed console.error
            notify('Error inesperado al procesar la solicitud.', 'error');
            resetCaptchaState();
        }
    };


    return (
        <>
        {
            openModal && <TermsModal open={openModal} onClose={()=>setOpenModal(false)} />
        }
        <Paper
            elevation={4}
            sx={{
                // Improved mobile container padding and overflow
                p: isMobile ? 2 : 4, 
                height: isMobile ? '100dvh' : 'auto',
                overflowY: 'auto'
            }}
        >
            <Typography
                variant='h4' // Adjusted variant for better hierarchy/readability
                gutterBottom
                sx={{ textAlign: 'center', mb: 3 }}
            >
                Planes
            </Typography>
            <Divider orientation='horizontal' sx={{ mb: isMobile ? 3 : 4 }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 3 : 4, // Added gap for spacing
                    alignItems: isMobile ? 'center' : 'stretch',
                    justifyContent: 'center',
                }}
            >
                {/* Free Plan */}
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        cursor: 'pointer',
                        transition: '0.2s scale ease-in',
                        scale: selectedPlan.plan === 'free' ? 1.05 : 1,
                        '&:hover': { scale: 1.05 },
                        border: isCurrentPlan('free') ? '3px solid green' : 'none',
                        position: 'relative', // Needed for Chip positioning
                        width: isMobile ? '100%' : 300, // Full width on mobile
                    }}
                    onClick={() => handlePlanSelection(0, 'free')}
                >
                    <Typography variant='h5' gutterBottom sx={{ textAlign: 'center' }}>
                        Free
                    </Typography>
                    <Divider orientation='horizontal' sx={{ mb: 2 }} />
                    <Typography fontWeight="bold">Incluye:</Typography>
                    <ul>
                        <li>10 esquemas por mes</li>
                    </ul>
                    <Divider orientation='horizontal' sx={{ mt: 2, mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h6'>Precio:</Typography>
                        <Typography variant='h3' color="primary">$0</Typography>
                    </Box>
                    {isCurrentPlan('free') && (
                        <Chip label="Plan actual" color="success" sx={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                </Paper>

                {/* Premium Plan */}
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
                        position: 'relative', // Needed for Chip positioning
                        width: isMobile ? '100%' : 300, // Full width on mobile
                        '&:hover': {
                            scale: 1.05,
                            background: 'rgba(131, 58, 180, 1)',
                            color: '#fff'
                        },
                    }}
                    onClick={() => handlePlanSelection(5999, 'premium')}
                >
                    <Typography variant='h5' gutterBottom sx={{ textAlign: 'center' }}>
                        Premium
                    </Typography>
                    <Divider orientation='horizontal' sx={{ mb: 2 }} />
                    <Typography fontWeight="bold">Incluye:</Typography>
                    <ul>
                        <li><Typography>1000 esquemas por mes</Typography></li>
                        <li><Typography>Adición de texto personalizado</Typography></li>
                        <li><Typography>Adición de imagenes personalizadas</Typography></li>
                    </ul>
                    <Divider orientation='horizontal' sx={{ mt: 2, mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h6'>Precio:</Typography>
                        <Typography variant='h4'>AR$5999/mes</Typography>
                    </Box>
                    {isCurrentPlan('premium') && (
                        <Chip label="Plan actual" color="success" sx={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                </Paper>

                {/* Pro Plan */}
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
                        position: 'relative', // Needed for Chip positioning
                        width: isMobile ? '100%' : 300, // Full width on mobile
                        '&:hover': {
                            scale: 1.05,
                            background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)',
                            color: '#fff'
                        },
                    }}
                    onClick={() => handlePlanSelection(9999, 'pro')} // Changed amount to match text
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                        <Typography variant='h5' gutterBottom>Pro</Typography>
                        <Chip
                            color='success'
                            label={'mejor valor'}
                            sx={{ mb: 1 }}
                        />
                    </Box>

                    <Divider orientation='horizontal' sx={{ mb: 2 }} />
                    <Typography fontWeight="bold">Incluye:</Typography>
                    <ul>
                        <li><Typography>Esquemas sin límites</Typography></li>
                        <li><Typography>Adición de texto personalizado</Typography></li>
                        <li><Typography>Adición de imagenes personalizadas</Typography></li>
                        <li><Typography>Función de quitar fondo a imagenes personalizadas</Typography></li>
                    </ul>
                    <Divider orientation='horizontal' sx={{ mt: 2, mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='h6'>Precio:</Typography>
                        <Typography variant='h4'>AR$9999/mes</Typography>
                    </Box>
                    {isCurrentPlan('pro') && (
                        <Chip label="Plan actual" color="success" sx={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                </Paper>
            </Box>
            {/* CAPTCHA and Button Section */}
            {
                selectedPlan.plan !== user.plan && selectedPlan.plan !== "free" &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        mt: 4,
                        gap: 3,
                        borderTop: '1px solid #ccc'
                    }}
                >
                    <HCaptcha
                        sitekey={captchaSiteKey}
                        onVerify={handleCaptchaVerify}
                        ref={captchaRef}
                    />
                    
                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    >
                        <Checkbox onChange={()=>setTermsRead(!termsRead)}/>
                        <Typography>
                            He leído los <span style={{
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            onClick={()=>setOpenModal(true)}
                            >términos y condiciones</span>
                        </Typography>
                    </Box>

                    <Button
                        variant='contained'
                        sx={{ background: theme.colors.primary }}
                        disabled={!captchaToken || validatingCaptcha || creatingSubscription || cancellingSubscription || !termsRead}
                        fullWidth={isMobile} // Only fullWidth on mobile
                        onClick={handlePayment}
                    >
                        {(validatingCaptcha || creatingSubscription || cancellingSubscription) ? 'PROCESANDO...' : 'SUSCRIBIRME'}
                    </Button>
                </Box>
            }
            {/* Cancellation Button for Free Plan selection */}
            {
                user.plan !== 'free' && selectedPlan.plan === 'free' &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        mt: 4,
                        gap: 3,
                        borderTop: '1px solid #ccc'
                    }}
                >
                    <HCaptcha
                        sitekey={captchaSiteKey}
                        onVerify={handleCaptchaVerify}
                        ref={captchaRef}
                    />
                    <Button
                        variant='contained'
                        color='error'
                        sx={{ background: theme.colors.error }}
                        disabled={!captchaToken || validatingCaptcha || cancellingSubscription}
                        fullWidth={isMobile}
                        onClick={handlePayment}
                    >
                        {validatingCaptcha || cancellingSubscription ? 'PROCESANDO CANCELACIÓN...' : 'CANCELAR SUSCRIPCIÓN'}
                    </Button>
                </Box>
            }
        </Paper>
        </>
    )
}

export default Plans