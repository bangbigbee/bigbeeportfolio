
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';

const Card: React.FC<{ product: ProductCard }> = ({ product }) => {
    const url = product.imageUrl ? getOptimizedUrl(product.imageUrl, 'preview') : undefined;
    return (
        <div className="relative rounded-[6px] bg-white overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-700 group cursor-pointer h-full min-h-[500px]">
            {url && (
                <img 
                    src={url} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />
            )}
            {/* Overlay for text legibility at top */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/30 to-transparent opacity-60" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase mb-3 block">
                        {product.category}
                    </span>
                    <h3 className="text-3xl font-black text-white leading-tight tracking-tighter drop-shadow-md">
                        {product.title}
                    </h3>
                </div>
                
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-base text-white/90 font-medium tracking-tight mb-2">
                        {product.subtitle}
                    </p>
                    <div className="h-0.5 w-12 bg-white/40 rounded-none" />
                </div>
            </div>
        </div>
    );
};

export default Card;
