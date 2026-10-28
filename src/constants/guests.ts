/**
 * guests.ts - Cấu hình danh sách khách mời
 *
 * File chứa thông tin các khách mời VIP với vai trò hài hước.
 * Mỗi khách mời được định danh bằng một mã code duy nhất (VIP01, VIP02, ...).
 * Khi truy cập link thiệp có query ?code=VIP01, hệ thống sẽ hiển thị
 * thông tin cá nhân hóa cho từng khách mời.
 */

// ===== INTERFACE KHÁCH MỜI =====
/** Kiểu dữ liệu cho thông tin một khách mời */
export interface GuestInfo {
  /** Mã code duy nhất để tra cứu (VD: "VIP01") */
  code: string;
  /** Tên đầy đủ của khách mời */
  name: string;
  /** Vai trò / chức danh hài hước gắn với kỷ niệm thời đại học */
  role: string;
  /** Lời nhắn cá nhân hóa, hài hước dành riêng cho khách mời */
  customMessage: string;
}

// ===== DANH SÁCH KHÁCH MỜI VIP =====
/**
 * Bản đồ tra cứu khách mời theo mã code.
 * Key: mã code viết HOA (VD: "VIP01")
 * Value: thông tin GuestInfo tương ứng
 */
export const GUEST_MAP: Record<string, GuestInfo> = {
  // --- Tri kỷ bàn đầu - Bạn thân nhất từ năm nhất ---
  VIP01: {
    code: "VIP01",
    name: "Nguyễn Văn A",
    role: "Tri kỷ bàn đầu 🪑",
    customMessage:
      "4 năm ngồi cạnh nhau, tao biết mày ngủ gật bao nhiêu lần hơn cả giảng viên đếm bài tập. Giờ tao tốt nghiệp rồi, mày phải đến mừng chứ nhỉ? 😎",
  },

  // --- Chủ nợ thân thiết - Người cho mượn tiền triền miên ---
  VIP02: {
    code: "VIP02",
    name: "Trần Thị B",
    role: "Chủ nợ thân thiết 💸",
    customMessage:
      "Cảm ơn bạn đã tài trợ bao nhiêu bữa trà sữa suốt 4 năm đại học! Tao hứa khi đi làm sẽ trả... bằng tình cảm. Đến lễ tốt nghiệp nha, có buffet miễn phí đó! 🧋",
  },

  // --- Đại gia bảo kê - Bạn luôn bảo vệ trong mọi tình huống ---
  VIP03: {
    code: "VIP03",
    name: "Lê Văn C",
    role: "Đại gia bảo kê 🛡️",
    customMessage:
      "Từ lúc bị nhóm khác giành phòng lab đến lúc tranh ghế canteen - có bạn là có tất cả! Giờ tao ra trường rồi, ai bảo kê tao đây? Đến dự nha, bodyguard! 💪",
  },

  // --- Hội trưởng Hội Ngủ Gật - Bạn ngủ gật cùng trong giờ học ---
  VIP04: {
    code: "VIP04",
    name: "Phạm Thị D",
    role: "Hội trưởng Hội Ngủ Gật 😴",
    customMessage:
      "Hai đứa mình ngủ gật cùng nhau nhiều đến nỗi giảng viên tưởng mình bị truyền nhiễm. Giờ tốt nghiệp rồi, đến ăn mừng đi, hứa không ngủ gật lần này! (Hoặc có cũng được) 💤",
  },

  // --- Thánh chép bài - Bạn chuyên copy bài tập ---
  VIP05: {
    code: "VIP05",
    name: "Hoàng Văn E",
    role: "Thánh chép bài 📝",
    customMessage:
      "Không có bạn thì GPA tao đã bay màu từ học kỳ 2 rồi! Cảm ơn vì đã cho tao 'tham khảo' bài suốt 4 năm. Đến lễ tốt nghiệp nha - lần này tao tự viết thiệp mời, không chép ai hết! ✍️",
  },

  // --- Bạn cùng tiến (lên canteen) - Bạn ăn uống cùng ---
  VIP06: {
    code: "VIP06",
    name: "Đỗ Thị F",
    role: "Bạn cùng tiến (lên canteen) 🍜",
    customMessage:
      "4 năm đại học, học thì ít mà ăn thì nhiều. Hai đứa mình review hết tất cả quán ăn quanh trường rồi! Đến lễ tốt nghiệp nha, nghe đồn có tiệc buffet xịn lắm! 🍕",
  },

  // --- Đối tác chiến lược (nhóm đồ án) - Bạn làm đồ án cùng ---
  VIP07: {
    code: "VIP07",
    name: "Vũ Văn G",
    role: "Đối tác chiến lược (nhóm đồ án) 🤝",
    customMessage:
      "Cùng nhau thức trắng đêm làm đồ án, cùng nhau deadline chạy như chó đuổi, cùng nhau cầu nguyện thầy cho qua... Giờ tốt nghiệp rồi, đến ăn mừng 'thành quả' của hai ta đi! 🎯",
  },

  // --- Cố vấn tâm linh mùa thi - Bạn đi chùa cầu may cùng ---
  VIP08: {
    code: "VIP08",
    name: "Ngô Thị H",
    role: "Cố vấn tâm linh (mùa thi) 🔮",
    customMessage:
      "Cảm ơn bạn đã cùng tao đi chùa cầu may trước mỗi kỳ thi! Nhờ bạn mà tao qua hết các môn (hoặc do giảng viên thương). Đến lễ tốt nghiệp nha, lần này không cần cầu gì nữa rồi! 🙏",
  },

  // --- Khách mời mặc định cho các mã code không tồn tại ---
  DEFAULT: {
    code: "DEFAULT",
    name: "Quý khách",
    role: "Người bí ẩn siêu cấp VIP 🌟",
    customMessage:
      "Dù tao không biết bạn nhận được link từ đâu, nhưng đã vào đây thì bạn là VIP rồi! Chào mừng bạn đến với lễ tốt nghiệp - sự xuất hiện của bạn là điều bất ngờ tuyệt vời nhất! 🎉",
  },
};

// ===== HÀM TRA CỨU KHÁCH MỜI =====
/**
 * Tìm thông tin khách mời theo mã code.
 * Nếu không tìm thấy mã code, trả về thông tin khách mặc định (DEFAULT).
 *
 * @param code - Mã code của khách mời (VD: "VIP01", "vip01" - không phân biệt hoa thường)
 * @returns GuestInfo - Thông tin khách mời tương ứng
 *
 * @example
 * ```ts
 * const guest = getGuestByCode("VIP01");
 * // => { code: "VIP01", name: "Nguyễn Văn A", role: "Tri kỷ bàn đầu 🪑", ... }
 *
 * const unknown = getGuestByCode("RANDOM123");
 * // => { code: "DEFAULT", name: "Quý khách", role: "Người bí ẩn siêu cấp VIP 🌟", ... }
 * ```
 */
export function getGuestByCode(code: string): GuestInfo {
  // Chuyển mã code thành chữ HOA để tra cứu (không phân biệt hoa/thường)
  const normalizedCode = code.toUpperCase().trim();

  // Tra cứu trong bản đồ khách mời, nếu không có thì dùng DEFAULT
  return GUEST_MAP[normalizedCode] ?? GUEST_MAP["DEFAULT"];
}
