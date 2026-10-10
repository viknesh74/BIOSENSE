import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from './cn';

const ToastContext = createContext({
  showToast: () => {}
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />,
            error: <AlertCircle className="text-rose-500 shrink-0" size={18} />,
            warning: <AlertTriangle className="text-amber-500 shrink-0" size={18} />,
            info: <Info className="text-teal-500 shrink-0" size={18} />
          };

          const borders = {
            success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100",
            error: "border-rose-200 dark:border-rose-900 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100",
            warning: "border-amber-200 dark:border-amber-900 bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100",
            info: "border-teal-200 dark:border-teal-900 bg-teal-50/95 dark:bg-teal-950/90 text-teal-900 dark:text-teal-100"
          };

          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3",
                borders[toast.type] || borders.info
              )}
            >
              {icons[toast.type] || icons.info}
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
