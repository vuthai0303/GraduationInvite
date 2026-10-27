"use client";

import { motion } from "framer-motion";
import { Heart, GraduationCap } from "lucide-react";

/**
 * Footer Section - Phần chân trang
 *
 * Hiển thị:
 * - Thông điệp cảm ơn
 * - Countdown timer đến ngày lễ tốt nghiệp
 * - Credit
 */

import { useState, useEffect } from "react";

export default function Footer() {
  /* === COUNTDOWN TIMER === */
  /* Đếm ngược đến ngày lễ tốt nghiệp: 14/11/2026 15:30 (GMT+7) */
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-11-14T15:30:00+07:00"); // Ngày lễ tốt nghiệp

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Cập nhật mỗi giây
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-pink-pastel to-navy py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* === COUNTDOWN === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-navy font-bold text-sm md:text-base uppercase tracking-widest mb-4">
            ⏰ Đếm ngược đến ngày trọng đại
          </p>

          {/* Các ô countdown */}
          <div className="flex justify-center gap-3 md:gap-6">
            {[
              { value: timeLeft.days, label: "Ngày" },
              { value: timeLeft.hours, label: "Giờ" },
              { value: timeLeft.minutes, label: "Phút" },
              { value: timeLeft.seconds, label: "Giây" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="bg-white/90 backdrop-blur rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg min-w-[70px] md:min-w-[90px]"
              >
                {/* Số đếm - animate khi thay đổi */}
                <motion.p
                  key={item.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-4xl font-extrabold text-pink-primary"
                >
                  {String(item.value).padStart(2, "0")}
                </motion.p>
                <p className="text-xs md:text-sm text-navy/60 font-bold mt-0.5">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* === THÔNG ĐIỆP CẢM ƠN === */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <GraduationCap className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gold" />
          <h3 className="text-xl md:text-2xl font-extrabold text-white">
            Cảm ơn bạn đã ghé thăm! 💖
          </h3>
          <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
            Sự hiện diện của bạn là món quà tốt nghiệp ý nghĩa nhất. Hẹn gặp
            bạn tại lễ tốt nghiệp ngày 14/11/2026!
          </p>

          {/* Dòng credit */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs flex items-center justify-center gap-1">
              Made with{" "}
              <Heart className="w-3 h-3 text-pink-primary fill-pink-primary animate-pulse" />{" "}
              for Quỳnh Nhiên&apos;s Graduation 2026
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
