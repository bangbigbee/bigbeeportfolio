
import React, { useMemo, memo, useState, useRef } from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

const EventImage = memo(({ img, onClick }: { img: ProductCard, onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const thumbUrl = useMemo(() => getCloudinaryUrl(img.imageUrl, 'grid'), [img.imageUrl]);

    return (
        <div 
            className="w-[180px] md:w-[400px] aspect-[16/9] flex-shrink-0 relative overflow-hidden group cursor-pointer rounded-[6px] shadow-sm transform-gpu bg-[#111]" 
            onClick={onClick} 
            style={{ isolation: 'isolate' }}
        >
            {!isLoaded && <div className="absolute inset-0 shimmer-bg-dark z-[1]" />}
            <img 
                src={thumbUrl} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:scale-105 z-10 image-load-fade ${isLoaded ? 'loaded opacity-100' : 'opacity-0'}`} 
                alt={img.title}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4 md:p-6">
                <p className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-tighter leading-tight">{img.title}</p>
                <div className="w-8 h-[2px] bg-blue-500 mt-2" />
            </div>
        </div>
    );
});

const EventSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, customEventPhotos?: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, customEventPhotos = [], videos = [] }) => {
    const rows = useMemo(() => {
        if (!customEventPhotos || customEventPhotos.length === 0) return [[], [], [], []];
        const r: ProductCard[][] = [[], [], [], []];
        customEventPhotos.forEach((p, i) => { r[i % 4].push(p); });
        return r.map(row => {
            let res = [...row];
            while (res.length < 12) res = [...res, ...row];
            return [...res, ...res];
        });
    }, [customEventPhotos]);

    return (
        <section id="event" className="py-12 md:py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
            <ArchiveHeader number="06" title={t.nav_event} slogan={t.slogan_event} light={true} />
            <div className="relative flex flex-col gap-2 md:gap-3 mb-12 md:mb-16 select-none w-full px-5 md:px-10 z-10">
                {rows.map((row, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <div key={`event-row-${idx}`} className="flex overflow-hidden w-full">
                            <div className={`flex gap-2 md:gap-3 py-1 ${isEven ? 'animate-marquee-rtl' : 'animate-marquee-ltr'} hover:[animation-play-state:paused]`} style={{ animationDuration: `${45 + idx * 8}s` }}>
                                {row.map((img, i) => (
                                    <EventImage 
                                        key={`e-${idx}-${img.id}-${i}`} 
                                        img={img} 
                                        onClick={() => onImageClick(img)} 
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_event} light={true} />}
            <div className="flex flex-col items-center mt-10"><BigAlbumButton label={t.cta_event} onClick={onViewAll} dark={true} /></div>
        </section>
    );
};

export default EventSection;
