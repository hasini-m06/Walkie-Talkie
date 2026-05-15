/*
 * TDL-9 MISSION CONTROL — Morse Encoder Panel
 * Design: Obsidian Tactical Grid
 * Interactive text → Morse converter + full A-Z / 0-9 reference grid
 */
import { MORSE_TABLE, textToMorse } from "@/lib/tacticalData";
import { useState } from "react";

export function MorseEncoder() {
  const [input, setInput] = useState("");
  const morse = input.trim() ? textToMorse(input.trim().toUpperCase()) : "";

  const letters = Object.entries(MORSE_TABLE).filter(([k]) => isNaN(Number(k)) && k !== "SOS");
  const digits = Object.entries(MORSE_TABLE).filter(([k]) => !isNaN(Number(k)));

  const cellStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0A",
    border: "1px solid #1A1A1A",
    padding: "3px 2px",
    textAlign: "center",
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
          marginBottom: "10px",
        }}
      >
        MORSE ENCODER
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase().slice(0, 20))}
        placeholder="TYPE TEXT..."
        maxLength={20}
        style={{
          width: "100%",
          backgroundColor: "#0A0A0A",
          border: "1px solid #262626",
          color: "#E5E5E5",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          padding: "6px 8px",
          outline: "none",
          letterSpacing: "0.08em",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4ADE80")}
        onBlur={(e) => (e.target.style.borderColor = "#262626")}
      />

      <div
        style={{
          marginTop: 8,
          padding: "8px",
          backgroundColor: "#0A0A0A",
          border: "1px solid #1A1A1A",
          minHeight: 36,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: morse ? "#4ADE80" : "#4B5563",
            letterSpacing: "0.08em",
            wordBreak: "break-all",
          }}
        >
          {morse || "· · · — — — · · ·"}
        </span>
      </div>

      {/* Letters A–Z */}
      <div
        style={{
          marginTop: 10,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "8px",
          color: "#4B5563",
          letterSpacing: "0.1em",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        A – Z
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 2,
        }}
      >
        {letters.map(([letter, code]) => (
          <div key={letter} style={cellStyle}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "#4ADE80",
                fontWeight: 700,
              }}
            >
              {letter}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "7px",
                color: "#4B5563",
                letterSpacing: "0.02em",
              }}
            >
              {code}
            </div>
          </div>
        ))}
      </div>

      {/* Digits 0–9 */}
      <div
        style={{
          marginTop: 8,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "8px",
          color: "#4B5563",
          letterSpacing: "0.1em",
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        0 – 9
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
        }}
      >
        {digits.map(([digit, code]) => (
          <div key={digit} style={cellStyle}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "#FBBF24",
                fontWeight: 700,
              }}
            >
              {digit}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "7px",
                color: "#4B5563",
                letterSpacing: "0.02em",
              }}
            >
              {code}
            </div>
          </div>
        ))}
      </div>

      {/* SOS special */}
      <div style={{ marginTop: 6 }}>
        <div style={{ ...cellStyle, display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "9px", color: "#EF4444", fontWeight: 700 }}>
            SOS
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#4B5563" }}>
            · · · — — — · · ·
          </span>
        </div>
      </div>
    </div>
  );
}
