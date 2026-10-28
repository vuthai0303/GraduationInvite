"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  GraduationCap,
  Plane,
  ExternalLink,
} from "lucide-react";

/**
 * EventTicket Section - Thông tin lễ tốt nghiệp
 *
 * Thiết kế dạng vé máy bay / boarding pass hạng thương gia
 * Bao gồm:
 * - Thông tin thời gian, địa điểm
 * - Barcode giả lập
 * - Nút xem Google Maps
 * - Hiệu ứng shine khi hover
 */

// Mảng kích thước cố định cho thanh barcode giả lập (tránh gọi Math.random khi render)
const BARCODE_STRIPES = [
  { width: 2, height: 32 }, { width: 1, height: 42 }, { width: 2, height: 24 }, { width: 1, height: 38 },
  { width: 1, height: 46 }, { width: 2, height: 28 }, { width: 1, height: 35 }, { width: 2, height: 44 },
  { width: 1, height: 22 }, { width: 2, height: 40 }, { width: 1, height: 30 }, { width: 1, height: 45 },
  { width: 2, height: 26 }, { width: 1, height: 36 }, { width: 2, height: 48 }, { width: 1, height: 25 },
  { width: 2, height: 34 }, { width: 1, height: 41 }, { width: 1, height: 28 }, { width: 2, height: 39 },
  { width: 1, height: 47 }, { width: 2, height: 31 }, { width: 1, height: 23 }, { width: 2, height: 43 },
  { width: 1, height: 37 }, { width: 1, height: 29 }, { width: 2, height: 46 }, { width: 1, height: 33 },
  { width: 2, height: 27 }, { width: 1, height: 40 },
];

export default function EventTicket() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-pink-pastel relative"
    >
      {/* Tiêu đề section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="text-sm md:text-base font-bold text-pink-primary uppercase tracking-widest">
          ✈️ Boarding Pass
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy mt-2">
          Bay Thẳng Đến{" "}
          <span className="text-pink-primary">Lễ Tốt Nghiệp!</span>
        </h2>
        <p className="text-navy/60 mt-3 text-sm md:text-base">
          Đây là vé VIP duy nhất dành cho bạn - không hoàn, không đổi, không được vắng mặt! ✨
        </p>
      </motion.div>

      {/* === VÉ MÁY BAY === */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 15 }} // Bắt đầu nghiêng nhẹ (3D effect)
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        whileHover={{ y: -8, scale: 1.01 }} // Nổi lên khi hover
        className="max-w-3xl mx-auto"
      >
        <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden ticket-notch border border-pink-100">
          {/* === PHẦN HEADER CỦA VÉ === */}
          <div className="bg-gradient-to-r from-navy to-navy-light px-5 md:px-8 py-4 md:py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-gold" />
              <div>
                <p className="text-gold font-bold text-sm md:text-base tracking-wider">
                  GRADUATION AIRLINES
                </p>
                <p className="text-white/70 text-xs">
                  Hạng Thương Gia ✦ First Class
                </p>
              </div>
            </div>
            <div className="text-right">
              <Plane className="w-6 h-6 md:w-8 md:h-8 text-white/80 rotate-[-30deg]" />
            </div>
          </div>

          {/* === PHẦN NỘI DUNG VÉ === */}
          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Cột trái - Thông tin chuyến "bay" */}
              <div className="flex-1 space-y-5">
                {/* Tên hành khách (cử nhân) */}
                <div>
                  <p className="text-xs text-navy/40 uppercase tracking-wider font-bold mb-1">
                    Hành Khách / Passenger
                  </p>
                  <p className="text-xl md:text-2xl font-extrabold text-navy">
                    NGUYỄN NGỌC QUỲNH NHIÊN
                  </p>
                  <p className="text-sm text-pink-primary font-semibold mt-0.5">
                    Cử nhân Kế toán (Bachelor of Accounting)
                  </p>
                </div>

                {/* Hành trình: Từ → Đến */}
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Điểm đi */}
                  <div className="text-center">
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Từ / From
                    </p>
                    <p className="text-2xl md:text-3xl font-extrabold text-navy">
                      UNI
                    </p>
                    <p className="text-xs text-navy/60">Đại Học Mở</p>
                  </div>

                  {/* Đường bay (icon máy bay + đường nét đứt) */}
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 border-t-2 border-dashed border-pink-primary/30" />
                    <motion.div
                      animate={{ x: [0, 10, 0] }} // Máy bay di chuyển qua lại
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Plane className="w-5 h-5 text-pink-primary" />
                    </motion.div>
                    <div className="flex-1 border-t-2 border-dashed border-pink-primary/30" />
                  </div>

                  {/* Điểm đến */}
                  <div className="text-center">
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Đến / To
                    </p>
                    <p className="text-2xl md:text-3xl font-extrabold text-pink-primary">
                      GRAD
                    </p>
                    <p className="text-xs text-navy/60">Lễ Tốt Nghiệp</p>
                  </div>
                </div>

                {/* Grid thông tin chi tiết */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Ngày */}
                  <div className="bg-pink-pastel/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-pink-primary" />
                      <p className="text-xs text-navy/40 uppercase font-bold">
                        Ngày / Date
                      </p>
                    </div>
                    <p className="text-lg md:text-xl font-extrabold text-navy">
                      14/11/2026
                    </p>
                    <p className="text-xs text-navy/50">Thứ Bảy</p>
                  </div>

                  {/* Giờ */}
                  <div className="bg-pink-pastel/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-pink-primary" />
                      <p className="text-xs text-navy/40 uppercase font-bold">
                        Giờ / Time
                      </p>
                    </div>
                    <p className="text-lg md:text-xl font-extrabold text-navy">
                      15:30
                    </p>
                    <p className="text-xs text-navy/50">Giờ Việt Nam (GMT+7)</p>
                  </div>
                </div>

                {/* Địa điểm */}
                <div className="bg-gradient-to-r from-pink-pastel/50 to-purple-50/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-pink-primary" />
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Địa Điểm / Venue
                    </p>
                  </div>
                  <p className="text-base md:text-lg font-bold text-navy">
                    Hội trường Đại học Mở
                  </p>
                  <p className="text-xs text-navy/50">
                    97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              {/* Cột phải - Barcode + thông tin phụ (ẩn trên mobile, hiện trên tablet+) */}
              <div className="hidden md:flex md:flex-col md:items-center md:justify-between ticket-divider pl-8 min-w-[140px]">
                {/* Boarding pass info */}
                <div className="text-center space-y-3">
                  <div>
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Cổng / Gate
                    </p>
                    <p className="text-3xl font-extrabold text-navy">G1</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Ghế / Seat
                    </p>
                    <p className="text-3xl font-extrabold text-pink-primary">
                      VIP
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy/40 uppercase font-bold">
                      Chuyến / Flight
                    </p>
                    <p className="text-xl font-bold text-navy">QN-2026</p>
                  </div>
                </div>

                {/* Barcode giả lập - tạo bằng các thanh đen có chiều rộng ngẫu nhiên */}
                <div className="mt-4">
                  <div className="flex gap-[1px] items-end h-12 justify-center">
                    {BARCODE_STRIPES.map((stripe, i) => (
                      <div
                        key={i}
                        className="bg-navy"
                        style={{
                          width: `${stripe.width}px`,
                          height: `${stripe.height}px`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[8px] text-navy/30 text-center mt-1 font-mono tracking-widest">
                    QN 1411 2026 GRAD
                  </p>
                </div>
              </div>
            </div>

            {/* === NÚT XEM GOOGLE MAPS === */}
            <motion.div className="mt-6 pt-5 border-t border-dashed border-pink-200">
              <motion.a
                href="https://maps.google.com/?q=Đại+học+Mở+TP.HCM+97+Võ+Văn+Tần"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-accent to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm md:text-base"
              >
                <MapPin className="w-5 h-5" />
                Xem đường đi trên Google Maps
                <ExternalLink className="w-4 h-4" />
              </motion.a>

              {/* Bản đồ nhúng Google Maps */}
              <div className="mt-4 rounded-xl overflow-hidden shadow-md border border-pink-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502745702037!2d106.69042!3d10.775847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2670a0de25%3A0x955748cb1e4cc228!2zxJDhuqFpIGjhu41jIE3hu58gVFAuSENNIC0gQ8ahIHPhu58gY2jDrW5o!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ Đại học Mở TP.HCM"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>

          {/* === HIỆU ỨNG SHINE KHI HOVER === */}
          {/* Một dải sáng chạy ngang qua vé khi di chuột vào */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
