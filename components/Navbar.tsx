
import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone, ArrowRight } from 'lucide-react';
import { getNavItems } from '../constants';
import { Language } from '../types';
import Logo from './Logo';

interface NavbarProps {
    onLogoClick?: () => void;
    lang: Language;
    setLang: (lang: Language) => void;
    isSolid?: boolean;
    scrollProgress?: number;
    t: Record<string, string>;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, lang, setLang, isSolid = false, scrollProgress = 0, t }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navItems = getNavItems(lang, t);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showSolidBg = isSolid || isScrolled;
    const isCompact = isScrolled;

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>, href: string) => {
        if (href.startsWith('http') || href.startsWith('mailto:')) return; 
        
        e.preventDefault();
        const targetId = href.replace('#', '');
        
        if (href === '#' || href === '#home') {
            if (onLogoClick) onLogoClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
            return;
        }

        const executeScroll = (id: string) => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (isSolid) {
            if (onLogoClick) onLogoClick(); 
            setTimeout(() => {
                executeScroll(targetId);
            }, 100);
        } else {
            executeScroll(targetId);
        }
        
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out ${showSolidBg ? 'bg-white/40 backdrop-blur-[40px] border-b border-white/20 shadow-sm' : 'bg-transparent'} ${isCompact ? 'h-14 md:h-16' : 'h-16 md:h-20'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-full relative flex items-center justify-between">
                    <div className="z-20">
                        <button onClick={() => setIsMenuOpen(true)} className={`p-2 transition-all rounded-full outline-none flex items-center justify-center ${showSolidBg ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'}`}>
                            <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.2} />
                        </button>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                        <div onClick={(e) => handleNavClick(e as any, '#')} className={`cursor-pointer transition-all duration-700 flex items-center justify-center ${showSolidBg ? 'text-[#0E4500]' : 'text-white'} ${isCompact ? 'scale-[0.85]' : 'scale-100'}`}>
                            <Logo scale={0.22} origin="center" gap="gap-[8px]" className="hover:opacity-80 transition-opacity" />
                        </div>
                    </div>

                    <div className="z-20">
                        <div className={`flex items-center gap-2 md:gap-4 ${showSolidBg ? 'text-black' : 'text-white'}`}>
                            <button onClick={() => setLang('vi')} className={`text-[9px] md:text-[10px] font-black tracking-widest transition-all ${lang === 'vi' ? 'opacity-100' : 'opacity-20'}`}>VI</button>
                            <span className="opacity-10 text-[10px]">/</span>
                            <button onClick={() => setLang('en')} className={`text-[9px] md:text-[10px] font-black tracking-widest transition-all ${lang === 'en' ? 'opacity-100' : 'opacity-20'}`}>EN</button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2.5px] bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%` }} />
            </nav>

            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
                <div className={`absolute top-0 left-0 h-full w-[85%] max-w-[360px] bg-[#0a0a0a] border-r border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="px-6 pt-8 pb-0 md:px-8 flex justify-between items-center">
                            <div className="flex items-center overflow-visible">
                                <Logo scale={0.4} origin="left" gap="gap-[10px]" className="text-white" />
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white/30 hover:text-white p-2 transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="flex-grow flex flex-col justify-start px-6 md:px-8 overflow-y-auto hide-scrollbar mt-6">
                            <p className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase mb-4 ml-1">Visual Archive</p>
                            
                            <div className="flex flex-col gap-2.5 md:gap-3">
                                {navItems.map((item, idx) => (
                                    <a key={item.label} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="group flex items-center gap-3 py-0.5">
                                        <span className="text-[7px] font-black text-white/10 group-hover:text-blue-500 transition-colors w-4">0{idx + 1}</span>
                                        <span className="text-lg md:text-2xl font-black tracking-tighter text-white group-hover:text-blue-500 transition-all uppercase leading-none">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 md:p-8 pt-4 border-t border-white/5 bg-black/20">
                            <div className="grid grid-cols-1 gap-2 mb-6">
                                <a href={`mailto:${t.contact_email}`} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all shrink-0"><Mail className="w-2.5 h-2.5 text-white/40 group-hover:text-white" strokeWidth={2.3} /></div>
                                    <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors truncate tracking-wide">{t.contact_email}</span>
                                </a>
                                <a href={`tel:${t.contact_phone}`} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all shrink-0"><Phone className="w-2.5 h-2.5 text-white/40 group-hover:text-white" strokeWidth={2.3} /></div>
                                    <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors tracking-wide">{t.contact_phone}</span>
                                </a>
                            </div>
                            <a 
                                href={t.link_contact_action} 
                                target={t.link_contact_action?.startsWith('http') ? "_blank" : "_self"}
                                className="w-full bg-white text-black py-3 rounded-[6px] text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-lg group"
                            >
                                {t.menu_contact_cta}
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
