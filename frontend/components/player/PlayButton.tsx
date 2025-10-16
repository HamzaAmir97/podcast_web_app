"use client";
import Image from "next/image";
import { usePlayer, type Episode } from "../../stores/usePlayer";

export default function PlayButton({
  episode,
  className,
}: { episode: Episode; className: string }) {
  const loadAndPlay = usePlayer(s => s.loadAndPlay);
  return (
    <button
      aria-label={`Play ${episode.title}`}
      className={className}
      onClick={(e) => { e.stopPropagation(); loadAndPlay(episode); }}
    >
      <Image
        src="/icons/play__green_arrow.svg"
        alt="play"
        width={20}
        height={20}
        className="cursor-pointer "
      />
    </button>
  );
}
