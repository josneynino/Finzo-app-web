import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import finzoFlowLogo from '../../assets/FinzoFlow.png';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { name: 'Invoices', icon: FileText, key: 'invoices' },
  { name: 'Expenses', icon: Receipt, key: 'expenses' },
  { name: 'Clients', icon: Users, key: 'clients' },
  { name: 'Reports', icon: BarChart3, key: 'reports' },
  { name: 'Settings', icon: Settings, key: 'settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state, dispatch, logout } = useApp();

  const handleNavClick = (key: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: key });
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white/95 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <img src={finzoFlowLogo} alt="FinzoFlow Logo" width={40} height={40} className="rounded-2xl shadow-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FinzoFlow</span>
          </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-3">
            {navigation.map((item) => {
              const isActive = state.currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:scale-105 backdrop-blur-sm'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center px-3 py-3 mb-3 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-medium text-gray-700">
                  {state.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{state.user?.name}</p>
                <p className="text-xs text-gray-500">{state.user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-white/60 hover:text-gray-900 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}