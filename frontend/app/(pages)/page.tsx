import Image from "next/image";
import EpisodeCard from "@/components/home/EpisodeCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_PATHS } from "@/lib/apiPaths";
import { resolveMediaUrl } from "@/utils/media";
import Link from "next/link";
import PlayButton from "@/components/player/PlayButton";

// (اختياري) لو بتستخدم Edge وفيه أكواد Node، ثبّت على nodejs
export const runtime = "nodejs";

// --- API shape coming from backend/static JSON ---
export type EpisodeAPI = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string;
  authors: string[];
};

// --- Type guards ---
function isEpisodeArray(x: unknown): x is EpisodeAPI[] {
  return Array.isArray(x) && x.every((e) => e && typeof (e as EpisodeAPI).id === "string");
}

// --- UI helpers ---
function formatDuration(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const year = String(d.getUTCFullYear()).slice(-2);
  const monthShort = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${day} ${monthShort} ${year}`;
}

function publishedTime(e: EpisodeAPI): number {
  const t = new Date(e.publishedAt ?? "").getTime();
  return Number.isFinite(t) ? t : 0;
}


async function fetchEpisodes(): Promise<EpisodeAPI[]> {
  try {
    const url = API_PATHS.EPISODES.GET_ALL as string;
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });

    if (!res.ok) {
 
      console.error("[episodes] fetch failed:", res.status, res.statusText, url);
      return [];
    }

    const raw: unknown = await res.json();

    // طبّع أي شكل شائع: [], {episodes:[]}, {items:[]}, {data:[]}
    if (isEpisodeArray(raw)) {
      return [...raw].sort((a, b) => publishedTime(b) - publishedTime(a));
    }

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const keys = ["episodes", "items", "data"] as const;
      for (const k of keys) {
        const v = obj[k];
        if (isEpisodeArray(v)) {
          return [...v].sort((a, b) => publishedTime(b) - publishedTime(a));
        }
      }
    }

    console.error("[episodes] unexpected payload shape:", raw);
    return [];
  } catch (e) {
    console.error("[episodes] fetch error:", e);
    return [];
  }
}

export default async function HomePage() {
  const episodes = await fetchEpisodes();

  // Pick latest two for the top cards (fallbacks if less than 2)
  const [first, secondCard] = episodes;

  return (
    <main className="w-[31rem] md:w-[62rem] lg:w-[42rem] xl:w-[68rem] bg-white lg:pb-0">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-15">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-10">
          {/* ===== Header / Latest releases ===== */}
          <section className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-[#494D4B]">Ultimos lançamentos</h1>

            <div className="flex flex-col xl:flex-row gap-6">
              {first && (
                <EpisodeCard
                  url={"/" + first.id}
                  title={first.title}
                  description={first.authors.join(", ")}
                  date={new Date(first.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  imgURL={resolveMediaUrl(first.thumbnail)}
                />
              )}

              {secondCard && (
                <EpisodeCard
                  url={"/" + secondCard.id}
                  title={secondCard.title}
                  description={secondCard.authors.join(", ")}
                  date={`${formatDateLabel(secondCard.publishedAt)} - ${formatDuration(
                    secondCard.durationSeconds
                  )}`}
                  imgURL={resolveMediaUrl(secondCard.thumbnail)}
                />
              )}
            </div>
          </section>

          {/* ===== All episodes (table) ===== */}
          <section className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-[#494D4B]">Todos os episódios</h2>

            <div className="w-full overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#ABA8B2]">Nome</TableHead>
                    <TableHead className="text-[#ABA8B2]">Descrição</TableHead>
                    <TableHead className="text-[#ABA8B2]">Data</TableHead>
                    <TableHead className="text-[#ABA8B2] text-right pr-4">Duração</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {episodes.map((ep) => (
                    <TableRow
                      key={ep.id}
                      className="hover:bg-[#F8F8FA] cursor-pointer hover:opacity-75"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Link href={"/" + ep.id} className="flex items-center gap-3 ">
                            <Image
                              src={resolveMediaUrl(ep.thumbnail)}
                              alt={ep.title}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <p className="font-bold text-[#494D4B] line-clamp-1">{ep.title}</p>
                          </Link>
                        </div>
                      </TableCell>

                      <TableCell className="text-[#AFB2B1]">
                        <Link href={"/" + ep.id} className="line-clamp-1">
                          {ep.authors.join(", ")}
                        </Link>
                      </TableCell>

                      <TableCell className="text-[#AFB2B1]">
                        <Link href={"/" + ep.id} className="line-clamp-1">
                          {formatDateLabel(ep.publishedAt)}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-between gap-3 pr-1">
                          <span className="text-[#AFB2B1] tabular-nums">
                            {formatDuration(ep.durationSeconds)}
                          </span>

                          <PlayButton
                            episode={ep}
                            className="w-8 h-8 rounded-[10px] border border-[#E6E8EB] flex items-center justify-center hover:bg-[#F2F3F5] transition"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
