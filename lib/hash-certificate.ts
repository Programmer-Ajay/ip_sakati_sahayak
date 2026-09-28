export interface CertificateData {
  hash: string;
  timestamp: string;
  isoDate: string;
  textLength: number;
}

/**
 * Computes a SHA-256 hash of the given text using the Web Crypto API (client-side only).
 * The plaintext is NEVER sent to any server.
 */
export async function hashFormulation(text: string): Promise<CertificateData> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }) + " IST";

  return {
    hash: hashHex,
    timestamp,
    isoDate: now.toISOString(),
    textLength: text.length,
  };
}
