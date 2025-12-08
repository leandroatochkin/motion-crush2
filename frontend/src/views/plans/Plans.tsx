import React, {useEffect, useState, useRef} from 'react'
import { Paper, Divider, Typography, Button, Box, Chip } from '@mui/material'
import { PaymentData } from '../../api/paymentsApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useValidateCaptchaMutation } from '../../api/userApi'
import { useCreateSubscriptionMutation } from '../../api/paymentsApi'
import { useMobile } from '../../utils/hooks/hooks'


const Plans = () => {
const user = useSelector((state: RootState) => state.user);
const theme = useSelector((state: RootState) => state.theme);
const captchaRef = useRef<HCaptcha>(null);
const [validateCaptcha, {isLoading: validatingCaptcha}] = useValidateCaptchaMutation()
const [createSubscription, {isLoading: creatingSubscription}] = useCreateSubscriptionMutation()
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
  
    const handlePayment = async () => {
        if (!captchaToken) {
            alert('Por favor completa el captcha');
            return;
        }

        try {
            // Validar captcha en el backend
            const captchaResponse = await validateCaptcha({token: captchaToken});
            
            console.log(captchaResponse)

            if (captchaResponse.data?.message?.includes("Captcha ok") === false) {
                alert('Captcha inválido');
                captchaRef.current?.resetCaptcha();
                setCaptchaToken(null);
                return;
            }

            // Enviar pago con el token del captcha
            // const paymentResponse = await fetch('http://localhost:3000/payment', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         email: selectedPlan.email,
            //         amount: selectedPlan.amount,
            //         planName: selectedPlan.plan,
            //         captchaToken: captchaToken // Incluir el token
            //     })
            // });



            const paymentResponse = createSubscription({
                 userId: selectedPlan.userId || '1',
                 email: selectedPlan.email || 'motioncrushapp@gmail.com',
                 amount: selectedPlan.amount,
                plan: selectedPlan.plan,
       
            })

            const result = await paymentResponse;
            console.log(result)
            if (result.data?.checkoutUrl && result.data?.checkoutUrl.includes("https://www.mercadopago.com.ar/")) {
                // Redirigir a MercadoPago
                window.location.href = result.data?.checkoutUrl;
            } else {
                alert('Error al procesar el pago');
                // Reset captcha en caso de error
                captchaRef.current?.resetCaptcha();
                setCaptchaToken(null);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el pago');
            captchaRef.current?.resetCaptcha();
            setCaptchaToken(null);
        }
    }



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