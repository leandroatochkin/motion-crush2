import ProtectedRoute from "./auth/ProtectedRoute"
import Dashboard from "./components/Dashboard/Dashboard"
import Main from "./views/main/Main"
import NotFoundPage from "./views/NotFound"
import Login from "./views/login/Login"
import AppAuth from "./auth/AuthListener"
import ResetPassword from "./views/reset-password/ResetPassword"
import { createBrowserRouter } from "react-router-dom"


export const router = createBrowserRouter([
  {
    element: <AppAuth />, // Root layout with auth listener
    children: [
      {
        path: '/draw',
        element: (
          <ProtectedRoute>
            <Dashboard>
              <Main />
            </Dashboard>
          </ProtectedRoute>
        ),
      },
      {
        path: '/',
        element: (
          <Dashboard>
            <Login />
          </Dashboard>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <Dashboard>
            <ResetPassword />
          </Dashboard>
        ),
      }
    ],
    errorElement: <NotFoundPage />
  }
])