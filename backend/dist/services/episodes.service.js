"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Episodes = void 0;
// src/services/episodes.service.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function resolveDataPath() {
    if (process.env.EPISODES_DATA_PATH) {
        const p = path_1.default.resolve(process.env.EPISODES_DATA_PATH);
        return p;
    }
    const p1 = path_1.default.join(process.cwd(), "public", "static", "data", "podcasts.json");
    const p2 = path_1.default.join(process.cwd(), "public", "data", "podcasts.json");
    if (fs_1.default.existsSync(p1))
        return p1;
    if (fs_1.default.existsSync(p2))
        return p2;
    // افتراضي (هيفشل برسالة مفهومة لو مش موجود)
    return p1;
}
const DATA_PATH = resolveDataPath();
let cache = null;
function readEpisodes() {
    const stat = fs_1.default.statSync(DATA_PATH); // هتفشل برسالة واضحة لو الملف مش موجود
    if (cache && cache.mtimeMs === stat.mtimeMs)
        return cache.episodes;
    const raw = fs_1.default.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
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
function includesCI(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase());
}
/** Apply text search on id/title/description/authors. */
function applySearch(items, q) {
    if (!q)
        return items;
    return items.filter((e) => includesCI(e.id, q) ||
        includesCI(e.title, q) ||
        includesCI(e.description ?? "", q) ||
        e.authors.some((a) => includesCI(a, q)));
}
exports.Episodes = {
    /**
     * List with optional text search and simple pagination.
     * Returns normalized payload: { items, total, limit, offset }.
     */
    list(params) {
        const { limit, offset, q } = params;
        const all = readEpisodes();
        const filtered = applySearch(all, q);
        // Clamp pagination to safe ranges
        const safeOffset = Math.max(0, offset | 0);
        const safeLimit = Math.max(0, limit | 0);
        const sliced = safeLimit > 0 ? filtered.slice(safeOffset, safeOffset + safeLimit) : filtered.slice(safeOffset);
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
    latest(limit = 2) {
        const all = readEpisodes();
        const n = Math.max(1, Math.min(50, limit));
        return all.slice(0, n);
    },
    /**
     * Find episode by id (slug).
     */
    byId(id) {
        if (!id)
            return null;
        const all = readEpisodes();
        return all.find((e) => e.id === id) ?? null;
    },
};
