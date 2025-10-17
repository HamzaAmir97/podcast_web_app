// stores/usePlayer.ts
"use client";
import { create } from "zustand";
import { API_PATHS } from "@/lib/apiPaths";

export type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audioUrl: string;           // مثال: /stream/:id أو /static/audio/:id.mp3
  durationSeconds: number;
  publishedAt: string;
  authors: string[];
};

type PlayerState = {
  audio: HTMLAudioElement | null;
  current?: Episode;
  isPlaying: boolean;
  progress: number;
  duration: number;

  // playlist
  queue: Episode[];
  index: number;

  // flags
  repeat: boolean;
  shuffle: boolean;

  // wiring
  setAudio: (el: HTMLAudioElement) => void;
  setQueue: (list: Episode[], startIndex?: number) => void;

  // actions
  loadAndPlay: (ep: Episode) => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  seek: (sec: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;

  // helpers
  primeQueueIfNeeded: (currentId?: string) => Promise<void>;
};

export const usePlayer = create<PlayerState>((set, get) => ({
  audio: null,
  current: undefined,
  isPlaying: false,
  progress: 0,
  duration: 0,

  queue: [],
  index: -1,

  repeat: false,
  shuffle: false,

  setAudio: (el: HTMLAudioElement) => {
    set({ audio: el });

    // إلغاء أي لستَنرز قديمة لتفادي التكرار
    el.onplay = null;
    el.onpause = null;
    el.onended = null;
    el.ontimeupdate = null;
    el.onloadedmetadata = null;
    el.onerror = null;

    el.addEventListener("timeupdate", () =>
      set({
        progress: Math.floor(el.currentTime),
        duration: Math.floor(el.duration || 0),
      })
    );

    el.addEventListener("loadedmetadata", () =>
      set({ duration: Math.floor(el.duration || 0) })
    );

    el.addEventListener("play",  () => set({ isPlaying: true  }));
    el.addEventListener("pause", () => set({ isPlaying: false }));

    el.addEventListener("ended", () => {
      const { repeat } = get();
      if (repeat) {
        const a = get().audio;
        if (a) {
          a.currentTime = 0;
          a.play().catch(() => {});
        }
        return;
      }
      // استدعاء آمن (async)
      get().next().catch(() => {});
    });

    el.addEventListener("error", () => console.error("Audio error:", el.error));
  },

  setQueue: (list, startIndex = 0) => {
    if (!Array.isArray(list) || !list.length) return;
    const idx = Math.max(0, Math.min(startIndex, list.length - 1));
    set({ queue: list, index: idx });
  },

  primeQueueIfNeeded: async (currentId?: string) => {
    const { queue, current } = get();

    // لو عندنا قائمة معتبرة (>1) اعتبرها جاهزة
    if (queue.length > 1) {
      if (currentId) {
        const i = queue.findIndex((e) => e.id === currentId);
        if (i >= 0) set({ index: i });
      }
      return;
    }

    // إن كانت فاضية تماماً لكن في current، خليها مبدئياً حلقة واحدة
    if (current && queue.length === 0) {
      set({ queue: [current], index: 0 });
    }

    try {
      const res = await fetch(API_PATHS.EPISODES.GET_ALL, { cache: "no-store" });
      const data = await res.json();
      const list: Episode[] = Array.isArray(data) ? data : (data?.items || []);
      if (list?.length) {
        let idx = 0;
        const nowId = currentId || get().current?.id;
        if (nowId) {
          const i = list.findIndex((e) => e.id === nowId);
          idx = i >= 0 ? i : 0;
        }
        set({ queue: list, index: idx });
      }
    } catch (err) {
      console.warn("primeQueueIfNeeded failed:", err);
    }
  },

  loadAndPlay: (ep: Episode) => {
    const a = get().audio;
    if (!a) return;

    set({ current: ep, isPlaying: false, progress: 0, duration: 0 });

    try { a.pause(); } catch {}

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    // لو audioUrl مطلق (http/https) استخدمه كما هو، غير ذلك ألصق الـbase
    const src = /^https?:\/\//i.test(ep.audioUrl) ? ep.audioUrl : `${base}${ep.audioUrl}`;

    a.src = src;
    a.load();
    a.play().catch((err) => console.warn("play failed:", err));

    // 👇 مهم: لو فيه queue جاهزة، اضبط الفهرس على هذه الحلقة
    const q = get().queue;
    if (q.length) {
      const i = q.findIndex((x) => x.id === ep.id);
      if (i >= 0) set({ index: i });
    }

    // حضّر القائمة كـ fallback إن كانت ضعيفة/فاضية
    get().primeQueueIfNeeded(ep.id).catch(() => {});
  },

  next: async () => {
    // لو القائمة فاضية أو عنصر واحد، حضّرها أولاً
    if (get().queue.length <= 1) {
      await get().primeQueueIfNeeded(get().current?.id);
    }

    const q = get().queue;
    if (!q.length) return;

    const { shuffle } = get();
    let nextIndex = get().index;

    if (shuffle) {
      if (q.length === 1) {
        nextIndex = 0;
      } else {
        let r = Math.floor(Math.random() * q.length);
        if (r === get().index) r = (r + 1) % q.length;
        nextIndex = r;
      }
    } else {
      nextIndex = (get().index + 1) % q.length;
    }

    set({ index: nextIndex });
    get().loadAndPlay(q[nextIndex]);
  },

  prev: async () => {
    // لو القائمة فاضية أو عنصر واحد، حضّرها أولاً
    if (get().queue.length <= 1) {
      await get().primeQueueIfNeeded(get().current?.id);
    }

    const q = get().queue;
    if (!q.length) return;

    const { shuffle } = get();
    let prevIndex = get().index;

    if (shuffle) {
      if (q.length === 1) {
        prevIndex = 0;
      } else {
        let r = Math.floor(Math.random() * q.length);
        if (r === get().index) r = (r + q.length - 1) % q.length;
        prevIndex = r;
      }
    } else {
      prevIndex = (get().index - 1 + q.length) % q.length;
    }

    set({ index: prevIndex });
    get().loadAndPlay(q[prevIndex]);
  },

  play:  () => get().audio?.play(),
  pause: () => get().audio?.pause(),
  toggle: () => (get().isPlaying ? get().pause() : get().play()),

  seek: (sec: number) => {
    const a = get().audio;
    if (!a) return;
    const clamped = Math.max(0, Math.min(sec, a.duration || sec));
    a.currentTime = clamped;
    set({ progress: Math.floor(clamped) });
  },

  toggleRepeat: () =>
    set((s) => {
      const nextRepeat = !s.repeat;
      return { repeat: nextRepeat, shuffle: nextRepeat ? false : s.shuffle };
    }),

  toggleShuffle: () =>
    set((s) => {
      const nextShuffle = !s.shuffle;
      return { shuffle: nextShuffle, repeat: nextShuffle ? false : s.repeat };
    }),
}));
