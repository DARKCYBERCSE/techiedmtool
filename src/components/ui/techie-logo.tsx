import React from 'react';

interface TechieLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export function TechieLogo({
  size = 'md',
  showText = true,
  className = '',
  animate = false,
}: TechieLogoProps) {
  const iconDimensions = {
    sm: { box: 'w-8 h-8 rounded-xl', text: 'text-sm' },
    md: { box: 'w-10 h-10 rounded-2xl', text: 'text-base' },
    lg: { box: 'w-12 h-12 rounded-2xl', text: 'text-xl' },
    xl: { box: 'w-16 h-16 rounded-3xl', text: 'text-2xl' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official 3D Graphic TechieDM Brand Emblem */}
      <div
        className={`${iconDimensions.box} relative flex-shrink-0 bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#FB7185] p-[1.5px] shadow-md shadow-[#F43F5E]/20 transition-transform duration-200 hover:scale-105 overflow-hidden group`}
      >
        <div className="w-full h-full bg-[#FFFFFF] rounded-[inherit] overflow-hidden flex items-center justify-center relative">
          <img
            src="/techiedmtool-logo.jpg"
            alt="TechieDMTool"
            className="w-full h-full object-cover rounded-[inherit] transform group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to render
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-black tracking-tight text-[#1F1216] ${iconDimensions.text}`}>
          TechieDM<span className="text-rose-gradient">Tool</span>
          {animate && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] ml-1.5 align-middle animate-pulse" />
          )}
        </span>
      )}
    </div>
  );
}
