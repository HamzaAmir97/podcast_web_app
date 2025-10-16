import { BASE_URL } from "@/lib/apiPaths";

export function resolveMediaUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;     
  return `${BASE_URL}${url}`;                   
}