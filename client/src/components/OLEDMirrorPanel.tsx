/*
 * TDL-9 MISSION CONTROL — OLED Mirror Panel
 * Design: Obsidian Tactical Grid
 * Mirrors the physical SSD1306 OLED display on NODE 9B.
 * Shows last 4 received messages with phosphor-green styling.
 */
import { TacticalLogEntry } from "@/lib/tacticalData";

interface OLEDMirrorPanelProps {
  log: TacticalLogEntry[];
}

export function OLEDMirrorPanel({ log }: OLEDMirrorPanelProps) {
  // Last 4 messages received at T9-B (what the physical OLED shows)
  const rxMessages = log
    .filter((e) => e.action === "RX" && e.origin === "T9-B")
    .slice(0, 4);

  return (
    <div
      style={{
        border: "1px solid #262626",
        backgroundColor: "#111111",
        padding: "12px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "#6B7280",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        OLED DISPLAY — NODE 9B
      </div>

      {/* OLED screen simulation */}
      <div
        style={{
          backgroundColor: "#020808",
          border: "2px solid #0F2010",
          borderRadius: 2,
          padding: "8px 10px",
          minHeight: 72,
          position: "relative",
          boxShadow: "inset 0 0 12px rgba(74,222,128,0.05)",
        }}
      >
        {rxMessages.length === 0 ? (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#0F3A10",
              letterSpacing: "0.06em",
            }}
          >
            AWAITING MSG
            <span className="animate-blink" style={{ color: "#1A5A1A" }}>
              ▋
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {rxMessages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: i === 0 ? "12px" : "10px",
                  color: i === 0 ? "#4ADE80" : `rgba(74,222,128,${0.35 - i * 0.08})`,
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "color 400ms ease-out",
                }}
              >
                {i === 0 ? ">" : " "} {msg.decodedText}
                {i === 0 && (
                  <span className="animate-blink" style={{ color: "#4ADE80" }}>
                    ▋
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scanline overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
            pointerEvents: "none",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Meta info */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 5 }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            color: "#374151",
            letterSpacing: "0.06em",
          }}
        >
          SSD1306 · 128×64 · I²C
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            color: "#374151",
          }}
        >
          {rxMessages.length}/4 LINES
        </span>
      </div>
    </div>
  );
}
