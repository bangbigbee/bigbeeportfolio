
import React from 'react';
import { ProductCard } from '../types';

interface StructuredGridProps {
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
}

const StructuredGrid: React.FC<StructuredGridProps> = ({ items, onImageClick }) => {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className="group cursor-pointer animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
                    onClick={() => onImageClick(item)}
                >
                    <div className="relative overflow-hidden rounded-none bg-[#fbfbfd] aspect-[4/3] shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                    <div className="mt-10 text-center md:text-left">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-3 block">{item.category}</span>
                        <h4 className="text-[18px] font-bold text-black/80 uppercase tracking-tighter leading-tight mb-2">{item.title}</h4>
                        <div className="w-8 h-[1px] bg-black/10 mx-auto md:mx-0 mb-3" />
                        <p className="text-[13px] text-gray-400 font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-700">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StructuredGrid;
