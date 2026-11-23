import { NextRequest, NextResponse } from "next/server";
import { getCachedMedia } from "@/lib/media/google-drive";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await context.params;

  // Retrieve cached media buffer or stream from Google Drive
  const cached = getCachedMedia(fileId);

  if (cached) {
    return new NextResponse(new Uint8Array(cached.buffer), {
      status: 200,
      headers: {
        "Content-Type": cached.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Fallback placeholder image if not found in memory
  const svgPlaceholder = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1e293b"/>
      <text x="50%" y="50%" fill="#94a3b8" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">
        Media ID: ${fileId}
      </text>
    </svg>
  `;

  return new NextResponse(svgPlaceholder, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
