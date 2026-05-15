/*
 * TDL-9 MISSION CONTROL — Tactical Data Types & Mock Simulation
 * Design: Obsidian Tactical Grid
 * Simulates Firebase RTDB tactical_log entries for demo/presentation
 */

export type NodeId = "T9-A" | "T9-B";
export type ActionType = "TX" | "RX";

export interface TacticalLogEntry {
  id: string;
  timestamp: string; // ISO 8601 UTC
  origin: NodeId;
  action: ActionType;
  decodedText: string;
  morseCode: string;
  isSOS: boolean;
  seqNum: number;
}

export interface NodeStatus {
  id: NodeId;
  label: string;
  online: boolean;
  cryptoStatus: "DISABLED" | "ENABLED" | "ERROR";
  latency: string;
  mode: "MANUAL" | "SOS" | "STANDBY";
  lastSeen: string;
  txCount: number;
  rxCount: number;
  currentAction: ActionType | null;
  pulseKey: number; // increment to re-trigger animation
}

// Morse code lookup table
export const MORSE_TABLE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.",
  SOS: "...---...",
};

export function textToMorse(text: string): string {
  if (text === "SOS") return MORSE_TABLE["SOS"];
  return text
    .toUpperCase()
    .split("")
    .map((c) => MORSE_TABLE[c] ?? "?")
    .join(" ");
}

// Seed log entries for initial display
export const SEED_LOG: TacticalLogEntry[] = [
  {
    id: "log-001",
    timestamp: new Date(Date.now() - 62000).toISOString(),
    origin: "T9-A",
    action: "TX",
    decodedText: "ALPHA",
    morseCode: ".- .-.. .--. .... .-",
    isSOS: false,
    seqNum: 1,
  },
  {
    id: "log-002",
    timestamp: new Date(Date.now() - 58000).toISOString(),
    origin: "T9-B",
    action: "RX",
    decodedText: "ALPHA",
    morseCode: ".- .-.. .--. .... .-",
    isSOS: false,
    seqNum: 2,
  },
  {
    id: "log-003",
    timestamp: new Date(Date.now() - 51000).toISOString(),
    origin: "T9-B",
    action: "TX",
    decodedText: "BRAVO",
    morseCode: "-... .-. .- ...- ---",
    isSOS: false,
    seqNum: 3,
  },
  {
    id: "log-004",
    timestamp: new Date(Date.now() - 47000).toISOString(),
    origin: "T9-A",
    action: "RX",
    decodedText: "BRAVO",
    morseCode: "-... .-. .- ...- ---",
    isSOS: false,
    seqNum: 4,
  },
  {
    id: "log-005",
    timestamp: new Date(Date.now() - 38000).toISOString(),
    origin: "T9-A",
    action: "TX",
    decodedText: "V",
    morseCode: "...-",
    isSOS: false,
    seqNum: 5,
  },
  {
    id: "log-006",
    timestamp: new Date(Date.now() - 34000).toISOString(),
    origin: "T9-B",
    action: "RX",
    decodedText: "V",
    morseCode: "...-",
    isSOS: false,
    seqNum: 6,
  },
  {
    id: "log-007",
    timestamp: new Date(Date.now() - 22000).toISOString(),
    origin: "T9-A",
    action: "TX",
    decodedText: "SOS",
    morseCode: "...---...",
    isSOS: true,
    seqNum: 7,
  },
  {
    id: "log-008",
    timestamp: new Date(Date.now() - 18000).toISOString(),
    origin: "T9-B",
    action: "RX",
    decodedText: "SOS",
    morseCode: "...---...",
    isSOS: true,
    seqNum: 8,
  },
  {
    id: "log-009",
    timestamp: new Date(Date.now() - 9000).toISOString(),
    origin: "T9-B",
    action: "TX",
    decodedText: "OK",
    morseCode: "--- -.-",
    isSOS: false,
    seqNum: 9,
  },
  {
    id: "log-010",
    timestamp: new Date(Date.now() - 5000).toISOString(),
    origin: "T9-A",
    action: "RX",
    decodedText: "OK",
    morseCode: "--- -.-",
    isSOS: false,
    seqNum: 10,
  },
];

// Simulation messages pool
export const SIMULATION_POOL: Array<{
  text: string;
  morse: string;
  isSOS: boolean;
}> = [
  { text: "ALPHA", morse: ".- .-.. .--. .... .-", isSOS: false },
  { text: "BRAVO", morse: "-... .-. .- ...- ---", isSOS: false },
  { text: "CHARLIE", morse: "-.-. .... .- .-. .-.. .. .", isSOS: false },
  { text: "DELTA", morse: "-.. . .-.. - .-", isSOS: false },
  { text: "ECHO", morse: ". -.-. .... ---", isSOS: false },
  { text: "FOXTROT", morse: "..-. --- -..- - .-. --- -", isSOS: false },
  { text: "GOLF", morse: "--. --- .-.. ..-..", isSOS: false },
  { text: "HOTEL", morse: ".... --- - . .-..", isSOS: false },
  { text: "V", morse: "...-", isSOS: false },
  { text: "OK", morse: "--- -.-", isSOS: false },
  { text: "GO", morse: "--. ---", isSOS: false },
  { text: "ACK", morse: ".- -.-. -.-", isSOS: false },
  { text: "NAK", morse: "-. .- -.-", isSOS: false },
  { text: "SOS", morse: "...---...", isSOS: true },
  { text: "HELP", morse: ".... . .-.. .--.", isSOS: false },
  { text: "READY", morse: ".-. . .- -.. -.--", isSOS: false },
];
