// components/home/EpisodeCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { MouseEvent } from "react";
import PlayIcon from "./playIcon";
import { usePlayer, type Episode } from "@/stores/usePlayer";
import { resolveMediaUrl } from "@/utils/media";

type Props = {
  title: string;
  description: string;         
  date: string;                
  imgURL: string;
  url: string;                 
  audioUrl?: string;           
  publishedAtISO?: string;     
  durationSeconds?: number;     
};

export default function EpisodeCard({
  title = "O que é um bom código?",
  description = "Diego e Richard",
  date = "12 de outubro de 2025",
  imgURL = "/Images/image (4).png",
  url = "",
  audioUrl,           
  publishedAtISO,       
  durationSeconds = 0,  
}: Props) {
  const loadAndPlay = usePlayer((s) => s.loadAndPlay);

 
  const id = url?.replace(/^\/+/, "") || title.toLowerCase().replace(/\s+/g, "-");


  const safeAudioUrl = audioUrl ?? `/stream/${id}`;

 
  const authors = description
    ? description.split(",").map((s) => s.trim()).filter(Boolean)
    : [];


  const episodeForPlayer: Episode = {
    id,
    title,
    description,
    thumbnail: resolveMediaUrl(imgURL),  
    audioUrl: safeAudioUrl,
    durationSeconds,
    publishedAt: publishedAtISO || new Date().toISOString(),
    authors: authors.length ? authors : ["—"],
  };

  const onPlayClick = (e: MouseEvent) => {
    e.preventDefault();   // لا تروح للينك
    e.stopPropagation();  // لا تفعّل click على البطاقة
    loadAndPlay(episodeForPlayer);
  };

  return (
    <div
      className="
        relative w-[432px] h-[136px] bg-[#FFFFFF]
        flex p-4 gap-2
        rounded-[24px]
        border-[1px] border-[#E6E8EB]
        hover:bg-[#F8F8FA] transition
      "
    >
      <Link href={url} className="flex gap-2 no-underline">
        {/* image */}
        <div>
          <Image
            src={imgURL}
            alt={title}
            width={96}
            height={96}
            className="rounded-[16px] object-cover"
          />
        </div>

        {/* title and description */}
        <div className="flex flex-col gap-2 p-2">
          <p className="text-[#494D4B] ">{title}</p>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#808080] font-inter ">{description}</p>
            <p className="text-[#808080] font-inter ">{date}</p>
          </div>
        </div>
      </Link>

     
      <button
        type="button"
        aria-label={`Play ${title}`}
        onClick={onPlayClick}
        className="absolute top-15 right-5"
      >
        <PlayIcon />
      </button>
    </div>
  );
}
