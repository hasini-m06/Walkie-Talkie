/*
 * TDL-9 MISSION CONTROL — UTC Clock Hook
 * Updates every second, returns formatted UTC time string
 */
import { useEffect, useState } from "react";

function formatUTC(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`
  );
}

export function useUTCClock() {
  const [time, setTime] = useState(() => formatUTC(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatUTC(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
