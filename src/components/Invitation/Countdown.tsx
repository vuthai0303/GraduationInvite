"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Component Countdown thời gian thực đến ngày giờ lễ tốt nghiệp
 */
export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isFinished) {
    return (
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-4 text-center font-bold shadow-lg animate-bounce">
        🎓 Đã đến giờ làm lễ tốt nghiệp! Cùng tiến về hội trường thôi! 🎉
      </div>
    );
  }

  const items = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold uppercase tracking-wider text-pink-600 mb-3">
        <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
        <span>Đếm ngược ngày hội quân</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 text-center border border-pink-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="h-9 sm:h-11 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.value}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl font-black text-navy bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent"
                >
                  {String(item.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

