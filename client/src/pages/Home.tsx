/*
 * TDL-9 MISSION CONTROL — Main Dashboard Page
 * Design: Obsidian Tactical Grid
 * Layout: Fixed header → Left column (telemetry) + Right column (signal log + footer bar)
 * Background: Dot-matrix tactical grid pattern
 * Fonts: Space Grotesk (titles/labels), JetBrains Mono (data)
 */
import { LinkTopology } from "@/components/LinkTopology";
import { MorseEncoder } from "@/components/MorseEncoder";
import { NodePanel } from "@/components/NodePanel";
import { SignalLog } from "@/components/SignalLog";
import { SystemStatsPanel } from "@/components/SystemStatsPanel";
import { TacticalHeader } from "@/components/TacticalHeader";
import { TechDocsPanel } from "@/components/TechDocsPanel";
import { useTacticalSimulation } from "@/hooks/useTacticalSimulation";

export default function Home() {
  const { log, nodes, sosAlert } = useTacticalSimulation();

  return (
    <div
      className="tactical-grid-bg"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed header */}
      <TacticalHeader sosAlert={sosAlert} />

      {/* Main content area — offset by header height */}
      <div
        style={{
          marginTop: 56,
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        {/* Left column — Telemetry */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid #262626",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Column header */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #1A1A1A",
              backgroundColor: "#0A0A0A",
              flexShrink: 0,
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "#4B5563",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              NODE TELEMETRY
            </span>
          </div>

          {/* Node panels */}
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {nodes.map((node) => (
              <NodePanel key={node.id} node={node} />
            ))}

            {/* Link topology */}
            <LinkTopology nodes={nodes} />

            {/* System stats */}
            <SystemStatsPanel log={log} nodes={nodes} />

            {/* Morse encoder */}
            <MorseEncoder />

            {/* Tech reference docs */}
            <TechDocsPanel />

            {/* Bottom padding */}
            <div style={{ height: 16 }} />
          </div>
        </div>

        {/* Right column — Signal Log + Footer */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Signal log — fills available height */}
          <div style={{ flex: 1, overflow: "hidden", padding: 8, paddingBottom: 0 }}>
            <SignalLog log={log} />
          </div>

          {/* Footer info bar */}
          <div
            style={{
              flexShrink: 0,
              borderTop: "1px solid #1A1A1A",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0A0A0A",
            }}
          >
            <div className="flex items-center gap-4">
              {[
                { label: "PHYSICAL", value: "2× Arduino Nano" },
                { label: "TRANSPORT", value: "NRF24L01 + Auto-ACK" },
                { label: "APPLICATION", value: "Serial JSON" },
                { label: "DATALINK", value: "Python Bridge" },
                { label: "PRESENTATION", value: "React / Firebase RTDB" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "8px",
                      letterSpacing: "0.1em",
                      color: "#4B5563",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}:
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      color: "#6B7280",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: "#4B5563",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              TEAM 9 · CH90 · IEEE DEMO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
