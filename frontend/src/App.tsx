// import React from "react";
// import { supabase } from "./auth/supabase";
// import Main from "./views/main/Main";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import NotFoundPage from "./views/NotFound";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Login from "./views/login/Login";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import { useDispatch } from "react-redux";
// import { storeLogin } from "./store/slices/User";
// import { setToken } from "./auth/token";
// import { useCheckLoginMutation } from "./api/userApi";
// import { useNavigate } from "react-router-dom";
// import AuthListener from "./auth/authListener";

// const App = () => {

//   const dispatch = useDispatch()
//   const [checkLoginTrigger] = useCheckLoginMutation()
//   //const navigate = useNavigate()
// //   React.useEffect(() => {
// //   supabase.auth.getSession().then(({ data }) => {
// //     if (data.session) {
// //       const user = data.session.user;

// //       const accessToken = data.session.access_token
      
// //       console.log("access token", accessToken)

// //       if (accessToken) {
// //             setToken(accessToken);            
// //           } else {
// //             console.warn("No access token returned from Supabase");
// //           }


// //       dispatch(storeLogin({
// //         id: user.id,
// //         name: user.user_metadata.full_name,
// //         email: user.email,
// //         role: "user",
// //         isLoggedIn: true,
// //       }));
// //     }
// //   });
// // }, []);

// // const navigate = useNavigate()

// // React.useEffect(() => {
// //   supabase.auth.getSession().then(res => {
// //     console.log("DEBUG SESSION:", res);
// //   });
// // }, []);

// // supabase.auth.onAuthStateChange((event, session) => {
// //   if (event === "SIGNED_IN") {
// //     console.log("SIGNED IN:", session);
// //   }
// // });

// // supabase.auth.getSession().then(res => {
// //   console.log("AFTER REDIRECT SESSION:", res);
// // });

// // console.log(import.meta.env.VITE_FRONTEND_URL);

// // React.useEffect(() => {
// //   const { data: listener } = supabase.auth.onAuthStateChange(
// //     async (event, session) => {
// //       if (!session) return;

// //       const user = session.user;
// //       const accessToken = session.access_token;

// //       if (accessToken) {
// //         setToken(accessToken);  // now works!
// //       }

// //       dispatch(
// //         storeLogin({
// //           id: user.id,
// //           name: user.user_metadata.full_name,
// //           email: user.email!,
// //           role: "user",
// //           isLoggedIn: true,
// //           usage: null,
// //         })
// //       );

// //         if (event === "SIGNED_IN") {
// //   navigate("/draw");
// // }
// //     }
// //   );




// //   return () => listener.subscription.unsubscribe();


  
// // }, []);



//   const router = createBrowserRouter([
//     {
//     path: '/draw',
//     element: (
//       <ProtectedRoute>
//         <Dashboard>
//          <Main />
//         </Dashboard>
//       </ProtectedRoute>
//     ),
//     errorElement: <NotFoundPage />
//   },
//   {
//     path: '/',
//     element: (
//       <Dashboard>
//          <Login />
//       </Dashboard>
//     ),
//     errorElement: <NotFoundPage />
//   }
//   ])

//   return (
//     <>
//             <AuthListener />
            
//     </>
//   );
// };

// export default App;
