
import React from 'react';
import BigAlbumButton from './BigAlbumButton';
import ArchiveHeader from './ArchiveHeader';
import VideoCarousel from './VideoCarousel';
import InteriorBentoGrid from './InteriorBentoGrid';
import { ProductCard, Language } from '../types';

const InteriorSection: React.FC<{ onImageClick: any, onViewAll: any, lang: Language, t: any, customHospitality: ProductCard[], videos?: ProductCard[] }> = ({ onImageClick, onViewAll, lang, t, customHospitality = [], videos = [] }) => {
    return (
        <section id="interior" className="py-12 md:py-24 bg-[#faf9f6] text-black overflow-hidden relative">
            <ArchiveHeader 
                number="04" 
                title={t.nav_interior} 
                slogan={t.slogan_interior} 
                bgText="SPACE"
                bgTextColor="text-black/[0.03]"
            />
            <div className="w-full mb-8 md:mb-12 px-5 md:px-10 mt-8 relative z-10">
                <InteriorBentoGrid items={customHospitality} onImageClick={onImageClick} />
            </div>
            {videos.length > 0 && <VideoCarousel videos={videos} onVideoClick={onImageClick} title={t.video_title_interior} />}
            <div className="flex justify-center mt-10"><BigAlbumButton label={t.cta_interior} onClick={onViewAll} /></div>
        </section>
    );
};

export default InteriorSection;
