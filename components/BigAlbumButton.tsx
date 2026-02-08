
import React from 'react';

interface BigAlbumButtonProps {
    label?: string;
    dark?: boolean;
    onClick?: () => void;
}

const BigAlbumButton: React.FC<BigAlbumButtonProps> = ({ 
    label = "EXPLORE FULL ALBUM →", 
    dark = false,
    onClick 
}) => (
    <div className="w-full flex justify-center mt-6 md:mt-10 mb-8 md:mb-16">
        <button 
            onClick={onClick}
            className={`w-full max-w-[280px] md:max-w-[320px] h-[52px] md:h-[60px] text-[13px] md:text-[15px] font-black tracking-[0.25em] md:tracking-[0.35em] transition-all duration-500 transform active:scale-95 shadow-2xl uppercase cursor-pointer border-none flex items-center justify-center gap-3 group rounded-[6px]
            ${dark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-[#111111]'}`}
        >
            <span className="relative flex items-center transition-transform duration-500 group-hover:translate-x-1">
                {label}
            </span>
        </button>
    </div>
);

export default BigAlbumButton;
