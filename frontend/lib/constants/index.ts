// types.ts
export type PodcastItem = {
  id: string;
  title: string;           // اسم الحلقة
  cover: string;           // مسار صورة الغلاف
  members: string[];       // أسماء المشاركين
  dateISO: string;         // تاريخ بصيغة ISO لفرز أسهل
  dateLabel: string;       // النص الظاهر في الجدول (مثل 8 Jan 21)
  duration: string;        // المدة الظاهرة (hh:mm:ss أو mm:ss)
  durationSeconds: number; // المدة بالثواني (مفيد للتايمر)
  audioUrl?: string;       // اختياري
};


export const PODCASTS: PodcastItem[] = [
  {
    id: "a-vida-e-boa",
    title: "A vida é boa",
    cover: "/images/table (1).png",
    members: ["Tiago", "Diego", "Pellizzetti"],
    dateISO: "2021-01-08",
    dateLabel: "8 Jan 21",
    duration: "1:35:18",
    durationSeconds: 1 * 3600 + 35 * 60 + 18,
    audioUrl: "/audio/a-vida-e-boa.mp3",
  },
  {
    id: "como-programar-like-a-god",
    title: "Como programar like a god",
    cover: "/images/table (2).png",
    members: ["Maria", "Tiago", "Samuel"],
    dateISO: "2021-01-07",
    dateLabel: "7 Jan 21",
    duration: "35:40",
    durationSeconds: 35 * 60 + 40,
    audioUrl: "/audio/como-programar-like-a-god.mp3",
  },
  {
    id: "bora-viver",
    title: "Bora viver!",
    cover: "/images/table (3).png",
    members: ["Diego", "Richard"],
    dateISO: "2021-02-12",
    dateLabel: "12 Fev 21",
    duration: "54:27",
    durationSeconds: 54 * 60 + 27,
    audioUrl: "/audio/bora-viver.mp3",
  },
  {
    id: "nao-desista-de-voce",
    title: "Não desista de você",
    cover: "/images/table (4).png",
    members: ["Pelpas", "Pulili", "Pepe", "Pupa"],
    dateISO: "2021-03-24",
    dateLabel: "24 Mar 21",
    duration: "1:27:11",
    durationSeconds: 1 * 3600 + 27 * 60 + 11,
    audioUrl: "/audio/nao-desista-de-voce.mp3",
  },
  {
    id: "a-vida-e-incrivel",
    title: "A vida é incrível",
    cover: "/images/table (5).png",
    members: ["B1", "B2", "descendo as escadas"],
    dateISO: "2021-03-25",
    dateLabel: "25 Mar 21",
    duration: "1:35:18",
    durationSeconds: 1 * 3600 + 35 * 60 + 18,
    audioUrl: "/audio/a-vida-e-incrivel.mp3",
  },
];
