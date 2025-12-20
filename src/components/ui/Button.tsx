import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
    ghost: "hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button 
      className={cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50", variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
}