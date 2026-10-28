"use client";

import { Envelope } from "@/components/Envelope";
import EventTicket from "@/components/EventTicket";
import Footer from "@/components/Footer";
import { InvitationCard } from "@/components/Invitation";
import MiniGame from "@/components/MiniGame";
import RSVPSection from "@/components/RSVPSection";
import Timeline from "@/components/Timeline";
import { getGuestByCode } from "@/constants/guests";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

/**
 * Component giao diện chính xử lý logic đọc tham số URL và hiển thị trạng thái thiệp
 */
function GraduationInviteApp() {
  const searchParams = useSearchParams();

  // Đọc query param 'code' từ URL (VD: ?code=VIP01 hoặc code=vip02)
  // Xử lý linh hoạt trường hợp người dùng copy dạng "code:VIP01"
  const rawCode = searchParams.get("code") || "";
  const cleanCode = rawCode.replace(/^code:/i, "").trim();

  // Tra cứu thông tin khách mời từ danh sách cấu hình, tự động fallback sang DEFAULT
  const guestInfo = getGuestByCode(cleanCode);

  // Trạng thái mở phong bì thư (mặc định là false - phong bì đóng niêm phong)
  const [isOpened, setIsOpened] = useState(false);

  // Ref cuộn xuống các section nội dung mở rộng (Timeline, Ticket, Game, RSVP)
  const moreContentRef = useRef<HTMLDivElement>(null);

  /**
   * Cuộn mượt xuống phần nội dung mở rộng
   */
  const handleExploreMore = () => {
    moreContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /**
   * Đóng phong bì để xem lại hiệu ứng mở thư 3D
   */
  const handleReseal = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50/40 to-pink-50 text-navy relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* ========================================================= */
          /* GIAI ĐOẠN 1: PHONG BÌ 3D NIÊM PHONG BÍ MẬT                */
          /* ========================================================= */
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Envelope
              onOpen={() => setIsOpened(true)}
              guestName={guestInfo.code !== "DEFAULT" ? guestInfo.name : undefined}
            />
          </motion.div>
        ) : (
          /* ========================================================= */
          /* GIAI ĐOẠN 2 & 3: TẤM THIỆP MỞ RA VÀ CÁC SECTION NỘI DUNG */
          /* ========================================================= */
          <motion.div
            key="invitation-stage"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative"
          >
            {/* Thanh điều hướng nổi: Đóng phong bì xem lại */}
            <div className="sticky top-4 z-40 flex justify-end px-4 max-w-4xl mx-auto pointer-events-none">
              <button
                type="button"
                onClick={handleReseal}
                className="pointer-events-auto inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-pink-600 hover:text-pink-700 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-pink-200/80 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Đóng phong bì lại để trải nghiệm mở thư"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Xem lại phong bì 3D</span>
              </button>
            </div>

            {/* Tấm thiệp tốt nghiệp chính (Bao gồm Avatar, Thông tin sự kiện, Countdown, Polaroid) */}
            <InvitationCard
              guestName={guestInfo.name}
              guestRole={guestInfo.role}
              guestMessage={guestInfo.customMessage}
              guestCode={guestInfo.code}
              onExploreMore={handleExploreMore}
            />

            {/* CÁC SECTION MỞ RỘNG TIẾP NỐI */}
            <div ref={moreContentRef} className="space-y-6">
              {/* Hành trình "Sống sót" Kế toán 4 năm */}
              <Timeline />

              {/* Vé máy bay đến lễ tốt nghiệp (Boarding Pass & Google Maps) */}
              <EventTicket />

              {/* Mini-game Bắt lỗi sai Nợ - Có */}
              <MiniGame />

              {/* Xác nhận tham dự (Nút trốn lầy lội + Momo) & Lưu bút */}
              <RSVPSection />

              {/* Chân trang đếm ngược và cảm ơn */}
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * Loading fallback khi Suspense chờ resolve tham số URL
 */
function GraduationLoadingFallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1a102a] text-white">
      <div className="w-16 h-16 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
      <p className="mt-4 text-sm font-semibold text-pink-300">Đang chuẩn bị phong thư bí mật...</p>
    </div>
  );
}

/**
 * Trang chính Next.js App Router
 * Bắt buộc bọc GraduationInviteApp trong Suspense theo quy chuẩn Next.js cho useSearchParams()
 */
export default function Page() {
  return (
    <Suspense fallback={<GraduationLoadingFallback />}>
      <GraduationInviteApp />
    </Suspense>
  );
}
