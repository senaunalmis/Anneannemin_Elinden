import React from 'react';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'normal' | 'huge';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const BigButton: React.FC<BigButtonProps> = ({
  variant = 'primary',
  size = 'huge',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative w-full flex items-center justify-center gap-3 font-extrabold rounded-3xl transition-all duration-150 select-none shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles =
    size === 'huge'
      ? 'min-h-[76px] py-4 px-6 text-xl sm:text-2xl tracking-wide'
      : 'min-h-[58px] py-3 px-5 text-lg sm:text-xl';

  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30 active:bg-emerald-800 border-b-4 border-emerald-800',
    secondary:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-700/30 active:bg-amber-800 border-b-4 border-amber-800',
    accent:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-700/30 active:bg-blue-800 border-b-4 border-blue-800',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-700/30 active:bg-rose-800 border-b-4 border-rose-800',
    ghost:
      'bg-stone-200 hover:bg-stone-300 text-stone-800 border-2 border-stone-300 active:bg-stone-400',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="text-center leading-tight">{children}</span>
    </button>
  );
};
