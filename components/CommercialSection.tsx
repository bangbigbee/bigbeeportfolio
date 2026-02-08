
import React, { useMemo, memo, useState, useEffect } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const CommercialImage = memo(({ photo, onClick }: { photo: ProductCard, onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ratio = useMemo(() => (photo.width && photo.height) ? photo.width / photo.height : 0.75, [photo]);
    // Sử dụng 'thumb' (60px) thay vì 'grid' để tiết kiệm RAM trên mobile
    const thumbUrl = useMemo(() => getCloudinaryUrl(photo.imageUrl, 'thumb'), [photo.imageUrl]);

    return (
        <div 
            onClick={onClick} 
            className="relative w-[120px] md:w-[240px] overflow-hidden group cursor-pointer shadow-xl transform-gpu rounded-[4px] flex-shrink-0 bg-[#0a0a0a] will-change-transform" 
            style={{ aspectRatio: ratio, isolation: 'isolate' }}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg-dark z-[1]" />}
            <img 
                src={thumbUrl} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out z-[2] group-hover:scale-110 image-load-fade ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`} 
                alt={photo.title} 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-3 md:p-4">
                <p className="text-[8px] md:text-[11px] font-black text-white uppercase tracking-tighter leading-tight">{photo.title}</p>
                <div className="w-6 h-[1.5px] bg-blue-500 mt-1.5 md:mt-2" />
            </div>
        </div>
    );
});

const CommercialSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const columns = useMemo(() => {
        // Mobile: 3 cột, Desktop: 5 cột
        const colCount = isMobile ? 3 : 5; 
        const cols: ProductCard[][] = Array.from({ length: colCount }, () => []);
        if (!photos || photos.length === 0) return cols;

        for (let i = 0; i < colCount; i++) {
            const startIdx = (i * 3) % photos.length; 
            const colPhotos = [];
            // Giảm số lượng ảnh tối đa để tránh tràn bộ nhớ
            const maxItems = isMobile ? 8 : 15; 
            for (let j = 0; j < Math.max(photos.length, maxItems); j++) {
                colPhotos.push(photos[(startIdx + j) % photos.length]);
            }
            
            let expanded = [...colPhotos];
            // Chỉ lặp lại vừa đủ để tạo hiệu ứng seamless (Mobile: 12, Desktop: 30)
            const targetLength = isMobile ? 12 : 30;
            while (expanded.length < targetLength) {
                expanded = [...expanded, ...colPhotos];
            }
            cols[i] = expanded;
        }
        return cols;
    }, [photos, isMobile]);

    return (
        <section id="commercial" className="py-12 md:py-24 bg-[#050505] text-white overflow-hidden relative">
            <ArchiveHeader number="08" title={t.nav_commercial} slogan={t.slogan_commercial} light={true} />
            
            {/* Giảm scale trên mobile từ 1.25 xuống 1.1 để giảm áp lực GPU */}
            <div className="relative w-full h-[80vh] md:h-[130vh] bg-black overflow-hidden border-y border-white/5 mb-16">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-2 md:gap-4 transform rotate-[-8deg] scale-110 md:scale-[1.15] origin-center will-change-transform">
                        {columns.map((col, idx) => (
                            <div 
                                key={`comm-col-${idx}`} 
                                className="flex flex-col gap-2 md:gap-4 animate-comm-diag-stream hover:[animation-play-state:paused]" 
                                style={{ 
                                    animationDuration: `${isMobile ? 40 + idx * 10 : 240 + idx * 40}s`, 
                                    animationDelay: `${idx * -5}s` 
                                }}
                            >
                                {col.map((photo, pIdx) => (
                                    <CommercialImage 
                                        key={`comm-${idx}-${pIdx}-${photo.id}`} 
                                        photo={photo} 
                                        onClick={() => onImageClick(photo)} 
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_commercial} light={true} />}
            <div className="flex flex-col items-center mt-10"><BigAlbumButton dark={true} label={t.cta_commercial} onClick={onViewAll} /></div>
        </section>
    );
};

export default CommercialSection;
