let accessToken: string | null = null;


export const setToken = (token?: string) => {
  if (token) {
    accessToken = token;
    return;
  }

  const raw = localStorage.getItem(
    Object.keys(localStorage).find(k => k.includes("-auth-token"))!
  );

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      accessToken = parsed?.access_token ?? null;
    } catch {
      accessToken = null;
    }
  }
};

export const getToken = () => accessToken;
