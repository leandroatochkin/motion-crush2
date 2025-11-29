import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    TextField,
    Box, 
    InputAdornment, 
    OutlinedInput, 
    IconButton, 
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { emailRegex, passwordRegex } from '../../utils/regex';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useMobile } from '../../utils/hooks/hooks';
import { supabase } from '../../auth/supabase';
import { notify } from '../../lib/notifications/notify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ResetPasswordData {
    password: string;
    repeatPassword: string;
}

interface ForgotPasswordData {
    email: string;
}

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isValidToken, setIsValidToken] = useState<boolean>(false);
    const [checkingToken, setCheckingToken] = useState<boolean>(true);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    
    // Form for resetting password (when user comes from email link)
    const resetForm = useForm<ResetPasswordData>();
    
    // Form for requesting reset email
    const forgotForm = useForm<ForgotPasswordData>();

    const isMobile = useMobile();
    const navigate = useNavigate();

    const theme = useSelector((state: RootState) => state.theme);
    

    useEffect(() => {
        // Check if we have a valid recovery session (user came from email link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsValidToken(true);
            }
            setCheckingToken(false);
        });
    }, []);

    // Handle sending reset email
    const onRequestReset = async (data: ForgotPasswordData) => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) {
                console.error(error);
                notify("Error al enviar el correo", "error");
            } else {
                notify("¡Correo enviado! Revisá tu bandeja de entrada", "success");
                setEmailSent(true);
            }
        } catch (e) {
            console.log(e);
            notify("Error inesperado", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle updating password
    const onSubmitNewPassword = async (data: ResetPasswordData) => {
        if (data.password !== data.repeatPassword) {
            notify("Las contraseñas no coinciden", "error");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password
            });

            if (error) {
                console.error(error);
                notify("Error al actualizar la contraseña", "error");
            } else {
                notify("¡Contraseña actualizada exitosamente!", "success");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (e) {
            console.log(e);
            notify("Error inesperado", "error");
        } finally {
            setLoading(false);
        }
    };

    // Loading state while checking token
    if (checkingToken) {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100dvh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress size={50} color='primary' />
            </Box>
        );
    }

    // If user has valid token (came from email), show password reset form
    if (isValidToken) {
        return (
            <Box
                aria-label="Sección de recuperación de contraseña"
                sx={{
                    width: '100vw',
                    height: '100dvh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: isMobile ? 10 : 0,
                }}
            >
                <Paper
                    aria-label="Formulario de nueva contraseña"
                    sx={{
                        borderRadius: 4,
                        width: {
                            md: '30%',
                            xs: '86vw'
                        },
                        p: 2,
                    }}
                >
                    {!loading ? (
                        <>
                            <Typography
                                variant='h4'
                                fontFamily={'PTSerif-Bold, sans-serif'}
                                color={theme.colors.primary}
                                textAlign='start'
                            >
                                Nueva contraseña
                            </Typography>
                            <Typography
                                textAlign='start'
                                color='#666'
                                sx={{ mt: 1, mb: 2 }}
                            >
                                Ingresá tu nueva contraseña
                            </Typography>
                            <form onSubmit={resetForm.handleSubmit(onSubmitNewPassword)}>
                                {/* PASSWORD */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        fontWeight='bold'
                                        textAlign='start'
                                        color='#333'
                                    >
                                        Nueva contraseña
                                    </Typography>
                                    <Box className="relative">
                                        <FormControl fullWidth variant="outlined" error={!!resetForm.formState.errors.password}>
                                            <OutlinedInput
                                                id="reset-password"
                                                color="secondary"
                                                type={showPassword ? "text" : "password"}
                                                {...resetForm.register("password", {
                                                    required: "Campo requerido",
                                                    pattern: {
                                                        value: passwordRegex,
                                                        message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
                                                    },
                                                })}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            <FormHelperText>
                                                {resetForm.formState.errors.password?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Box>

                                {/* REPEAT PASSWORD */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        fontWeight='bold'
                                        textAlign='start'
                                        color='#333'
                                    >
                                        Repetir contraseña
                                    </Typography>
                                    <Box className="relative">
                                        <FormControl fullWidth variant="outlined" error={!!resetForm.formState.errors.repeatPassword}>
                                            <OutlinedInput
                                                type={showPassword ? "text" : "password"}
                                                {...resetForm.register("repeatPassword", {
                                                    required: "Campo requerido",
                                                    validate: {
                                                        passwordsDontMatch: (value) =>
                                                            value === resetForm.getValues("password") || "Las contraseñas no coinciden"
                                                    }
                                                })}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            <FormHelperText>
                                                {resetForm.formState.errors.repeatPassword?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Box>

                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{
                                        background: theme.colors.primary,
                                        mt: 4
                                    }}
                                    fullWidth
                                    disabled={loading}
                                >
                                    Actualizar contraseña
                                </Button>

                                <Button
                                    variant='text'
                                    sx={{
                                        color: theme.colors.primary,
                                        mt: 2
                                    }}
                                    fullWidth
                                    onClick={() => navigate("/")}
                                >
                                    Volver al inicio
                                </Button>
                            </form>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <CircularProgress size={50} color='primary' />
                        </Box>
                    )}
                </Paper>
            </Box>
        );
    }

    // If no valid token, show email input to request reset link
    return (
        <Box
            aria-label="Sección de recuperación de contraseña"
            sx={{
                width: '100vw',
                height: '100dvh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: isMobile ? 10 : 0,
            }}
        >
            <Paper
                aria-label="Formulario de solicitud de recuperación"
                sx={{
                    borderRadius: 4,
                    width: {
                        md: '30%',
                        xs: '86vw'
                    },
                    p: 2,
                }}
            >
                {!loading ? (
                    <>
                        <Typography
                            variant='h4'
                            fontFamily={'PTSerif-Bold, sans-serif'}
                            color={theme.colors.primary}
                            textAlign='start'
                        >
                            ¿Olvidaste tu contraseña?
                        </Typography>
                        <Typography
                            textAlign='start'
                            color='#666'
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {emailSent 
                                ? "Te enviamos un correo con las instrucciones para recuperar tu contraseña"
                                : "Ingresá tu email y te enviaremos un enlace para recuperar tu contraseña"
                            }
                        </Typography>

                        {emailSent ? (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                ¡Correo enviado! Si no lo ves, revisá tu carpeta de spam.
                            </Alert>
                        ) : null}

                        {!emailSent && (
                            <form onSubmit={forgotForm.handleSubmit(onRequestReset)}>
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        fontWeight='bold'
                                        textAlign='start'
                                        color='#333'
                                    >
                                        Email
                                    </Typography>
                                    <Box className="relative">
                                        <TextField
                                            fullWidth
                                            id="forgot-email"
                                            type="email"
                                            variant="outlined"
                                            placeholder="Email"
                                            {...forgotForm.register(`email`, { 
                                                required: 'Campo requerido.', 
                                                pattern: { 
                                                    value: emailRegex, 
                                                    message: 'Email incorrecto.' 
                                                } 
                                            })}
                                            error={!!forgotForm.formState.errors.email}
                                            helperText={forgotForm.formState.errors.email?.message}
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    type='submit'
                                    variant='contained'
                                    sx={{
                                        background: theme.colors.primary,
                                        mt: 4
                                    }}
                                    fullWidth
                                    disabled={loading}
                                >
                                    Enviar enlace de recuperación
                                </Button>
                            </form>
                        )}

                        <Button
                            variant='text'
                            sx={{
                                color: theme.colors.primary,
                                mt: 2
                            }}
                            fullWidth
                            onClick={() => navigate("/")}
                        >
                            Volver al inicio
                        </Button>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress size={50} color='primary' />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ResetPassword;