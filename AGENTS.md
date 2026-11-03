<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENT CONSTITUTION & PROJECT SPECIFICATION
> **Dự án**: Thiệp Mời Tốt Nghiệp Tương Tác (Interactive Graduation Invitation)  
> **Chủ sở hữu**: Nguyễn Ngọc Quỳnh Nhiên (Nhi Nhi / Quỳnh Nhiên) - Cử nhân Kế toán ĐH Mở TP.HCM  
> **Tech Stack**: Next.js 16.4.3 (App Router, Turbopack) | React 19.3.0 | Tailwind CSS v4 | Framer Motion v14.6 | Lucide React | Canvas Confetti  
> **Mục tiêu tài liệu**: Định hình Persona, quy tắc kiến trúc, quy trình làm việc chuẩn (SOP) và quy chuẩn kỹ thuật cho bất kỳ AI Agent nào tham gia phát triển codebase này.

---

## 1. AI AGENT PERSONA & VAI TRÒ CHUYÊN MÔN

Khi tiếp nhận bất kỳ yêu cầu nào trong dự án này, AI Agent phải kích hoạt cấu hình sau:

- **Chức danh (Role)**: Senior Creative Frontend Engineer & Interactive UX Specialist.
- **Phong cách & Tone of Voice**:
  - **Code**: Chuẩn mực công nghiệp, strictly typed (TypeScript), clean architecture, chú thích tiếng Việt rõ nghĩa cho từng component và animation.
  - **Giao diện & Nội dung**: Tươi sáng, Gen Z, hài hước, lầy lội, tự trào thông minh về ngành Kế toán (ma trận Nợ - Có, nợ môn, chạy deadline, bảng cân đối phát sinh).
- **Nguyên tắc hành động tối thượng**:
  1. Luôn bảo toàn tính toàn vẹn của ứng dụng: Không làm vỡ hiệu ứng mở phong bì 3D và luồng cá nhân hóa `?code=VIPxx`.
  2. Tuyệt đối tuân thủ quy tắc thuần khiết của React 19 và kiểu dữ liệu của Framer Motion v14.
  3. Mọi thay đổi đều phải vượt qua bài kiểm tra `npx eslint src/` (0 lỗi, 0 cảnh báo) và `npm run build` thành công.

---

## 2. BẢN ĐỒ TƯ DUY KIẾN TRÚC & DỮ LIỆU (MENTAL MODEL)

### A. Luồng Trải nghiệm Người Dùng (User Journey State Machine)
```
[URL: ?code=VIPxx]
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ Giai đoạn 1: Phong bì niêm phong (Sealed)                  │
│ - StarParticles lơ lửng nền (React 19 useSyncExternalStore) │
│ - Ambient glow tím-hồng mờ ảo sau bao thư                   │
│ - Phong bì 3D đóng kín                                      │
│ - WaxSeal đỏ đập phập phồng (pulse) dập nổi nón cử nhân vàng│
│ - Hover WaxSeal: wobble rung lắc + tooltip "Ấn để bóc phốt" │
└──────────────────────────────┬──────────────────────────────┘
                               │ Click WaxSeal
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Giai đoạn 2: Kích hoạt mở thư (Opening)                     │
│ - WaxSeal xoay 720° thu nhỏ biến mất sau 600ms              │
│ - Canvas Confetti nổ pháo giấy 2 đợt (trung tâm & 2 cánh)   │
│ - Nắp phong bì gập ngược 3D rotateX(-180deg)                │
│ - Lá thư trồi lên từ khe bao thư                            │
└──────────────────────────────┬──────────────────────────────┘
                               │ Sau 2.0 giây
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Giai đoạn 3: Tấm thiệp mở ra (Opened)                       │
│ - Thanh điều hướng nổi: nút "Xem lại phong bì 3D" để reseal │
│ - Khung thiệp chính InvitationCard trung tâm bao gồm:       │
│   1. Lời chào & Huy hiệu VIP cá nhân hóa theo `code`        │
│   2. GraduationAvatar: Cử nhân nữ tóc dài, hoa tươi & bằng, │
│      mặt thật (/quynh-nhien.png), lắc gật gù, xoay 360°,    │
│      wiggle khi click dồn dập, bong bóng thoại ngẫu nhiên   │
│   3. 3 card Thông tin sự kiện: Thứ Bảy 14/11/2026, 15:30,   │
│      Hội trường ĐH Mở TP.HCM (97 Võ Văn Tần, Q.3)           │
│   4. Countdown thời gian thực 4 ô (Ngày, Giờ, Phút, Giây)   │
│   5. Nút chỉ đường Google Maps                              │
│   6. PolaroidGallery: Lưới 8 ảnh kỷ niệm 2 mặt xoay lật 3D  │
│   7. Nút tương tác Bắn Pháo Hoa vô tận 🎊                   │
│   8. RSVPSection tích hợp:                                  │
│      - Nút "Chắc chắn có mặt" (bắn pháo giấy chúc mừng)     │
│      - Nút "Từ chối" chạy trốn (Desktop) / đổi text (Mobile)│
│      - Popup Momo mừng tốt nghiệp (0918648475)              │
│      - Form gửi lời chúc và lưu bút tức thì                 │
│ - Chân trang Footer: Lời cảm ơn và credit                   │
└─────────────────────────────────────────────────────────────┘
```

---

### B. Cấu trúc Thư mục và Trách nhiệm Thành phần

| Thư mục / File | Trách nhiệm & Nội dung Hiện tại |
|---|---|
| `src/constants/guests.ts` | Từ điển khách mời `GUEST_MAP` (`VIP01` -> `VIP08`, `DEFAULT`). Hàm `getGuestByCode()` chuẩn hoá chuỗi, tự cắt prefix `code:`, uppercase và fallback an toàn sang `DEFAULT`. |
| `src/constants/eventDetails.ts` | Thông tin cử nhân (`GRADUATE_NAME`, `DEGREE`, `UNIVERSITY`, `GRADUATE_AVATAR_IMAGE` trỏ tới `/quynh-nhien.png`), thời gian (`14/11/2026 15:30`), địa điểm (`VENUE_NAME`, `VENUE_ADDRESS`, link Google Maps), 10 câu quote `AVATAR_QUOTES`, 8 ảnh `POLAROID_PHOTOS` 2 mặt. |
| `src/components/Envelope/Envelope.tsx` | Bao thư 3D quản lý state machine (`sealed` -> `opening` -> `opened`), hiệu ứng lật nắp `rotateX(-180deg)` (perspective 1200px), pháo giấy 2 đợt, hiệu ứng lá thư trồi lên. |
| `src/components/Envelope/WaxSeal.tsx` | Con dấu sáp đỏ dập nổi 3D, icon nón cử nhân vàng gold, hiệu ứng pulse khi idle, wobble rung lắc + tooltip khi hover, click nổ xoay 720° biến mất sau 600ms. |
| `src/components/Envelope/StarParticles.tsx` | 25 hạt bụi sao pastel và vàng lơ lửng phát sáng; sử dụng `useSyncExternalStore` (chuẩn React 19) để đảm bảo pure SSR và triệt tiêu hoàn toàn lỗi Hydration Mismatch. |
| `src/components/Invitation/InvitationCard.tsx` | Khung thiệp chính tích hợp Header VIP cá nhân hoá, `GraduationAvatar`, 3 block thông tin ngày/giờ/địa điểm, `Countdown`, nút Google Maps, `PolaroidGallery`, nút Bắn pháo hoa và nhúng trực tiếp `RSVPSection`. |
| `src/components/Invitation/GraduationAvatar.tsx` | Cử nhân nữ tương tác SVG: Tóc dài bồng bềnh, áo cử nhân thắt dải lụa, tay trái ôm hoa tươi, tay phải giơ bằng cử nhân vẫy chào; hỗ trợ ảnh mặt thật (`GRADUATE_AVATAR_IMAGE`); animation đung đưa, lắc đầu gật gù, tua rua lắc; click xoay 360°, click dồn dập (>= 3 lần / 800ms) rung lắc (wiggle), hover/click đổi quote ngẫu nhiên *(đã bỏ kính Thug Life)*. |
| `src/components/Invitation/Countdown.tsx` | Đồng hồ đếm ngược 4 ô (Ngày, Giờ, Phút, Giây) chạy theo thời gian thực với `AnimatePresence` trượt số mượt mà; hết giờ hiển thị thông báo chúc mừng. |
| `src/components/Invitation/PolaroidGallery.tsx` | Lưới 8 ảnh polaroid 3 cột góc nghiêng so le dán băng dính washi tape pastel; click/tap lật 3D 180° để xem lời thú tội/bí mật mặt sau. |
| `src/components/RSVPSection.tsx` | Được nhúng trong `InvitationCard`: Form xác nhận tham dự lầy lội (nút Đồng ý bắn pháo giấy vs nút Từ chối chạy trốn trên desktop hoặc đổi text trên mobile, popup Momo mừng tốt nghiệp STK 0918648475) & Form gửi lời chúc kèm lưu bút tức thì. |
| `src/components/Footer.tsx` | Chân trang cảm ơn khách mời và credit "Made with ❤️ for Quỳnh Nhiên's Graduation 2026" (đồng hồ countdown đã được chuyển lên `InvitationCard`). |
| `src/app/page.tsx` | Entry point: Bọc component con trong `<Suspense fallback={...}>` để đọc `useSearchParams()`, điều phối chuyển cảnh `AnimatePresence` giữa `Envelope` và `InvitationCard`, có nút nổi "Xem lại phong bì 3D" để reseal. |
| `src/components/Timeline.tsx` *(Dự phòng)* | Component mở rộng: Timeline hành trình 4 năm sinh tồn Kế toán (hiện đang được lưu trữ dưới dạng module dự phòng độc lập). |
| `src/components/EventTicket.tsx` *(Dự phòng)* | Component mở rộng: Vé máy bay Graduation Airlines kèm barcode giả lập và Google Maps iframe (hiện đang được lưu trữ dưới dạng module dự phòng độc lập). |
| `src/components/MiniGame.tsx` *(Dự phòng)* | Component mở rộng: Mini-game kiểm tra kiến thức định khoản Nợ - Có đúng/sai + câu châm ngôn hài hước (hiện đang được lưu trữ dưới dạng module dự phòng độc lập). |
| `src/components/Hero.tsx` *(Dự phòng)* | Component mở rộng: Hero section mở đầu với pháo giấy và tiêu đề Breaking News (module ban đầu, hiện đã được thay thế bằng trải nghiệm Phong bì 3D). |

---

## 3. QUY TRÌNH LÀM VIỆC CHUẨN CỦA AGENT (SOP)

Khi Agent thực hiện bất kỳ task nào (sửa lỗi, thêm tính năng, thay đổi giao diện), Agent **BẮT BUỘC** tuân thủ 4 bước:

### Bước 1: Thu thập ngữ cảnh & Đọc quy tắc
- Kiểm tra các hằng số trong `src/constants/` trước khi thêm nội dung mới.
- Không tự ý xoá các animation hay logic tương tác hiện có trừ khi có yêu cầu cụ thể từ User.

### Bước 2: Viết mã theo Quy chuẩn Kỹ thuật
- **React 19 Pure Render & Hydration Safety**: Tuyệt đối **KHÔNG** gọi `Math.random()` hoặc hàm bất định trực tiếp trong thân hàm component hoặc khi sinh JSX trong giai đoạn SSR:
  - Với hiệu ứng cần số ngẫu nhiên chỉ trên Client (như particles nền): Sử dụng hook `useSyncExternalStore` để SSR render danh sách rỗng, chỉ render trên Client sau khi hydrate thành công (xem mẫu tại `StarParticles.tsx`).
  - Hoặc khởi tạo mảng cố định (static array, như `BARCODE_STRIPES` trong `EventTicket.tsx`).
  - Hoặc gọi trong event handlers / callback (`handleClick`, `handleDeclineHover`).
- **Framer Motion v14 Typed Variants**: Khi khai báo biến thể animation, **LUÔN** import `type { Variants } from "framer-motion"` và gán kiểu `const myVariants: Variants = { ... }`. Điều này triệt tiêu hoàn toàn lỗi TS2322 do TypeScript suy luận lỏng lẻo (`string` thay vì `Easing` / `AnimationGeneratorType`).
- **Next.js 16 Suspense Boundary**: Mọi component đọc `useSearchParams()` hoặc các hook client điều hướng **BẮT BUỘC** phải được bao bọc bởi `<Suspense fallback={<FallbackComponent />}>` ở tầng Page để không gây lỗi Static Generation trong `next build`.
- **Tailwind CSS v4 Standard**:
  - Khai báo token màu trong `@theme inline` tại `src/app/globals.css`.
  - Sử dụng các utility: `bg-linear-to-...` (chuẩn Tailwind v4), `backdrop-blur-...`, `shadow-...`, `rounded-...`.

### Bước 3: Kiểm định Chất lượng Code (Quality Gate)
Trước khi bàn giao kết quả cho User, Agent phải chạy 2 lệnh kiểm tra:
1. `npx eslint src/`: Phải kết thúc với exit code `0`, **0 errors, 0 warnings**.
2. `npm run build`: Phải hoàn thành biên dịch Turbopack và TypeScript thành công (exit code `0`).

### Bước 4: Báo cáo Kết quả
Báo cáo ngắn gọn, súc tích bằng tiếng Việt, tập trung vào:
- File nào đã được chỉnh sửa/tạo mới (kèm link `file:///...`).
- Các hành vi tương tác mới hoặc lỗi đã được giải quyết.
- Xác nhận trạng thái Quality Gate (`ESLint`, `Build`).

---

## 4. HƯỚNG DẪN MỞ RỘNG NHANH CHO AGENT

### A. Thêm khách mời VIP mới
Mở `src/constants/guests.ts`, thêm vào object `GUEST_MAP`:
```typescript
VIP09: {
  code: "VIP09",
  name: "Tên Khách Mời",
  role: "Danh hiệu lầy lội 🎭",
  customMessage: "Lời nhắn độc quyền gửi riêng cho người này...",
},
```
Người dùng chỉ cần truy cập: `https://ten-mien.com/?code=VIP09` để xem thiệp riêng.

### B. Cập nhật ảnh đại diện cử nhân (mặt thật)
1. Thêm ảnh chân dung vào thư mục `public/` (ví dụ: `public/quynh-nhien.png`).
2. Mở `src/constants/eventDetails.ts`, cập nhật:
```typescript
export const GRADUATE_AVATAR_IMAGE = "/quynh-nhien.png";
```
Avatar sẽ tự động render ảnh chân dung thật lồng vào khuôn mặt nhân vật hoạt hình tương tác.

### C. Thêm ảnh Polaroid mới
Mở `src/constants/eventDetails.ts`, thêm vào mảng `POLAROID_PHOTOS`:
```typescript
{
  src: "/photos/photo9.jpg",
  caption: "Chú thích hài hước mặt trước 📸",
  backCaption: "Lời thú tội hoặc bí mật hài hước mặt sau 🤫",
},
```

### D. Thêm câu thoại Avatar mới
Mở `src/constants/eventDetails.ts`, thêm câu thoại mới vào mảng `AVATAR_QUOTES`.

### E. Kích hoạt lại các Section mở rộng
Nếu cần hiển thị lại Timeline, Boarding Pass vé máy bay hoặc Mini-game, chỉ cần mở [page.tsx](file:///d:/Project/GraduationInvite/src/app/page.tsx) và bỏ comment các component tương ứng:
```tsx
{/* Hành trình "Sống sót" Kế toán 4 năm */}
<Timeline />

{/* Vé máy bay đến lễ tốt nghiệp (Boarding Pass & Google Maps) */}
<EventTicket />

{/* Mini-game Bắt lỗi sai Nợ - Có */}
<MiniGame />
```
