import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md' 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-sm backdrop-blur-sm',
    md: 'shadow-xl backdrop-blur-md',
    lg: 'shadow-2xl backdrop-blur-lg',
  };

  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 ${shadowClasses[shadow]} ${paddingClasses[padding]} hover:bg-white/90 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}