// stores/usePlayer.ts
"use client";
import { create } from "zustand";

export type Episode = {
  id: string; title: string; description: string;
  thumbnail: string; audioUrl: string;
  durationSeconds: number; publishedAt: string; authors: string[];
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
  repeat: boolean;   // repeat current track
  shuffle: boolean;  // random next/prev

  // wiring
  setAudio: (el: HTMLAudioElement) => void;

  // actions
  loadAndPlay: (ep: Episode) => void; 
  next: () => void;
  prev: () => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  seek: (sec: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;


  [_: string]: any;
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
     
      get().next();
    });

    el.addEventListener("error", () => console.error("Audio error:", el.error));
  },

 
  _ensureQueueLoadedAndSync(currentId?: string) {
    const { queue } = get() as any;
    if (queue && queue.length) {
      if (currentId) {
        const i = queue.findIndex((e: Episode) => e.id === currentId);
        set({ index: i >= 0 ? i : -1 });
      }
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URL || "";

    // مؤقتًا: اجعل الطابور يحوي الحالي لضمان عمل next/prev الآن
    if (currentId && get().current) set({ queue: [get().current!], index: 0 });

    fetch(`${base}/episodes`, { cache: "no-store" })
      .then(r => r.json())
      .then((data) => {
        const list: Episode[] = Array.isArray(data) ? data : (data?.items || []);
        if (!Array.isArray(list) || !list.length) return;
        set({ queue: list });
        if (currentId) {
          const i = list.findIndex(e => e.id === currentId);
          set({ index: i >= 0 ? i : -1 });
        }
      })
      .catch((err) => console.warn("Failed to prime queue:", err));
  },

  loadAndPlay: (ep: Episode) => {
    const a = get().audio;
    if (!a) return;

    set({ current: ep, isPlaying: false, progress: 0, duration: 0 });

    try { a.pause(); } catch {}

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    a.src = `${base}${ep.audioUrl}`;
    a.load();
    a.play().catch((err) => console.warn("play failed:", err));

   
    (get() as any)._ensureQueueLoadedAndSync(ep.id);
  },

  next: () => {
    const { queue, index, shuffle } = get();
    if (!queue.length) return;

    let nextIndex = index;
    if (shuffle) {
      if (queue.length === 1) nextIndex = 0;
      else {
        let r = Math.floor(Math.random() * queue.length);
        if (r === index) r = (r + 1) % queue.length;
        nextIndex = r;
      }
    } else {
      nextIndex = (index + 1) % queue.length;
    }

    set({ index: nextIndex });
    get().loadAndPlay(queue[nextIndex]);
  },

  prev: () => {
    const { queue, index, shuffle } = get();
    if (!queue.length) return;

    let prevIndex = index;
    if (shuffle) {
      if (queue.length === 1) prevIndex = 0;
      else {
        let r = Math.floor(Math.random() * queue.length);
        if (r === index) r = (r + queue.length - 1) % queue.length;
        prevIndex = r;
      }
    } else {
      prevIndex = (index - 1 + queue.length) % queue.length;
    }

    set({ index: prevIndex });
    get().loadAndPlay(queue[prevIndex]);
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
