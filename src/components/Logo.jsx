import React from 'react';

export default function Logo({ className = "text-3xl" }) {
  // Using em units allows the logo to scale based on the parent's font size (via the className prop)
  return (
    <div className={`flex items-center text-[#049B74] font-black font-sans leading-none tracking-widest ${className}`}>
      <span>BI</span>
      
      {/* Custom 'O' with ECG line */}
      <div className="relative mx-[0.05em] flex items-center justify-center h-[0.85em] w-[0.85em]">
        {/* The Circle */}
        <div className="absolute inset-0 border-[0.14em] border-[#049B74] rounded-full"></div>
        
        {/* The ECG line inside the circle */}
        <svg 
          className="w-[0.75em] h-[0.75em] text-[#049B74] z-10" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 12 h4 l1 -2 l2.5 6 l2.5 -10 l2.5 8 l1 -2 h4.5" />
        </svg>
      </div>
      
      <span>SENSE</span>
    </div>
  );
}
