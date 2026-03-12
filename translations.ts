
import { Language } from './types';

export type TranslationData = Record<string, string>;
export type TranslationStore = Record<Language, TranslationData>;

export const FALLBACK_TRANSLATIONS: TranslationStore = {
  vi: {
    og_title: "Bigbee – Hình ảnh không chỉ để đẹp.",
    og_subtitle: "Chúng tôi tạo hình ảnh và video giúp thương hiệu được nhìn thấy, được nhớ và được chọn.",
    
    hero_title: "QUA TỪNG KHUNG HÌNH .",
    hero_subtitle: "CẢM XÚC THĂNG HOA .",
    hero_desc: "BIGBEE KIẾN TẠO NHỮNG CÂU CHUYỆN HÌNH ẢNH CAO CẤP CHO THƯƠNG HIỆU VÀ KHÔNG GIAN CỦA BẠN.",
    hero_cta: "KHÁM PHÁ BIGBEE",
    
    // Categories
    nav_food_beverage: "FOOD & BEVERAGE",
    nav_sports: "SPORTS",
    nav_wedding: "WEDDING",
    nav_interior: "INTERIOR",
    nav_profile: "PROFILE",
    nav_event: "EVENT",
    nav_real_estate: "REAL ESTATE",
    nav_commercial: "COMMERCIAL",
    nav_lifestyle: "LIFE STYLE",

    // Video Section Titles
    video_title_food: "Ẩm Thực Cinema",
    video_title_sports: "Thể Thao Cinema",
    video_title_wedding: "Phóng Sự Cưới",
    video_title_interior: "Kiến Trúc Cinema",
    video_title_profile: "Profile Cinema",
    video_title_event: "Sự Kiện Cinema",
    video_title_real_estate: "Bất Động Sản Cinema",
    video_title_commercial: "Thương Mại Cinema",
    video_title_lifestyle: "Lifestyle Cinema",

    // CTA Button Keys
    cta_food_beverage: "KHÁM PHÁ FOOD & BEVERAGE →",
    cta_sports: "KHÁM PHÁ SPORTS →",
    cta_wedding: "KHÁM PHÁ WEDDING →",
    cta_interior: "KHÁM PHÁ INTERIOR →",
    cta_profile: "KHÁM PHÁ PROFILE →",
    cta_event: "KHÁM PHÁ EVENT →",
    cta_real_estate: "KHÁM PHÁ REAL ESTATE →",
    cta_commercial: "KHÁM PHÁ COMMERCIAL →",
    cta_lifestyle: "KHÁM PHÁ LIFE STYLE →",

    // Wedding Collections Keys
    wedding_item_1: "Love Story Vol.1",
    wedding_item_2: "Love Story Vol.2",
    wedding_item_3: "Love Story Vol.3",
    wedding_item_4: "Love Story Vol.4",
    wedding_item_5: "Love Story Vol.5",
    wedding_item_6: "Love Story Vol.6",

    // Slogans
    slogan_food_beverage: "Hình ảnh hóa hương vị, bán sạch từng món ăn.",
    slogan_sports: "Nghệ thuật của sức mạnh và chuyển động không ngừng.",
    slogan_wedding: "Nơi mỗi ánh nhìn trở thành ký ước vĩnh cửu.",
    slogan_interior: "Không gian mời gọi, chi tiết hoàn hảo.",
    slogan_profile: "Định hình uy tín của bạn qua ống kính.",
    slogan_event: "Lưu giữ bầu không khí, đóng khung năng lượng.",
    slogan_real_estate: "Phô diễn tài sản, tối đa hóa giá trị thị trường.",
    slogan_commercial: "Kiến tạo khao khát, thúc đẩy thành công thương mại.",
    slogan_lifestyle: "Ghi lại đam mê, tôn vinh hành trình cá nhân.",

    // Descriptions
    food_beverage_desc: "Dự án chụp ẩm thực, đồ uống và quảng cáo thương hiệu nhà hàng cao cấp.",
    sports_desc: "Năng lượng bùng nổ của hành động và vẻ đẹp hùng vĩ của những vùng đất mới.",
    wedding_desc: "Những câu chuyện tình yêu được kể lại qua lăng kính điện ảnh và giàu cảm xúc.",
    interior_desc: "Lưu trữ hình ảnh Văn phòng, Nhà hàng, Café và Nhận diện thương hiệu.",
    profile_desc: "Chân dung chuyên nghiệp và phong cách sống đẳng cấp cho lãnh đạo.",
    event_desc: "Lưu giữ những khoảnh khắc kịch tính của các sự kiện tầm cỡ.",
    real_estate_desc: "Tối đa hóa giá trị thị trường qua hình ảnh và video bất động sản chuyên nghiệp.",
    commercial_desc: "Thúc đẩy thành công thương mại qua hình ảnh sản phẩm sáng tạo.",
    lifestyle_desc: "Tôn vinh hành trình cá nhân qua góc máy nghệ thuật.",

    // Process & Studio Section (Last 2 sections)
    process_tag: "TRIẾT LÝ",
    process_title: "Hành trình hoàn hảo.",
    process_step1_title: "Tầm nhìn",
    process_step1_desc: "Đồng điệu với câu chuyện.",
    process_step2_title: "Ghi ảnh",
    process_step2_desc: "Làm chủ ánh sáng.",
    process_step3_title: "Tinh chỉnh",
    process_step3_desc: "Hậu kỳ đẳng cấp.",
    process_step4_title: "Bàn giao",
    process_step4_desc: "Nâng tầm giá trị.",
    
    studio_title: "BIGBEE STUDIO",
    studio_section_cta: "BẮT ĐẦU DỰ ÁN",

    menu_contact_cta: "LIÊN HỆ NGAY",
    contact_phone: "(+84) 0915 091 093",
    contact_email: "bigbeecoltd@gmail.com",
    contact_address: "77 Nguyễn Sinh Sắc, Hòa Khánh, Đà Nẵng",
    contact_location_title: "Địa điểm",
    link_contact_action: "https://zalo.me/0915091093",
    footer_desc: "BigBee Studio kiến tạo những di sản hình ảnh thông qua ngôn ngữ điện ảnh đặc trưng."
  },
  en: {
    og_title: "Bigbee – More than just aesthetics.",
    og_subtitle: "We create visuals and videos that help your brand be seen, remembered, and chosen.",

    hero_title: "EVERY FRAME KEEPS .",
    hero_subtitle: "EMOTIONS BLOOM .",
    hero_desc: "BIGBEE CRAFTS PREMIUM VISUAL NARRATIVES FOR YOUR BRAND AND SPACES.",
    hero_cta: "EXPLORE BIGBEE",

    nav_food_beverage: "FOOD & BEVERAGE",
    nav_sports: "SPORTS",
    nav_wedding: "WEDDING",
    nav_interior: "INTERIOR",
    nav_profile: "PROFILE",
    nav_event: "EVENT",
    nav_real_estate: "REAL ESTATE",
    nav_commercial: "COMMERCIAL",
    nav_lifestyle: "LIFE STYLE",

    // Video Section Titles
    video_title_food: "Gastronomy Cinema",
    video_title_sports: "Sports Cinema",
    video_title_wedding: "Wedding Journalism",
    video_title_interior: "Architecture Cinema",
    video_title_profile: "Profile Cinema",
    video_title_event: "Event Cinema",
    video_title_real_estate: "Real Estate Cinema",
    video_title_commercial: "Commercial Cinema",
    video_title_lifestyle: "Lifestyle Cinema",

    // CTA Button Keys
    cta_food_beverage: "EXPLORE FOOD & BEVERAGE →",
    cta_sports: "EXPLORE SPORTS →",
    cta_wedding: "EXPLORE WEDDING →",
    cta_interior: "EXPLORE INTERIOR →",
    cta_profile: "EXPLORE PROFILE →",
    cta_event: "EXPLORE EVENT →",
    cta_real_estate: "EXPLORE REAL ESTATE →",
    cta_commercial: "EXPLORE COMMERCIAL →",
    cta_lifestyle: "EXPLORE LIFE STYLE →",

    wedding_item_1: "Love Story Vol.1",
    wedding_item_2: "Love Story Vol.2",
    wedding_item_3: "Love Story Vol.3",
    wedding_item_4: "Love Story Vol.4",
    wedding_item_5: "Love Story Vol.5",
    wedding_item_6: "Love Story Vol.6",

    slogan_food_beverage: "Visualize flavor, sell every dish.",
    slogan_sports: "The art of power and relentless motion.",
    slogan_wedding: "Where every glance becomes a timeless memory.",
    slogan_interior: "Inviting spaces, perfected in every detail.",
    slogan_profile: "Shape your reputation through the lens.",
    slogan_event: "Preserve the atmosphere, frame the energy.",
    slogan_real_estate: "Showcase properties, maximize market value.",
    slogan_commercial: "Create desire, drive commercial success.",
    slogan_lifestyle: "Capture passion, celebrate personal journeys.",

    food_beverage_desc: "Premium food and beverage projects for high-end branding.",
    sports_desc: "Explosive athletic energy and majestic global landscapes.",
    wedding_desc: "Love stories told through a cinematic visual lens.",
    interior_desc: "Corporate Offices, Restaurants, and Brand Identity in architecture.",
    profile_desc: "Professional portraits and high-end lifestyle for leaders.",
    event_desc: "Capturing dramatic highlights of premium events.",
    real_estate_desc: "Maximize market value through professional property media.",
    commercial_desc: "Drive commercial success through creative product visuals.",
    lifestyle_desc: "Celebrate personal journeys through an artistic lens.",

    // Process & Studio Section
    process_tag: "PHILOSOPHY",
    process_title: "Path to Perfection.",
    process_step1_title: "Vision",
    process_step1_desc: "Aligning with your story.",
    process_step2_title: "Capture",
    process_step2_desc: "Mastery of light.",
    process_step3_title: "Refine",
    process_step3_desc: "High-end cinematic standards.",
    process_step4_title: "Deliver",
    process_step4_desc: "Elevating value.",
    
    studio_title: "BIGBEE STUDIO",
    studio_section_cta: "START A PROJECT",

    menu_contact_cta: "CONTACT NOW",
    contact_phone: "(+84) 0915 091 093",
    contact_email: "bigbeecoltd@gmail.com",
    contact_address: "77 Nguyen Sinh Sac Street, Da Nang",
    contact_location_title: "Location",
    link_contact_action: "https://zalo.me/0915091093",
    footer_desc: "BigBee Studio creates visual legacies through distinctive cinema language."
  }
};
