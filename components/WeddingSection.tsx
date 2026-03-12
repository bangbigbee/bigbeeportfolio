import React, { useMemo, useState, memo, useEffect, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const WeddingCollectionCard = memo(({ 
    photos, 
    label, 
    isFocused, 
    onMouseEnter, 
    onMouseLeave, 
    onClick,
    isMobile = false,
    interval
}: { 
    photos: ProductCard[]; label: string; isFocused: boolean; 
    onMouseEnter: () => void; onMouseLeave: () => void; 
    onClick: () => void; isMobile?: boolean; interval: number; 
}) => {
    const photo = photos[0];
    if (!photo) return null;
    const sources = photos.map(p => getOptimizedUrl(p.imageUrl, 'preview'));

    return (
        <div 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={`relative rounded-[16px] overflow-hidden cursor-pointer group transform-gpu bg-[#f5f5f7]
                ${isMobile ? 'aspect-[4/5] w-full' : `h-full ${isFocused ? 'flex-[12]' : 'flex-[2.5]'}`}
            `}
            style={{ 
                transition: 'flex-grow 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                isolation: 'isolate'
            }}
        >
            <SmartImage 
                src={sources.length > 0 ? sources : undefined}
                alt={label}
                // Sử dụng 'fill' để ép ảnh phủ kín thẻ card cao h-full
                aspectRatio={isMobile ? "4/5" : "fill"}
                containerClassName="h-full w-full"
                className="group-hover:scale-105" 
                isDark={false}
                interval={interval}
                overlay={
                    <>
                        <div className={`absolute bottom-8 left-8 md:bottom-12 md:left-12 right-8 md:right-12 z-20 transition-all duration-700 ease-out ${isFocused || isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <p className="text-white/60 text-[10px] font-black tracking-[0.3em] mb-2 uppercase">Collection</p>
                            <h3 className={`font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] 
                                ${isMobile ? 'text-3xl mb-2' : 'text-3xl md:text-5xl lg:text-7xl mb-3'}
                            `}>
                                {label.toUpperCase()}
                            </h3>
                            <div className="bg-rose-500 h-[3px] mt-4 transition-all duration-1000" style={{ width: isFocused || isMobile ? '80px' : '0' }} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 z-[15]" />
                    </>
                }
            />
        </div>
    );
});

const WeddingSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, weddingCollections: Record<string, ProductCard[]>, weddingVideos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, weddingCollections, weddingVideos = [] }) => {
    const [focusedId, setFocusedId] = useState<string | null>(null);
    
    const collectionEntries = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => {
            const key = `wedding_item_${i + 1}`;
            const photos = weddingCollections[key] || [];
            return {
                key, 
                photos, 
                label: t[key] || `VOL.${i + 1}`,
                interval: 4000 + (i * 800) 
            };
        }).filter(entry => entry.photos.length > 0);
    }, [weddingCollections, t]);

    return (
        <section id="wedding" className="py-12 md:py-24 bg-white text-black overflow-hidden relative">
            <ArchiveHeader 
                number="03" 
                title={t.nav_wedding} 
                slogan={t.slogan_wedding} 
                accentColor="text-rose-500" 
                dotColor="text-rose-500" 
                bgText="LOVE" 
                bgTextColor="text-rose-500/[0.06]" 
            />
            
            <div className="w-full mb-8 md:mb-12 px-5 md:px-10 relative z-10 mt-10">
                <div className="flex flex-col md:hidden gap-2">
                    {collectionEntries.map((entry) => (
                        <WeddingCollectionCard 
                            key={entry.key} 
                            photos={entry.photos}
                            label={entry.label}
                            interval={entry.interval}
                            isFocused={false} 
                            isMobile={true} 
                            onMouseEnter={() => {}} 
                            onMouseLeave={() => {}} 
                            onClick={() => onViewAll(entry.key)} 
                        />
                    ))}
                </div>

                <div className="hidden md:flex flex-row gap-4 h-[75vh] lg:h-[85vh] w-full items-center">
                    {collectionEntries.map((entry) => (
                        <WeddingCollectionCard 
                            key={entry.key} 
                            photos={entry.photos}
                            label={entry.label}
                            interval={entry.interval}
                            isFocused={focusedId === entry.key} 
                            onMouseEnter={() => setFocusedId(entry.key)} 
                            onMouseLeave={() => setFocusedId(null)} 
                            onClick={() => onViewAll(entry.key)} 
                        />
                    ))}
                </div>
            </div>

            {weddingVideos.length > 0 && (
                <VideoCarousel 
                    videos={weddingVideos} 
                    onVideoClick={onImageClick} 
                    title={t.video_title_wedding} 
                />
            )}

            <div className="flex justify-center px-6 mt-12">
                <BigAlbumButton label={t.cta_wedding} onClick={() => onViewAll()} />
            </div>
        </section>
    );
};

export default WeddingSection;