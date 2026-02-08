
import React, { useMemo, useState, memo, useEffect, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

interface WeddingCollectionCardProps {
    photos: ProductCard[];
    label: string;
    isFocused: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    isMobile?: boolean;
    interval: number;
}

const WeddingCollectionCard = memo(({ 
    photos, 
    label, 
    isFocused, 
    onMouseEnter, 
    onMouseLeave, 
    onClick,
    isMobile = false,
    interval
}: WeddingCollectionCardProps) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const photosRef = useRef(photos);

    useEffect(() => {
        photosRef.current = photos;
    }, [photos]);

    useEffect(() => {
        if (!photos || photos.length <= 1) return;
        
        const timer = setInterval(() => {
            const nextIdx = (currentIdx + 1) % photosRef.current.length;
            const nextItem = photosRef.current[nextIdx];
            
            if (!nextItem?.imageUrl) return;

            const img = new Image();
            img.src = getCloudinaryUrl(nextItem.imageUrl, 'grid');
            img.onload = () => {
                setPrevIdx(currentIdx);
                setCurrentIdx(nextIdx);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 1600);
            };
        }, interval);

        return () => clearInterval(timer);
    }, [currentIdx, interval, photos.length]);

    if (!photos || photos.length === 0) return null;
    
    const basePhoto = photos[currentIdx];
    const prevPhoto = prevIdx !== null ? photos[prevIdx] : null;

    return (
        <div 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={`wedding-accordion-item relative rounded-[6px] overflow-hidden cursor-pointer group transform-gpu bg-[#f2f2f2]
                ${isMobile ? 'aspect-square w-full mb-2' : `h-full ${isFocused ? 'flex-[10] md:flex-[12]' : 'flex-[2]'}`}
            `}
            style={{ 
                isolation: 'isolate',
                transition: 'flex-grow 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            
            {prevPhoto?.imageUrl && (
                <img 
                    src={getCloudinaryUrl(prevPhoto.imageUrl, 'grid')} 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    alt="background"
                />
            )}

            <img 
                key={basePhoto.id}
                src={getCloudinaryUrl(basePhoto.imageUrl, 'grid')} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover z-10 transform-gpu transition-transform duration-[2000ms] ${isFocused ? 'scale-105' : 'scale-100'} ${isTransitioning ? 'animate-crossfade' : (isLoaded ? 'opacity-100' : 'opacity-0')}`}
                alt={label}
            />

            <div className={`absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-10 z-[30] transition-all duration-700 ease-out ${isFocused || isMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className={`font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] 
                    ${isMobile ? 'text-2xl mb-1' : 'text-3xl md:text-5xl lg:text-7xl mb-2'}
                `}>
                    {label.toUpperCase()}
                </h3>
                <div className={`bg-rose-500 mt-2 md:mt-4 transition-all duration-1000 delay-100 ${isMobile ? 'h-[2px] w-12' : 'h-[3px] w-24'}`} style={{ width: isFocused || isMobile ? '60px' : '0' }} />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-60 pointer-events-none z-25" />
        </div>
    );
});

interface WeddingSectionProps {
    onImageClick: (img: ProductCard) => void;
    onViewAll: (subKey?: string) => void;
    lang: Language;
    t: Record<string, string>;
    weddingCollections: Record<string, ProductCard[]>;
    weddingVideos?: ProductCard[];
}

const WeddingSection: React.FC<WeddingSectionProps> = ({ onImageClick, onViewAll, lang, t, weddingCollections, weddingVideos = [] }) => {
    const [focusedId, setFocusedId] = useState<string | null>(null);
    
    const collectionEntries = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => {
            const key = `wedding_item_${i + 1}`;
            const photos = weddingCollections[key] || [];
            return {
                key,
                photos,
                label: t[key] || `LOVE STORY VOL.${i + 1}`,
                interval: 6000 + (i * 400) 
            };
        }).filter(entry => entry.photos.length > 0);
    }, [weddingCollections, t]);

    if (collectionEntries.length === 0 && weddingVideos.length === 0) return null;

    return (
        <section id="wedding" className="py-12 md:py-24 bg-white text-black overflow-hidden relative">
            <ArchiveHeader number="03" title={t.nav_wedding} slogan={t.slogan_wedding} accentColor="text-rose-500" dotColor="text-rose-500" />
            <div className="w-full mb-12 md:mb-20 px-5 md:px-10 relative z-10">
                <div className="flex flex-col md:hidden">
                    {collectionEntries.map((entry) => (
                        <WeddingCollectionCard key={`${entry.key}-mobile`} photos={entry.photos} label={entry.label} isFocused={false} isMobile={true} onMouseEnter={() => {}} onMouseLeave={() => {}} onClick={() => onViewAll(entry.key)} interval={entry.interval} />
                    ))}
                </div>
                <div className="hidden md:flex flex-row gap-3 h-[70vh] lg:h-[80vh] w-full items-center">
                    {collectionEntries.map((entry) => (
                        <WeddingCollectionCard key={`${entry.key}-desktop`} photos={entry.photos} label={entry.label} isFocused={focusedId === entry.key} isMobile={false} onMouseEnter={() => setFocusedId(entry.key)} onMouseLeave={() => setFocusedId(null)} onClick={() => onViewAll(entry.key)} interval={entry.interval} />
                    ))}
                </div>
            </div>
            {weddingVideos.length > 0 && <VideoCarousel videos={weddingVideos} onVideoClick={onImageClick} title={t.video_title_wedding} />}
            <div className="flex justify-center px-6 mt-10"><BigAlbumButton label={t.cta_wedding} onClick={() => onViewAll()} /></div>
        </section>
    );
};

export default WeddingSection;
