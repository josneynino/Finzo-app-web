import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import { AuthContainer } from './components/auth/AuthContainer';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { InvoiceList } from './components/invoices/InvoiceList';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ClientList } from './components/clients/ClientList';

function AppContent() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Detectar la ruta para mostrar login o registro
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/register') {
        setAuthMode('register');
      } else {
        setAuthMode('login');
      }
    };

    // Detectar ruta inicial
    handleRouteChange();

    // Escuchar cambios de ruta
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Función para cambiar entre login y registro
  const switchAuthMode = (mode: 'login' | 'register') => {
    console.log('App.tsx: switchAuthMode llamado con:', mode);
    setAuthMode(mode);
    const path = mode === 'register' ? '/register' : '/';
    console.log('App.tsx: Cambiando URL a:', path);
    window.history.pushState({}, '', path);
  };

  console.log('Valor de authMode:', authMode);
  if (!state.user) {
    return <AuthContainer mode={authMode} onSwitchMode={switchAuthMode} />;
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <InvoiceList />;
      case 'expenses':
        return <ExpenseList />;
      case 'clients':
        return <ClientList />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h3>
            <p className="text-gray-500">Advanced reporting features will be available in the next update.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-500">User settings and preferences will be available in the next update.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppProvider>
  );
}

export default App;