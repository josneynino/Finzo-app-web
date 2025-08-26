import React from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthContainerProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export function AuthContainer({ mode, onSwitchMode }: AuthContainerProps) {
  return (
    <div>
      {mode === 'login' ? (
        <LoginForm onSwitchToRegister={() => {
          console.log('AuthContainer: Cambiando a registro');
          onSwitchMode('register');
        }} />
      ) : (
        <RegisterForm onSwitchToLogin={() => {
          console.log('AuthContainer: Cambiando a login');
          onSwitchMode('login');
        }} />
      )}
    </div>
  );
}
