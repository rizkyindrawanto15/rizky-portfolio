import React, { useState } from 'react';

interface SchoolLogoProps {
  schoolId: 'smk' | 'smp' | 'sd' | string;
  customSrc?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const getDefaultLogoPath = (schoolId: string): string => {
  const norm = schoolId.toLowerCase();
  if (norm.includes('smk') || norm.includes('krian')) {
    return '/schools/smk-krian-1.png';
  }
  if (norm.includes('smp') || norm.includes('mts') || norm.includes('bumi')) {
    return '/schools/mts-bumi-shalawat.png';
  }
  return '/schools/sdn-pilang-1.png';
};

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  schoolId,
  customSrc,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const containerClass = `${sizeClasses[size]} ${className} relative flex items-center justify-center shrink-0`;
  const logoSrc = customSrc || getDefaultLogoPath(schoolId);

  if (logoSrc && !imgError) {
    return (
      <div className={containerClass}>
        <img
          src={logoSrc}
          alt={`Logo ${schoolId}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
          loading="lazy"
        />
      </div>
    );
  }

  // Minimal fallback badge if image ever fails to load
  return (
    <div
      className={`${containerClass} rounded-lg border border-blue-400/30 bg-blue-500/10 font-mono text-xs font-semibold text-blue-300 uppercase`}
    >
      {schoolId.replace(/^edu-/, '').toUpperCase()}
    </div>
  );
};
