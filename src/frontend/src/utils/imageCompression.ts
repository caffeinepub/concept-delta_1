/**
 * Compresses an image file if it exceeds the size threshold
 * @param file - The image file to compress
 * @param maxSizeKB - Maximum size in KB before compression (default: 1024KB = 1MB)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Compressed image as Uint8Array
 */
export async function compressImage(
  file: File,
  maxSizeKB: number = 1024,
  quality: number = 0.8
): Promise<Uint8Array<ArrayBuffer>> {
  const fileSizeKB = file.size / 1024;

  // If file is already small enough, just convert to Uint8Array
  if (fileSizeKB <= maxSizeKB) {
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
  }

  // Compress the image using canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions (max 1920px width/height while maintaining aspect ratio)
      const maxDimension = 1920;
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const arrayBuffer = await blob.arrayBuffer();
          resolve(new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}
