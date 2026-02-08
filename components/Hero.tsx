
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { getCloudinaryUrl } from '../App';

interface HeroProps {
    lang: Language;
    t: Record<string, string>;
    backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ lang, t, backgroundImage }) => {
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollOffset(window.pageYOffset);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const finalBg = backgroundImage || "https://res.cloudinary.com/dhj3lf8ei/image/upload/v1739988101/617861719_2659988441049494_2024938141444314660_n_hirofg.jpg";
    const optimizedHeroUrl = getCloudinaryUrl(finalBg, 'hero');

    return (
        <section className="relative h-[85vh] md:h-[95vh] w-full flex flex-col bg-black overflow-hidden">
            <div 
                className="absolute inset-0 z-0 will-change-transform transform-gpu" 
                style={{ transform: `translateY(${scrollOffset * 0.4}px)` }}
            >
                {/* 
                  SỬ DỤNG <img> THAY CHO background-image:
                  - Có preload
                  - Có fetchPriority="high"
                  - Browser tối ưu render nhanh hơn hẳn
                */}
                <img 
                    src={optimizedHeroUrl} 
                    alt="Bigbee Studio Hero" 
                    fetchPriority="high"
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
            </div>

            <div className="h-20 md:h-24 shrink-0" />
            
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-center pb-20 pt-4">
                <div className="max-w-[1400px] w-full">
                    <h1 className="text-4xl md:text-[6.5rem] font-black tracking-tighter text-white leading-[1.3] mb-8 drop-shadow-2xl uppercase py-8 overflow-visible">
                        <span className="block pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">{t.hero_title}</span>
                        <span className="blue-text block relative pb-4 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">{t.hero_subtitle}</span>
                    </h1>
                    <p className="text-white/60 text-[11px] md:text-xs font-medium max-w-lg mx-auto mb-10 tracking-[0.2em] uppercase leading-relaxed animate-in fade-in duration-1000 delay-300">{t.hero_desc}</p>
                    <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-500">
                        <a 
                            href={t.link_contact_action || "#food-beverage"} 
                            onClick={(e) => handleAnchorScroll(e, 'food-beverage')} 
                            className="bg-white text-black px-12 py-5 rounded-[6px] text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.4em] cursor-pointer"
                        >
                            {t.hero_cta}
                        </a>
                        <ChevronDown className="w-6 h-6 text-white/20 animate-bounce mt-4" />
                    </div>
                </div>
            </div>
            <style>{`
                .blue-text { 
                    color: #0071e3; 
                    background: linear-gradient(to right, #0071e3 0%, #5ac8fa 100%); 
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </section>
    );
};

export default Hero;
