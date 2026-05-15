/*
 * TDL-9 MISSION CONTROL — Technical Documentation Panel
 * Design: Obsidian Tactical Grid
 * Shows Firebase JSON schema, bridge.py snippet, and Arduino serial format
 */
import { useState } from "react";

type Tab = "firebase" | "bridge" | "arduino";

const FIREBASE_SCHEMA = `// Firebase RTDB — tactical_log schema
{
  "tactical_log": {
    "-NxABC123": {
      "timestamp": "2026-05-15T06:55:38.000Z",
      "origin":    "T9-A",
      "action":    "TX",
      "text":      "SOS",
      "morse":     "...---...",
      "seq":       7
    }
  }
}`;

const BRIDGE_PY = `# bridge.py — Datalink Bridge
import serial, re, json, time
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://<project>.firebaseio.com"
})
ref = db.reference("tactical_log")

PATTERN = re.compile(
    r"\\[([^|]+)\\|([^|]+)\\|([^|]+)\\|([^\\]]+)\\]"
)

with serial.Serial("/dev/ttyUSB0", 9600) as ser:
    seq = 0
    while True:
        line = ser.readline().decode().strip()
        m = PATTERN.match(line)
        if m:
            node, action, text, morse = m.groups()
            seq += 1
            ref.push({
                "timestamp": time.strftime(
                    "%Y-%m-%dT%H:%M:%SZ",
                    time.gmtime()
                ),
                "origin": node,
                "action": action,
                "text": text,
                "morse": morse,
                "seq": seq
            })`;

const ARDUINO_FMT = `// Arduino Serial Output Format
// Node A sends letter 'V':
[T9A|SENT|V|...-]

// Node A received 'SOS':
[T9A|RCVD|SOS|...---...]

// Node B sends 'OK':
[T9B|SENT|OK|--- -.-]

// C++ snippet (Node A):
void sendMorse(char letter, String morse) {
  Serial.print("[T9A|SENT|");
  Serial.print(letter);
  Serial.print("|");
  Serial.print(morse);
  Serial.println("]");
}`;

export function TechDocsPanel() {
  const [tab, setTab] = useState<Tab>("firebase");

  const content =
    tab === "firebase"
      ? FIREBASE_SCHEMA
      : tab === "bridge"
      ? BRIDGE_PY
      : ARDUINO_FMT;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "9px",
    letterSpacing: "0.1em",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "4px 10px",
    cursor: "pointer",
    border: "none",
    backgroundColor: active ? "#1A1A1A" : "transparent",
    color: active ? "#4ADE80" : "#4B5563",
    borderBottom: active ? "1px solid #4ADE80" : "1px solid transparent",
    transition: "color 150ms ease-out",
  });

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
          marginBottom: "8px",
        }}
      >
        TECH REFERENCE
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{ borderBottom: "1px solid #1A1A1A", marginBottom: 8 }}
      >
        <button style={tabStyle(tab === "firebase")} onClick={() => setTab("firebase")}>
          Firebase
        </button>
        <button style={tabStyle(tab === "bridge")} onClick={() => setTab("bridge")}>
          Bridge.py
        </button>
        <button style={tabStyle(tab === "arduino")} onClick={() => setTab("arduino")}>
          Arduino
        </button>
      </div>

      {/* Code block */}
      <div
        style={{
          backgroundColor: "#0A0A0A",
          border: "1px solid #1A1A1A",
          padding: "8px",
          overflowX: "auto",
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <pre
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre",
          }}
        >
          {content}
        </pre>
      </div>
    </div>
  );
}
