# TDL-9 Mission Control — Tactical C3I Dashboard

![Header Image](https://img.shields.io/badge/Tactical_Operations-Active-4ADE80?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Encrypted_Link-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-React_Hardware_Bridge-0A0A0A?style=for-the-badge)

## 🎯 The Mission
**TDL-9 Mission Control** is a high-stakes, professional-grade Command, Control, Communications, and Intelligence (C3I) dashboard. Developed specifically for the IEEE tactical radio competition, it transforms raw Morse code signals into an actionable, data-dense operational map. 

While typical radio software focuses on simple text output, TDL-9 provides a full **Mission Command** experience—monitoring unit health, radio link topology, and environmental telemetry in real-time, ensuring operators have total situational awareness in high-pressure field environments.

---

## ⚡ Feature Showcase

### 🛰️ Live Unit Telemetry (Unit Health)
The dashboard provides a deep-dive into the physical state of every deployed node (**T9-A** & **T9-B**). Beyond simple connectivity, it tracks:
- **Signal Integrity (RSSI):** High-resolution radio signal strength visualization.
- **Power Management:** Precise battery voltage and percentage monitoring.
- **Environmental Awareness:** Real-time temperature sensors to prevent field hardware failure.
- **Crypto-Handshake:** Visual confirmation of the secure datalink between units.

### 📜 Intelligent Signal Intercept
A sophisticated monospace data stream that does more than just log characters:
- **Instant Morse-to-Text:** On-the-fly decoding of radio pulses into human-readable alphanumeric text.
- **Urgent Alert System:** Automated recognition of **SOS** patterns, triggering dashboard-wide visual overrides and operator alerts.
- **Sequence Integrity:** Tracking of packet sequence numbers to identify signal drops in high-interference zones.
- **The "Blinking Cursor":** A retro-futurist terminal aesthetic that provides immediate visual feedback for live incoming data.

### 🎮 Direct Command Uplink
Operators can act as the central hub of the mission, sending instructions back to the field:
- **Dual-Mode Transmission:** Type directly to encode text into Morse, or manually sequence dots and dashes for tactical precision.
- **Hardware Feedback Loop:** Every transmitted command is tracked until the field unit acknowledges (ACK) receipt.
- **Emergency Override:** A dedicated SOS trigger to broadcast priority signals across the entire radio network.

### 🖥️ Virtual OLED Mirroring
To ensure parity between the operator and the field technician, the dashboard features a **Digital Twin** of the physical hardware. The 128x64 OLED display found on the Arduino nodes is mirrored exactly in the software, allowing operators to see exactly what the field unit is displaying.

### 🗺️ Network Topology Visualization
A dynamic map that renders the "invisible" radio network. It visualizes the active links between nodes, showing path quality and routing logic, critical for identifying dead zones or interference patterns during a mission.

---

## 🎨 The "Obsidian" Design Language
TDL-9 is built on the **Obsidian Tactical Grid** design philosophy—a system engineered for **Zero Cognitive Load**.
- **High Contrast, Low Fatigue:** Deep obsidian blacks (`#0A0A0A`) reduce eye strain during long-duration monitoring.
- **Functional Color Encoding:** Colors are never decorative. **Green** is Active, **Amber** is Wait/RX, and **Red** is Urgent/SOS.
- **Monospace Precision:** Every data point is rendered in `JetBrains Mono` for maximum legibility in high-stakes environments.
- **Rectangular Geometry:** Sharp, zero-radius panels evoke the rugged reliability of military Multi-Function Displays (MFDs).

---

## 🛠️ Technical Implementation
The system is a multi-tier architectural bridge:
- **Hardware:** Arduino Nano + NRF24L01+ (2.4GHz) + I2C OLED Displays.
- **Bridge:** Python-based serial ingestion layer for high-frequency data throughput.
- **Realtime:** Supabase-backed live synchronization with sub-100ms latency.
- **Frontend:** React 19 + Tailwind 4, utilizing a custom-built tactical component library.

---

## 🚀 Quick Start (Development)
For developers looking to run the dashboard simulation:
1. `pnpm install` — Install tactical dependencies.
2. `npm run dev` — Launch the Mission Control interface.
3. Observe the simulated telemetry and signal logs to test the C3I logic.

**Team 9 | CH90 | IEEE Project Demo**
