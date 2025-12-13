import React from "react";
import { useDeleteAccountMutation } from "../../api/userApi";
import ReusableDialog from "../Templates/DialogWithTextarea";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/User";

export default function DeleteAccountModal({ open, onClose }) {
  const [deleteAccount, {isSuccess, isError}] = useDeleteAccountMutation();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch()



  const handleSubmit = (data) => {
    deleteAccount({
      userId: user.id,
      exitReason: data.exitReason
    });
  };

  // 🔥 Auto redirect after success
  React.useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(logout())
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title="Eliminar cuenta"
      description="Esta acción es permanente. Se eliminarán tu perfil, tus datos y tu historial."
      confirmLabel="Eliminar cuenta"
      onSubmit={handleSubmit}
      success={isSuccess}
      error={isError}
      successMessage="Tu cuenta fue eliminada. Gracias por habernos elegido."
      errorMessage={`Error al eliminar tu cuenta. Escribinos a ${import.meta.env.VITE_REACH_EMAIL}`}
    />
  );
}
