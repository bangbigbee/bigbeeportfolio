import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { getOptimizedUrl } from '../App';
import CrossfadeImage from './CrossfadeImage';

interface HeroProps {
    lang: Language;
    t: Record<string, string>;
    backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ lang, t, backgroundImage }) => {
    const handleAnchorScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        if (t.link_contact_action && (t.link_contact_action.startsWith('http') || t.link_contact_action.startsWith('mailto:'))) {
            return;
        }

        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const heroBgUrl = getOptimizedUrl(
        backgroundImage || "https://raw.githubusercontent.com/portbigbee/portfolio-photo/main/617861719_2659988441049494_2024938141444314660_n.jpg",
        "full"
    );

    return (
        <section className="relative h-[90vh] md:h-screen w-full flex flex-col bg-black overflow-hidden" style={{ height: '100dvh' }}>
            <div className="absolute inset-0 z-0 transform-gpu">
                {/* Sử dụng CrossfadeImage để khóa cứng hiệu ứng hòa trộn cho ảnh nền Hero */}
                <CrossfadeImage 
                    src={heroBgUrl} 
                    alt="Bigbee Visual Studio" 
                    objectFit="cover"
                    isPriority={true}
                />
                
                {/* Lớp phủ gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-[5]" />
            </div>

            <div className="h-16 md:h-24 shrink-0" />
            
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center pb-20 pt-4">
                <div className="max-w-[1400px] w-full">
                    <h1 className="text-[36px] md:text-[84px] lg:text-[110px] font-[900] tracking-[-0.04em] text-white leading-[1.05] mb-10 md:mb-12 drop-shadow-2xl uppercase transform-gpu">
                        <span className="block animate-in fade-in slide-in-from-bottom-4 duration-500 transform-gpu">{t.hero_title}</span>
                        <span className="blue-text block relative pt-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 transform-gpu">{t.hero_subtitle}</span>
                    </h1>
                    <p className="text-white/80 text-[10px] md:text-[14px] font-[600] max-w-2xl mx-auto mb-12 md:mb-14 tracking-[0.15em] uppercase leading-relaxed animate-in fade-in duration-1000 delay-300 transform-gpu">
                        {t.hero_desc}
                    </p>
                    <div className="flex flex-col items-center gap-10 animate-in fade-in duration-1000 delay-500 transform-gpu">
                        <a 
                            href={t.link_contact_action || "#food-beverage"} 
                            onClick={(e) => handleAnchorScroll(e, 'food-beverage')} 
                            className="bg-white text-black px-12 md:px-16 py-4 md:py-5 rounded-full text-[10px] md:text-[12px] font-black hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.3em] md:tracking-[0.4em] cursor-pointer"
                        >
                            {t.hero_cta}
                        </a>
                        <div className="flex flex-col items-center gap-2 mt-4 md:mt-8 opacity-40">
                            <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white animate-bounce" />
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .blue-text { 
                    color: #2997ff; 
                    background: linear-gradient(to right, #2997ff 0%, #5ac8fa 100%); 
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </section>
    );
};

export default Hero;