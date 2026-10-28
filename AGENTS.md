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
┌───────────────────────────────────────────────┐
│ Giai đoạn 1: Phong bì niêm phong (Sealed)    │
│ - StarParticles lơ lửng nền                   │
│ - Phong bì 3D đóng kín                        │
│ - WaxSeal đỏ đập phập phồng (pulse)           │
│ - Hover WaxSeal: wobble rung lắc + tooltip    │
└───────────────────────┬───────────────────────┘
                        │ Click WaxSeal
                        ▼
┌───────────────────────────────────────────────┐
│ Giai đoạn 2: Kích hoạt mở thư (Opening)       │
│ - Canvas Confetti nổ pháo giấy kim tuyến      │
│ - WaxSeal xoay 720° thu nhỏ biến mất          │
│ - Nắp phong bì gập ngược 3D rotateX(-180deg)  │
│ - Lá thư trồi lên từ khe bao thư              │
└───────────────────────┬───────────────────────┘
                        │ Sau 1.4 giây
                        ▼
┌───────────────────────────────────────────────┐
│ Giai đoạn 3: Tấm thiệp mở ra (Opened)         │
│ - InvitationCard hiển thị trung tâm           │
│ - Lời chào & Huy hiệu VIP theo `code`         │
│ - GraduationAvatar đa lớp tương tác           │
│ - Countdown thời gian thực tới 14/11/2026     │
│ - Nút Google Maps & Thêm vào Lịch (.ics)      │
│ - Thư viện ảnh Polaroid lật thẻ 3D (2 mặt)   │
│ - Nút Pháo hoa vô tận & Nút Copy Link         │
│ - Nút "Xem lại phong bì 3D" để reseal         │
│ - Cuộn xuống xem Timeline, Ticket, Game, RSVP │
└───────────────────────────────────────────────┘
```

---

### B. Cấu trúc Thư mục và Trách nhiệm Thành phần

| Thư mục / File | Trách nhiệm & Nội dung |
|---|---|
| `src/constants/guests.ts` | Từ điển khách mời `GUEST_MAP` (`VIP01` -> `VIP08`, `DEFAULT`). Hàm `getGuestByCode()` tự chuẩn hoá chuỗi, bỏ prefix `code:` và fallback an toàn. |
| `src/constants/eventDetails.ts` | Thông tin cử nhân, thời gian (`14/11/2026 15:30`), địa điểm, link Google Maps, danh sách câu thoại Avatar và 8 thẻ Polaroid kỷ niệm 2 mặt. |
| `src/components/Envelope/Envelope.tsx` | Bao thư 3D quản lý state machine (`sealed` -> `opening` -> `opened`), xử lý hiệu ứng lật nắp `rotateX(-180deg)`, perspective `1200px`. |
| `src/components/Envelope/WaxSeal.tsx` | Con dấu sáp đỏ dập nổi 3D, icon nón cử nhân vàng gold, hiệu ứng pulse/wobble, click nổ xoay 720° biến mất. |
| `src/components/Envelope/StarParticles.tsx` | 25 hạt bụi sao pastel và vàng lơ lửng, phát sáng mờ ảo quanh màn hình (pure render với `useMemo`). |
| `src/components/Invitation/InvitationCard.tsx` | Khung thiệp chính tích hợp Avatar, Header cá nhân hoá, Countdown, Polaroid, nút Lịch `.ics`, nút bắn pháo hoa, nút copy link thiệp. |
| `src/components/Invitation/GraduationAvatar.tsx` | Nhân vật cử nhân tương tác: Gown + Mortarboard có tua rua lắc lư, mặt gật gù, kính râm Thug Life trượt xuống + sparkle ✨, bong bóng thoại ngẫu nhiên, xoay 360°/wiggle khi click. |
| `src/components/Invitation/Countdown.tsx` | Đồng hồ đếm ngược 4 ô (Ngày, Giờ, Phút, Giây) chạy theo thời gian thực với animation đổi số mượt. |
| `src/components/Invitation/PolaroidGallery.tsx` | Lưới thẻ ảnh polaroid góc nghiêng so le dán washi tape, click xoay lật 3D 180° xem lời bình mặt sau. |
| `src/components/Timeline.tsx` | Timeline hành trình 4 năm sinh tồn Kế toán từ năm 1 đến năm 4. |
| `src/components/EventTicket.tsx` | Vé máy bay Graduation Airlines kèm mã vạch giả lập và bản đồ nhúng Google Maps iframe. |
| `src/components/MiniGame.tsx` | Mini-game kiểm tra kiến thức định khoản Nợ - Có đúng/sai + câu châm ngôn hài hước. |
| `src/components/RSVPSection.tsx` | Form gửi lời chúc + Nút xác nhận lầy lội (nút từ chối chạy trốn khi hover trên desktop, đổi text trên mobile + popup Momo). |
| `src/components/Footer.tsx` | Chân trang cảm ơn và đồng hồ đếm ngược. |
| `src/app/page.tsx` | Entry point: Bọc component con trong `<Suspense fallback={...}>` để đọc `useSearchParams()`, điều phối chuyển cảnh giữa Envelope và InvitationCard. |

---

## 3. QUY TRÌNH LÀM VIỆC CHUẨN CỦA AGENT (SOP)

Khi Agent thực hiện bất kỳ task nào (sửa lỗi, thêm tính năng, thay đổi giao diện), Agent **BẮT BUỘC** tuân thủ 4 bước:

### Bước 1: Thu thập ngữ cảnh & Đọc quy tắc
- Kiểm tra các hằng số trong `src/constants/` trước khi thêm nội dung mới.
- Không tự ý xoá các animation hay logic tương tác hiện có trừ khi có yêu cầu cụ thể từ User.

### Bước 2: Viết mã theo Quy chuẩn Kỹ thuật
- **React 19 Pure Render**: Tuyệt đối **KHÔNG** gọi `Math.random()` hoặc hàm bất định trực tiếp trong thân hàm component hoặc khi sinh JSX. Nếu cần số ngẫu nhiên:
  - Khởi tạo trong `useMemo(() => ..., [])`.
  - Hoặc khởi tạo trong `useState(() => ...)`.
  - Hoặc dùng danh sách tĩnh (static array).
  - Hoặc gọi trong callback (event handler) / `useEffect`.
- **Framer Motion v14 Typed Variants**: Khi khai báo biến thể animation, **LUÔN** import `type { Variants } from "framer-motion"` và gán kiểu `const myVariants: Variants = { ... }`. Điều này triệt tiêu hoàn toàn lỗi TS2322 do TypeScript suy luận lỏng lẻo (`string` thay vì `Easing` / `AnimationGeneratorType`).
- **Next.js 16 Suspense Boundary**: Mọi component đọc `useSearchParams()` hoặc các hook client điều hướng **BẮT BUỘC** phải được bao bọc bởi `<Suspense fallback={<FallbackComponent />}>` ở tầng Page để không gây lỗi Static Generation trong `next build`.
- **Tailwind CSS v4 Standard**:
  - Khai báo token màu trong `@theme inline` tại `src/app/globals.css`.
  - Sử dụng các utility: `bg-gradient-to-...`, `backdrop-blur-...`, `shadow-...`, `rounded-...`.

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

### B. Thêm ảnh Polaroid mới
Mở `src/constants/eventDetails.ts`, thêm vào mảng `POLAROID_PHOTOS`:
```typescript
{
  src: "/photos/photo9.jpg",
  caption: "Chú thích hài hước mặt trước 📸",
  backCaption: "Lời thú tội hoặc bí mật hài hước mặt sau 🤫",
},
```

### C. Thêm câu thoại Avatar mới
Mở `src/constants/eventDetails.ts`, thêm câu thoại mới vào mảng `AVATAR_QUOTES`.
