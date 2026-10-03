import { useEffect, useState } from "react";

/** Uploaded images live in IndexedDB (localStorage is too small for them). */

const DB = "taj_cms_media";
const STORE = "files";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = run(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const putFile = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id));
export const getFile = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id) as IDBRequest<Blob | undefined>);
export const deleteFile = (id: string) => tx("readwrite", (s) => s.delete(id));

const urls = new Map<string, string>();

/** A usable URL for a media source: site paths as they are, "idb:<id>" from IndexedDB. */
export async function resolveSrc(src: string): Promise<string | undefined> {
  if (!src.startsWith("idb:")) return src;
  const id = src.slice(4);
  if (urls.has(id)) return urls.get(id);
  try {
    const blob = await getFile(id);
    if (!blob) return undefined;
    const url = URL.createObjectURL(blob);
    urls.set(id, url);
    return url;
  } catch {
    return undefined;
  }
}

export function useMediaSrc(src?: string) {
  const [url, setUrl] = useState<string | undefined>(src && !src.startsWith("idb:") ? src : undefined);
  useEffect(() => {
    let live = true;
    if (!src) setUrl(undefined);
    else resolveSrc(src).then((u) => live && setUrl(u));
    return () => {
      live = false;
    };
  }, [src]);
  return url;
}

/** Shrinks an image to `maxWidth` and re-encodes it as WebP (what the image plugin does on upload). */
export async function compressImage(file: Blob, maxWidth = 1600, quality = 0.8): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/webp", quality));
  return { blob, width, height };
}
