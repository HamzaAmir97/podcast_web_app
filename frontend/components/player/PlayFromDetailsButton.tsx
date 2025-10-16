"use client";
import Image from "next/image";
import { usePlayer, type Episode } from "@/stores/usePlayer";
import { resolveMediaUrl } from "@/utils/media";

export default function PlayFromDetailsButton({ episode }: { episode: Episode }) {
  const loadAndPlay = usePlayer(s => s.loadAndPlay);

  const play = () => {
    // normalize thumbnail path for the player sidebar
    loadAndPlay({
      ...episode,
      thumbnail: resolveMediaUrl(episode.thumbnail),
    });
  };

  return (
    <button
      className="absolute top-1/2 -translate-y-1/2 -right-[15px] z-20
                 w-10 h-10 rounded-[10px] bg-secondary flex items-center justify-center shadow-md pointer-events-auto"
      aria-label={`Play ${episode.title}`}
      onClick={play}
      type="button"
    >
      <Image src="/icons/play_arrow.png" alt="Play" width={24} height={24} />
    </button>
  );
}