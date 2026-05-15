/*
 * TDL-9 MISSION CONTROL — Node Telemetry Panel
 * Design: Obsidian Tactical Grid
 * Shows node status, crypto, latency, mode, TX/RX counts, and pulse indicators
 * Font: Space Grotesk (labels), JetBrains Mono (values)
 */
import { NodeStatus } from "@/lib/tacticalData";
import { useEffect, useRef, useState } from "react";

interface NodePanelProps {
  node: NodeStatus;
}

function PulseRing({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 12, height: 12 }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: active ? "#4ADE80" : "#262626",
          transition: "background-color 200ms ease-out",
        }}
      />
      {active && (
        <div
          className="absolute animate-ring-pulse"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            border: "1px solid #4ADE80",
            top: 2,
            left: 2,
          }}
        />
      )}
    </div>
  );
}

export function NodePanel({ node }: NodePanelProps) {
  const [txFlash, setTxFlash] = useState(false);
  const [rxFlash, setRxFlash] = useState(false);
  const prevPulseKey = useRef(node.pulseKey);

  useEffect(() => {
    if (node.pulseKey !== prevPulseKey.current) {
      prevPulseKey.current = node.pulseKey;
      if (node.currentAction === "TX") {
        setTxFlash(true);
        setTimeout(() => setTxFlash(false), 1000);
      } else if (node.currentAction === "RX") {
        setRxFlash(true);
        setTimeout(() => setRxFlash(false), 1000);
      }
    }
  }, [node.pulseKey, node.currentAction]);

  const isSOS = node.mode === "SOS";
  const borderColor = isSOS ? "#EF4444" : node.online ? "#262626" : "#1A1A1A";

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

  const activeValueStyle: React.CSSProperties = {
    ...valueStyle,
    color: "#4ADE80",
  };

  const sosValueStyle: React.CSSProperties = {
    ...valueStyle,
    color: "#EF4444",
  };

  return (
    <div
      className={isSOS ? "animate-sos-pulse" : ""}
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: "#111111",
        padding: "12px",
        position: "relative",
      }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PulseRing active={node.online} />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: node.online ? "#E5E5E5" : "#6B7280",
              textTransform: "uppercase",
            }}
          >
            {node.label}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.1em",
            fontWeight: 600,
            color: node.online ? "#4ADE80" : "#EF4444",
            border: `1px solid ${node.online ? "#4ADE80" : "#EF4444"}`,
            padding: "1px 6px",
          }}
        >
          {node.online ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, backgroundColor: "#1A1A1A", marginBottom: 10 }} />

      {/* Telemetry fields */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span style={labelStyle}>Crypto Status</span>
          <span style={{ ...valueStyle, color: "#6B7280" }}>{node.cryptoStatus}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={labelStyle}>Latency</span>
          <span style={activeValueStyle}>{node.latency}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={labelStyle}>Mode</span>
          <span style={isSOS ? sosValueStyle : activeValueStyle}>{node.mode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={labelStyle}>Protocol</span>
          <span style={valueStyle}>NRF24L01</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={labelStyle}>Channel</span>
          <span style={valueStyle}>CH90</span>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, backgroundColor: "#1A1A1A", margin: "10px 0" }} />

      {/* TX / RX counters and pulse badges */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex flex-col items-center py-2"
          style={{
            border: `1px solid ${txFlash ? "#4ADE80" : "#1A1A1A"}`,
            backgroundColor: txFlash ? "rgba(74,222,128,0.08)" : "transparent",
            transition: "all 200ms ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: txFlash ? "#4ADE80" : "#6B7280",
              fontWeight: 700,
              transition: "color 200ms ease-out",
            }}
          >
            TX
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "16px",
              color: txFlash ? "#4ADE80" : "#A3A3A3",
              fontWeight: 600,
              transition: "color 200ms ease-out",
            }}
          >
            {String(node.txCount).padStart(3, "0")}
          </span>
        </div>
        <div
          className="flex-1 flex flex-col items-center py-2"
          style={{
            border: `1px solid ${rxFlash ? "#FBBF24" : "#1A1A1A"}`,
            backgroundColor: rxFlash ? "rgba(251,191,36,0.08)" : "transparent",
            transition: "all 200ms ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: rxFlash ? "#FBBF24" : "#6B7280",
              fontWeight: 700,
              transition: "color 200ms ease-out",
            }}
          >
            RX
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "16px",
              color: rxFlash ? "#FBBF24" : "#A3A3A3",
              fontWeight: 600,
              transition: "color 200ms ease-out",
            }}
          >
            {String(node.rxCount).padStart(3, "0")}
          </span>
        </div>
      </div>

      {/* SOS indicator */}
      {isSOS && (
        <div
          className="mt-2 flex items-center justify-center gap-2 py-1"
          style={{
            border: "1px solid #EF4444",
            backgroundColor: "rgba(239,68,68,0.08)",
          }}
        >
          <span
            className="animate-blink"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "#EF4444",
              fontWeight: 700,
            }}
          >
            ▲ SOS ACTIVE
          </span>
        </div>
      )}
    </div>
  );
}
