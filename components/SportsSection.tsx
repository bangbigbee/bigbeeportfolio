
import React from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import AnimatedBentoGrid from './AnimatedBentoGrid';
import VideoCarousel from './VideoCarousel';
import { ProductCard, Language } from '../types';

const SportsSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, photos: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, photos, videos = [] }) => {
    return (
        <section id="sports" className="py-12 md:py-24 bg-[#f8f9fa] overflow-hidden relative">
            <ArchiveHeader number="02" title={t.nav_sports} slogan={t.slogan_sports} />
            <div className="w-full px-5 md:px-10 mb-16 mt-8">
                <AnimatedBentoGrid items={photos} onImageClick={onImageClick} isNear={true} />
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_sports} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_sports} onClick={onViewAll} /></div>
        </section>
    );
};

export default SportsSection;
