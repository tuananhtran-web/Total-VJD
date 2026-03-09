export interface Club {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  openTime: string;
  address: string;
  type: 'daily' | 'event';
  categoryId: string;
  tags?: string[];
  priceRange?: string;
  services?: string[];
  description?: string;
  images?: string[];
  reviews?: { user: string; rating: number; comment: string }[];
  rules?: string[];
}

export const clubs: Club[] = [
  {
    id: "1",
    name: "Sân Cầu Lông & Pickleballs B&B Đào Sư Tích",
    image: "https://images.unsplash.com/photo-1626248560064-a692a549090b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    distance: "6.5km",
    openTime: "05:00 - 23:00",
    address: "205A Đê thủy Lợi Ấp 3, Phước Kiển, Nhà Bè, TP.HCM",
    type: "daily",
    categoryId: "2",
    tags: ["Đơn ngày", "Sự kiện"],
    priceRange: "50.000đ - 100.000đ/giờ",
    services: ["Wifi", "Giữ xe", "Canteen", "Cho thuê vợt"],
    description: "Sân cầu lông và Pickleball tiêu chuẩn, thoáng mát, hệ thống chiếu sáng hiện đại.",
    images: [
      "https://images.unsplash.com/photo-1626248560064-a692a549090b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { user: "Linh Trang Linh", rating: 5, comment: "Sân sạch, chủ sân thân thiện." },
      { user: "Nguyễn Văn Ba", rating: 4, comment: "Giờ vàng giá tốt, đèn chiếu sáng ổn." }
    ],
    rules: [
      "Khách đặt sân phải đến đúng giờ.",
      "Khung giờ 18-22h yêu cầu đặt tối thiểu 2 giờ.",
      "Huỷ lịch trong vòng 24h sẽ hoàn 80% phí."
    ]
  },
  {
    id: "2",
    name: "Nhà Bè Badminton Pickleball - Sân mái che",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    distance: "6.9km",
    openTime: "05:00 - 22:00",
    address: "197 Đ. Đào Sư Tích, Phước Kiển, Nhà Bè, TP.HCM",
    type: "daily",
    categoryId: "2",
    tags: ["Đơn ngày", "Sự kiện"],
    priceRange: "60.000đ - 120.000đ/giờ",
    services: ["Mái che", "Nước uống", "Phòng thay đồ"],
    description: "Sân chơi chuyên nghiệp, mặt sân chống trơn trượt, phục vụ cả ngày lẫn đêm.",
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { user: "Thùy Linh", rating: 3, comment: "Khung giờ cao điểm hơi đông." }
    ],
    rules: [
      "Không hút thuốc trong khu vực sân.",
      "Giữ gìn vệ sinh chung, bỏ rác đúng nơi quy định."
    ]
  },
  {
    id: "3",
    name: "CLB Cầu Lông Phú Mỹ",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    distance: "7.0km",
    openTime: "05:30 - 22:00",
    address: "30/1 Nguyễn Văn Quỳ, Phú Thuận, Quận 7, TP.HCM",
    type: "daily",
    categoryId: "2",
    tags: ["Đơn ngày", "Đơn tháng"],
    priceRange: "40.000đ - 80.000đ/giờ",
    services: ["Wifi", "Bãi đậu xe ô tô", "Huấn luyện viên"],
    description: "Câu lạc bộ cầu lông lâu đời, uy tín, cộng đồng người chơi đông đảo."
  },
  {
    id: "4",
    name: "Trung tâm Thể thao Huỳnh Tấn Phát",
    image: "https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.2,
    distance: "7.2km",
    openTime: "06:00 - 21:00",
    address: "512A Huỳnh Tấn Phát, Phường Tân Thuận Đông, Quận 7, TP.HCM",
    type: "event",
    categoryId: "3",
    tags: ["Đơn ngày", "Sự kiện"],
    priceRange: "100.000đ - 200.000đ/trận",
    services: ["Khán đài", "Y tế", "Trọng tài"],
    description: "Trung tâm thể thao đa năng, tổ chức các giải đấu chuyên nghiệp và phong trào."
  },
   {
    id: "5",
    name: "Sân Tennis Hồ Thiên Nga",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    distance: "5.5km",
    openTime: "05:00 - 23:00",
    address: "Khu biệt thự Hồ Thiên Nga, Quận 7, TP.HCM",
    type: "daily",
    categoryId: "4",
    tags: ["Đơn ngày", "Thẻ hội viên"],
    priceRange: "150.000đ - 300.000đ/giờ",
    services: ["Người nhặt bóng", "Đèn pha", "Canteen VIP"],
    description: "Sân Tennis mặt cứng tiêu chuẩn quốc tế, không gian sang trọng, yên tĩnh."
  }
];

export interface FeaturedDeal {
  id: string;
  title: string;
  subtitle: string;
  promoText: string;
  price?: string;
  address?: string;
  phone?: string;
  imageColor: string;
  theme?: 'swin' | 'coco' | 'yellow';
  buttonText?: string;
}

export const featuredDeals: FeaturedDeal[] = [
  {
    id: "1",
    title: "Swin Pickleball",
    subtitle: "Quận 7",
    promoText: "50K/h",
    price: "Giá gốc: 100K/h",
    address: "123 Nguyễn Văn Linh, Q7",
    phone: "0909 123 456",
    imageColor: "bg-blue-100",
    theme: "swin",
    buttonText: "ĐẶT LỊCH NGAY"
  },
  {
    id: "2",
    title: "Giờ Vàng Giá Sốc",
    subtitle: "Sân B&B",
    promoText: "GIẢM 50%",
    price: "Khung giờ: 10:00 - 14:00",
    address: "205A Đê thủy Lợi, Nhà Bè",
    imageColor: "bg-orange-100",
    theme: "yellow",
    buttonText: "SĂN DEAL NGAY"
  },
  {
    id: "3",
    title: "Gói Tháng Siêu Hời",
    subtitle: "CLB Phú Mỹ",
    promoText: "TẶNG 2 BUỔI",
    price: "Khi đăng ký gói 3 tháng",
    address: "30/1 Nguyễn Văn Quỳ, Q7",
    imageColor: "bg-green-100",
    theme: "coco",
    buttonText: "ĐĂNG KÝ NGAY"
  }
];

export interface DiscoveryEvent {
  id: string;
  clubName: string;
  clubAvatar: string;
  distance: string;
  address: string;
  image: string;
  title: string;
  time: string;
  interestedCount: number;
  content: string;
  hashtags: string[];
  availableSlots: { date: string, courts: { name: string, time: string }[] }[];
}

export const discoveryEvents: DiscoveryEvent[] = [
  {
    id: "1",
    clubName: "Amber Pickleball Club",
    clubAvatar: "https://images.unsplash.com/photo-1626248560064-a692a549090b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    distance: "1.2km",
    address: "Lý Thường Kiệt, Quận 10",
    image: "https://images.unsplash.com/photo-1626248560064-a692a549090b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Giải đấu Pickleball Mở Rộng - Tranh Cúp Mùa Xuân 2024",
    time: "20/04/2024 - 08:00",
    interestedCount: 128,
    content: "Đăng ký tham gia giải đấu Pickleball mở rộng ngay hôm nay! Cơ hội giao lưu và nhận giải thưởng hấp dẫn.",
    hashtags: ["#Pickleball", "#Tournament", "#AmberClub"],
    availableSlots: []
  },
  {
    id: "2",
    clubName: "Sân B&B Đào Sư Tích",
    clubAvatar: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    distance: "6.5km",
    address: "Phước Kiển, Nhà Bè",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Khai trương sân mới - Giảm giá 50% giờ vàng",
    time: "01/05/2024",
    interestedCount: 245,
    content: "Sân mới 100%, mặt sân chuẩn thi đấu. Ưu đãi 50% cho khung giờ 10h-14h trong tháng khai trương.",
    hashtags: ["#GrandOpening", "#Discount", "#Badminton"],
    availableSlots: [
        {
            date: "Hôm nay, 20/04",
            courts: [
                { name: "Sân 1", time: "10:00 - 11:00" },
                { name: "Sân 3", time: "14:00 - 15:00" }
            ]
        }
    ]
  },
  {
    id: "3",
    clubName: "CLB Cầu Lông Phú Mỹ",
    clubAvatar: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    distance: "7.0km",
    address: "Phú Thuận, Quận 7",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Tuyển thành viên nhóm cố định 3-5-7",
    time: "Hàng tuần 18:00 - 20:00",
    interestedCount: 42,
    content: "Nhóm trình độ trung bình khá cần tuyển thêm 2 thành viên cố định. Vui vẻ, hòa đồng, bao cầu.",
    hashtags: ["#TuyenThanhVien", "#CauLongQuan7"],
    availableSlots: []
  }
];
