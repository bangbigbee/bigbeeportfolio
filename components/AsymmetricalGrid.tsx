
import React from 'react';
import { ProductCard } from '../types';

interface AsymmetricalGridProps {
    items: ProductCard[];
    reverse?: boolean;
}

const AsymmetricalGrid: React.FC<AsymmetricalGridProps> = ({ items, reverse = false }) => {
    const featured = items[0];
    const others = items.slice(1, 5);

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]`}>
                {/* Large Featured Image */}
                <div className={`md:col-span-8 h-[400px] md:h-full relative overflow-hidden rounded-none group shadow-2xl ${reverse ? 'md:order-last' : ''}`}>
                    <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                        <span className="text-white/70 text-sm font-bold tracking-widest uppercase mb-2">{featured.category}</span>
                        <h3 className="text-white text-4xl font-black uppercase tracking-tighter">{featured.title}</h3>
                        <p className="text-white/80 text-xl mt-2 italic">{featured.subtitle}</p>
                    </div>
                </div>

                {/* Small Thumbnails Column */}
                <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6 h-full">
                    {others.map((item) => (
                        <div key={item.id} className="relative overflow-hidden rounded-none group shadow-xl aspect-square md:aspect-auto">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <h4 className="text-white font-bold text-center text-lg uppercase tracking-tighter">{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AsymmetricalGrid;
