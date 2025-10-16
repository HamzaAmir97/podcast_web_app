
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/lib/apiPaths";
import { resolveMediaUrl } from "@/utils/media";
import PlayFromDetailsButton from "@/components/player/PlayFromDetailsButton";

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string;
  authors: string[];
};

// --- format helpers --
const fmtDur = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return h ? `${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}` : `${m}:${String(ss).padStart(2,"0")}`;
};
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const yr  = String(d.getUTCFullYear()).slice(-2);
  return `${day} ${mon} ${yr}`;
};

// --- server fetch ---
async function getEpisode(id: string): Promise<Episode> {
  const res = await fetch(`${BASE_URL}/episodes/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to load episode: ${res.status} ${res.statusText}${body ? " → " + body : ""}`);
  }
  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const episode = await getEpisode(id);

  return (
    <div className="w-[31rem] md:w-[62rem] lg:w-[42rem] xl:w-[68rem] h-screen flex flex-col items-center p-10 gap-2 mb-10">
      {/* header */}
      <div className="relative w-[400px] md:w-[500px] lg:w-[600px] xl:w-[656px] h-[160px]">
        {/* rounded image */}
        <div className="h-full w-full rounded-2xl overflow-hidden">
          <Image
            src={resolveMediaUrl(episode.thumbnail)}
            alt={episode.title}
            fill
            sizes="(min-width:1280px) 656px, (min-width:1024px) 600px, (min-width:768px) 500px, 400px"
            className="object-cover object-center rounded-2xl"
            priority
          />
        </div>

        {/* back button */}
        <Link href="/" className="absolute top-1/2 -translate-y-1/2 -left-[15px] z-20" aria-label="Back">
          <div className="w-10 h-10 rounded-[10px] bg-primary flex items-center justify-center shadow-md pointer-events-auto">
            <Image src="/icons/back.svg" alt="Back" width={7} height={14} />
          </div>
        </Link>

        {/* play button → plays in sidebar (no navigation) */}
        <PlayFromDetailsButton episode={episode} />
      </div>

      {/* content */}
      <div className="w-[400px] md:w-[500px] lg:w-[600px] xl:w-[656px] h-[379px] flex flex-col gap-5">
        <h1 className="text-[32px] text-[#494D4B] font-bold">{episode.title}</h1>

        <div className="flex gap-5 items-center">
          <p className="text-[#808080]">{episode.authors.join(", ")}</p>
          <span className="w-[4px] h-[4px] rounded-full bg-[#DDDDDD]" />
          <p className="text-[#808080]">{fmtDate(episode.publishedAt)}</p>
          <span className="w-[4px] h-[4px] rounded-full bg-[#DDDDDD]" />
          <p className="text-[#808080]">{fmtDur(episode.durationSeconds)}</p>
        </div>

        {/* separator */}
        <span className="w-[623px] h-[0px] rounded-full border-[1px] border-[#E6E8EB]" />

        <article className="text-[16px] text-[#494D4B]">{episode.description}</article>
      </div>
    </div>
  );
}
