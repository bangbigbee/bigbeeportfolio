
import React from 'react';
import { ProductCard } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const BentoGrid: React.FC<{ items: ProductCard[], onImageClick?: any }> = ({ items, onImageClick }) => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-6">
            {items.map((item, idx) => {
                const isFirst = idx === 0;
                const size = item.size || (isFirst ? 'large' : 'small');
                
                let sizeClasses = 'aspect-square';
                if (size === 'wide') sizeClasses = 'md:col-span-2 aspect-[2/1]';
                else if (size === 'tall') sizeClasses = 'md:row-span-2 aspect-[1/2]';
                else if (size === 'large') sizeClasses = 'md:col-span-2 md:row-span-2 aspect-square';

                return (
                    <div 
                        key={item.id}
                        className={`relative overflow-hidden rounded-[6px] shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer ${sizeClasses}`}
                        onClick={() => onImageClick && onImageClick(item)}
                    >
                        {item.imageUrl && (
                            <SmartImage 
                                src={getOptimizedUrl(item.imageUrl, size === 'large' ? 'preview' : 'thumb')} 
                                alt={item.title} 
                                aspectRatio="fill"
                                className="transition-transform duration-700 group-hover:scale-105"
                                overlay={
                                    <>
                                        <div className="absolute top-0 left-0 p-6 z-20">
                                            <p className="text-xs font-bold text-white/70 uppercase mb-1">{item.category}</p>
                                            <h3 className={`font-bold text-white leading-tight ${size === 'large' ? 'text-3xl' : 'text-xl'}`}>{item.title}</h3>
                                            {size === 'large' && <p className="text-white/80 mt-2">{item.subtitle}</p>}
                                        </div>
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <span className="bg-white text-black px-4 py-2 rounded-[6px] text-sm font-semibold shadow-lg">Explore</span>
                                        </div>
                                    </>
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BentoGrid;
