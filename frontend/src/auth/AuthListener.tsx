import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import { setToken } from "./token";
import { useDispatch, useSelector } from "react-redux";
import { storeLogin, logout } from "../store/slices/User";
import { useCheckLoginMutation } from "../api/userApi";
import type { RootState } from "../store/store";

export default function AppAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [checkLogin] = useCheckLoginMutation()
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  
  console.log("🔍 AuthListener - Current location:", location.pathname, "isLoggedIn:", isLoggedIn);
  
  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("✅ Initial session check:", session?.user?.email || "No session");
      
      if (session) {
        try {
          // Fetch usage data
          const checkResult = await checkLogin({ userId: session.user.id });
          const res = (checkResult as any)?.data ?? checkResult;
          const usage = res?.usage ?? { used: 0, limit: 100, remaining: 100 };
          
          console.log("📊 Fetched usage:", usage);
          
          dispatch(storeLogin({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            role: res?.role || 'user',
            isLoggedIn: true,
            usage
          }));
          setToken(session.access_token);
          
          // If on login page and have session, redirect to draw
          if (location.pathname === '/') {
            console.log("🚀 Navigating to /draw");
            navigate("/draw", { replace: true });
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      }
      
      setIsLoading(false); // ✅ Done checking session
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔔 AUTH EVENT:", event, session?.user?.email || "No session");
        
        if (event === "SIGNED_IN" && session) {
          try {
            const checkResult = await checkLogin({ userId: session.user.id });
            const res = (checkResult as any)?.data ?? checkResult;
            const usage = res?.usage ?? { used: 0, limit: 100, remaining: 100 };
            
            dispatch(storeLogin({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
              email: session.user.email || '',
              role: res?.role || 'user',
              isLoggedIn: true,
              usage
            }));
            setToken(session.access_token);
            console.log("🚀 User signed in, navigating to /draw");
            navigate("/draw", { replace: true });
          } catch (error) {
            console.error("❌ Error on sign in:", error);
          }
        } 
        else if (event === "SIGNED_OUT") {
          console.log("👋 User signed out, navigating to /");
          dispatch(logout());
          navigate("/", { replace: true });
        }
        else if (event === "TOKEN_REFRESHED" && session) {
          console.log("🔄 Token refreshed");
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
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return <Outlet />;
}