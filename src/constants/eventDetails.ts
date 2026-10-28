/**
 * eventDetails.ts - Thông tin chi tiết lễ tốt nghiệp
 *
 * File chứa toàn bộ thông tin về buổi lễ tốt nghiệp bao gồm:
 * - Thông tin cử nhân (tên, bằng cấp, trường)
 * - Thời gian & địa điểm sự kiện
 * - URL Google Maps
 * - Các câu quote hài hước của avatar cử nhân
 * - Danh sách ảnh polaroid kỷ niệm
 */

// =============================================
// ===== THÔNG TIN CỬ NHÂN =====
// =============================================

/** Họ tên đầy đủ của cử nhân */
export const GRADUATE_NAME = "Nguyễn Ngọc Quỳnh Nhiên";

/** Tên thường gọi */
export const GRADUATE_NICKNAME = "Quỳnh Nhiên";

/** Biệt danh thân mật (dùng trong các đoạn text vui nhộn) */
export const GRADUATE_ALIAS = "Nhi Nhi";

/** Bằng cấp đạt được */
export const DEGREE = "Cử nhân Kế toán (Bachelor of Accounting)";

/** Tên trường đại học */
export const UNIVERSITY = "Trường Đại học Mở TP.HCM";

// =============================================
// ===== THỜI GIAN & ĐỊA ĐIỂM SỰ KIỆN =====
// =============================================

/**
 * Ngày giờ chính xác của buổi lễ (múi giờ Việt Nam GMT+7).
 * Dùng để tính countdown timer.
 */
export const EVENT_DATE = new Date("2026-11-14T15:30:00+07:00");

/** Ngày tháng dạng chuỗi hiển thị thân thiện cho người dùng */
export const EVENT_DATE_STRING = "Thứ Bảy, 14/11/2026";

/** Giờ bắt đầu buổi lễ */
export const EVENT_TIME = "15:30";

/** Tên địa điểm tổ chức */
export const VENUE_NAME = "Hội trường Đại học Mở TP.HCM";

/** Địa chỉ đầy đủ của địa điểm */
export const VENUE_ADDRESS =
  "97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh";

/** URL mở Google Maps để xem chỉ đường */
export const GOOGLE_MAPS_URL =
  "https://maps.google.com/?q=Đại+học+Mở+TP.HCM+97+Võ+Văn+Tần";

/** URL nhúng iframe Google Maps (dùng cho bản đồ embed trong trang) */
export const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502745702037!2d106.69042!3d10.775847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2670a0de25%3A0x955748cb1e4cc228!2zxJDhuqFpIGjhu41jIE3hu58gVFAuSENNIC0gQ8ahIHPhu58gY2jDrW5o!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s";

// =============================================
// ===== CÂU QUOTE HÀI HƯỚC CỦA AVATAR =====
// =============================================

/**
 * Danh sách các câu nói vui nhộn mà avatar cử nhân sẽ nói.
 * Được hiển thị ngẫu nhiên hoặc xoay vòng trên trang.
 * Mỗi câu mang phong cách Gen Z, hài hước, tự trào.
 */
export const AVATAR_QUOTES: string[] = [
  // Câu 1: Tự trào về tương lai sau khi ra trường
  "Cứu! Bắt đầu chuỗi ngày thất nghiệp! 😱",

  // Câu 2: Kêu gọi đến chụp hình
  "Đến chụp hình bao đẹp! 📸",

  // Câu 3: Nhắc nhở khéo về phong bì (trọng tâm!)
  "Nhớ phong bì dày nhen! 💰",

  // Câu 4: So sánh hài hước về thời gian đại học
  "4 năm đại học = 40 năm già đi 👴",

  // Câu 5: Tự trào về ngành Kế toán
  "Kế toán mà không biết đếm tiền, chỉ biết đếm nợ! 📊",

  // Câu 6: Chơi chữ với thuật ngữ kế toán (Nợ - Có)
  "Cuối cùng cũng thoát khỏi ma trận Nợ - Có! 🧮",

  // Câu 7: Hài hước về sự chuyển đổi từ nợ môn sang nợ thật
  "Tốt nghiệp rồi, giờ nợ môn thành nợ ngân hàng! 🏦",

  // Câu 8: Câu nói triết lý Gen Z
  "Welcome to real life, no more Ctrl+Z! ⌨️",

  // Câu 9: Tự hào một cách hài hước
  "GPA không cao nhưng tinh thần cao ngút trời! 🚀",

  // Câu 10: Kế toán chính hiệu
  "Bảng cân đối đời tao: Nợ nhiều hơn Có! 😂",
];

// =============================================
// ===== ẢNH POLAROID KỶ NIỆM =====
// =============================================

/** Kiểu dữ liệu cho một tấm ảnh polaroid */
export interface PolaroidPhoto {
  /** Đường dẫn đến file ảnh */
  src: string;
  /** Chú thích hài hước phía dưới ảnh (mặt trước) */
  caption: string;
  /** Chú thích vui nhộn ở mặt sau (hiện khi lật ảnh) */
  backCaption: string;
}

/**
 * Danh sách ảnh polaroid kỷ niệm đại học.
 * Mỗi ảnh có caption hài hước ở mặt trước và mặt sau.
 * Khi user click/tap vào ảnh, ảnh sẽ lật để hiện mặt sau.
 */
export const POLAROID_PHOTOS: PolaroidPhoto[] = [
  // Ảnh 1: Ngày đầu tiên nhập học
  {
    src: "/photos/photo1.jpg",
    caption: "Ngày đầu nhập học - Còn ngây thơ lắm 🌸",
    backCaption:
      "Ngày này tao còn tin đại học là thiên đường... 4 năm sau: 'Ai cho tao quay lại!' 😭",
  },

  // Ảnh 2: Nhóm đồ án huyền thoại
  {
    src: "/photos/photo2.jpg",
    caption: "Nhóm đồ án 'Dream Team' 💪",
    backCaption:
      "Dream Team gì đâu, thức trắng 3 đêm liền, ai cũng muốn disband! 😵‍💫",
  },

  // Ảnh 3: Giờ học buồn ngủ
  {
    src: "/photos/photo3.jpg",
    caption: "Giờ học 7h sáng thứ 2 📚",
    backCaption:
      "Cả lớp có 50 người thì 49 người ngủ, 1 người còn lại là giảng viên 😴",
  },

  // Ảnh 4: Canteen - chiến trường ẩm thực
  {
    src: "/photos/photo4.jpg",
    caption: "Canteen chiến trường mỗi trưa 🍜",
    backCaption:
      "Đại học không dạy tao kế toán giỏi, nhưng dạy tao xếp hàng mua cơm pro lắm! 🏃‍♀️",
  },

  // Ảnh 5: Mùa thi căng thẳng
  {
    src: "/photos/photo5.jpg",
    caption: "Mùa thi - Survival Mode ON 📝",
    backCaption:
      "Một học kỳ không học, một tuần cố gắng ôn, một đêm cầu nguyện, một bài thi viết bừa 🙏",
  },

  // Ảnh 6: Khoảnh khắc tốt nghiệp
  {
    src: "/photos/photo6.jpg",
    caption: "Cuối cùng cũng đến ngày này! 🎓",
    backCaption:
      "Tốt nghiệp rồi! Bố mẹ khóc vì mừng, tao khóc vì giờ phải đi làm thật... 😢🎉",
  },

  // Ảnh 7: Chụp hình trước cổng trường
  {
    src: "/photos/photo7.jpg",
    caption: "Check-in cổng trường lần cuối 🏫",
    backCaption:
      "4 năm đi học muốn nghỉ, giờ nghỉ rồi lại muốn quay lại. Đời là vậy! 🥲",
  },

  // Ảnh 8: Kỷ niệm với thầy cô
  {
    src: "/photos/photo8.jpg",
    caption: "Cảm ơn thầy cô đã không đuổi em 🙇‍♀️",
    backCaption:
      "Thầy cô ơi, em biết em hay ngủ gật nhưng em nghe giảng bằng tiềm thức đó ạ! 💤✨",
  },
];
