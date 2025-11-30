import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/store";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  //const isLoggedIn = true
  const remaining = useSelector((state: RootState) => state.user.usage.remaining)

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if(remaining === 0) {
    return <Navigate to="/trial-over" replace />
  }

  return children;
}
