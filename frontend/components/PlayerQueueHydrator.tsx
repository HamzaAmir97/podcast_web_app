"use client";
import { useEffect } from "react";
import { usePlayer, type Episode } from "@/stores/usePlayer";

export default function PlayerQueueHydrator({ episodes }: { episodes: Episode[] }) {
  useEffect(() => {
    if (Array.isArray(episodes) && episodes.length > 1) {
     
      usePlayer.getState().setQueue(episodes, 0);
    
    }
  }, [episodes]);

  return null;
}
