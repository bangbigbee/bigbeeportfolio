
import React from 'react';
import { Instagram, Facebook, Mail, Globe, MapPin } from 'lucide-react';
import { Language } from '../types';
import Logo from './Logo';

interface FooterProps {
    lang: Language;
    t: Record<string, string>;
}

const Footer = React.memo<FooterProps>(({ lang, t }) => {
    const year = new Date().getFullYear();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        if (targetId.startsWith('http')) return;
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-[#050505] text-white pt-16 md:pt-24 pb-12 border-t border-white/5 relative z-10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
                    <div className="flex flex-col gap-6 md:gap-8 reveal active reveal-up">
                        <div className="h-8 md:h-10 flex items-center text-white overflow-visible">
                            <Logo scale={0.3} origin="left" />
                        </div>
                        <p className="text-white/40 text-[10px] md:text-[11px] leading-relaxed font-medium uppercase tracking-[0.1em] max-w-xs">
                            {t.footer_desc}
                        </p>
                        <div className="flex gap-4 md:gap-5 mt-2">
                            <a href="https://www.instagram.com/bigbee.studio" target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/50 hover:text-white transition-colors cursor-pointer" />
                            </a>
                            <a href="https://www.facebook.com/bigbee.co.ltd" target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/50 hover:text-white transition-colors cursor-pointer" />
                            </a>
                            <a href={`mailto:${t.contact_email}`} className="p-2 md:p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/50 hover:text-white transition-colors cursor-pointer" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2 reveal active reveal-up delay-200">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 md:mb-10">Visual Archive</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            <ul className="flex flex-col gap-3 md:gap-4 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase">
                                <li><a href="#food-beverage" onClick={(e) => handleScroll(e, 'food-beverage')} className="text-white/40 hover:text-blue-500 transition-colors">01. {t.nav_food_beverage}</a></li>
                                <li><a href="#sports" onClick={(e) => handleScroll(e, 'sports')} className="text-white/40 hover:text-blue-500 transition-colors">02. {t.nav_sports}</a></li>
                                <li><a href="#wedding" onClick={(e) => handleScroll(e, 'wedding')} className="text-white/40 hover:text-rose-400 transition-colors">03. {t.nav_wedding}</a></li>
                                <li><a href="#interior" onClick={(e) => handleScroll(e, 'interior')} className="text-white/40 hover:text-blue-500 transition-colors">04. {t.nav_interior}</a></li>
                                <li><a href="#profile" onClick={(e) => handleScroll(e, 'profile')} className="text-white/40 hover:text-blue-500 transition-colors">05. {t.nav_profile}</a></li>
                            </ul>
                            <ul className="flex flex-col gap-3 md:gap-4 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase">
                                <li><a href="#event" onClick={(e) => handleScroll(e, 'event')} className="text-white/40 hover:text-blue-500 transition-colors">06. {t.nav_event}</a></li>
                                <li><a href="#realestate" onClick={(e) => handleScroll(e, 'realestate')} className="text-white/40 hover:text-blue-500 transition-colors">07. {t.nav_real_estate}</a></li>
                                <li><a href="#commercial" onClick={(e) => handleScroll(e, 'commercial')} className="text-white/40 hover:text-blue-500 transition-colors">08. {t.nav_commercial}</a></li>
                                <li><a href="#lifestyle" onClick={(e) => handleScroll(e, 'lifestyle')} className="text-white/40 hover:text-blue-500 transition-colors">09. {t.nav_lifestyle}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="reveal active reveal-up delay-400">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 md:mb-10">Studio Hotline</h4>
                        <div className="flex flex-col gap-6 md:gap-8">
                            <div className="flex gap-4">
                                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 shrink-0" />
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase">{t.contact_location_title || "Location"}</span>
                                    <span className="text-white/30 text-[9px] font-medium leading-relaxed tracking-wider">{t.contact_address}</span>
                                </div>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-[0.2em] mb-2">Email Inquiry</p>
                                <p className="text-sm md:text-base font-black tracking-tighter border-b border-white/5 group-hover:border-blue-500 transition-all pb-1 inline-block text-white/80 group-hover:text-white">
                                    {t.contact_email}
                                </p>
                            </div>
                            <div className="group cursor-pointer">
                                <p className="text-[8px] md:text-[9px] text-white/20 uppercase tracking-[0.2em] mb-2">Phone</p>
                                <p className="text-sm md:text-base font-black tracking-tighter border-b border-white/5 group-hover:border-blue-500 transition-all pb-1 inline-block text-white/80 group-hover:text-white">
                                    {t.contact_phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 reveal active">
                    <div className="flex gap-6 md:gap-10 text-[8px] md:text-[9px] font-black text-white/20 tracking-[0.3em] uppercase">
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 md:w-8 h-[1px] bg-white/10" />
                        <p className="text-[7px] md:text-[8px] font-black text-white/10 tracking-[0.3em] md:tracking-[0.4em] uppercase">
                            © {year} BIGBEE STUDIO. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
