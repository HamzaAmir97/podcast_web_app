import React from "react";
import Image from "next/image";

const AppHeader = () => {
  return (
    <header className="sticky w-[1092px] top-0 z-50 bg-white border-b px-8 border-[#E6E8EB]">
      <div className="container mx-auto h-24 px-8 flex items-center justify-between">
        {/* logo + tagline */}
        <div className="flex items-center gap-5">
          <Image src="/top.svg" alt="Logo" width={163} height={40} priority />
          <span className="hidden sm:inline-block w-px h-6 bg-[#E6E8EB]" />
          <p className="text-sm text-[#808080] max-sm:hidden">
            O melhor para você ouvir, sempre
          </p>
        </div>

        {/* date */}
        <p className="text-sm text-[#808080]">Qui, 8 Abril</p>
      </div>
    </header>
  );
};

export default AppHeader;
