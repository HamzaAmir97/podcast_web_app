// frontend/utils/media.ts
const ORIGIN = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/,"");

export function resolveMediaUrl(input: string): string {
  if (!input) return "/static/images/placeholder.png";

  // URL مطلق؟
  if (/^https?:\/\//i.test(input)) {
    try {
      const u = new URL(input);
      if (ORIGIN && u.origin === new URL(ORIGIN).origin) {
        // حوّل لمسار نسبي ليستفيد من rewrite
        return u.pathname + u.search;        // مثال: "/static/images/a-vida-e-incrivel.jpg"
      }
    } catch { /* ignore */ }
    return input; // دومين خارجي (لو عندك)
  }

  // جاهز أصلاً
  if (input.startsWith("/static/")) return input;

  // اسم بدون مسار؟ ابنِه تحت /static/images
  return `/static/images/${/\.[a-z0-9]+$/i.test(input) ? input : `${input}.png`}`;
}
