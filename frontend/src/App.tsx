import Main from "./views/main/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./views/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./views/login/Login";

const App = () => {

  const router = createBrowserRouter([
    {
    path: '/home',
    element: (
      <Dashboard>
         <Main />
      </Dashboard>
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
