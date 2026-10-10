import React from 'react';
import { cn } from './cn';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("p-5 md:p-6 pt-0 md:pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-5 md:p-6 pt-0 md:pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-auto", className)}
      {...props}
    />
  );
}
