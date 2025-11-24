import { supabase } from "./supabase";
import { store } from "../store/store";
import { storeLogin, logout } from "../store/slices/User";

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const user = session.user;

    store.dispatch(
      storeLogin({
        id: user.id,
        name: user.user_metadata.full_name ?? "",
        email: user.email ?? "",
        role: "user"
      })
    );
  }

  if (event === "SIGNED_OUT") {
    store.dispatch(logout());
  }
});