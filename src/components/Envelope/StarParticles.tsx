'use client';

import { useSyncExternalStore, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * StarParticles - Hiệu ứng hạt sao/bụi phát sáng trôi nổi trên nền
 *
 * Tạo 25 hạt ngẫu nhiên hoàn toàn mới (Math.random) mỗi lần tải trang.
 * Áp dụng useSyncExternalStore chuẩn React 19 để giải quyết Client-Only Mount:
 * 1. Trên Server (SSR): getServerSnapshot trả về false => danh sách hạt rỗng.
 * 2. Trên Client Hydration: đồng bộ với server snapshot => không lỗi Hydration Mismatch.
 * 3. Ngay sau khi mount: getSnapshot trả về true => tạo 25 hạt ngẫu nhiên và render mượt mà.
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
 * Tạo danh sách 25 hạt sao ngẫu nhiên.
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

const emptySubscribe = () => () => {};

export default function StarParticles() {
  // Xác định trạng thái đã mount trên client bằng API chuẩn React 19
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Chỉ sinh các hạt ngẫu nhiên khi đã ở trên client
  const particles = useMemo(() => {
    if (!isMounted) return [];
    return generateParticles(25);
  }, [isMounted]);

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
          /* Fade in mượt mà khi xuất hiện */
          initial={{ opacity: 0 }}
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
