import React from 'react';

export default function Logo({ className = "text-2xl", variant = "default", showTagline = false }) {
  const isLightOnDark = variant === "light";
  const primaryColor = isLightOnDark ? "text-white" : "text-[#174D38] dark:text-[#EEF5F0]";
  const accentColor = isLightOnDark ? "text-emerald-400" : "text-[#4B8A64] dark:text-emerald-400";
  const ringColor = isLightOnDark ? "border-emerald-400/80" : "border-[#174D38] dark:border-emerald-400";
  const badgeBg = isLightOnDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-[#EEF5F0] dark:bg-emerald-950/60 text-[#174D38] dark:text-emerald-300 border-[#DDEADF] dark:border-emerald-800";

  return (
    <div className="inline-flex flex-col">
      <div className={`flex items-center font-black font-display leading-none tracking-tight select-none ${className} ${primaryColor}`}>
        <span className="tracking-tighter">BI</span>
        
        {/* Custom 'O' with Vital ECG Pulse */}
        <div className="relative mx-[0.06em] flex items-center justify-center h-[0.84em] w-[0.84em]">
          <div className={`absolute inset-0 border-[0.14em] ${ringColor} rounded-full`}></div>
          <svg 
            className={`w-[0.7em] h-[0.7em] ${accentColor} z-10`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 12 h4 l1 -2.5 l2.5 7 l2.5 -11 l2.5 9 l1 -2.5 h4.5" />
          </svg>
        </div>
        
        <span className="tracking-tight">SENSE</span>
        
        <span className={`ml-1.5 text-[0.42em] font-extrabold uppercase px-1.5 py-0.5 rounded border tracking-widest ${badgeBg}`}>
          COLLAR
        </span>
      </div>
      {showTagline && (
        <span className={`text-[9px] font-semibold tracking-wider uppercase mt-1 ${isLightOnDark ? "text-emerald-200/80" : "text-[#5A7065] dark:text-slate-400"}`}>
          Smarter Care. Healthier Herds.
        </span>
      )}
    </div>
  );
}
