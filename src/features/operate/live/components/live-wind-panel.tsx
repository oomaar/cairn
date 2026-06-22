"use client";

import { Anemometer } from "./anemometer";

interface LiveWindPanelProps {
  windSpeed: number;
  windThreshold?: number;
}

export function LiveWindPanel({
  windSpeed,
  windThreshold = 40,
}: LiveWindPanelProps) {
  return <Anemometer windSpeed={windSpeed} windThreshold={windThreshold} />;
}
