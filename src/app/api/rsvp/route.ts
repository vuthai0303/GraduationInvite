import { GOOGLE_SHEET_SCRIPT_URL } from "@/constants/eventDetails";
import { NextResponse } from "next/server";

export interface RSVPRequestBody {
  code?: string;
  name?: string;
  attending?: boolean | null;
  message?: string;
}

/**
 * API Route Handler: /api/rsvp
 * Nhận thông tin xác nhận tham dự và lời chúc từ website,
 * sau đó chuyển tiếp (forward) an toàn lên Google Apps Script Web App để ghi vào Google Sheet.
 */
export async function POST(request: Request) {
  try {
    const body: RSVPRequestBody = await request.json();

    const response = await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: body.code || "Vãng lai",
        name: body.name || "Ẩn danh",
        attending: body.attending !== undefined ? body.attending : null,
        message: body.message || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script trả về mã lỗi HTTP ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi khi ghi dữ liệu vào Google Sheet:", error);
    return NextResponse.json(
      {
        result: "error",
        message:
          error instanceof Error
            ? error.message
            : "Không thể kết nối đến Google Sheet",
      },
      { status: 500 }
    );
  }
}

