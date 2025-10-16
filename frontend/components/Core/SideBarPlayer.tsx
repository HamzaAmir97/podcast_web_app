import React from "react";
import Image from "next/image";

const SideBarPlayer = () => {
  return (
    <aside
   className={`
  fixed z-50
  
  bottom-0 inset-x-0 h-20
  bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80
  shadow-[0_-6px_20px_rgba(0,0,0,0.15)]

  lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto
  lg:h-[100dvh] lg:w-[424px]
  lg:bg-primary lg:backdrop-blur-none lg:shadow-none
`}
>



      {/* ====== mobile controls only====== */}
      <div className="h-full w-full px-4 lg:hidden">
        <div className="h-full w-full flex items-center justify-center gap-5">
          <Image
            src="/icons/shuffle.png"
            alt="shuffle"
            width={24}
            height={24}
            className="rounded-2xl hover:bg-[#6F48C9] "
          />
          <Image
            src="/icons/play_left_arrow.png"
            alt="prev"
            width={24}
            height={24}
            className="rounded-2xl hover:bg-[#6F48C9] "
          />

          <button
            className="
              w-16 h-16 rounded-2xl bg-[#9164FA]
              hover:bg-[#6F48C9]
              flex items-center justify-center
            "
            aria-label="play"
          >
            <Image src="/icons/play_arrow.png" alt="play" width={32} height={32} />
          </button>

          <Image
            src="/icons/play_right_arrow.png"
            alt="next"
            width={24}
            height={24}
            className="rounded-2xl hover:bg-[#6F48C9] "
          />
          <Image
            src="/icons/repeat.svg"
            alt="repeat"
            width={24}
            height={24}
            className="rounded-2xl hover:bg-[#6F48C9] "
          />
        </div>
        {/* safe area bottom */}
        <div className="pb-[max(env(safe-area-inset-bottom),0px)]" />
      </div>



      {/* ====== desktop: full sidebar ====== */}
      <div className="hidden lg:flex h-full w-full p-10 flex-col items-center gap-6">
        {/* logo */}
        <div className="w-full flex items-center justify-center">
          <Image src="/Top.png" alt="Logo" width={169} height={36} />
        </div>

        {/* placeholder / cover area */}
        <div className="w-full flex-1 flex items-center justify-center">
          <div
            className="
              w-full max-w-[320px] min-h-[320px]
              rounded-3xl border-2 border-dashed
              border-[#E6E8EB]/60 bg-[#9F75FF]/30
              flex items-center justify-center text-center
              px-6 py-10
            "
          >
            <p className="text-white/90 leading-relaxed">
              Selecione um <br /> podcast para ouvir
            </p>
          </div>
        </div>

        {/* progress + controls (bottom) */}
        <div className="w-full flex flex-col gap-5">
          {/* progress */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm tabular-nums">00:00</span>
            <input
              type="range"
              min={0}
              max={100}
              className="
                w-full h-1
                [accent-color:#13c2a3]
                bg-violet-300/40 rounded-full
              "
            />
            <span className="text-white text-sm tabular-nums">00:00</span>
          </div>

          {/* controls */}
          <div className="w-full flex items-center justify-center gap-5 opacity-80">
            <Image
              src="/icons/shuffle.png"
              alt="shuffle"
              width={24}
              height={24}
              className="rounded-2xl hover:bg-[#6F48C9]"
            />
            <Image
              src="/icons/play_left_arrow.png"
              alt="prev"
              width={24}
              height={24}
              className="rounded-2xl hover:bg-[#6F48C9]"
            />

            <button
              className="
                w-16 h-16 rounded-2xl bg-[#9164FA]
                hover:bg-[#6F48C9]
                flex items-center justify-center
              "
              aria-label="play"
            >
              <Image src="/icons/play_arrow.png" alt="play" width={32} height={32} />
            </button>

            <Image
              src="/icons/play_right_arrow.png"
              alt="next"
              width={24}
              height={24}
              className="rounded-2xl hover:bg-[#6F48C9]"
            />
            <Image
              src="/icons/repeat.svg"
              alt="repeat"
              width={24}
              height={24}
              className="rounded-2xl hover:bg-[#6F48C9]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBarPlayer;
