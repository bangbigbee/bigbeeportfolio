
import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    isGradient?: boolean;
    align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, isGradient = true, align = 'left' }) => {
    return (
        <div className={`max-w-[1200px] mx-auto px-6 md:px-12 mb-10 flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase leading-none ${isGradient ? 'apple-gradient-text' : 'text-[#1d1d1f]'}`}>
                {title}
            </h2>
            <div className={`w-12 h-[3px] bg-black/10 rounded-none mb-6 ${align === 'center' ? 'mx-auto' : ''}`} />
            <p className="text-[10px] md:text-[11px] text-[#86868b] font-bold leading-relaxed max-w-md tracking-[0.15em] uppercase opacity-80">
                {subtitle}
            </p>
        </div>
    );
};

export default SectionHeader;
