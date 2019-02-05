const AUTH_TOKEN_KEY = 'auth_token';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = token =>
  localStorage.setItem(AUTH_TOKEN_KEY, token);

export const destroyAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

export const isAuthenticated = () => !!getAuthToken();
