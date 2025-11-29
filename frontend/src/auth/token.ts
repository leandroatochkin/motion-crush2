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

export const getToken = () => accessToken;

