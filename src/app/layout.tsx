import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ===== METADATA CHO SEO ===== */
/* Tối ưu cho chia sẻ trên mạng xã hội (Open Graph) */
export const metadata: Metadata = {
  title: "🎓 Thiệp Mời Tốt Nghiệp - Nguyễn Ngọc Quỳnh Nhiên",
  description:
    "Cảnh báo: Một Kế toán viên sắp thoát khỏi ma trận nợ môn! Hãy đến chung vui cùng Quỳnh Nhiên tại lễ tốt nghiệp Đại học Mở ngày 14/11/2026!",
  openGraph: {
    title: "🎓 Lễ Tốt Nghiệp Quỳnh Nhiên - Đại Học Mở",
    description:
      "Quỳnh Nhiên chính thức tốt nghiệp ngành Kế toán! Bạn có dám bỏ lỡ?",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
