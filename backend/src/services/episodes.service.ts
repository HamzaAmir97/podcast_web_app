
import data from "../data/episodes.json";

// INFO: Public type shared across controllers and frontend (via API responses).

export type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audioUrl: string;        // INFO: Always points to /stream/:id
  durationSeconds: number; // INFO: Used by UI for time display/progress
  publishedAt: string;     // INFO: ISO date used to sort "latest"
  authors: string[];
};



// INFO: Load episodes once at startup (in-memory). Read-only for this task.


const episodes: Episode[] = data as Episode[];

export const Episodes = {

  // INFO: List episodes with optional text query and simple pagination.

  list({ limit, offset, q = "" }: { limit: number; offset: number; q?: string }) {

    // INFO: Lowercase query for a basic "contains" match.

    const qx = q.toLowerCase().trim();


    // INFO: Search in title + description + authors.

    const filtered = qx
      ? episodes.filter(e =>
          [e.title, e.description, ...e.authors].join(" ").toLowerCase().includes(qx)
        )
      : episodes;


    // INFO: Slice for pagination and return a normalized shape.

    const items = filtered.slice(offset, offset + limit);
    return { items, total: filtered.length, limit, offset };
  },


  // INFO: Return the N most recent episodes by publishedAt (desc).


  
  latest(limit: number) {
    const sorted = [...episodes].sort(
      (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
    );
    return { items: sorted.slice(0, limit) };
  },


  // INFO: Find one episode by id (slug). Returns undefined if not found.
  
  byId(id: string) {
    return episodes.find(e => e.id === id);
  },
};
