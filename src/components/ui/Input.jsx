import React from 'react';
import { cn } from './cn';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  error = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
          : "border-slate-200 dark:border-slate-800 focus:border-emerald-500",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
