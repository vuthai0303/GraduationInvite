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
  "416E682042616F": {
    code: "416E682042616F",
    name: "Anh Bảo",
    role: "Người đặc biệt 🌟",
    customMessage:
      "Cảm on Bảo vì đã chịu đựng Nhiên suốt 3 năm cấp 3, cảm ơn zì hay chọc tui hay nói chuyện zới tui để tui tỉnh ngủ 😆 Nhớ mặt đồ đẹp đẹp đi đó, quần bó ống là k miễn tiếp 😒!!!",
  },

  "416E682053616E67": {
    code: "416E682053616E67",
    name: "Anh Sang",
    role: "Freefire sống zai thành quyền thọi 🙏",
    customMessage:
      "Cảm ơn Sang vì lúc nào cũng đối xử tốt với t, tới chụp hình kỉ niệm 6 năm tình bạn nhá 👌",
  },

  "4B68616E6820487579": {
    code: "4B68616E6820487579",
    name: "Khánh Huy",
    role: "VIP 🌟",
    customMessage:
      "Mời bạn Huy đến với lễ tốt nghiệp của Quỳnh Nhiên - Sự xuất hiện của bạn là điều bất ngờ tuyệt vời nhất! 🎉",
  },

  "56616E20487579": {
    code: "56616E20487579",
    name: "Văn Huy",
    role: "Chúa mỏ hỗn 😏",
    customMessage:
      "Cảm ơn Huy vì đã chở Nhiên đi học nhaaa, mời Huy tới chụp hình với Nhiên nhá 👌",
  },

  "4D79204469656E6E": {
    code: "4D79204469656E6E",
    name: "Mỹ Diênn",
    role: "Bạn cùng tiến 😘",
    customMessage:
      "Cảm ơn Mỹ diên lúc nào cũng đi ăn zới Quỳnh Nhiên giúp Quỳnh Nhiên tăng lên dc 10 kíii 🤭",
  },

  "5468616E682048616F": {
    code: "5468616E682048616F",
    name: "Thanh Hào",
    role: "VIP 🌟",
    customMessage:
      "Mời bạn Hào tới dự lễ tốt nghiệp của bạn Nhiênn nha 🎉, chân chọng!!!",
  },

  "5468696E68": {
    code: "5468696E68",
    name: "Thịnh",
    role: "VIP 🌟",
    customMessage:
      "Mời bạn Thịnh đến với lễ tốt nghiệp của Quỳnh Nhiên - sự xuất hiện của bạn là điều bất ngờ tuyệt vời nhất! 🎉",
  },

  "54687579": {
    code: "54687579",
    name: "Thuý",
    role: "Cờ rớttt",
    customMessage:
      "Mê Thí nhứt 😘, tôi không biết bày tỏ tình iu dành cho bà như nào ngắn gọn thôi 'Không Thịnh thì có Nhiên'. Iuuu Thí 🫶",
  },

  "42696E68": {
    code: "42696E68",
    name: "Bình",
    role: "Chị chị em em 👩‍❤️‍👩",
    customMessage:
      "Chị em tốt nhứt của tui, lúc nào cũng chia sẻ giúp đỡ tuii hết, mãiii iuuu 🫶, tới chụp hình 4 chị iem mình nha 🥰",
  },

  "5068756F6E67": {
    code: "5068756F6E67",
    name: "Phương",
    role: "Người số 1️⃣",
    customMessage:
      "Cảm ơn Phương lúc nào cũng nhiệt tình giúp đỡ Nhiên hớtt, Phương là số 1️⃣ 🥰",
  },

  "5175796E68": {
    code: "5175796E68",
    name: "Quỳnh",
    role: "Bạn karaoke 🎤",
    customMessage:
      "Cảm ơn Quỳnh nhìuu lém, dù gặp Quỳnh không lâu nhưng mình đã có chung chí hướng đi hát karaoke 🎤, Quỳnh tới chụp hình zớiii Nhiênn cho zuiii nhen 🎁.",
  },
  
  "486F6E6720416E68": {
    code: "486F6E6720416E68",
    name: "Hồng Ánh",
    role: "Người tình 😘",
    customMessage:
      "Iuuuu bà nhứttt, lúc nào cũng quan tâm hỏi han tuii, lúc nào cũng làm bài cho tui chép 😆, tới chụp hình zớiii tui nha tềnhh iuu 🥰",
  },

  "5468616E68205468616F": {
    code: "5468616E68205468616F",
    name: "Thanh Thảo",
    role: "Gặp là nấu xói 🫢",
    customMessage:
      "Không gặp thì thôi gặp thì không biết nấu xói chưa bao giờ là đủ 🤣, mời Thảo tới chụp hình tốt nghiệp zớii Nhiên nhaaa 🎉.",
  },

  "5068756F6E67205472616D": {
    code: "5068756F6E67205472616D",
    name: "Phương Trâm",
    role: "🎊 Anh em Đồng Môn 🎊",
    customMessage:
      "Mời em guột tới chụp hình cho chị nhooo 🎉",
  },

  "5068756F6E67205468616F": {
    code: "5068756F6E67205468616F",
    name: "Phương Thảo",
    role: "🎊 Anh em Đồng Môn 🎊",
    customMessage:
      "Mời em guột tới chụp hình cho chị nhooo 🎉",
  },

  "4D79204C696E68": {
    code: "4D79204C696E68",
    name: "Mỹ Linh",
    role: "🎊 Chị em cây khế 🎊",
    customMessage:
      "Cảm ơn Linh nhìuuu nhe, bệnh đau hay gì cũng báo Linh, lúc nào đi đâu Linh cũng đi với Nhiên hết, nay Nhiên tốt nghiệp mời Linh tới chụp hình kỉ niệm nhennn 🎉",
  },

  "5875616E2054687579": {
    code: "5875616E2054687579",
    name: "Xuân Thuỳ",
    role: "VIP 🌟",
    customMessage:
      "Nhanh quá he, hông nghĩ mình mới học chung lớp 1 bây giờ ra trường rùi, cảm ơn bà luôn luôn đối xử tốt zới tui, bà là bạn mà tui chơi lâu nhứt từ lớp 1 tới giờ, tới chụp hình zới tuiii nhennn 🎉",
  },

  "4E676F63204E6875": {
    code: "4E676F63204E6875",
    name: "Ngọc Nhu",
    role: "🎊 Con ruột Thầy Đạt 🎊",
    customMessage:
      "Cảm ơn Nhu đã cùng tui vượt qua môn KTQT, mời Như tới dữ lễ tốt nghiệp củaa tui nháa 🎉",
  },

  "416E68205479": {
    code: "416E68205479",
    name: "Anh Tý yêu dấu",
    role: "Người yêu dấu ❤️‍🔥",
    customMessage:
      "Bé iu mời anh Tý iu dấu đến dự lễ tốt nghiệp 💓",
  },

  // --- Khách mời mặc định cho các mã code không tồn tại ---
  DEFAULT: {
    code: "DEFAULT",
    name: "Quý khách",
    role: "🎊 Người bí ẩn siêu cấp VIP 🎊",
    customMessage:
      "Dù tao không biết bạn nhận được link từ đâu, nhưng đã vào đây thì bạn là VIP rồi! Chào mừng bạn đến với lễ tốt nghiệp - sự xuất hiện của bạn là điều bất ngờ tuyệt vời nhất! 🎉",
  },
};

// ===== HÀM TRA CỨU KHÁCH MỜI =====
/**
 * Kiểm tra xem mã code khách mời có tồn tại trong hệ thống hay không (và khác DEFAULT).
 *
 * @param code - Mã code của khách mời (VD: "416E682042616F" hoặc "code:416E682042616F")
 * @returns boolean - true nếu mã code hợp lệ và có trong GUEST_MAP, ngược lại false
 */
export function isExistInviteCode(code?: string): boolean {
  if (!code) return false;
  const cleanCode = code.replace(/^code:/i, "").trim().toUpperCase();
  return cleanCode !== "" && cleanCode !== "DEFAULT" && cleanCode in GUEST_MAP;
}

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
