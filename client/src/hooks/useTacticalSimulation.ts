/*
 * TDL-9 MISSION CONTROL — Tactical Simulation Hook
 * Simulates Firebase RTDB real-time updates for demo purposes.
 * In production, replace with Supabase Realtime subscription on tactical_log.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NodeId,
  NodeStatus,
  SEED_LOG,
  SIMULATION_POOL,
  TacticalLogEntry,
  textToMorse,
} from "@/lib/tacticalData";
import { nanoid } from "nanoid";

const INITIAL_NODES: NodeStatus[] = [
  {
    id: "T9-A",
    label: "NODE 9A",
    online: true,
    cryptoStatus: "DISABLED",
    latency: "<48ms",
    mode: "MANUAL",
    lastSeen: new Date().toISOString(),
    txCount: 5,
    rxCount: 5,
    currentAction: null,
    pulseKey: 0,
    signalQuality: 87,
    buzzerActive: false,
  },
  {
    id: "T9-B",
    label: "NODE 9B",
    online: true,
    cryptoStatus: "DISABLED",
    latency: "<52ms",
    mode: "MANUAL",
    lastSeen: new Date().toISOString(),
    txCount: 5,
    rxCount: 5,
    currentAction: null,
    pulseKey: 0,
    signalQuality: 82,
    buzzerActive: false,
  },
];

/** Play a short beep via Web Audio API. SOS plays the full pattern. */
function playBeep(isSOS: boolean) {
  try {
    const ctx = new AudioContext();
    const tone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.02);
    };
    if (isSOS) {
      // S O S — short short short | long long long | short short short
      [0, 0.15, 0.3].forEach((t) => tone(1200, t, 0.1));
      [0.55, 0.8, 1.05].forEach((t) => tone(880, t, 0.2));
      [1.4, 1.55, 1.7].forEach((t) => tone(1200, t, 0.1));
    } else {
      tone(660, 0, 0.12);
    }
  } catch {
    // Audio context unavailable (e.g. no user gesture yet) — silently ignore
  }
}

export function useTacticalSimulation() {
  const [log, setLog] = useState<TacticalLogEntry[]>(SEED_LOG);
  const [nodes, setNodes] = useState<NodeStatus[]>(INITIAL_NODES);
  const [sosAlert, setSosAlert] = useState(false);
  const seqRef = useRef(SEED_LOG.length + 1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gently fluctuate signal quality every 3 s to look live
  useEffect(() => {
    const id = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          signalQuality: Math.min(
            99,
            Math.max(58, n.signalQuality + (Math.random() - 0.5) * 5)
          ),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const triggerNodePulse = useCallback(
    (nodeId: NodeId, action: "TX" | "RX", isSOS: boolean) => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              currentAction: action,
              pulseKey: n.pulseKey + 1,
              mode: isSOS ? "SOS" : "MANUAL",
              lastSeen: new Date().toISOString(),
              txCount: action === "TX" ? n.txCount + 1 : n.txCount,
              rxCount: action === "RX" ? n.rxCount + 1 : n.rxCount,
              buzzerActive: action === "RX" || isSOS,
            };
          }
          return n;
        })
      );
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? { ...n, currentAction: null, mode: isSOS ? "SOS" : "MANUAL", buzzerActive: false }
              : n
          )
        );
      }, 1200);
    },
    []
  );

  const addLogEntry = useCallback(
    (entry: TacticalLogEntry) => {
      setLog((prev) => [entry, ...prev].slice(0, 200));

      const senderNode = entry.origin;
      const receiverNode: NodeId = entry.origin === "T9-A" ? "T9-B" : "T9-A";

      if (entry.action === "TX") {
        triggerNodePulse(senderNode, "TX", entry.isSOS);
        setTimeout(() => {
          const rxEntry: TacticalLogEntry = {
            id: nanoid(),
            timestamp: new Date().toISOString(),
            origin: receiverNode,
            action: "RX",
            decodedText: entry.decodedText,
            morseCode: entry.morseCode,
            isSOS: entry.isSOS,
            seqNum: seqRef.current++,
          };
          setLog((prev) => [rxEntry, ...prev].slice(0, 200));
          triggerNodePulse(receiverNode, "RX", entry.isSOS);
          if (entry.isSOS) setSosAlert(true);
          playBeep(entry.isSOS);
        }, 320);
      }
    },
    [triggerNodePulse]
  );

  /** Manually send a message from the dashboard (queued as TX from chosen node). */
  const sendMessage = useCallback(
    (text: string, origin: NodeId = "T9-A") => {
      const upper = text.trim().toUpperCase();
      if (!upper) return;
      const isSOS = upper === "SOS";
      const entry: TacticalLogEntry = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        origin,
        action: "TX",
        decodedText: upper,
        morseCode: textToMorse(upper),
        isSOS,
        seqNum: seqRef.current++,
      };
      addLogEntry(entry);
    },
    [addLogEntry]
  );

  const scheduleNext = useCallback(() => {
    const delay = 4000 + Math.random() * 6000;
    timerRef.current = setTimeout(() => {
      const msg = SIMULATION_POOL[Math.floor(Math.random() * SIMULATION_POOL.length)];
      const origin: NodeId = Math.random() > 0.5 ? "T9-A" : "T9-B";
      addLogEntry({
        id: nanoid(),
        timestamp: new Date().toISOString(),
        origin,
        action: "TX",
        decodedText: msg.text,
        morseCode: msg.morse,
        isSOS: msg.isSOS,
        seqNum: seqRef.current++,
      });
      scheduleNext();
    }, delay);
  }, [addLogEntry]);

  useEffect(() => {
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scheduleNext]);

  useEffect(() => {
    if (sosAlert) {
      const t = setTimeout(() => setSosAlert(false), 8000);
      return () => clearTimeout(t);
    }
  }, [sosAlert]);

  return { log, nodes, sosAlert, sendMessage };
}
