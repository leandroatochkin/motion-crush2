import { useCancelSubscriptionMutation } from "../../api/paymentsApi";
import ReusableDialog from "../Templates/DialogWithTextarea";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export default function CancelSubscriptionModal({ open, onClose }) {
  const [cancelSubscription, result] = useCancelSubscriptionMutation();
  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = (data) => {
    cancelSubscription({
      userId: user.id,
      subscriptionId: user.subscriptionId,
      exitReason: data.exitReason
    });
  };

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title="Cancelar suscripción"
      description="¿Estás seguro de que querés cancelar tu suscripción? Perderás acceso al finalizar tu ciclo actual."
      confirmLabel="Cancelar suscripción"
      onSubmit={handleSubmit}
      success={result.isSuccess}
      error={result.isError}
      successMessage="Tu suscripción fue cancelada. Vas a mantener el plan hasta el próximo ciclo."
      errorMessage={`Error al cancelar. Escribinos a ${import.meta.env.VITE_REACH_EMAIL}`}
    />
  );
}
