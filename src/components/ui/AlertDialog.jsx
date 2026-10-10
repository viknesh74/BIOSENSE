import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from './cn';
import { Button } from './Button';

export function AlertDialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogContent({ className, children }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function AlertDialogHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-2 mb-4", className)} {...props} />
  );
}

export function AlertDialogTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5", className)}
      {...props}
    >
      <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
        <AlertTriangle size={20} />
      </div>
      <span>{children}</span>
    </h3>
  );
}

export function AlertDialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-12", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-5", className)}
      {...props}
    />
  );
}
