/*
 * TDL-9 MISSION CONTROL — Tactical Header
 * Design: Obsidian Tactical Grid
 * Fixed top bar: Title | Classification | UTC Clock
 * Font: Space Grotesk (title), JetBrains Mono (clock)
 */
import { useUTCClock } from "@/hooks/useUTCClock";
import { Shield, Wifi } from "lucide-react";

interface TacticalHeaderProps {
  sosAlert: boolean;
  connectionMode?: "LIVE" | "SIMULATED";
}

export function TacticalHeader({ sosAlert, connectionMode = "SIMULATED" }: TacticalHeaderProps) {
  const time = useUTCClock();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid #262626",
      }}
    >
      {/* Left: System identity */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-8 h-8"
          style={{ border: "1px solid #262626" }}
        >
          <Shield size={16} style={{ color: "#4ADE80" }} />
        </div>
        <div>
          <div
            className="text-sm font-bold tracking-widest uppercase"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#E5E5E5",
              letterSpacing: "0.15em",
            }}
          >
            TDL-9 MISSION CONTROL
          </div>
          <div
            className="text-xs tracking-wider"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#6B7280",
              letterSpacing: "0.08em",
              fontSize: "10px",
            }}
          >
            TACTICAL DATALINK · CH90 · NRF24L01
          </div>
        </div>
      </div>

      {/* Center: SOS alert */}
      {sosAlert && (
        <div
          className="flex items-center gap-2 px-3 py-1 animate-sos-pulse"
          style={{
            border: "1px solid #EF4444",
            backgroundColor: "rgba(239,68,68,0.1)",
          }}
        >
          <span
            className="animate-blink"
            style={{ color: "#EF4444", fontSize: "10px", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.1em", fontWeight: 700 }}
          >
            ▲ SOS SIGNAL DETECTED
          </span>
        </div>
      )}

      {/* Right: Classification + Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wifi
            size={12}
            style={{ color: connectionMode === "LIVE" ? "#4ADE80" : "#FBBF24" }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: connectionMode === "LIVE" ? "#4ADE80" : "#FBBF24",
              fontSize: "10px",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            {connectionMode === "LIVE" ? "LINK ACTIVE" : "SIMULATED"}
          </span>
        </div>
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: "#262626",
          }}
        />
        <div
          className="px-2 py-0.5"
          style={{
            border: "1px solid #262626",
            backgroundColor: "#111111",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#6B7280",
              fontSize: "9px",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            CLASSIFICATION: UNCLASSIFIED
          </span>
        </div>
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: "#262626",
          }}
        />
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#A3A3A3",
            fontSize: "12px",
            letterSpacing: "0.04em",
            minWidth: "220px",
            textAlign: "right",
          }}
        >
          {time}
        </div>
      </div>
    </header>
  );
}
