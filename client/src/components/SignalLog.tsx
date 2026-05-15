/*
 * TDL-9 MISSION CONTROL — Integrated Signal Log
 * Design: Obsidian Tactical Grid
 * Dense monospace scrollable table with TX/RX/SOS indicators
 * Font: JetBrains Mono for all data, Space Grotesk for column headers
 */
import { TacticalLogEntry } from "@/lib/tacticalData";
import { useEffect, useRef, useState } from "react";

interface SignalLogProps {
  log: TacticalLogEntry[];
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
  } catch {
    return "??:??:??Z";
  }
}

function ActionBadge({ action, isSOS }: { action: "TX" | "RX"; isSOS: boolean }) {
  if (isSOS) {
    return (
      <span
        className="animate-blink"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#EF4444",
          border: "1px solid #EF4444",
          padding: "1px 5px",
          display: "inline-block",
          minWidth: 36,
          textAlign: "center",
        }}
      >
        SOS
      </span>
    );
  }
  if (action === "TX") {
    return (
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#4ADE80",
          border: "1px solid rgba(74,222,128,0.4)",
          padding: "1px 5px",
          display: "inline-block",
          minWidth: 36,
          textAlign: "center",
        }}
      >
        TX
      </span>
    );
  }
  return (
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#FBBF24",
        border: "1px solid rgba(251,191,36,0.4)",
        padding: "1px 5px",
        display: "inline-block",
        minWidth: 36,
        textAlign: "center",
      }}
    >
      RX
    </span>
  );
}

interface LogRowProps {
  entry: TacticalLogEntry;
  isNew: boolean;
  isLast: boolean;
}

function LogRow({ entry, isNew, isLast }: LogRowProps) {
  const [entered, setEntered] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setEntered(true), 10);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  const isSOS = entry.isSOS;

  return (
    <tr
      className={isSOS ? "animate-sos-pulse" : ""}
      style={{
        borderLeft: isSOS ? "2px solid #EF4444" : "2px solid transparent",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)",
        backgroundColor: isSOS ? "rgba(239,68,68,0.04)" : "transparent",
      }}
    >
      {/* Seq */}
      <td
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#4B5563",
          padding: "5px 8px",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {String(entry.seqNum).padStart(4, "0")}
      </td>
      {/* Timestamp */}
      <td
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#6B7280",
          padding: "5px 8px",
          whiteSpace: "nowrap",
        }}
      >
        {formatTimestamp(entry.timestamp)}
      </td>
      {/* Origin */}
      <td
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: entry.origin === "T9-A" ? "#38BDF8" : "#A78BFA",
          padding: "5px 8px",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        {entry.origin}
      </td>
      {/* Action */}
      <td style={{ padding: "5px 8px", whiteSpace: "nowrap" }}>
        <ActionBadge action={entry.action} isSOS={isSOS} />
      </td>
      {/* Decoded text */}
      <td
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: isSOS ? "#EF4444" : "#E5E5E5",
          padding: "5px 8px",
          fontWeight: isSOS ? 700 : 500,
          whiteSpace: "nowrap",
        }}
      >
        {entry.decodedText}
        {isLast && (
          <span className="animate-blink" style={{ color: "#4ADE80", marginLeft: 2 }}>
            ▋
          </span>
        )}
      </td>
      {/* Morse code */}
      <td
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: isSOS ? "rgba(239,68,68,0.7)" : "#4B5563",
          padding: "5px 8px 5px 12px",
          letterSpacing: "0.06em",
          maxWidth: "260px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {entry.morseCode}
      </td>
    </tr>
  );
}

export function SignalLog({ log }: SignalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(log.length);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (log.length > prevLengthRef.current) {
      const added = log.slice(0, log.length - prevLengthRef.current);
      setNewIds(new Set(added.map((e) => e.id)));
      prevLengthRef.current = log.length;
      // Scroll to top (newest entries are at top)
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [log]);

  const colHeaderStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "9px",
    letterSpacing: "0.12em",
    color: "#4B5563",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "6px 8px",
    textAlign: "left",
    borderBottom: "1px solid #1A1A1A",
    backgroundColor: "#0A0A0A",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  return (
    <div
      style={{
        border: "1px solid #262626",
        backgroundColor: "#111111",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid #1A1A1A", flexShrink: 0 }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.12em",
            color: "#6B7280",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          INTEGRATED SIGNAL LOG
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 6, height: 6, backgroundColor: "#4ADE80", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "#6B7280",
                letterSpacing: "0.08em",
              }}
            >
              TX
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 6, height: 6, backgroundColor: "#FBBF24", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "#6B7280",
                letterSpacing: "0.08em",
              }}
            >
              RX
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 6, height: 6, backgroundColor: "#EF4444", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "#6B7280",
                letterSpacing: "0.08em",
              }}
            >
              SOS
            </span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "#4ADE80",
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "1px 6px",
            }}
          >
            {log.length} ENTRIES
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div ref={scrollRef} style={{ overflowY: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...colHeaderStyle, minWidth: 44 }}>#</th>
              <th style={{ ...colHeaderStyle, minWidth: 80 }}>TIME (UTC)</th>
              <th style={{ ...colHeaderStyle, minWidth: 60 }}>ORIGIN</th>
              <th style={{ ...colHeaderStyle, minWidth: 52 }}>ACTION</th>
              <th style={{ ...colHeaderStyle, minWidth: 80 }}>DECODED</th>
              <th style={{ ...colHeaderStyle }}>MORSE CODE</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, idx) => (
              <LogRow
                key={entry.id}
                entry={entry}
                isNew={newIds.has(entry.id)}
                isLast={idx === 0}
              />
            ))}
          </tbody>
        </table>

        {log.length === 0 && (
          <div
            className="flex items-center justify-center"
            style={{ height: 200 }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#4B5563",
                letterSpacing: "0.08em",
              }}
            >
              AWAITING SIGNAL...
              <span className="animate-blink">▋</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
