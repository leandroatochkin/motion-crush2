import ProtectedRoute from "./auth/ProtectedRoute"
import Dashboard from "./components/Dashboard/Dashboard"
import Main from "./views/main/Main"
import NotFoundPage from "./views/notFound/NotFound"
import Login from "./views/login/Login"
import AppAuth from "./auth/AuthListener"
import ResetPassword from "./views/reset-password/ResetPassword"
import TrialOver from "./views/trial-over/TrialOver"
import { createBrowserRouter } from "react-router-dom"
import Plans from "./views/plans/Plans"
import PaymentSuccess from "./views/paymentSuccess/PaymentSuccess"


export const router = createBrowserRouter([
  {
    element: <AppAuth />, // Root layout with auth listener
    children: [
      {
        path: '/draw',
        element: (
          
            <Dashboard>
              <Main />
            </Dashboard>
         
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
      },
      {
        path: '/trial-over',
        element: (
          <Dashboard>
            <TrialOver />
          </Dashboard>
        ),
      },
      {
        path: '/plans',
        element: (
          <Dashboard>
            <Plans />
          </Dashboard>
        ),
      },
      {
        path: '/payment-success',
        element: (
          <Dashboard>
            <PaymentSuccess />
          </Dashboard>
        ),
      }
    ],
    errorElement: <NotFoundPage />
  }
])