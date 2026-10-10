import React from 'react';
import { cn } from './cn';

export function Label({ className, children, required, ...props }) {
  return (
    <label
      className={cn(
        "text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 font-bold">*</span>}
    </label>
  );
}
