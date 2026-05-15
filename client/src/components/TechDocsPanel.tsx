/*
 * TDL-9 MISSION CONTROL — Technical Documentation Panel
 * Design: Obsidian Tactical Grid
 * Tabs: Supabase schema | bridge.py | Arduino serial format | Circuit diagram
 */
import { useState } from "react";

type Tab = "supabase" | "bridge" | "arduino" | "circuit";

const SUPABASE_SCHEMA = `-- Supabase (Postgres) — tactical_log table
create table tactical_log (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  origin       text not null,   -- 'T9-A' or 'T9-B'
  action       text not null,   -- 'TX' or 'RX'
  decoded_text text not null,
  morse_code   text not null,
  is_sos       boolean default false,
  seq_num      integer
);

-- node_status table
create table node_status (
  id         text primary key,  -- 'T9-A' or 'T9-B'
  online     boolean default false,
  last_seen  timestamptz,
  tx_count   integer default 0,
  rx_count   integer default 0
);

-- Enable Realtime on both tables
alter publication supabase_realtime
  add table tactical_log, node_status;`;

const BRIDGE_PY = `# bridge.py — Serial → Supabase Datalink Bridge
# Reads JSON lines from COM13 (T9-A) and COM3 (T9-B)
# Pushes rows to Supabase tactical_log via REST API

import serial, json, time
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
sb = create_client(os.getenv("SUPABASE_URL"),
                   os.getenv("SUPABASE_SERVICE_KEY"))

PORTS = {"T9-A": "COM13", "T9-B": "COM3"}
BAUD  = 9600

def handle_line(node_id: str, line: str, seq: int):
    try:
        d = json.loads(line.strip())
        sb.table("tactical_log").insert({
            "origin":       node_id,
            "action":       d["action"],   # TX or RX
            "decoded_text": d["text"],
            "morse_code":   d["morse"],
            "is_sos":       d.get("sos", False),
            "seq_num":      seq,
        }).execute()
    except Exception as e:
        print(f"[{node_id}] parse error: {e}")

# Open both ports and read in round-robin
serials = {nid: serial.Serial(port, BAUD, timeout=0.1)
           for nid, port in PORTS.items()}
seq = 0
while True:
    for nid, ser in serials.items():
        line = ser.readline().decode(errors="ignore")
        if line.strip():
            seq += 1
            handle_line(nid, line, seq)`;

const ARDUINO_FMT = `// Arduino Serial Output Format (JSON lines)
// Each Arduino prints one JSON object per event:

// Node T9-A transmits letter 'V':
{"action":"TX","text":"V","morse":"...-","sos":false}

// Node T9-B receives 'SOS':
{"action":"RX","text":"SOS","morse":"...---...","sos":true}

// C++ snippet — paste in both sketches:
void serialReport(const char* action,
                  const char* text,
                  const char* morse,
                  bool sos) {
  Serial.print("{\"action\":\"");
  Serial.print(action);          // "TX" or "RX"
  Serial.print("\",\"text\":\"");
  Serial.print(text);
  Serial.print("\",\"morse\":\"");
  Serial.print(morse);
  Serial.print("\",\"sos\":");
  Serial.print(sos ? "true" : "false");
  Serial.println("}");
}`;

const CIRCUIT = `NRF24L01+ → Arduino Nano Wiring
(same pinout for both T9-A and T9-B)

NRF24L01  │ Arduino Nano
──────────┼──────────────
VCC       │ 3.3V  (NOT 5V!)
GND       │ GND
CE        │ D9
CSN       │ D10
SCK       │ D13  (SPI CLK)
MOSI      │ D11  (SPI MOSI)
MISO      │ D12  (SPI MISO)
IRQ       │ (not connected)

OLED SSD1306 (I2C):
VCC  → 3.3V / 5V
GND  → GND
SCL  → A5
SDA  → A4

Buzzer (passive):
(+) → D6 (PWM)  via 100Ω resistor
(-) → GND

Note: Add 100µF cap across NRF24L01
VCC/GND to stabilise 3.3V rail.`;

const CONTENT: Record<Tab, string> = {
  supabase: SUPABASE_SCHEMA,
  bridge: BRIDGE_PY,
  arduino: ARDUINO_FMT,
  circuit: CIRCUIT,
};

const TABS: { id: Tab; label: string }[] = [
  { id: "supabase", label: "Supabase" },
  { id: "bridge", label: "Bridge.py" },
  { id: "arduino", label: "Arduino" },
  { id: "circuit", label: "Circuit" },
];

export function TechDocsPanel() {
  const [tab, setTab] = useState<Tab>("supabase");

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
      <div className="flex" style={{ borderBottom: "1px solid #1A1A1A", marginBottom: 8 }}>
        {TABS.map((t) => (
          <button key={t.id} style={tabStyle(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
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
            color: tab === "circuit" ? "#4ADE80" : "#6B7280",
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre",
          }}
        >
          {CONTENT[tab]}
        </pre>
      </div>
    </div>
  );
}
