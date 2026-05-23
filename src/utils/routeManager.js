const ROUTE_STORAGE_KEY = 'app_last_route';

export const saveLastRoute = (route) => {
  if (route && route !== 'login' && route !== 'register') {
    sessionStorage.setItem(ROUTE_STORAGE_KEY, route);
  }
};

export const getLastRoute = () => {
  const saved = sessionStorage.getItem(ROUTE_STORAGE_KEY);
  const validRoutes = ['dashboard', 'profile', 'products', 'settings', 'history'];
  return saved && validRoutes.includes(saved) ? saved : 'dashboard';
};

export const clearLastRoute = () => {
  sessionStorage.removeItem(ROUTE_STORAGE_KEY);
};