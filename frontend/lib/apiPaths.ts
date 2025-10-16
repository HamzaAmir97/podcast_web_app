// utils/apiPaths.ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const DATA_SOURCE = (process.env.NEXT_PUBLIC_DATA_SOURCE || "static") as
  | "api"
  | "static";

/** Static files are served by Express at `${BASE_URL}/static/*` */
const STATIC_BASE = {
  DATA_LIST: `${BASE_URL}/static/data/podcasts.json`,
  DATA_BY_ID: (id: string) => `${BASE_URL}/static/data/episodes/${id}.json`,
  AUDIO: (id: string) => `${BASE_URL}/static/audio/${id}.mp3`,
  IMAGE: (id: string, ext: "jpg" | "png" = "jpg") =>
    `${BASE_URL}/static/images/${id}.${ext}`,
};

const API_BASE = {
  EPISODES: {
    GET_ALL: `${BASE_URL}/episodes`,
    GET_LATEST: (limit?: number) =>
      `${BASE_URL}/episodes/latest${limit ? `?limit=${limit}` : ""}`,
    GET_BY_ID: (id: string) => `${BASE_URL}/episodes/${id}`,
    GET_BY_PODCAST_ID: (podcastId: string) =>
      `${BASE_URL}/episodes?podcastId=${encodeURIComponent(podcastId)}`,
  },
  STREAM: (id: string) => `${BASE_URL}/stream/${id}`,
  HEALTH: `${BASE_URL}/health`,
};

export const API_PATHS = {
  EPISODES: {
    GET_ALL: DATA_SOURCE === "api" ? API_BASE.EPISODES.GET_ALL : STATIC_BASE.DATA_LIST,
    GET_BY_ID: (id: string) =>
      DATA_SOURCE === "api" ? API_BASE.EPISODES.GET_BY_ID(id) : STATIC_BASE.DATA_BY_ID(id),
    GET_BY_PODCAST_ID: (podcastId: string) =>
      DATA_SOURCE === "api" ? API_BASE.EPISODES.GET_BY_PODCAST_ID(podcastId) : STATIC_BASE.DATA_LIST,
    GET_LATEST: (limit?: number) =>
      DATA_SOURCE === "api" ? API_BASE.EPISODES.GET_LATEST(limit) : STATIC_BASE.DATA_LIST,
  },
} as const;

export const getAudioSrc = (id: string) =>
  DATA_SOURCE === "api" ? API_BASE.STREAM(id) : STATIC_BASE.AUDIO(id);

export const getImageSrc = (id: string, ext?: "jpg" | "png") =>
  STATIC_BASE.IMAGE(id, ext || "jpg");
