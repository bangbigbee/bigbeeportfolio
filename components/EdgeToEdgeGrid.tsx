
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

const EdgeToEdgeGrid: React.FC<{ items: ProductCard[] }> = ({ items }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
            {items.map((item) => {
                const url = getOptimizedUrl(item.imageUrl, 'full');
                return (
                    <div key={item.id} className="relative h-[80vh] group overflow-hidden">
                        <img 
                            src={url} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                        <div className="absolute bottom-20 left-12 md:left-24">
                            <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-4 block">Portrait Collection</span>
                            <h3 className="text-white text-5xl md:text-7xl font-bold tracking-tighter mb-4">{item.title}</h3>
                            <p className="text-white/80 text-xl font-medium max-w-sm">{item.subtitle}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EdgeToEdgeGrid;
