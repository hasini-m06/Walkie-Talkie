/*
 * TDL-9 MISSION CONTROL — Link Topology Diagram
 * Design: Obsidian Tactical Grid
 * Visual representation of T9-A ↔ T9-B radio link
 */
import { NodeStatus } from "@/lib/tacticalData";

interface LinkTopologyProps {
  nodes: NodeStatus[];
}

export function LinkTopology({ nodes }: LinkTopologyProps) {
  const nodeA = nodes.find((n) => n.id === "T9-A");
  const nodeB = nodes.find((n) => n.id === "T9-B");
  const linkActive = nodeA?.online && nodeB?.online;

  const nodeBoxStyle = (online: boolean, isSOS: boolean): React.CSSProperties => ({
    border: `1px solid ${isSOS ? "#EF4444" : online ? "#4ADE80" : "#262626"}`,
    backgroundColor: "#0A0A0A",
    padding: "8px 12px",
    textAlign: "center",
    minWidth: 72,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  const subStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "9px",
    color: "#4B5563",
    marginTop: 2,
  };

  return (
    <div
      style={{
        border: "1px solid #262626",
        backgroundColor: "#111111",
        padding: "12px",
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "#6B7280",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        LINK TOPOLOGY
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Node A */}
        <div style={nodeBoxStyle(nodeA?.online ?? false, nodeA?.mode === "SOS")}>
          <div style={{ ...labelStyle, color: "#38BDF8" }}>T9-A</div>
          <div style={subStyle}>NANO</div>
        </div>

        {/* Link line */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: linkActive ? "#4ADE80" : "#4B5563",
              letterSpacing: "0.06em",
            }}
          >
            {linkActive ? "◄ ─ ─ ─ ►" : "◄ · · · ►"}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "8px",
              color: "#4B5563",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            2.4 GHz · Auto-ACK
          </div>
        </div>

        {/* Node B */}
        <div style={nodeBoxStyle(nodeB?.online ?? false, nodeB?.mode === "SOS")}>
          <div style={{ ...labelStyle, color: "#A78BFA" }}>T9-B</div>
          <div style={subStyle}>NANO</div>
        </div>
      </div>

      {/* Link status */}
      <div
        className="flex items-center justify-center mt-3 py-1"
        style={{
          border: `1px solid ${linkActive ? "rgba(74,222,128,0.3)" : "#1A1A1A"}`,
          backgroundColor: linkActive ? "rgba(74,222,128,0.04)" : "transparent",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.1em",
            color: linkActive ? "#4ADE80" : "#4B5563",
            fontWeight: 700,
          }}
        >
          {linkActive ? "LINK ESTABLISHED" : "LINK DOWN"}
        </span>
      </div>
    </div>
  );
}
