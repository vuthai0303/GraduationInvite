"use client";

import { motion } from "framer-motion";
import { GraduationCap, Heart } from "lucide-react";

/**
 * Footer Section - Phần chân trang
 *
 * Hiển thị:
 * - Thông điệp cảm ơn
 * - Credit
 */

export default function Footer() {

  return (
    <footer className="bg-linear-to-b from-pink-pastel to-navy py-6 px-4">
      <div className="max-w-3xl mx-auto text-center">
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
