
import React from 'react';
import { ProductCard } from '../types';

interface JustifiedGridProps {
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
}

const JustifiedGrid: React.FC<JustifiedGridProps> = ({ items, onImageClick }) => {
    return (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-wrap gap-6">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className="flex-grow h-[250px] md:h-[400px] relative group cursor-pointer overflow-hidden rounded-none bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                    onClick={() => onImageClick(item)}
                >
                    <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="min-w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <p className="text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-none w-fit">
                            {item.category}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JustifiedGrid;
