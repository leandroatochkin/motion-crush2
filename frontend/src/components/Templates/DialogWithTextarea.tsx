import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { spamRegex } from "../../utils/regex";

export default function ReusableDialog({
  open,
  onClose,
  title,
  description,
  suggestionLabel = "¿Querés dejarnos alguna sugerencia? (Opcional)",
  confirmLabel = "Confirmar",
  onSubmit,
  success,
  error,
  successMessage,
  errorMessage
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useForm({ mode: "onChange" });

  const handleClose = () => {
    if (!success && !error) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      
      {success ? (
        <>
          <DialogContent>
            <Typography>{successMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={onClose}>Entendido</Button>
          </DialogActions>
        </>
      ) : error ? (
        <>
          <DialogContent>
            <Typography color="error">{errorMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={onClose}>Cerrar</Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{title}</DialogTitle>

          <DialogContent dividers>
            <Typography gutterBottom>{description}</Typography>

            {suggestionLabel && (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>{suggestionLabel}</Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Escribe aquí..."
                  {...register("exitReason", {
                    pattern: {
                      value: spamRegex,
                      message: "Texto inválido o sospechoso."
                    }
                  })}
                  error={!!errors.exitReason}
                  helperText={typeof errors.exitReason?.message === 'string' ? errors.exitReason.message : ''}
                />
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={!isValid}
            >
              {false ? <CircularProgress size={20} /> : confirmLabel}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
