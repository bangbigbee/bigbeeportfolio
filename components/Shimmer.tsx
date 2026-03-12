
import React from 'react';

interface ShimmerProps {
    isDark?: boolean;
    className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ isDark = false, className = "" }) => (
    <div 
        className={`${isDark ? 'shimmer-bg-dark' : 'shimmer-bg'} absolute inset-0 z-0 opacity-50 ${className}`} 
        aria-hidden="true"
    />
);

export default Shimmer;
