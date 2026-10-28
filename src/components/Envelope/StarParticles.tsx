'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * StarParticles - Hiệu ứng hạt sao/bụi phát sáng trôi nổi trên nền
 *
 * Tạo 25 hạt ngẫu nhiên với vị trí, kích thước, màu sắc và tốc độ khác nhau.
 * Mỗi hạt bay lên/xuống liên tục tạo hiệu ứng "bầu trời đêm" lung linh.
 * Component này được đặt absolute, không chặn sự kiện chuột (pointer-events-none).
 */

/* Bảng màu cho các hạt: vàng gold, hồng pastel, tím nhạt */
const PARTICLE_COLORS = [
  '#f59e0b', // vàng gold
  '#fde68a', // vàng nhạt
  '#ec4899', // hồng chính
  '#fbcfe8', // hồng nhạt
  '#8b5cf6', // tím
  '#c4b5fd', // tím nhạt
  '#fbbf24', // vàng ấm
];

/** Kiểu dữ liệu cho mỗi hạt sao */
interface Particle {
  id: number;
  x: number; // vị trí ngang (%)
  y: number; // vị trí dọc (%)
  size: number; // kích thước (px)
  color: string; // màu sắc
  duration: number; // thời gian animation (giây)
  delay: number; // độ trễ bắt đầu (giây)
  opacity: number; // độ trong suốt ban đầu
  drift: number; // độ trôi ngang (px)
  yDrift: number; // độ trôi dọc (px)
}

/**
 * Tạo danh sách hạt ngẫu nhiên một lần duy nhất.
 * Dùng useMemo để tránh tạo lại mỗi lần render.
 */
function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // vị trí ngang ngẫu nhiên 0-100%
    y: Math.random() * 100, // vị trí dọc ngẫu nhiên 0-100%
    size: 2 + Math.random() * 4, // kích thước 2-6px
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    duration: 3 + Math.random() * 5, // thời gian bay 3-8 giây
    delay: Math.random() * 3, // trễ ngẫu nhiên 0-3 giây
    opacity: 0.3 + Math.random() * 0.5, // opacity 0.3-0.8
    drift: -10 + Math.random() * 20, // trôi ngang ±10px
    yDrift: -(15 + Math.random() * 10), // độ trôi dọc
  }));
}

export default function StarParticles() {
  /* Tạo 25 hạt, chỉ tính 1 lần khi mount */
  const particles = useMemo(() => generateParticles(25), []);

  return (
    /* Container phủ toàn màn hình, không chặn click */
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            /* Vị trí ngẫu nhiên theo phần trăm */
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            /* Hiệu ứng phát sáng (glow) xung quanh hạt */
            boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}40`,
          }}
          /* Animation bay lên/xuống liên tục */
          animate={{
            /* Di chuyển dọc: lên rồi xuống */
            y: [0, p.yDrift, 0],
            /* Di chuyển ngang nhẹ tạo hiệu ứng trôi tự nhiên */
            x: [0, p.drift, 0],
            /* Nhấp nháy opacity */
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            /* Thay đổi kích thước nhẹ */
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity, // lặp vô hạn
            ease: 'easeInOut', // chuyển động mượt mà
          }}
        />
      ))}
    </div>
  );
}
