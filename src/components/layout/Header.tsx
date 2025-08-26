import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { state } = useApp();
  // Notificaciones simuladas (puedes conectar a backend o contexto global)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Factura pagada por Acme Corp', time: 'hace 2 horas', color: 'green', read: false },
    { id: 2, text: 'Nuevo gasto agregado', time: 'hace 1 hora', color: 'blue', read: false },
    { id: 3, text: 'Factura enviada al cliente', time: 'hace 10 min', color: 'yellow', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  // Contador de no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Cerrar el panel si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifPanelRef.current && !notifPanelRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getViewTitle = () => {
    switch (state.currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'invoices':
        return 'Invoices';
      case 'expenses':
        return 'Expenses';
      case 'clients':
        return 'Clients';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-white/60 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{getViewTitle()}</h1>
            <p className="text-sm text-gray-600 font-medium">
              Welcome back, {state.user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-3 rounded-xl hover:bg-white/60 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              onClick={() => {
                setShowNotifications((v) => !v);
                // Marcar como leídas al abrir
                setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
              }}
              aria-label="Ver notificaciones"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Panel lateral de notificaciones */}
            {showNotifications && (
              <>
                {/* Overlay oscuro */}
                <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] transition-opacity"></div>
                {/* Panel de notificaciones */}
                <div
                  ref={notifPanelRef}
                className="fixed top-0 right-20 h-screen w-96 max-w-full bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[9999] animate-slide-in flex flex-col"
                  style={{ minWidth: '384px' }}
                >
                  <div className="flex items-center justify-between px-6 py-6 border-b border-white/20">
                    <h4 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Notificaciones</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <ul className="divide-y divide-white/20">
                      {notifications.length === 0 && (
                        <li className="py-8 text-center text-gray-400">No hay notificaciones</li>
                      )}
                      {notifications.map(n => (
                        <li key={n.id} className="py-4 flex items-start gap-3">
                          <span className={`w-3 h-3 mt-2 bg-${n.color}-500 rounded-full`}></span>
                          <div>
                            <span className={`text-gray-800 text-base font-medium ${n.read ? 'opacity-60' : ''}`}>{n.text}</span>
                            <div className="text-xs text-gray-500 mt-1">{n.time}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-6 py-4 border-t border-white/20">
                    <button className="w-full text-blue-600 hover:underline text-sm font-semibold">Ver todas</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
            <span className="text-white font-medium text-sm">
              {state.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}