import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/store";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  console.log(isLoggedIn)
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
