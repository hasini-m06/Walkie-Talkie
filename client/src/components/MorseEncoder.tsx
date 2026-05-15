/*
 * TDL-9 MISSION CONTROL — Morse Encoder Panel
 * Design: Obsidian Tactical Grid
 * Interactive text → Morse converter for demo/presentation
 */
import { MORSE_TABLE, textToMorse } from "@/lib/tacticalData";
import { useState } from "react";

export function MorseEncoder() {
  const [input, setInput] = useState("");
  const morse = input.trim() ? textToMorse(input.trim().toUpperCase()) : "";

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

      {/* Quick reference */}
      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 2,
        }}
      >
        {Object.entries(MORSE_TABLE)
          .filter(([k]) => k.length === 1 && isNaN(Number(k)))
          .slice(0, 12)
          .map(([letter, code]) => (
            <div
              key={letter}
              style={{
                backgroundColor: "#0A0A0A",
                border: "1px solid #1A1A1A",
                padding: "2px 4px",
                textAlign: "center",
              }}
            >
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
                  fontSize: "8px",
                  color: "#4B5563",
                  letterSpacing: "0.04em",
                }}
              >
                {code}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
