
import React from 'react';
import { ProductCard as ProductCardType } from '../types';
import Card from './Card';

const ProductCarousel: React.FC<{ items: ProductCardType[] }> = ({ items }) => {
    return (
        <div className="w-full overflow-x-auto hide-scrollbar pb-12 pt-4">
            <div className="flex gap-6 px-4 md:px-[calc(50vw-512px+32px)] min-w-max">
                {items.map((item) => (
                    <div key={item.id} className="w-[300px] md:w-[400px]">
                        <Card product={item} />
                    </div>
                ))}
                {/* Spacer card for better alignment */}
                <div className="w-[32px]" />
            </div>
        </div>
    );
};

export default ProductCarousel;
