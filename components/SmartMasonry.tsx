
import React, { memo, useMemo, useState } from 'react';
import { ProductCard } from '../types';
import { getCloudinaryUrl } from '../App';

interface SmartMasonryProps {
    items: ProductCard[];
    onImageClick: (img: ProductCard) => void;
}

const SmartMasonry: React.FC<SmartMasonryProps> = ({ 
    items, 
    onImageClick,
}) => {
    if (!items || items.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Optimizing Gallery...</p>
            </div>
        );
    }

    return (
        <div className="w-full columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 space-y-2 md:space-y-4">
            {items.map((item, idx) => (
                <MasonryItem key={item.id || idx} item={item} onClick={() => onImageClick(item)} />
            ))}
        </div>
    );
};

const MasonryItem = memo(({ item, onClick }: { item: ProductCard; onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isVideo = item.resourceType === 'video' || !!item.videoUrl || !!item.youtubeId;

    const ratio = (item.width && item.height) 
        ? item.width / item.height 
        : (isVideo ? 1.77 : 0.66);

    // CHỈ DÙNG 1 ẢNH OPTIMIZED (GRID SIZE)
    const thumbUrl = useMemo(() => isVideo ? item.imageUrl : getCloudinaryUrl(item.imageUrl, 'grid'), [item.imageUrl, isVideo]);

    return (
        <article 
            className="relative break-inside-avoid group cursor-pointer overflow-hidden transform-gpu mb-2 md:mb-4 bg-[#f2f2f2] rounded-[6px]"
            style={{ 
                aspectRatio: ratio,
                isolation: 'isolate'
            }}
            onClick={onClick}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg" />}
            
            <img 
                src={thumbUrl} 
                alt={item.title} 
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`block w-full h-full object-cover transform-gpu relative z-10 group-hover:scale-105 transition-all duration-700 image-load-fade ${isLoaded ? 'loaded' : ''}`}
            />
            
            {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 flex flex-col justify-end p-4">
                <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-tighter leading-tight">
                    {item.title}
                </p>
            </div>
        </article>
    );
});

export default SmartMasonry;
