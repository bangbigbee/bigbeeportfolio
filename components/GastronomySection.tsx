
import React, { useMemo, memo, useState } from 'react';
import BigAlbumButton from './BigAlbumButton';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

// Wrap GastronomyImage in memo to ensure it is recognized as a React component with valid intrinsic attributes like 'key'
const GastronomyImage = memo(({ photo, onClick }: { photo: ProductCard, onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    // CHỈ DÙNG 1 ẢNH OPTIMIZED (GRID SIZE)
    const thumbUrl = useMemo(() => getCloudinaryUrl(photo.imageUrl, 'grid'), [photo.imageUrl]);

    return (
        <div 
            onClick={onClick}
            className="group relative aspect-[3/4] overflow-hidden bg-[#f2f2f2] transition-all duration-500 active:scale-95 rounded-[6px] shadow-sm transform-gpu"
            style={{ isolation: 'isolate' }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 shimmer-bg z-[1]" />
            )}
            <img 
                src={thumbUrl} 
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-[1200ms] z-10 image-load-fade ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`} 
                alt={photo.title} 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        </div>
    );
});

interface GastronomySectionProps {
    onImageClick: (img: ProductCard) => void;
    onViewAll: (category?: string) => void;
    lang: Language;
    t: Record<string, string>;
    customFoodPhotos?: ProductCard[];
    customDrinkPhotos?: ProductCard[];
}

const GastronomySection: React.FC<GastronomySectionProps> = ({ 
    onImageClick, 
    onViewAll, 
    lang, 
    t, 
    customFoodPhotos = [], 
    customDrinkPhotos = [] 
}) => {
    const allPhotos = useMemo(() => [...customFoodPhotos, ...customDrinkPhotos], [customFoodPhotos, customDrinkPhotos]);

    const columns = useMemo(() => {
        const colCount = 4;
        if (allPhotos.length === 0) return Array(colCount).fill([]);
        const cols: ProductCard[][] = Array.from({ length: colCount }, () => []);
        allPhotos.forEach((photo, idx) => { cols[idx % colCount].push(photo); });
        return cols.map(col => {
            let res = [...col];
            while (res.length < 12 && allPhotos.length > 0) res = [...res, ...allPhotos];
            return res;
        });
    }, [allPhotos]);

    const title = t.nav_food_beverage || "FOOD & BEVERAGE";

    return (
        <section id="food-beverage" className="py-20 md:py-32 bg-[#ffffff] text-black overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
                <div className="reveal reveal-left active">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[12px] font-black tracking-[0.5em] text-blue-600 uppercase">ARCHIVE 01</span>
                        <div className="h-[1px] flex-grow bg-gray-100" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
                                {title}<span className="text-blue-500">.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-black text-gray-400 uppercase italic">
                                {t.slogan_food_beverage}
                            </p>
                        </div>
                        <p className="max-w-md text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            {t.food_beverage_desc}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-12 mb-20 h-[600px] md:h-[800px] relative overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 h-full mask-fade-edges-v">
                    {columns.map((col, idx) => (
                        <div 
                            key={`wall-col-${idx}`} 
                            className="flex flex-col gap-3 md:gap-6 animate-scroll-v hover:[animation-play-state:paused]"
                            style={{ animationDuration: `${25 + idx * 10}s` }}
                        >
                            {[...col, ...col].map((photo, pIdx) => (
                                <GastronomyImage key={`gast-${idx}-${pIdx}`} photo={photo} onClick={() => onImageClick(photo)} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="reveal active flex justify-center px-6">
                <BigAlbumButton label={t.cta_gastronomy || `KHÁM PHÁ ${title} →`} onClick={() => onViewAll('food-beverage')} />
            </div>
        </section>
    );
};

export default GastronomySection;
