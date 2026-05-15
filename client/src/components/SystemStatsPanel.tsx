/*
 * TDL-9 MISSION CONTROL — System Stats Panel
 * Design: Obsidian Tactical Grid
 * Shows protocol stack, system info, and uptime
 */
import { NodeStatus, TacticalLogEntry } from "@/lib/tacticalData";
import { useEffect, useState } from "react";

interface SystemStatsPanelProps {
  log: TacticalLogEntry[];
  nodes: NodeStatus[];
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function SystemStatsPanel({ log, nodes }: SystemStatsPanelProps) {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const totalTx = nodes.reduce((a, n) => a + n.txCount, 0);
  const totalRx = nodes.reduce((a, n) => a + n.rxCount, 0);
  const sosCount = log.filter((e) => e.isSOS).length;

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "9px",
    letterSpacing: "0.1em",
    color: "#6B7280",
    fontWeight: 600,
    textTransform: "uppercase",
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    color: "#A3A3A3",
  };

  const STACK = [
    { layer: "L1 PHY", value: "2× Arduino Nano" },
    { layer: "L2 TRN", value: "NRF24L01 + ACK" },
    { layer: "L3 APP", value: "Serial JSON" },
    { layer: "L4 DLK", value: "Python Bridge" },
    { layer: "L5 UI", value: "React / Supabase" },
  ];

  return (
    <div
      style={{
        border: "1px solid #262626",
        backgroundColor: "#111111",
        padding: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "#6B7280",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        SYSTEM STATUS
      </div>

      {/* Uptime */}
      <div className="flex items-center justify-between mb-2">
        <span style={labelStyle}>Uptime</span>
        <span style={{ ...valueStyle, color: "#4ADE80" }}>{formatUptime(uptime)}</span>
      </div>

      {/* Log count */}
      <div className="flex items-center justify-between mb-2">
        <span style={labelStyle}>Log Entries</span>
        <span style={valueStyle}>{log.length}</span>
      </div>

      {/* Total TX */}
      <div className="flex items-center justify-between mb-2">
        <span style={labelStyle}>Total TX</span>
        <span style={{ ...valueStyle, color: "#4ADE80" }}>{totalTx}</span>
      </div>

      {/* Total RX */}
      <div className="flex items-center justify-between mb-2">
        <span style={labelStyle}>Total RX</span>
        <span style={{ ...valueStyle, color: "#FBBF24" }}>{totalRx}</span>
      </div>

      {/* SOS events */}
      <div className="flex items-center justify-between mb-3">
        <span style={labelStyle}>SOS Events</span>
        <span style={{ ...valueStyle, color: sosCount > 0 ? "#EF4444" : "#6B7280" }}>
          {sosCount}
        </span>
      </div>

      {/* Separator */}
      <div style={{ height: 1, backgroundColor: "#1A1A1A", marginBottom: 10 }} />

      {/* Protocol stack */}
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
        PROTOCOL STACK
      </div>
      <div className="flex flex-col gap-1">
        {STACK.map((s) => (
          <div key={s.layer} className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#4ADE80",
                minWidth: "48px",
              }}
            >
              {s.layer}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#6B7280",
                textAlign: "right",
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
