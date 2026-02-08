
import React, { useMemo } from 'react';
import BigAlbumButton from './BigAlbumButton';
import { ProductCard, Language } from '../types';
import { getCloudinaryUrl } from '../App';

interface MenuSectionProps {
    onImageClick: (img: ProductCard) => void;
    onViewAll: () => void;
    lang: Language;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onImageClick, onViewAll, lang }) => {
    // Giả sử lấy dữ liệu menu từ constants hoặc props
    // Vì code gốc sử dụng getCulinaryMenuPhotos, chúng ta sẽ cần đảm bảo các ảnh này qua bộ lọc Cloudinary
    
    // Lưu ý: Trong thực tế bạn có thể truyền photos qua props giống như các section khác
    const displayPhotos: ProductCard[] = []; // Placeholder nếu cần photos động

    const content = {
        tag: lang === 'vi' ? 'MENU & CULINARY SHOTS' : 'MENU & CULINARY SHOTS',
        title: lang === 'vi' ? 'Chi Tiết\nThực Đơn.' : 'Editorial\nDetails.',
        desc: lang === 'vi' ? 'Góc nhìn tối giản và nghệ thuật về các món ăn. Tập trung vào kết cấu, độ sắc nét và sự tinh khiết của nguyên liệu.' : 'A minimal and artistic perspective on dishes. Focusing on texture, sharpness, and the purity of ingredients.',
        btn: lang === 'vi' ? 'XEM TOÀN BỘ MENU →' : 'EXPLORE MENU ALBUM →'
    };

    return (
        <section id="menu" className="py-24 md:py-48 bg-white text-black overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32 pb-20 border-b border-gray-100">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-[1px] bg-black" />
                            <span className="text-[10px] font-black tracking-[1em] text-black uppercase">{content.tag}</span>
                        </div>
                        <h2 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase leading-[0.8] mb-0 whitespace-pre-line">
                            {content.title}<span className="text-gray-200">.</span>
                        </h2>
                    </div>
                </div>
                
                {/* Content rendering logic here similar to other sections using getCloudinaryUrl(img, 'grid') */}
                
                <div className="mt-40 flex flex-col items-center">
                    <div className="w-[1px] h-24 bg-gradient-to-b from-gray-200 to-transparent mb-12" />
                    <BigAlbumButton label={content.btn} onClick={onViewAll} dark={false} />
                </div>
            </div>
        </section>
    );
};

export default MenuSection;
