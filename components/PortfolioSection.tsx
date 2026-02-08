
import React from 'react';
import BigAlbumButton from './BigAlbumButton';
import SmartMasonry from './SmartMasonry';
import { ProductCard } from '../types';

interface PortfolioSectionProps {
    id: string;
    number: string;
    title: string;
    slogan: string;
    description: string;
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
    onViewAll: () => void;
    layout?: 'masonry' | 'bento' | 'split';
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
    id, number, title, slogan, description, items, onImageClick, onViewAll, layout = 'masonry' 
}) => {
    return (
        <section id={id} className="py-24 md:py-32 bg-white overflow-hidden opacity-100">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
                <div className="reveal reveal-up active"> 
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[12px] font-black tracking-[0.5em] text-blue-600 uppercase">ARCHIVE {number}</span>
                        <div className="h-[1px] flex-grow bg-gray-100" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
                                {title || "PORTFOLIO"}<span className="text-gray-200">.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-black text-gray-400 uppercase tracking-tight italic mb-2">
                                {slogan || "Capture every moment."}
                            </p>
                        </div>
                        <p className="max-w-md text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-16 min-h-[300px]">
                {items.length > 0 ? (
                    <SmartMasonry items={items.slice(0, 8)} onImageClick={onImageClick} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-y border-gray-50 bg-gray-50/20 rounded-[6px]">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Optimizing Visual Archive...</p>
                    </div>
                )}
            </div>

            <div className="reveal reveal-up flex justify-center px-6">
                <BigAlbumButton label={`KHÁM PHÁ TOÀN BỘ ${title} →`} onClick={onViewAll} />
            </div>
        </section>
    );
};

export default PortfolioSection;
