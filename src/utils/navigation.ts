// Utilidades de navegación para la aplicación

export const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  // Disparar un evento personalizado para notificar el cambio de ruta
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const navigateToLogin = () => {
  navigateTo('/');
};

export const navigateToRegister = () => {
  navigateTo('/register');
};

export const navigateToDashboard = () => {
  navigateTo('/dashboard');
};

// Función para escuchar cambios de ruta
export const useRouteListener = (callback: (path: string) => void) => {
  const handleRouteChange = () => {
    callback(window.location.pathname);
  };

  // Escuchar cambios de ruta
  window.addEventListener('popstate', handleRouteChange);
  
  // Retornar función de limpieza
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
};
