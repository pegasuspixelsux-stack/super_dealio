import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.8;

/** Downscales an image on-device and re-encodes it as WebP before upload. */
export async function compressToWebP(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image conversion failed."))),
      "image/webp",
      WEBP_QUALITY,
    ),
  );
}

export async function uploadCarImage(carId: string, file: File) {
  const blob = await compressToWebP(file);
  const path = `cars/${carId}/${crypto.randomUUID()}.webp`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: "image/webp" });
  return { url: await getDownloadURL(storageRef), path };
}
