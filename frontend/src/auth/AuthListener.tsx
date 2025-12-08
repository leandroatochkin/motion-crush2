import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import { setToken } from "./token";
import { useDispatch, useSelector } from "react-redux";
import { storeLogin, logout } from "../store/slices/User";
import { useCheckLoginMutation } from "../api/userApi";
import type { RootState } from "../store/store";
import { CircleLoader } from "react-spinners";

export default function AppAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [checkLogin] = useCheckLoginMutation()
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  
  
  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
    
      
      if (session) {
        try {
          // Fetch usage data
          const checkResult = await checkLogin({ userId: session.user.id });
          const res = (checkResult as any)?.data ?? checkResult;
          const usage = res?.usage ?? { used: 0, limit: 100, remaining: 100 };
          const plan = res?.plan ?? 'free';
          const subscriptionId = res?.subscriptionId ?? null
      
          
          dispatch(storeLogin({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            role: res?.role || 'user',
            isLoggedIn: true,
            usage,
            plan,
            subscriptionId
          }));
          setToken(session.access_token);
          
          // If on login page and have session, redirect to draw
          if (location.pathname === '/') {
       
            navigate("/draw", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      
      setIsLoading(false); // ✅ Done checking session
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === "SIGNED_IN" && session) {
          try {
            const checkResult = await checkLogin({ userId: session.user.id });
            const res = (checkResult as any)?.data ?? checkResult;
            const usage = res?.usage ?? { used: 0, limit: 10, remaining: 10 };
            const plan = res?.plan ?? 'free';
             const subscriptionId = res?.subscriptionId ?? null
            
            dispatch(storeLogin({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
              email: session.user.email || '',
              role: res?.role || 'user',
              isLoggedIn: true,
              usage,
              plan,
              subscriptionId
            }));
            setToken(session.access_token);
            navigate("/draw", { replace: true });
          } catch (error) {
            console.error("❌ Error on sign in:", error);
          }
        } 
        else if (event === "SIGNED_OUT") {
          dispatch(logout());
          navigate("/", { replace: true });
        }
        else if (event === "TOKEN_REFRESHED" && session) {
          setToken(session.access_token);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate, location.pathname]);

  // ✅ Show loading spinner while checking session
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw' 
      }}>
        <CircleLoader />
      </div>
    );
  }

  return <Outlet />;
}