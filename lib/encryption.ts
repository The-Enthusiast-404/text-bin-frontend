// File: lib/encryption.ts
import { TextData } from "@/types";

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function generateKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

export async function encryptText(
  text: string,
  key: CryptoKey,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const iv = generateIV();

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data,
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const resultArray = new Uint8Array(iv.length + encryptedArray.length);
  resultArray.set(iv);
  resultArray.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode.apply(null, Array.from(resultArray)));
}

export async function decryptText(
  encryptedText: string,
  key: CryptoKey,
): Promise<string> {
  const encryptedData = new Uint8Array(
    atob(encryptedText)
      .split("")
      .map((char) => char.charCodeAt(0)),
  );
  const iv = encryptedData.slice(0, IV_LENGTH);
  const data = encryptedData.slice(IV_LENGTH);

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}
