// src/services/episodes.service.ts
import fs from "fs";
import path from "path";
import type { Episode, ListParams, ListResponse } from "../types/episode";

function resolveDataPath() {
  if (process.env.EPISODES_DATA_PATH) {
    const p = path.resolve(process.env.EPISODES_DATA_PATH);
    return p;
  }
  const p1 = path.join(process.cwd(), "public", "static", "data", "podcasts.json");
  const p2 = path.join(process.cwd(), "public", "data", "podcasts.json");
  if (fs.existsSync(p1)) return p1;
  if (fs.existsSync(p2)) return p2;
  // افتراضي (هيفشل برسالة مفهومة لو مش موجود)
  return p1;
}

const DATA_PATH = resolveDataPath();

let cache: { episodes: Episode[]; mtimeMs: number } | null = null;

function readEpisodes(): Episode[] {
  const stat = fs.statSync(DATA_PATH); // هتفشل برسالة واضحة لو الملف مش موجود
  if (cache && cache.mtimeMs === stat.mtimeMs) return cache.episodes;

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Episode[];

  const episodes = parsed
    .map((e) => ({
      ...e,
      description: e.description ?? "",
      durationSeconds: Number(e.durationSeconds ?? 0),
      authors: Array.isArray(e.authors) ? e.authors : [],
    }))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  cache = { episodes, mtimeMs: stat.mtimeMs };
  return episodes;
}




/** Case-insensitive contains check for search. */
function includesCI(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/** Apply text search on id/title/description/authors. */
function applySearch(items: Episode[], q?: string): Episode[] {
  if (!q) return items;
  return items.filter(
    (e) =>
      includesCI(e.id, q) ||
      includesCI(e.title, q) ||
      includesCI(e.description ?? "", q) ||
      e.authors.some((a) => includesCI(a, q))
  );
}

export const Episodes = {
  /**
   * List with optional text search and simple pagination.
   * Returns normalized payload: { items, total, limit, offset }.
   */
  list(params: ListParams): ListResponse {
    const { limit, offset, q } = params;

    const all = readEpisodes();
    const filtered = applySearch(all, q);

    // Clamp pagination to safe ranges
    const safeOffset = Math.max(0, offset | 0);
    const safeLimit = Math.max(0, limit | 0);
    const sliced =
      safeLimit > 0 ? filtered.slice(safeOffset, safeOffset + safeLimit) : filtered.slice(safeOffset);

    return {
      items: sliced,
      total: filtered.length,
      limit: safeLimit,
      offset: safeOffset,
    };
  },

  /**
   * Return N most recent episodes (default 2).
   * Always sorted by publishedAt desc.
   */
  latest(limit = 2): Episode[] {
    const all = readEpisodes();
    const n = Math.max(1, Math.min(50, limit));
    return all.slice(0, n);
  },

  /**
   * Find episode by id (slug).
   */
  byId(id: string): Episode | null {
    if (!id) return null;
    const all = readEpisodes();
    return all.find((e) => e.id === id) ?? null;
  },
};
