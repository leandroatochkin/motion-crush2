import React from "react";
import { useDeleteAccountMutation } from "../../api/userApi";
import ReusableDialog from "../Templates/DialogWithTextarea";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function DeleteAccountModal({ open, onClose }) {
  const [deleteAccount, result] = useDeleteAccountMutation();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    deleteAccount({
      userId: user.id,
      exitReason: data.exitReason
    });
  };

  // 🔥 Auto redirect after success
  React.useEffect(() => {
    if (result.isSuccess) {
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
      }, 2500);
    }
  }, [result.isSuccess]);

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title="Eliminar cuenta"
      description="Esta acción es permanente. Se eliminarán tu perfil, tus datos y tu historial."
      confirmLabel="Eliminar cuenta"
      onSubmit={handleSubmit}
      success={result.isSuccess}
      error={result.isError}
      successMessage="Tu cuenta fue eliminada. Gracias por habernos elegido."
      errorMessage={`Error al eliminar tu cuenta. Escribinos a ${import.meta.env.VITE_REACH_EMAIL}`}
    />
  );
}
