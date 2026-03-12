import React, { useMemo, memo, useState, useRef, useEffect } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getOptimizedUrl } from '../App';
import SmartImage from './SmartImage';

const ProfileImage = memo(({ photo, onClick }: { photo: ProductCard; onClick: () => void }) => {
    if (!photo) return null;
    
    // Sử dụng tỷ lệ gốc từ metadata (App.tsx mapRes trả về width/height)
    // Nếu không có tỷ lệ, mặc định là 3/4
    const ratio = photo.aspectRatio || '3/4';
    
    return (
        <div 
            onClick={onClick} 
            className="h-[300px] md:h-[550px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[#f5f5f7] group relative shadow-sm"
            style={{ 
                aspectRatio: ratio,
                isolation: 'isolate'
            }}
        >
            <SmartImage 
                src={getOptimizedUrl(photo.imageUrl, 'thumb')}
                alt={photo.title}
                aspectRatio="fill" // Lấp đầy container đã có tỷ lệ chuẩn
                containerClassName="h-full w-full transition-all duration-700"
                objectFit="cover" // Không crop vì tỷ lệ khung bao đã khớp tỷ lệ ảnh
                overlay={
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 z-20">
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] line-clamp-1">{photo.title}</p>
                    </div>
                }
            />
        </div>
    );
});

const ProfileSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { 
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.01, rootMargin: '1000px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        
        const timer = setTimeout(() => setIsVisible(true), 1500);
        
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    const marqueeRows = useMemo(() => {
        if (!photos || photos.length === 0) return [];
        const filtered = photos.filter(p => p && p.imageUrl);
        if (filtered.length === 0) return [];

        const rows: ProductCard[][] = [[], []];
        filtered.forEach((p, idx) => {
            rows[idx % 2].push(p);
        });

        if (rows[0].length > 0 && rows[1].length === 0) rows[1] = [...rows[0]];

        return rows.map(row => {
            if (row.length === 0) return [];
            let extended = [...row];
            while (extended.length < 10) extended = [...extended, ...row];
            return [...extended, ...extended];
        });
    }, [photos]);

    const hasData = marqueeRows.length > 0 && marqueeRows[0].length > 0;

    return (
        <section ref={sectionRef} id="profile" className="py-12 md:py-24 bg-white text-black overflow-hidden relative border-t border-gray-50 min-h-[400px]">
            <ArchiveHeader 
                number="05" 
                title={t.nav_profile} 
                slogan={t.slogan_profile} 
                bgText="IDENTITY" 
                bgTextColor="text-blue-500/[0.03]" 
            />
            
            <div className={`flex flex-col gap-2 md:gap-8 mb-8 md:mb-12 select-none relative w-full mt-6 md:mt-14 transform-gpu min-h-[350px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {hasData ? (
                    marqueeRows.map((row, idx) => (
                        <div key={idx} className="flex overflow-hidden w-full">
                            <div 
                                className={`flex w-max gap-2 md:gap-8 ${idx % 2 === 0 ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} hover:[animation-play-state:paused]`} 
                                style={{ animationDuration: `${60 + idx * 15}s` }}
                            >
                                {row.map((p, i) => (
                                    <ProfileImage key={`${idx}-${i}-${p.id}`} photo={p} onClick={() => onImageClick(p)} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-[400px] flex items-center justify-center opacity-10">
                         <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}
            </div>
            
            {videos.length > 0 && (
                <div className="mt-4">
                    <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_profile} />
                </div>
            )}
            
            <div className="flex flex-col items-center mt-12">
                <BigAlbumButton label={t.cta_profile} onClick={onViewAll} />
            </div>
        </section>
    );
};

export default ProfileSection;