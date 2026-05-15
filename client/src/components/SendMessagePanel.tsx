/*
 * TDL-9 MISSION CONTROL — Send Message Panel
 * Design: Obsidian Tactical Grid
 * Allows judges / operators to transmit a message from the dashboard
 * to a chosen node, queued as a TX event in the signal log.
 */
import { NodeId, textToMorse } from "@/lib/tacticalData";
import { Send, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface SendMessagePanelProps {
  onSend: (text: string, origin: NodeId) => void;
}

export function SendMessagePanel({ onSend }: SendMessagePanelProps) {
  const [text, setText] = useState("");
  const [origin, setOrigin] = useState<NodeId>("T9-A");
  const [sent, setSent] = useState(false);

  const upper = text.trim().toUpperCase();
  const morse = upper ? textToMorse(upper) : "";
  const isSOS = upper === "SOS";

  const handleSend = () => {
    if (!upper) return;
    onSend(upper, origin);
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 1500);
  };

  const handleSOS = () => {
    onSend("SOS", origin);
    setSent(true);
    setTimeout(() => setSent(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const nodeBtn = (id: NodeId): React.CSSProperties => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "9px",
    letterSpacing: "0.1em",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "3px 10px",
    cursor: "pointer",
    border: `1px solid ${origin === id ? "#4ADE80" : "#262626"}`,
    backgroundColor: origin === id ? "rgba(74,222,128,0.1)" : "transparent",
    color: origin === id ? "#4ADE80" : "#6B7280",
    transition: "all 150ms ease-out",
  });

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
        TRANSMIT MESSAGE
      </div>

      {/* Node selector */}
      <div className="flex items-center gap-1 mb-2">
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "8px",
            color: "#4B5563",
            letterSpacing: "0.1em",
            fontWeight: 600,
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          FROM:
        </span>
        <button style={nodeBtn("T9-A")} onClick={() => setOrigin("T9-A")}>
          T9-A
        </button>
        <button style={nodeBtn("T9-B")} onClick={() => setOrigin("T9-B")}>
          T9-B
        </button>
      </div>

      {/* Text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 16))}
        onKeyDown={handleKeyDown}
        placeholder="TYPE MESSAGE (MAX 16)..."
        maxLength={16}
        style={{
          width: "100%",
          backgroundColor: "#0A0A0A",
          border: `1px solid ${isSOS ? "#EF4444" : "#262626"}`,
          color: isSOS ? "#EF4444" : "#E5E5E5",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          padding: "6px 8px",
          outline: "none",
          letterSpacing: "0.08em",
          boxSizing: "border-box",
          transition: "border-color 150ms ease-out",
        }}
        onFocus={(e) => { if (!isSOS) e.target.style.borderColor = "#4ADE80"; }}
        onBlur={(e) => { if (!isSOS) e.target.style.borderColor = "#262626"; }}
      />

      {/* Live Morse preview */}
      <div
        style={{
          marginTop: 6,
          padding: "5px 8px",
          backgroundColor: "#0A0A0A",
          border: "1px solid #1A1A1A",
          minHeight: 28,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: morse ? (isSOS ? "#EF4444" : "#4ADE80") : "#374151",
            letterSpacing: "0.08em",
            wordBreak: "break-all",
          }}
        >
          {morse || "· – · – ·"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleSend}
          disabled={!upper}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 0",
            backgroundColor: sent ? "rgba(74,222,128,0.15)" : upper ? "rgba(74,222,128,0.1)" : "transparent",
            border: `1px solid ${sent ? "#4ADE80" : upper ? "rgba(74,222,128,0.5)" : "#1A1A1A"}`,
            color: sent ? "#4ADE80" : upper ? "#4ADE80" : "#374151",
            cursor: upper ? "pointer" : "not-allowed",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.12em",
            fontWeight: 700,
            textTransform: "uppercase",
            transition: "all 150ms ease-out",
          }}
        >
          <Send size={11} />
          {sent ? "SENT!" : "TRANSMIT"}
        </button>

        <button
          onClick={handleSOS}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "6px 12px",
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.5)",
            color: "#EF4444",
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.12em",
            fontWeight: 700,
            textTransform: "uppercase",
            transition: "all 150ms ease-out",
          }}
        >
          <AlertTriangle size={11} />
          SOS
        </button>
      </div>
    </div>
  );
}
