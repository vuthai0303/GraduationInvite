"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import EventTicket from "@/components/EventTicket";
import MiniGame from "@/components/MiniGame";
import RSVPSection from "@/components/RSVPSection";
import Footer from "@/components/Footer";

/**
 * Trang chính - Thiệp mời tốt nghiệp Quỳnh Nhiên
 *
 * Flow:
 * 1. Hiển thị Hero Section với pháo giấy + nút CTA
 * 2. Khi bấm nút "Mở thiệp", cuộn mượt xuống phần nội dung
 * 3. Các section xuất hiện dần khi cuộn (scroll-triggered animations)
 *
 * Sử dụng state `isInviteOpened` để kiểm soát:
 * - Khi chưa mở: chỉ hiện Hero
 * - Khi đã mở: hiện tất cả các section với animation đẹp
 */
export default function Home() {
  const [isInviteOpened, setIsInviteOpened] = useState(false); // Trạng thái mở thiệp
  const contentRef = useRef<HTMLDivElement>(null); // Ref để cuộn đến nội dung

  /**
   * Xử lý khi bấm nút "Mở thiệp" ở Hero Section
   * - Đặt trạng thái đã mở
   * - Cuộn mượt xuống phần nội dung chính
   */
  const handleOpenInvite = () => {
    setIsInviteOpened(true);

    // Đợi 300ms cho animation render xong rồi mới cuộn
    // (tránh cuộn đến element chưa tồn tại trong DOM)
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth", // Cuộn mượt
        block: "start", // Cuộn đến đầu element
      });
    }, 300);
  };

  return (
    <main className="relative">
      {/* === HERO SECTION - LUÔN HIỂN THỊ === */}
      <Hero onOpenInvite={handleOpenInvite} />

      {/* === CÁC SECTION NỘI DUNG - CHỈ HIỂN THỊ KHI ĐÃ MỞ THIỆP === */}
      <AnimatePresence>
        {isInviteOpened && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }} // Bắt đầu mờ
            animate={{ opacity: 1 }} // Hiện dần
            transition={{ duration: 0.8 }}
          >
            {/* Section 1: Hành trình "Sống sót" Kế toán */}
            <Timeline />

            {/* Section 2: Thông tin lễ tốt nghiệp (dạng vé máy bay) */}
            <EventTicket />

            {/* Section 3: Mini-game Easter Egg */}
            <MiniGame />

            {/* Section 4: Xác nhận tham dự + Lưu bút */}
            <RSVPSection />

            {/* Footer với countdown */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
