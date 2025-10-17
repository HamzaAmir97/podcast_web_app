// frontend/utils/media.ts
const ORIGIN = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export function resolveMediaUrl(input: string): string {
  if (!input) return "/static/images/placeholder.png";


  if (/^https?:\/\//i.test(input)) {
    try {
      const u = new URL(input);
      if (ORIGIN && u.origin === new URL(ORIGIN).origin) {
        return u.pathname + u.search; 
      }
    } catch {}
    return input; 
  }

  if (input.startsWith("/static/")) return input;


  return `/static/images/${/\.[a-z0-9]+$/i.test(input) ? input : `${input}.jpg`}`;
}
