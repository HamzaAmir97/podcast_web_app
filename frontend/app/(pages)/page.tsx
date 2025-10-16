
import Image from "next/image";
import EpisodeCard from "@/components/home/EpisodeCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_PATHS } from "@/lib/apiPaths";
import { resolveMediaUrl } from "@/utils/media";

// --- API shape coming from backend/static JSON ---
type EpisodeAPI = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;        
  audioUrl: string;         
  durationSeconds: number;  
  publishedAt: string;      
  authors: string[];      
};

// --- UI helpers ---
function formatDuration(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` : `${m}:${String(s).padStart(2,"0")}`;
}



function formatDateLabel(iso: string) {
  // Example output: "8 Jan 21" to match your table style
  const d = new Date(iso);
  const day = d.getUTCDate();
  const year = String(d.getUTCFullYear()).slice(-2);
  const monthShort = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }); // Jan/Feb/Mar...
  return `${day} ${monthShort} ${year}`;
}

async function fetchEpisodes(): Promise<EpisodeAPI[]> {
  const res = await fetch(API_PATHS.EPISODES.GET_ALL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load episodes");
  const data = (await res.json()) as EpisodeAPI[];

  // Ensure newest first (if backend doesn’t already sort)
  return data.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export default async function HomePage() {
  const episodes = await fetchEpisodes();

  // Pick latest two for the top cards (fallbacks if less than 2)
  const [first, second] = episodes;
  const secondCard = episodes[1];

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
                  title={secondCard.title}
                  description={secondCard.authors.join(", ")}
                  date={`${formatDateLabel(secondCard.publishedAt)} - ${formatDuration(secondCard.durationSeconds)}`}
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
                    <TableRow key={ep.id} className="hover:bg-[#F8F8FA] cursor-pointer hover:opacity-75">
                    
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={resolveMediaUrl(ep.thumbnail)}
                            alt={ep.title}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <p className="font-bold text-[#494D4B] line-clamp-1">{ep.title}</p>
                        </div>
                      </TableCell>

                      <TableCell className="text-[#AFB2B1]">
                        <span className="line-clamp-1">{ep.authors.join(", ")}</span>
                      </TableCell>

                      <TableCell className="text-[#AFB2B1]">
                        {formatDateLabel(ep.publishedAt)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-3 pr-1">
                          <span className="text-[#AFB2B1] tabular-nums">
                            {formatDuration(ep.durationSeconds)}
                          </span>

                          {/* play icon (wire this to your PlayerContext) */}
                          <button
                            aria-label={`Play ${ep.title}`}
                            className="w-8 h-8 rounded-[10px] border border-[#E6E8EB] flex items-center justify-center hover:bg-[#F2F3F5] transition"
                            // onClick={() => player.playById(ep.id)} // example
                          >
                            <Image
                              src="/icons/play__green_arrow.svg"
                              alt="play"
                              width={16}
                              height={16}
                              className="pointer-events-none "
                            />
                          </button>
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
