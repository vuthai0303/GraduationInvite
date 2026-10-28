"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Share2,
  Check,
  CalendarPlus,
  ExternalLink,
  Sparkles,
  Quote,
  ChevronDown,
} from "lucide-react";
import GraduationAvatar from "./GraduationAvatar";
import Countdown from "./Countdown";
import PolaroidGallery from "./PolaroidGallery";
import {
  GRADUATE_NAME,
  GRADUATE_NICKNAME,
  DEGREE,
  UNIVERSITY,
  EVENT_DATE,
  EVENT_DATE_STRING,
  EVENT_TIME,
  VENUE_NAME,
  VENUE_ADDRESS,
  GOOGLE_MAPS_URL,
  AVATAR_QUOTES,
  POLAROID_PHOTOS,
} from "@/constants/eventDetails";

export interface InvitationCardProps {
  guestName: string;
  guestRole: string;
  guestMessage: string;
  guestCode?: string;
  onExploreMore?: () => void;
}

/**
 * InvitationCard - Tấm thiệp mời tốt nghiệp chính
 *
 * Chứa toàn bộ nội dung cá nhân hóa, nhân vật cử nhân tương tác,
 * thông tin ngày giờ, countdown, polaroid, và các nút tính năng.
 */
export default function InvitationCard({
  guestName,
  guestRole,
  guestMessage,
  guestCode,
  onExploreMore,
}: InvitationCardProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Bắn pháo hoa ăn mừng không giới hạn
   */
  const handleFireConfetti = useCallback(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#ec4899", "#f59e0b", "#8b5cf6", "#10b981", "#3b82f6"],
    });
  }, []);

  /**
   * Sao chép link thiệp cá nhân hóa vào Clipboard
   */
  const handleCopyLink = useCallback(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (guestCode && guestCode !== "DEFAULT") {
        url.searchParams.set("code", guestCode);
      }
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }, [guestCode]);

  /**
   * Tạo và tải file .ics để thêm sự kiện vào Google / Apple Calendar
   */
  const handleAddToCalendar = useCallback(() => {
    // 14/11/2026 15:30 GMT+7 = 20261114T083000Z
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//QuynhNhienGraduation//VN",
      "BEGIN:VEVENT",
      "UID:grad-quynh-nhien-2026@graduationinvite.vn",
      "DTSTAMP:20261027T000000Z",
      "DTSTART:20261114T083000Z",
      "DTEND:20261114T113000Z",
      `SUMMARY:🎓 Lễ Tốt Nghiệp của ${GRADUATE_NAME}`,
      `DESCRIPTION:Buổi lễ tốt nghiệp cử nhân Kế toán của ${GRADUATE_NAME}. Nhớ đến chung vui và chụp ảnh kỷ niệm nhé!`,
      `LOCATION:${VENUE_NAME}, ${VENUE_ADDRESS}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Le-Tot-Nghiep-${GRADUATE_NICKNAME}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* TẤM THIỆP CHÍNH */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl md:rounded-[40px] shadow-2xl border border-pink-100 overflow-hidden relative"
      >
        {/* Dải ruy băng mạ vàng & hồng ở góc trên */}
        <div className="h-3 w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600" />

        <div className="p-6 sm:p-10 md:p-14 space-y-10 md:space-y-14">
          {/* ========================================================= */}
          {/* PHẦN 1: LỜI CHÀO KHÁCH MỜI CÁ NHÂN HÓA                     */}
          {/* ========================================================= */}
          <div className="relative text-center">
            {/* Huy hiệu khách mời VIP */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider mb-3"
            >
              <Sparkles className="w-4 h-4" />
              Khách Mời Danh Dự
            </motion.div>

            <h2 className="text-sm sm:text-base font-bold text-slate-400 uppercase tracking-widest">
              Kính gửi Quý Khách
            </h2>

            {/* Tên Khách Mời */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy mt-1">
              <span className="bg-gradient-to-r from-pink-600 via-purple-700 to-navy bg-clip-text text-transparent">
                {guestName}
              </span>
            </h1>

            {/* Danh hiệu / Vai trò hài hước */}
            <div className="mt-2.5">
              <span className="inline-block bg-pink-100 text-pink-700 font-extrabold text-sm sm:text-base px-4 py-1.5 rounded-xl border border-pink-200 shadow-xs">
                🏷️ Danh hiệu: {guestRole}
              </span>
            </div>

            {/* Hộp Lời Nhắn Cá Nhân Hóa Độc Quyền */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl mx-auto bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 rounded-2xl p-4 sm:p-5 border border-pink-200/70 shadow-inner relative text-left"
            >
              <Quote className="w-6 h-6 text-pink-300 absolute -top-3 -left-2 rotate-180 fill-pink-200" />
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
                Lời nhắn riêng từ Quỳnh Nhiên:
              </p>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic font-medium">
                &ldquo;{guestMessage}&rdquo;
              </p>
            </motion.div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* ========================================================= */}
          {/* PHẦN 2: NHÂN VẬT CỬ NHÂN TƯƠNG TÁC + NỘI DUNG TỐT NGHIỆP  */}
          {/* ========================================================= */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Avatar cử nhân (Lớp body + nón + kính thug life + speech bubble) */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <GraduationAvatar quotes={AVATAR_QUOTES} />
              <p className="text-[11px] text-slate-400 mt-2 italic">
                👆 Chạm vào cử nhân để troll / đeo kính!
              </p>
            </div>

            {/* Giới thiệu tốt nghiệp */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 rounded-full">
                🎓 Lễ Trao Bằng Tốt Nghiệp 2026
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy leading-tight">
                Tân Cử Nhân Kế Toán
                <br />
                <span className="text-pink-600">{GRADUATE_NAME}</span>
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sau 4 năm kiên cường &ldquo;chiến đấu&rdquo; với bảng cân đối số phát sinh,
                cuối cùng thì Quỳnh Nhiên cũng chính thức được &ldquo;giải phóng&rdquo; khỏi
                giảng đường để bắt đầu sự nghiệp đi làm và trả nợ tình cảm! 🎉
              </p>

              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-lg">
                  🏛️ {UNIVERSITY}
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-lg">
                  📊 {DEGREE}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* ========================================================= */}
          {/* PHẦN 3: THỜI GIAN, ĐỊA ĐIỂM & ĐỒNG HỒ ĐẾM NGƯỢC          */}
          {/* ========================================================= */}
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-100/80 px-3 py-1 rounded-full">
                📍 Thời Gian & Địa Điểm
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
                Hẹn Gặp Bạn Tại Buổi Lễ Trọng Đại!
              </h3>
            </div>

            {/* Grid 3 cột thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ngày */}
              <div className="bg-pink-50/70 rounded-2xl p-4 sm:p-5 border border-pink-100 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Ngày diễn ra</p>
                  <p className="text-base sm:text-lg font-black text-navy mt-0.5">{EVENT_DATE_STRING}</p>
                  <p className="text-xs text-pink-600 font-semibold mt-0.5">Thứ Bảy vui vẻ</p>
                </div>
              </div>

              {/* Giờ */}
              <div className="bg-purple-50/70 rounded-2xl p-4 sm:p-5 border border-purple-100 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Khung giờ</p>
                  <p className="text-base sm:text-lg font-black text-navy mt-0.5">{EVENT_TIME} Chiều</p>
                  <p className="text-xs text-purple-600 font-semibold mt-0.5">Đón khách từ 15:00</p>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-100 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Địa điểm</p>
                  <p className="text-sm sm:text-base font-black text-navy mt-0.5">{VENUE_NAME}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{VENUE_ADDRESS}</p>
                </div>
              </div>
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className="py-2">
              <Countdown targetDate={EVENT_DATE} />
            </div>

            {/* 2 nút hành động: Google Maps & Thêm vào Lịch */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
              >
                <MapPin className="w-4 h-4" />
                Chỉ Đường Google Maps
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleAddToCalendar}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" />
                Thêm Vào Lịch (iCal / Google)
              </button>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* ========================================================= */}
          {/* PHẦN 4: BỘ SƯU TẬP ẢNH POLAROID KỶ NIỆM                  */}
          {/* ========================================================= */}
          <PolaroidGallery photos={POLAROID_PHOTOS} />

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

          {/* ========================================================= */}
          {/* PHẦN 5: CÁC NÚT TƯƠNG TÁC PHỤ (PHÁO HOA & COPY LINK)      */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-r from-pink-50 via-amber-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-pink-100 text-center space-y-4">
            <h4 className="text-lg sm:text-xl font-black text-navy">
              Góp Thêm Niềm Vui Cùng Quỳnh Nhiên 🎉
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
              Bắn pháo hoa thả ga không giới hạn, hoặc sao chép đường link thiệp VIP này để chia sẻ lại cho hội bạn thân!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              {/* Nút Bắn Pháo Hoa Ăn Mừng */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFireConfetti}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg cursor-pointer text-sm sm:text-base animate-pulse-glow"
              >
                <PartyPopper className="w-5 h-5" />
                Bắn Pháo Hoa! 🎊
              </motion.button>

              {/* Nút Copy Link Thiệp */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-navy font-bold py-3.5 px-6 rounded-2xl shadow-md border border-slate-200 hover:border-pink-300 transition-colors cursor-pointer text-sm sm:text-base"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-600">Đã Copy Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5 text-purple-600" />
                    <span>Copy Link Thiệp</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Gợi ý cuộn tiếp xem thêm hành trình & game */}
          {onExploreMore && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onExploreMore}
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-bold text-sm bg-pink-50 hover:bg-pink-100 px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>Khám phá Hành trình & Mini-Game bên dưới</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
