
import React from 'react';

interface ArchiveHeaderProps {
    number: string;
    title: string;
    slogan: string;
    accentColor?: string;
    dotColor?: string;
    light?: boolean;
}

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({ 
    number, 
    title, 
    slogan, 
    accentColor = "text-blue-600", 
    dotColor = "text-blue-500",
    light = false
}) => {
    return (
        <div className="reveal active reveal-left w-full px-5 md:px-10">
            <div className="flex items-center gap-4 mb-4">
                <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${accentColor}`}>ARCHIVE {number}</span>
                <div className={`h-[1px] flex-grow ${light ? 'bg-white/10' : 'bg-gray-100'}`} />
            </div>
            <div>
                <h2 className={`text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4 ${light ? 'text-white' : 'text-black'}`}>
                    {title}<span className={dotColor}>.</span>
                </h2>
                <p className="text-sm md:text-xl font-black text-gray-400 uppercase italic">
                    {slogan}
                </p>
            </div>
        </div>
    );
};

export default ArchiveHeader;
