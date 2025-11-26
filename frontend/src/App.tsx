import React from "react";
import { supabase } from "./auth/supabase";
import Main from "./views/main/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./views/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./views/login/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useDispatch } from "react-redux";
import { storeLogin } from "./store/slices/User";

const App = () => {

  const dispatch = useDispatch()

  React.useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      const user = data.session.user;
      console.log(data.session)
      dispatch(storeLogin({
        id: user.id,
        name: user.user_metadata.full_name,
        email: user.email,
        role: "user",
        isLoggedIn: true,
      }));
    }
  });
}, []);

  const router = createBrowserRouter([
    {
    path: '/draw',
    element: (
      <ProtectedRoute>
        <Dashboard>
         <Main />
        </Dashboard>
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />
  },
  {
    path: '/',
    element: (
      <Dashboard>
         <Login />
      </Dashboard>
    ),
    errorElement: <NotFoundPage />
  }
  ])

  return (
    <>
            <RouterProvider router={router} />
    </>
  );
};

export default App;
