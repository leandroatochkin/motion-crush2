let accessToken: string | null = null;

export const setToken = (token?: any) => {
  // Case 1: Called with a direct token string
  if (typeof token === "string") {
    accessToken = token;
    localStorage.setItem("access_token", token);
    return;
  }

  // Case 2: Supabase stores its session in this key
  const raw = localStorage.getItem("sb-cbbvploublqutmbiwwaq-auth-token");

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      accessToken = parsed.access_token;
      localStorage.setItem("access_token", parsed.access_token);
      return;
    } catch {}
  }

  // Case 3: TokenData passed explicitly
  if (token) {
    accessToken = token.access_token;
    localStorage.setItem("access_token", token.access_token);
  }
};

// ✅ FIX: Leer desde localStorage si accessToken no está en memoria
export const getToken = () => {
  // Si ya está en memoria, retornarlo
  if (accessToken) {
    return accessToken;
  }

  // Si no está en memoria, intentar recuperarlo de localStorage
  const stored = localStorage.getItem("access_token");
  if (stored) {
    accessToken = stored; // Guardarlo en memoria para próximas llamadas
    return stored;
  }

  // Si no está en ningún lado, intentar desde Supabase storage
  const raw = localStorage.getItem("sb-cbbvploublqutmbiwwaq-auth-token");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.access_token) {
        accessToken = parsed.access_token;
        localStorage.setItem("access_token", parsed.access_token);
        return parsed.access_token;
      }
    } catch (error) {
      console.error("Error parsing Supabase token:", error);
    }
  }

  return null;
};

// ✅ NUEVO: Función para limpiar el token
export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem("access_token");
};