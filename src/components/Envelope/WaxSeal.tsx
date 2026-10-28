'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

/**
 * WaxSeal - Con dấu sáp trên phong bì
 *
 * Hiệu ứng:
 * - Trạng thái mặc định: nhịp đập nhẹ (pulse) liên tục
 * - Hover: rung lắc (wobble) + phóng to nhẹ + hiện tooltip "Ấn để bóc phốt 👀"
 * - Click: xoay nhanh + thu nhỏ về 0 (biến mất) rồi gọi onBreak
 *
 * @param onBreak - Callback khi con dấu bị phá vỡ
 */
interface WaxSealProps {
  onBreak: () => void;
}

/* Variants cho animation nhịp đập (pulse) khi ở trạng thái idle */
const pulseVariants: Variants = {
  idle: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/* Variants cho animation phá vỡ con dấu: xoay nhanh + thu nhỏ */
const breakVariants: Variants = {
  breaking: {
    scale: 0,
    rotate: 720, // xoay 2 vòng
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeIn',
    },
  },
};

/* Variants cho tooltip hiện/ẩn */
const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.9,
    transition: {
      duration: 0.15,
    },
  },
};

export default function WaxSeal({ onBreak }: WaxSealProps) {
  /* isBroken: đã bấm phá dấu chưa */
  const [isBroken, setIsBroken] = useState(false);
  /* isHovered: đang hover chuột lên dấu không */
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Xử lý khi người dùng click vào con dấu:
   * 1. Đặt trạng thái "đã phá" để chạy animation biến mất
   * 2. Sau 600ms (khi animation xong), gọi callback onBreak
   */
  const handleClick = () => {
    if (isBroken) return; // tránh click nhiều lần
    setIsBroken(true);
    setTimeout(() => {
      onBreak();
    }, 600);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Con dấu sáp chính */}
      <motion.button
        className="relative flex cursor-pointer items-center justify-center rounded-full"
        style={{
          /* Kích thước con dấu: 80px mobile, 100px desktop (dùng clamp) */
          width: 'clamp(80px, 12vw, 100px)',
          height: 'clamp(80px, 12vw, 100px)',
          /*
           * Gradient đỏ đậm tạo hiệu ứng sáp nóng chảy:
           * - Từ đỏ crimson (#991b1b) ở giữa
           * - Đến đỏ sẫm (#7f1d1d) ở viền ngoài
           */
          background: 'radial-gradient(circle at 35% 35%, #b91c1c, #991b1b 40%, #7f1d1d 80%)',
          /*
           * Hiệu ứng nổi 3D (embossed):
           * - Shadow trong sáng ở góc trên trái (ánh sáng)
           * - Shadow trong tối ở góc dưới phải (bóng đổ)
           * - Shadow ngoài tạo chiều sâu
           */
          boxShadow: `
            inset 3px 3px 6px rgba(255, 255, 255, 0.15),
            inset -2px -2px 6px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.2)
          `,
          /* Viền mỏng tạo cảm giác mép sáp */
          border: '2px solid rgba(127, 29, 29, 0.6)',
        }}
        /* Animation: nếu chưa phá thì pulse, nếu đã phá thì chạy breaking */
        variants={isBroken ? breakVariants : pulseVariants}
        animate={isBroken ? 'breaking' : 'idle'}
        /* Hiệu ứng hover: rung lắc nhẹ + phóng to */
        whileHover={
          !isBroken
            ? {
                scale: 1.1,
                /* Rung lắc: xoay qua lại ±5 độ */
                rotate: [0, -5, 5, -3, 3, 0],
                transition: {
                  rotate: { duration: 0.5, ease: 'easeInOut' },
                  scale: { duration: 0.2 },
                },
              }
            : undefined
        }
        /* Hiệu ứng nhấn: thu nhỏ nhẹ */
        whileTap={!isBroken ? { scale: 0.95 } : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        aria-label="Phá dấu sáp để mở phong bì"
      >
        {/* Icon mũ cử nhân bên trong con dấu */}
        <GraduationCap
          className="drop-shadow-sm"
          style={{
            /* Màu vàng gold cho icon nổi bật trên nền đỏ */
            color: '#fde68a',
            width: 'clamp(32px, 5vw, 40px)',
            height: 'clamp(32px, 5vw, 40px)',
            /* Glow nhẹ cho icon */
            filter: 'drop-shadow(0 0 4px rgba(253, 230, 138, 0.5))',
          }}
        />

        {/* Viền trang trí bên trong con dấu - vòng tròn nét đứt */}
        <div
          className="pointer-events-none absolute inset-2 rounded-full"
          style={{
            border: '1.5px dashed rgba(253, 230, 138, 0.3)',
          }}
        />
      </motion.button>

      {/* Tooltip hiện khi hover: "Ấn để bóc phốt 👀" */}
      <AnimatePresence>
        {isHovered && !isBroken && (
          <motion.div
            className="pointer-events-none absolute -bottom-12 left-1/2 z-10 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{
              /* Đặt tooltip ở giữa theo chiều ngang */
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(30, 27, 75, 0.9)',
              color: '#fde68a',
              /* Viền mỏng cho tooltip */
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Ấn để bóc phốt 👀
            {/* Mũi tên hướng lên trên tooltip */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(30, 27, 75, 0.9)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
