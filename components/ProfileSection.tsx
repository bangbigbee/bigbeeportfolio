
import React, { useMemo, memo, useState, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const ProfileImage = memo(({ photo, onClick }: { photo: ProductCard; onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const thumbUrl = useMemo(() => getCloudinaryUrl(photo.imageUrl, 'grid'), [photo.imageUrl]);
    const ratio = useMemo(() => (photo.width && photo.height) ? photo.width / photo.height : 0.66, [photo.width, photo.height]);

    return (
        <div onClick={onClick} className="marquee-item h-[280px] md:h-[450px] flex-shrink-0 group relative overflow-hidden cursor-pointer rounded-[6px] transform-gpu bg-[#f2f2f2] shadow-sm" style={{ aspectRatio: ratio, width: 'auto', isolation: 'isolate' }}>
            {!isLoaded && <div className="absolute inset-0 shimmer-bg z-[1]" />}
            <img 
                src={thumbUrl} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`h-full w-full object-cover relative z-10 group-hover:scale-105 transition-all duration-[600ms] image-load-fade ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`} 
                alt={photo.title}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4 md:p-6">
                <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-tighter leading-tight">{photo.title}</p>
                <div className="w-8 h-[2px] bg-blue-500 mt-2" />
            </div>
        </div>
    );
});

const ProfileSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    const marqueeData = useMemo(() => {
        if (!photos || photos.length === 0) return [[], []];
        const rawRows: ProductCard[][] = [[], []];
        photos.forEach((photo, idx) => { rawRows[idx % 2].push(photo); });
        return rawRows.map(row => {
            if (row.length === 0) return [];
            let base = [...row];
            while (base.length < 12) base = [...base, ...row];
            return [...base, ...base];
        });
    }, [photos]);

    return (
        <section id="profile" className="py-12 md:py-24 bg-white text-black overflow-hidden">
            <ArchiveHeader number="05" title={t.nav_profile} slogan={t.slogan_profile} />
            <div className="flex flex-col gap-3 md:gap-6 mb-12 md:mb-16 select-none relative w-full marquee-container">
                {marqueeData.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <div key={`profile-row-${idx}`} className="flex overflow-hidden w-full">
                            <div className={`flex gap-3 md:gap-6 py-0 ${isEven ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} hover:[animation-play-state:paused]`} style={{ animationDuration: `${70 + idx * 25}s` }}>
                                {row.map((photo, pIdx) => (
                                    <ProfileImage 
                                        key={`${idx}-${photo.id}-${pIdx}`} 
                                        photo={photo} 
                                        onClick={() => onImageClick(photo)} 
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_profile} />}
            <div className="flex flex-col items-center mt-10"><BigAlbumButton label={t.cta_profile} onClick={onViewAll} /></div>
        </section>
    );
};

export default ProfileSection;
