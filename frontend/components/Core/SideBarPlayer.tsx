// components/SideBarPlayer.tsx
"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "../../stores/usePlayer";
import { resolveMediaUrl } from "../../utils/media";
import clsx from "clsx";

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const SideBarPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    setAudio, current, isPlaying, progress, duration,
    toggle, seek, next, prev,
    toggleRepeat, toggleShuffle, repeat, shuffle
  } = usePlayer();

  useEffect(() => {
    if (audioRef.current) setAudio(audioRef.current);
  }, [setAudio]);

  const disabled = !current;

  return (
    <aside
      className={`
        fixed z-50 bottom-0 
        h-[155px]                   
        bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80
        shadow-[0_-6px_20px_rgba(0,0,0,0.15)]
        lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto
        lg:h-[100dvh] lg:w-[424px]
        lg:bg-primary lg:backdrop-blur-none lg:shadow-none
      `}
    >
      {/* global audio */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* ====== mobile (info+progress + controls) ====== */}
      <div className="h-[20rem] w-screen  px-5 lg:hidden">
        {/* info + progress */}
        <div className="pt-2">
          <div className="flex items-center gap-2">
            {/* small thumbnail */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#9F75FF]/30 border border-white/10">
              {current ? (
                <Image
                  src={resolveMediaUrl(current.thumbnail)}
                  alt={current.title}
                  fill
                  className="object-cover object-center"
                  sizes="40px"
                />
              ) : null}
            </div>
            {/* title + authors */}
            <div className="min-w-0 flex flex-col">
              <div className="text-white/90 text-sm font-medium truncate">
                {current ? current.title : "—"}
              </div>
              <div className="text-white/60 text-xs truncate">
                {current ? current.authors.join(", ") : "Selecione um podcast"}
              </div>
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-white text-xs tabular-nums">{fmt(disabled ? 0 : progress)}</span>
            <input
              type="range"
              min={0}
              max={disabled ? 0 : duration}
              value={disabled ? 0 : progress}
              onChange={(e) => !disabled && seek(Number(e.target.value))}
              className="w-full h-1 [accent-color:#13c2a3] bg-violet-300/40 rounded-full"
              disabled={disabled}
            />
            <span className="text-white text-xs tabular-nums">{fmt(disabled ? 0 : duration)}</span>
          </div>
        </div>

        {/* controls row (unchanged) */}
        <div className="h-[56px] p-10 w-full flex items-center justify-center gap-5">
          {/* shuffle */}
          <Image
            src="/icons/shuffle.png"
            alt="shuffle"
            width={24}
            height={24}
            onClick={() => toggleShuffle()}
            aria-pressed={shuffle}
            className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""} ${shuffle ? "ring-2 ring-white/60" : ""}`}
          />
          {/* prev */}
          <Image
            src="/icons/play_left_arrow.png"
            alt="prev"
            width={24}
            height={24}
            className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
            onClick={() => !disabled && prev()}
            role="button"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) prev(); }}
          />
          {/* play/pause */}
          <button
            className={`w-16 h-16 rounded-2xl bg-[#9164FA] hover:bg-[#6F48C9] flex items-center justify-center
                        ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
            aria-label="play"
            onClick={() => !disabled && toggle()}
          >
            {isPlaying ? (
              <Image src="/icons/pause.png" alt="pause" width={11} height={19} />
            ) : (
              <Image src="/icons/play_arrow.png" alt="play" width={32} height={32} />
            )}
          </button>
          {/* next */}
          <Image
            src="/icons/play_right_arrow.png"
            alt="next"
            width={24}
            height={24}
            className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
            onClick={() => !disabled && next()}
            role="button"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) next(); }}
          />
          {/* repeat */}
          <Image
            src="/icons/repeat.svg"
            alt="repeat"
            width={24}
            height={24}
            onClick={() => toggleRepeat()}
            aria-pressed={repeat}
            className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""} ${repeat ? "ring-2 ring-white/60" : ""}`}
          />
        </div>

       
      </div>




      {/* ====== desktop sidebar (unchanged) ====== */}
      <div className="hidden lg:flex h-full w-full p-4 flex-col items-center gap-6">
        {/* logo */}
        <div className="w-full flex  justify-center">
          <Image src="/Top.png" alt="Logo" width={169} height={36} />
        </div>

        {/* cover / placeholder */}
        <div className="w-full flex-1 flex items-center justify-center">
          {!current ? (
            <div className=" w-[296px] h-[346px] rounded-[24px] border-2 border-dashed border-[#E6E8EB]/60 bg-[#9F75FF]/30 flex items-center justify-center text-center  ">
              <p className="text-white/90 leading-relaxed">
                Selecione um <br /> podcast para ouvir
              </p>
            </div>
          ) : (
            <div className="w-[296px] h-[346px]">
              <div className="relative w-[296px] h-[346px] rounded-[24px] overflow-hidden">
                <Image
                  src={resolveMediaUrl(current.thumbnail)}
                  alt={current.title}
                  fill
                  className="object-cover"
                
                />
              </div>

              <div className="mt-4 text-white  text-center ">
                <div className="font-semibold "> <p className="text-[24px]">{current.title .slice(0, 20)}</p></div>
                <div className="text-white/70 text-sm line-clamp-1"> <p className="text-[16px]">{current.authors.join(", ")}</p></div>
              </div>


            </div>
          )}
        </div>

        {/* progress + controls */}
        <div className="w-full flex flex-col gap-5 p-8">
          {/* progress */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm tabular-nums">{fmt(disabled ? 0 : progress)}</span>
            <input
              type="range"
              min={0}
              max={disabled ? 0 : duration}
              value={disabled ? 0 : progress}
              onChange={(e) => !disabled && seek(Number(e.target.value))}
              className="w-full h-1 [accent-color:#13c2a3] bg-violet-300/40 rounded-full"
              disabled={disabled}
            />
            <span className="text-white text-sm tabular-nums">{fmt(disabled ? 0 : duration)}</span>
          </div>

          {/* bottom controls */}
          <div className="w-full flex items-center justify-center gap-5 opacity-80">
            {/* shuffle */}
            <Image
              src="/icons/shuffle.png"
              alt="shuffle"
              width={24}
              height={24}
              onClick={() => toggleShuffle()}
              aria-pressed={shuffle}
              className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""} ${shuffle ? "ring-2 ring-white/60" : ""}`}
            />
            {/* prev */}
            <Image
              src="/icons/play_right_arrow.png"
              alt="prev"
              width={24}
              height={24}
              className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
              onClick={() => !disabled && prev()}
              role="button"
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) prev(); }}
            />
            {/* play/pause */}
            <button
              className={clsx(`w-16 h-16 rounded-2xl  hover:bg-[#6F48C9] ${isPlaying ? "bg-[#6F48C9]" : "bg-[#9164FA]"} flex items-center justify-center
                          ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`)}
              aria-label="play"
              onClick={() => !disabled && toggle()}
              disabled={disabled}
            >
              {isPlaying ? (
                <Image src="/icons/pause.png" alt="pause" width={11} height={19} />
              ) : (
                <Image src="/icons/play_arrow.png" alt="play" width={32} height={32} />
              )}
            </button>
            {/* next */}
            <Image
              src="/icons/play_left_arrow.png"
              alt="next"
              width={24}
              height={24}
              className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
              onClick={() => !disabled && next()}
              role="button"
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) next(); }}
            />
            {/* repeat */}
            <Image
              src="/icons/repeat.svg"
              alt="repeat"
              width={24}
              height={24}
              onClick={() => toggleRepeat()}
              aria-pressed={repeat}
              className={`rounded-2xl hover:bg-[#6F48C9] ${disabled ? "opacity-40 pointer-events-none" : ""} ${repeat ? "ring-2 ring-white/60" : ""}`}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBarPlayer;
