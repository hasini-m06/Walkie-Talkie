/*
 * TDL-9 MISSION CONTROL — Tactical Simulation Hook
 * Simulates Firebase RTDB real-time updates for demo purposes.
 * In production, replace with Firebase onValue listener on tactical_log.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NodeId,
  NodeStatus,
  SEED_LOG,
  SIMULATION_POOL,
  TacticalLogEntry,
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
  },
];

export function useTacticalSimulation() {
  const [log, setLog] = useState<TacticalLogEntry[]>(SEED_LOG);
  const [nodes, setNodes] = useState<NodeStatus[]>(INITIAL_NODES);
  const [sosAlert, setSosAlert] = useState(false);
  const seqRef = useRef(SEED_LOG.length + 1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
            };
          }
          return n;
        })
      );
      // Reset action after pulse duration
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? { ...n, currentAction: null, mode: isSOS ? "SOS" : "MANUAL" }
              : n
          )
        );
      }, 1200);
    },
    []
  );

  const addLogEntry = useCallback(
    (entry: TacticalLogEntry) => {
      setLog((prev) => {
        const updated = [entry, ...prev];
        return updated.slice(0, 200); // cap at 200 entries
      });

      // Determine sender and receiver
      const senderNode = entry.origin;
      const receiverNode: NodeId = entry.origin === "T9-A" ? "T9-B" : "T9-A";

      if (entry.action === "TX") {
        triggerNodePulse(senderNode, "TX", entry.isSOS);
        // Simulate RX on the other node 300ms later
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
        }, 320);
      }
    },
    [triggerNodePulse]
  );

  // Schedule next simulation event
  const scheduleNext = useCallback(() => {
    const delay = 4000 + Math.random() * 6000; // 4–10s
    timerRef.current = setTimeout(() => {
      const pool = SIMULATION_POOL;
      const msg = pool[Math.floor(Math.random() * pool.length)];
      const origin: NodeId = Math.random() > 0.5 ? "T9-A" : "T9-B";

      const entry: TacticalLogEntry = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        origin,
        action: "TX",
        decodedText: msg.text,
        morseCode: msg.morse,
        isSOS: msg.isSOS,
        seqNum: seqRef.current++,
      };

      addLogEntry(entry);
      scheduleNext();
    }, delay);
  }, [addLogEntry]);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext]);

  // Dismiss SOS alert after 8s
  useEffect(() => {
    if (sosAlert) {
      const t = setTimeout(() => setSosAlert(false), 8000);
      return () => clearTimeout(t);
    }
  }, [sosAlert]);

  return { log, nodes, sosAlert };
}
