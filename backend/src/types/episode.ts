// src/types/episode.ts
export type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;        // e.g. /static/images/a-vida-e-boa.jpg
  audioUrl: string;         // e.g. /stream/a-vida-e-boa  (or /static/audio/..)
  durationSeconds: number;
  publishedAt: string;      // ISO string
  authors: string[];        // e.g. ["Tiago", "Diego"]
};

export type ListParams = {
  limit: number;
  offset: number;
  q?: string;
};

export type ListResponse = {
  items: Episode[];
  total: number;
  limit: number;
  offset: number;
};
