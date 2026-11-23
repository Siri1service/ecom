import { NextRequest, NextResponse } from "next/server";
import { validateMediaBuffer } from "@/lib/media/uploader";
import { uploadToGoogleDrive, setCachedMedia } from "@/lib/media/google-drive";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const productId = (formData.get("productId") as string) || "PROD-DEFAULT";
    const productSlug = (formData.get("productSlug") as string) || "product-item";
    const durationSeconds = formData.get("durationSeconds")
      ? parseInt(formData.get("durationSeconds") as string, 10)
      : undefined;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่ต้องการอัปโหลด" }, { status: 400 });
    }

    const mimeType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate size and mime on server
    const validation = validateMediaBuffer(buffer, mimeType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Video duration validation on server
    if (mimeType.startsWith("video/") && durationSeconds && durationSeconds > 30) {
      return NextResponse.json(
        { error: `วิดีโอต้องมีความยาวไม่เกิน 30 วินาที (ระบุ ${durationSeconds} วิ)` },
        { status: 400 }
      );
    }

    // Upload to Google Drive structure
    const uploadResult = await uploadToGoogleDrive({
      fileName: file.name,
      mimeType,
      productId,
      productSlug,
      buffer,
      durationSeconds,
    });

    // Store in cache for fast immediate delivery
    setCachedMedia(uploadResult.fileId, buffer, mimeType);

    return NextResponse.json({
      success: true,
      fileId: uploadResult.fileId,
      proxyUrl: uploadResult.proxyUrl,
      folderPath: uploadResult.folderPath,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการประมวลผลไฟล์" }, { status: 500 });
  }
}
