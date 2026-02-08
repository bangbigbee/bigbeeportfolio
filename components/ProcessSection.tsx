
import React from 'react';
import { Target, Camera, Edit3, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface ProcessSectionProps {
    lang: Language;
    t: Record<string, string>;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ lang, t }) => {
    const steps = [
        { 
            title: t.process_step1_title || "Vision", 
            description: t.process_step1_desc || "Aligning with story.", 
            icon: <Target className="w-6 h-6 md:w-8 md:h-8" /> 
        },
        { 
            title: t.process_step2_title || "Capture", 
            description: t.process_step2_desc || "Mastery of light.", 
            icon: <Camera className="w-6 h-6 md:w-8 md:h-8" /> 
        },
        { 
            title: t.process_step3_title || "Refine", 
            description: t.process_step3_desc || "High-end post.", 
            icon: <Edit3 className="w-6 h-6 md:w-8 md:h-8" /> 
        },
        { 
            title: t.process_step4_title || "Deliver", 
            description: t.process_step4_desc || "Elevate value.", 
            icon: <CheckCircle className="w-6 h-6 md:w-8 md:h-8" /> 
        },
    ];
    
    const content = {
        tag: t.process_tag || "Philosophy",
        title: t.process_title || "Path to Perfection.",
    };

    return (
        <section id="process" className="py-10 md:py-32 bg-[#0a0a0a] text-white">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                <div className="mb-8 md:mb-16 reveal active reveal-up">
                    <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase mb-4 block opacity-80">{content.tag}</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
                        {content.title}
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="group relative bg-[#0a0a0a] p-5 md:p-8 flex flex-col justify-between overflow-hidden min-h-[180px] md:min-h-[280px]"
                        >
                            <div className="relative z-10">
                                <span className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4 md:mb-6 block">0{idx + 1}</span>
                                <div className="mb-4 md:mb-6 text-white group-hover:text-blue-500 transition-all duration-500 transform group-hover:scale-110">
                                    {step.icon}
                                </div>
                                <h4 className="text-lg md:text-xl font-black tracking-tighter uppercase mb-1 md:mb-3">{step.title}</h4>
                                <p className="text-white/40 text-[9px] md:text-[11px] font-bold tracking-[0.1em] uppercase leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.04] transition-colors duration-700 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
