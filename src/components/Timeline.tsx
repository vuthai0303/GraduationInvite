"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  BookOpen,
  Brain,
  Trophy,
  Coffee,
  AlertTriangle,
  Zap,
  Star,
} from "lucide-react";

/**
 * Timeline Section - Hành trình "Sống sót" ngành Kế toán
 *
 * Hiển thị progress bar vui nhộn từ năm 1 đến năm 4
 * Mỗi mốc có:
 * - Icon đặc trưng
 * - Tiêu đề hài hước
 * - Mô tả chi tiết lầy lội
 * - Hiệu ứng xuất hiện khi cuộn đến (scroll-triggered)
 */

/* Dữ liệu các mốc thời gian - dễ dàng tùy chỉnh nội dung */
const milestones = [
  {
    year: "Năm 1",
    title: "Tân binh ngơ ngác 🐣",
    description:
      'Tưởng ngành kế toán chỉ cần bấm máy tính. Ai ngờ phải học cả "nghệ thuật" ghi sổ kép và phân biệt Nợ - Có. Máy tính chưa kịp bấm đã muốn bấm nút Reset đời.',
    icon: Calculator,
    emoji: "😳",
    color: "from-blue-400 to-cyan-400", // Gradient màu cho card
    bgColor: "bg-blue-50", // Màu nền nhẹ
    progress: 25, // % tiến trình
  },
  {
    year: "Năm 2",
    title: "Đầu bù tóc rối 🤯",
    description:
      "Bảng cân đối kế toán không chịu cân. Nợ môn nhiều hơn nợ tài khoản. Cà phê trở thành người bạn tri kỷ duy nhất hiểu mình.",
    icon: Coffee,
    emoji: "😤",
    color: "from-orange-400 to-red-400",
    bgColor: "bg-orange-50",
    progress: 50,
  },
  {
    year: "Năm 3",
    title: "Chiến binh mùa thuế ⚔️",
    description:
      "Sống sót qua các mùa thuế và đồ án nhóm (mà nhóm chỉ có mình làm). Đã có thể nhìn bảng số liệu mà không khóc thét.",
    icon: AlertTriangle,
    emoji: "💪",
    color: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-50",
    progress: 75,
  },
  {
    year: "Năm 4",
    title: "Vinh quang cầm bằng! 🏆",
    description:
      'Chính thức "giải ngân" tấm bằng đại học. Từ giờ sẽ "sốt ruột" đi làm thay vì sốt ruột chờ điểm. Kế toán viên chính hiệu ra lò!',
    icon: Trophy,
    emoji: "🎓",
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50",
    progress: 100,
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  /* Theo dõi khi section vào viewport để kích hoạt animation */
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-pink-pastel to-white relative overflow-hidden"
    >
      {/* Hình trang trí nền */}
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <BookOpen className="w-40 h-40 text-pink-primary" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
        <Brain className="w-32 h-32 text-purple" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Tiêu đề section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-sm md:text-base font-bold text-pink-primary uppercase tracking-widest">
            📖 Câu chuyện sinh tồn
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy mt-2">
            Hành Trình{" "}
            <span className="text-pink-primary">&ldquo;Sống Sót&rdquo;</span>{" "}
            Kế Toán
          </h2>
          <p className="text-navy/60 mt-3 text-sm md:text-base max-w-lg mx-auto">
            4 năm cười ra nước mắt, từ &ldquo;kế toán là gì?&rdquo; đến
            &ldquo;tôi là kế toán viên&rdquo;
          </p>
        </motion.div>

        {/* === THANH TIẾN TRÌNH TỔNG === */}
        {/* Progress bar chạy từ 0% đến 100% khi cuộn đến */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex justify-between text-xs md:text-sm font-bold text-navy/60 mb-2 px-1">
            <span>🏫 Nhập học</span>
            <span>🎓 Tốt nghiệp</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }} // Chạy mượt trong 2 giây
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-green-400 rounded-full relative"
            >
              {/* Hiệu ứng sáng lóa chạy dọc thanh progress */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        {/* === CÁC MỐC THỜI GIAN === */}
        <div className="space-y-6 md:space-y-8">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={index}
              milestone={milestone}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Câu quote cuối section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl px-6 py-4 shadow-lg">
            <Star className="w-5 h-5 text-gold inline mr-2" />
            <span className="text-navy font-bold text-sm md:text-base italic">
              &ldquo;Bốn năm qua không uổng phí, vì cuối cùng mình cũng biết
              Nợ - Có cân bằng!&rdquo;
            </span>
            <Star className="w-5 h-5 text-gold inline ml-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * MilestoneCard - Card hiển thị mỗi mốc thời gian
 * Sử dụng framer-motion cho hiệu ứng trượt vào từ trái/phải xen kẽ
 */
function MilestoneCard({
  milestone,
  index,
  isInView,
}: {
  milestone: (typeof milestones)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = milestone.icon;

  return (
    <motion.div
      /* Hiệu ứng trượt vào: năm lẻ từ trái, năm chẵn từ phải */
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: 0.5 + index * 0.4, // Mỗi card xuất hiện cách nhau 400ms
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      /* Hiệu ứng hover: hơi nhích lên + phóng to nhẹ */
      whileHover={{ y: -4, scale: 1.02 }}
      className={`${milestone.bgColor} rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50 relative overflow-hidden`}
    >
      {/* Gradient trang trí góc phải */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${milestone.color} rounded-full opacity-10 blur-xl`}
      />

      <div className="flex items-start gap-4 md:gap-6 relative z-10">
        {/* Icon và nhãn năm */}
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ rotate: 360 }} // Xoay 360° khi hover vào icon
            transition={{ duration: 0.6 }}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </motion.div>
          {/* Badge hiển thị % tiến trình */}
          <div className="text-center mt-2">
            <span className="text-[10px] md:text-xs font-bold text-navy/50">
              {milestone.progress}%
            </span>
          </div>
        </div>

        {/* Nội dung mô tả */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Badge năm học */}
            <span
              className={`bg-gradient-to-r ${milestone.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
            >
              {milestone.year}
            </span>
            <span className="text-xl">{milestone.emoji}</span>
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-navy mb-1">
            {milestone.title}
          </h3>
          <p className="text-navy/70 text-sm md:text-base leading-relaxed">
            {milestone.description}
          </p>

          {/* Mini progress bar cho mỗi mốc */}
          <div className="mt-3 h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={isInView ? { width: `${milestone.progress}%` } : {}}
              transition={{ delay: 1 + index * 0.4, duration: 1 }}
              className={`h-full bg-gradient-to-r ${milestone.color} rounded-full`}
            />
          </div>
        </div>

        {/* Icon lightning trang trí */}
        <Zap
          className={`w-5 h-5 md:w-6 md:h-6 text-gold absolute right-3 top-3 opacity-30`}
        />
      </div>
    </motion.div>
  );
}
