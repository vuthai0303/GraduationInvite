"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Zap } from "lucide-react";

/**
 * MiniGame Section - Trò chơi "Bắt lỗi sai tài khoản Nợ - Có"
 *
 * Easter egg vui nhộn:
 * - Hiển thị các bút toán kế toán
 * - Người chơi bấm nút xác định bút toán đúng/sai
 * - Bấm đúng → nhận câu châm ngôn hài hước về kế toán
 * - Có đếm điểm và thời gian phản hồi
 */

/* Dữ liệu các câu hỏi bút toán - dễ tùy chỉnh thêm */
const questions = [
  {
    entry: "Mua hàng chưa trả tiền: Nợ TK 156 / Có TK 111",
    isCorrect: false, // SAI: phải Có TK 331 (phải trả người bán), không phải TK 111 (tiền mặt)
    explanation:
      "Sai rồi! Mua chưa trả tiền thì phải Có TK 331 (Phải trả người bán), không phải TK 111 (Tiền mặt)! 😱",
  },
  {
    entry: "Rút tiền gửi ngân hàng về quỹ: Nợ TK 111 / Có TK 112",
    isCorrect: true, // ĐÚNG: Nợ Tiền mặt, Có Tiền gửi ngân hàng
    explanation:
      "Chính xác! Tiền mặt tăng (Nợ 111), Tiền gửi NH giảm (Có 112). Bạn giỏi lắm! 🤑",
  },
  {
    entry: "Khách hàng trả nợ bằng tiền mặt: Nợ TK 131 / Có TK 111",
    isCorrect: false, // SAI: phải ngược lại - Nợ TK 111 / Có TK 131
    explanation:
      "Oops! Khách trả nợ thì tiền mặt TĂNG (Nợ 111), phải thu GIẢM (Có 131). Bạn ghi ngược rồi! 🤪",
  },
  {
    entry: "Chi tiền mặt trả lương: Nợ TK 334 / Có TK 111",
    isCorrect: true, // ĐÚNG: Nợ Phải trả người lao động, Có Tiền mặt
    explanation:
      "Bingo! Trả lương xong thì nợ lương giảm (Nợ 334), tiền mặt cũng giảm (Có 111). Đúng rồi! 💪",
  },
  {
    entry: "Mua TSCĐ bằng tiền gửi NH: Nợ TK 211 / Có TK 331",
    isCorrect: false, // SAI: trả bằng TGNH thì Có TK 112, không phải 331
    explanation:
      "Sai bét! Mua bằng tiền gửi NH thì Có TK 112, chứ chưa ai nợ ở đây cả! 😂",
  },
];

/* Danh sách châm ngôn kế toán hài hước - hiển thị khi trả lời đúng */
const funnyQuotes = [
  "💡 Kế toán là ngành duy nhất mà 'Nợ' nhiều lại là chuyện bình thường!",
  "📊 Đằng sau mỗi kế toán viên thành công là hàng đống giấy tờ chất cao hơn người!",
  "🧮 Kế toán: Nghề duy nhất mà bạn có thể 'cân bằng' cuộc sống... trên sổ sách!",
  "💰 Tiền không mua được hạnh phúc, nhưng kế toán viên biết nó đi đâu!",
  "☕ Kế toán viên: Chạy bằng cà phê, sống nhờ Excel, và mơ về ngày cân đối!",
  "📚 Nếu bạn nghĩ kế toán nhàm chán, hãy thử 'cân' một bảng 100 dòng lúc 2h sáng!",
];

export default function MiniGame() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  /* State quản lý game */
  const [currentQuestion, setCurrentQuestion] = useState(0); // Câu hỏi hiện tại
  const [score, setScore] = useState(0); // Điểm số
  const [showResult, setShowResult] = useState(false); // Hiển thị kết quả
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false); // Câu trả lời đúng/sai
  const [gameComplete, setGameComplete] = useState(false); // Game đã hoàn thành
  const [currentQuote, setCurrentQuote] = useState(""); // Châm ngôn hiện tại
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null); // Câu trả lời đã chọn

  /**
   * Xử lý khi người chơi bấm nút trả lời
   * @param answer - true nếu người chơi chọn "Đúng", false nếu chọn "Sai"
   */
  const handleAnswer = useCallback(
    (answer: boolean) => {
      const question = questions[currentQuestion];
      const correct = answer === question.isCorrect; // So sánh với đáp án

      setSelectedAnswer(answer);
      setIsCorrectAnswer(correct);
      setShowResult(true);

      if (correct) {
        setScore((prev) => prev + 1);
        // Chọn ngẫu nhiên một câu châm ngôn hài hước
        setCurrentQuote(
          funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]
        );
      }
    },
    [currentQuestion]
  );

  /**
   * Chuyển sang câu hỏi tiếp theo hoặc kết thúc game
   */
  const nextQuestion = useCallback(() => {
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setGameComplete(true); // Hết câu hỏi → hoàn thành game
    }
  }, [currentQuestion]);

  /**
   * Reset game về trạng thái ban đầu
   */
  const resetGame = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setIsCorrectAnswer(false);
    setGameComplete(false);
    setCurrentQuote("");
    setSelectedAnswer(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-pink-pastel via-purple-50 to-white relative overflow-hidden"
    >
      {/* Hình trang trí nền */}
      <div className="absolute top-20 left-10 text-6xl md:text-8xl opacity-5 pointer-events-none select-none">
        🧮
      </div>
      <div className="absolute bottom-20 right-10 text-6xl md:text-8xl opacity-5 pointer-events-none select-none">
        📊
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tiêu đề section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-sm md:text-base font-bold text-pink-primary uppercase tracking-widest">
            🎮 Easter Egg
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy mt-2">
            <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 inline mr-2 text-purple" />
            Bắt Lỗi{" "}
            <span className="text-pink-primary">Nợ - Có</span>
          </h2>
          <p className="text-navy/60 mt-3 text-sm md:text-base">
            Thử sức xem bạn có thể trở thành kế toán viên không nào! 🤓
          </p>
        </motion.div>

        {/* === KHUNG GAME === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-8 border border-pink-100"
        >
          {/* Thanh thông tin: điểm + tiến trình */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <span className="font-bold text-navy">
                Điểm: <span className="text-pink-primary">{score}</span>/
                {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple" />
              <span className="text-sm text-navy/60">
                Câu {Math.min(currentQuestion + 1, questions.length)}/
                {questions.length}
              </span>
            </div>
          </div>

          {/* Thanh tiến trình game */}
          <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <motion.div
              animate={{
                width: `${
                  ((currentQuestion + (showResult ? 1 : 0)) / questions.length) *
                  100
                }%`,
              }}
              className="h-full bg-gradient-to-r from-pink-primary to-purple rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* === TRẠNG THÁI: GAME ĐÃ HOÀN THÀNH === */}
            {gameComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                {/* Emoji kết quả tùy theo điểm */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-6xl mb-4"
                >
                  {score >= 4 ? "🏆" : score >= 2 ? "👏" : "📚"}
                </motion.div>
                <h3 className="text-2xl font-extrabold text-navy mb-2">
                  Kết quả:{" "}
                  <span className="text-pink-primary">
                    {score}/{questions.length}
                  </span>
                </h3>
                <p className="text-navy/60 mb-4">
                  {score >= 4
                    ? "Xuất sắc! Bạn sinh ra để làm kế toán! 🎉"
                    : score >= 2
                    ? "Khá lắm! Cần ôn thêm chút xíu nha! 💪"
                    : "Ôi không... Hãy ghi danh học lại Kế toán cơ bản nhé! 😅"}
                </p>

                {/* Hiển thị châm ngôn bonus */}
                <div className="bg-gradient-to-r from-pink-pastel to-purple-50 rounded-xl p-4 mb-6">
                  <p className="text-sm md:text-base text-navy italic font-medium">
                    {funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]}
                  </p>
                </div>

                {/* Nút chơi lại */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-gradient-to-r from-pink-primary to-purple text-white font-bold px-8 py-3 rounded-full shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Chơi Lại
                </motion.button>
              </motion.div>
            ) : (
              /* === TRẠNG THÁI: ĐANG CHƠI === */
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Câu hỏi: hiển thị bút toán */}
                <div className="bg-gradient-to-r from-pink-pastel/60 to-purple-50/60 rounded-xl p-4 md:p-6 mb-6 border border-pink-100/50">
                  <p className="text-xs text-navy/40 uppercase font-bold mb-2 tracking-wider">
                    📝 Bút toán định khoản
                  </p>
                  <p className="text-base md:text-lg font-bold text-navy leading-relaxed">
                    {questions[currentQuestion].entry}
                  </p>
                </div>

                {/* Các nút trả lời */}
                {!showResult ? (
                  <div className="flex gap-3 md:gap-4">
                    {/* Nút "Đúng" */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(true)}
                      className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-base md:text-lg"
                    >
                      ✅ Đúng rồi!
                    </motion.button>

                    {/* Nút "Sai" */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(false)}
                      className="flex-1 bg-gradient-to-r from-red-400 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-base md:text-lg"
                    >
                      ❌ Sai bét!
                    </motion.button>
                  </div>
                ) : (
                  /* === HIỂN THỊ KẾT QUẢ SAU KHI TRẢ LỜI === */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Thông báo đúng/sai */}
                    <div
                      className={`rounded-xl p-4 ${
                        isCorrectAnswer
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className="font-bold text-lg mb-1">
                        {isCorrectAnswer ? "🎉 Chính xác!" : "😬 Sai rồi!"}
                      </p>
                      <p className="text-sm text-navy/70">
                        {questions[currentQuestion].explanation}
                      </p>
                    </div>

                    {/* Hiển thị châm ngôn nếu trả lời đúng */}
                    {isCorrectAnswer && currentQuote && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-gold-light/50 to-yellow-50 rounded-xl p-4 border border-gold/20"
                      >
                        <p className="text-sm md:text-base text-navy font-medium italic">
                          {currentQuote}
                        </p>
                      </motion.div>
                    )}

                    {/* Nút tiếp tục */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={nextQuestion}
                      className="w-full bg-gradient-to-r from-navy to-navy-light text-white font-bold py-3 rounded-xl shadow-lg cursor-pointer"
                    >
                      {currentQuestion < questions.length - 1
                        ? "Câu tiếp theo →"
                        : "Xem kết quả 🏆"}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
