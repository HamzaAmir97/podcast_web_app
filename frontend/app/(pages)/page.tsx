import EpisodeCard from "@/components/home/EpisodeCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PODCASTS } from "@/lib/constants";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  return (
   <main className="w-[31rem] md:w-[62rem] lg:w-[42rem] xl:w-[68rem] bg-white   lg:pb-0 ">
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-15">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-10">
       
        {/* ===== Header / Latest releases ===== */}
        <section className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-[#494D4B]">Ultimos lançamentos</h1>

          <div
            className="
             flex flex-col xl:flex-row gap-6
            "
          >
            <EpisodeCard
              title="O que é um bom código?"
              description="Diego e Richard"
              date="12 de outubro de 2025"
              imgURL="/Images/image (4).png"
            />
            <EpisodeCard
              title="Como começar na programação...?"
              description="Tiago, Diego e Pellizzetti"
              date="8 Jan 21 - 35:40"
              imgURL="/Images/image (3).png"
            />
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
                {PODCASTS.map((podcast) => (
                  <TableRow key={podcast.id} className="hover:bg-[#F8F8FA]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={podcast.cover}
                          alt={podcast.title}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <p className="font-bold text-[#494D4B] line-clamp-1">{podcast.title}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-[#AFB2B1]">
                      <span className="line-clamp-1">{podcast.members.join(", ")}</span>
                    </TableCell>

                    <TableCell className="text-[#AFB2B1]">{podcast.dateLabel}</TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-3 pr-1">
                        <span className="text-[#AFB2B1] tabular-nums">{podcast.duration}</span>

                        {/* play icon */}
                        <button
                          aria-label={`Play ${podcast.title}`}
                          className="
                            w-8 h-8 rounded-[10px] border border-[#E6E8EB]
                            flex items-center justify-center
                            hover:bg-[#F2F3F5] transition
                          "
                        >
                          <Image
                            src="/icons/play__green_arrow.svg"
                            alt="play"
                            width={16}
                            height={16}
                            className="pointer-events-none"
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
