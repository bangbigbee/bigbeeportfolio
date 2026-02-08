
import React from 'react';
import { ProductCard } from '../types';

const BentoGrid: React.FC<{ items: ProductCard[] }> = ({ items }) => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            {items.map((item, idx) => {
                const isFirst = idx === 0;
                const isTall = item.size === 'tall';
                
                return (
                    <div 
                        key={item.id}
                        className={`relative overflow-hidden rounded-[6px] shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer 
                            ${isFirst ? 'md:col-span-2 md:row-span-2' : ''} 
                            ${isTall ? 'md:row-span-2' : ''}
                        `}
                    >
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-0 left-0 p-6">
                            <p className="text-xs font-bold text-white/70 uppercase mb-1">{item.category}</p>
                            <h3 className={`font-bold text-white leading-tight ${isFirst ? 'text-3xl' : 'text-xl'}`}>{item.title}</h3>
                            {isFirst && <p className="text-white/80 mt-2">{item.subtitle}</p>}
                        </div>
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white text-black px-4 py-2 rounded-[6px] text-sm font-semibold shadow-lg">Explore</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BentoGrid;
