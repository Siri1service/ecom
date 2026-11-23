// Client-side and server-side media validators & WebP converter

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  file?: File | Blob;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Converts an image file to WebP format in the browser via HTML5 Canvas
 */
export async function convertToWebP(
  file: File,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Browser environment required for canvas conversion"));
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Failed to get canvas 2d context"));
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("WebP conversion failed"));
          }
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image for conversion"));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates video duration (maximum 30 seconds) on the client side
 */
export async function validateVideoDuration(
  file: File,
  maxDurationSeconds: number = 30
): Promise<MediaValidationResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve({ valid: false, error: "Window not available" });
    }

    if (!file.type.startsWith("video/")) {
      return resolve({ valid: false, error: "ไฟล์ที่เลือกไม่ใช่วิดีโอ" });
    }

    if (file.size > 25 * 1024 * 1024) {
      return resolve({
        valid: false,
        error: "ขนาดไฟล์วิดีโอต้องไม่เกิน 25 MB",
      });
    }

    const video = document.createElement("video");
    video.preload = "metadata";

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = Math.round(video.duration);
      if (duration > maxDurationSeconds) {
        resolve({
          valid: false,
          error: `วิดีโอมีความยาว ${duration} วินาที (ต้องไม่เกิน ${maxDurationSeconds} วินาที)`,
          duration,
        });
      } else {
        resolve({
          valid: true,
          duration,
          width: video.videoWidth,
          height: video.videoHeight,
          file,
        });
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, error: "ไม่สามารถอ่านข้อมูลวิดีโอได้ กรุณาลองใหม่อีกครั้ง" });
    };
  });
}

/**
 * Server-side media inspection & validation
 */
export function validateMediaBuffer(
  buffer: Buffer,
  mimeType: string,
  maxSizeBytes: number = 25 * 1024 * 1024
): { valid: boolean; error?: string } {
  if (buffer.length > maxSizeBytes) {
    return { valid: false, error: "ขนาดไฟล์เกินขีดจำกัดที่เซิร์ฟเวอร์กำหนด" };
  }

  const allowedImageMimes = ["image/webp", "image/jpeg", "image/png"];
  const allowedVideoMimes = ["video/mp4", "video/webm"];

  if (![...allowedImageMimes, ...allowedVideoMimes].includes(mimeType)) {
    return { valid: false, error: `ประเภทไฟล์ ${mimeType} ไม่ได้รับอนุญาตในระบบ` };
  }

  return { valid: true };
}
