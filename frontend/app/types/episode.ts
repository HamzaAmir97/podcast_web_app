// types/episode.ts
export type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audioUrl: string;        // مثال: /stream/:id
  durationSeconds: number;
  publishedAt: string;
  authors: string[];
};
