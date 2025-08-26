import React, { useState } from 'react';
import finzoFlowLogo from '../../assets/FinzoFlow.png';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, state } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error ya manejado en el contexto
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Lado izquierdo: logo y fondo azul */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-10 relative">
          <img src={finzoFlowLogo} alt="FinzoFlow Logo" width={120} height={120} className="rounded-xl shadow-lg mb-4" />
          <h1 className="mt-6 text-3xl font-bold text-white tracking-wide font-sans">Finzo<span className="text-teal-300">flow</span></h1>
          <p className="mt-2 text-white/80 text-center text-sm">Bienvenido de nuevo</p>
        </div>
        {/* Lado derecho: formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <div className="mb-8 text-center">
            {/* Logo eliminado */}
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Iniciar sesión</h2>
            <p className="text-base text-gray-500">Accede a tu cuenta para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Correo electrónico</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="correo@ejemplo.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base transition-shadow duration-200 shadow-sm focus:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  placeholder="Tu contraseña"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-base text-blue-600 hover:underline bg-none border-none p-0 m-0 font-normal cursor-pointer"
            >
              ¿No tienes cuenta? <span className="font-semibold">Regístrate gratis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}