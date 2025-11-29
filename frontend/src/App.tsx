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
import { setToken } from "./auth/token";

const App = () => {

  const dispatch = useDispatch()

//   React.useEffect(() => {
//   supabase.auth.getSession().then(({ data }) => {
//     if (data.session) {
//       const user = data.session.user;

//       const accessToken = data.session.access_token
      
//       console.log("access token", accessToken)

//       if (accessToken) {
//             setToken(accessToken);            
//           } else {
//             console.warn("No access token returned from Supabase");
//           }


//       dispatch(storeLogin({
//         id: user.id,
//         name: user.user_metadata.full_name,
//         email: user.email,
//         role: "user",
//         isLoggedIn: true,
//       }));
//     }
//   });
// }, []);
React.useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (!session) return;

      const user = session.user;
      const accessToken = session.access_token;

      console.log("TOKEN FROM EVENT:", accessToken);

      if (accessToken) setToken(accessToken);
    
      dispatch(
        storeLogin({
          id: user.id,
          name: user.user_metadata.full_name,
          email: user.email!,
          role: "user",
          isLoggedIn: true,
          usage: null
        })
      );
    }
  );

  return () => listener.subscription.unsubscribe();
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
