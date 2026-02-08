
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../types';

interface LivelyGridProps {
    items: ProductCard[];
}

const LivelyGrid: React.FC<LivelyGridProps> = ({ items }) => {
    const [indices, setIndices] = useState([0, 1, 2]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndices(prev => {
                const next = [...prev];
                const slotToChange = Math.floor(Math.random() * 3);
                let newIdx = Math.floor(Math.random() * items.length);
                while (next.includes(newIdx) && items.length > 3) {
                    newIdx = Math.floor(Math.random() * items.length);
                }
                next[slotToChange] = newIdx;
                return next;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {indices.map((itemIdx, slotIdx) => {
                const item = items[itemIdx];
                return (
                    <div 
                        key={`${slotIdx}-${item.id}`} 
                        className="relative rounded-none overflow-hidden aspect-square group shadow-xl cursor-pointer bg-gray-100 transition-all duration-1000 animate-in fade-in zoom-in-95"
                    >
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <h4 className="text-white text-2xl font-black uppercase tracking-tighter">{item.title}</h4>
                            <p className="text-white/80 text-lg uppercase text-xs tracking-widest">{item.category}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LivelyGrid;
