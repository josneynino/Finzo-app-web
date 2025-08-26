import React, { useState } from 'react';
import { useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    address: '',
    taxId: '',
    preferredCurrency: 'USD',
  });

  // Mapeo de país a moneda
  const countryCurrencyMap: Record<string, string> = {
    US: 'USD',
    MX: 'MXN',
    ES: 'EUR',
    AR: 'ARS',
    CO: 'COP',
    CL: 'CLP',
    PE: 'PEN',
    GB: 'GBP',
    CA: 'CAD',
    AU: 'AUD',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    PT: 'EUR',
    BR: 'BRL',
    // Agrega más según necesidad
  };

  useEffect(() => {
    // Detectar país por IP usando una API pública
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country && countryCurrencyMap[data.country]) {
          setFormData(prev => ({ ...prev, preferredCurrency: countryCurrencyMap[data.country] }));
        }
      })
      .catch(() => {});
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'MXN', label: 'MXN - Peso Mexicano' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'ARS', label: 'ARS - Peso Argentino' },
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'CLP', label: 'CLP - Peso Chileno' },
    { value: 'PEN', label: 'PEN - Sol Peruano' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'BRL', label: 'BRL - Real Brasileño' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        businessName: formData.businessName.trim() || undefined,
        address: formData.address.trim() || undefined,
        taxId: formData.taxId.trim() || undefined,
        preferredCurrency: formData.preferredCurrency,
      });
    } catch (error) {
      // Error ya manejado en el contexto
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Lado izquierdo: logo y fondo azul */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-10 relative">
          <h1 className="mt-6 text-3xl font-bold text-white tracking-wide font-sans flex items-center gap-2">
            <span>Finzo</span><span className="text-teal-300">flow</span>
          </h1>
          <p className="mt-2 text-white/80 text-center text-sm">Crea tu cuenta para comenzar</p>
        </div>
        {/* Lado derecho: formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 mt-2">Sign Up</h2>
            <p className="text-base text-gray-500">Regístrate para comenzar a usar FinzoFlow</p>
            <div className="mt-2 text-sm text-blue-700 font-semibold">
              Moneda seleccionada: {currencies.find(c => c.value === formData.preferredCurrency)?.label || formData.preferredCurrency}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            {/* Moneda preferida */}
            <div>
              <label htmlFor="preferredCurrency" className="block text-base font-medium text-gray-700 mb-1">Moneda preferida *</label>
              <select
                id="preferredCurrency"
                value={formData.preferredCurrency}
                onChange={e => handleInputChange('preferredCurrency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {currencies.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">Nombre completo *</label>
              <Input
                type="text"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={value => handleInputChange('name', value)}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                required
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

          {/* Email */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">Correo electrónico *</label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={value => handleInputChange('email', value)}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

          {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">Contraseña *</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={value => handleInputChange('password', value)}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

          {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={value => handleInputChange('confirmPassword', value)}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

          {/* Nombre de la empresa */}
            <div>
              <label htmlFor="businessName" className="block text-base font-medium text-gray-700 mb-1">Empresa (opcional)</label>
              <Input
                type="text"
                placeholder="Nombre de la empresa"
                value={formData.businessName}
                onChange={value => handleInputChange('businessName', value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-1">Dirección (opcional)</label>
              <Input
                type="text"
                placeholder="Dirección de la empresa"
                value={formData.address}
                onChange={value => handleInputChange('address', value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          {/* ID Fiscal */}
            <div>
              <label htmlFor="taxId" className="block text-base font-medium text-gray-700 mb-1">ID Fiscal (opcional)</label>
              <Input
                type="text"
                placeholder="Identificación fiscal"
                value={formData.taxId}
                onChange={value => handleInputChange('taxId', value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          {/* Moneda preferida */}
          <div>
            {/* Campo de moneda preferida eliminado para diseño más simple */}
          </div>

          {/* Botón de registro */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
          {/* Enlace para ir al login */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
                onSwitchToLogin();
              }}
              aria-label="Ir a inicio de sesión"
              className="text-blue-600 hover:underline bg-none border-none p-0 m-0 font-semibold cursor-pointer"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
