import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from './cn';

export function DropdownMenu({ trigger, children, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-30 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-800 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150",
            align === 'right' ? "right-0" : "left-0"
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  destructive = false,
  icon: Icon
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors",
        destructive
          ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80",
        className
      )}
    >
      {Icon && <Icon size={15} className={destructive ? "text-rose-500" : "text-slate-400 dark:text-slate-500"} />}
      <span>{children}</span>
    </button>
  );
}
