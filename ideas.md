# TDL-9 Mission Control — Design Brainstorm

## Context
A defense-themed Tactical Operations Dashboard for a bidirectional Morse communication system between nodes T9-A and T9-B. The audience is IEEE professionals and judges. The interface must radiate high-stakes reliability, data density, and operational precision.

---

<response>
<text>
## Idea 1 — Cold War SIGINT Terminal

**Design Movement:** Retro-Futurist Military Computing (1970s–80s NORAD aesthetic, updated with modern legibility)

**Core Principles:**
1. Every pixel serves a data function — no decorative chrome
2. Amber phosphor glow on deep black creates unmistakable "live system" tension
3. Sharp-edged panel borders with hairline separators — no soft radius
4. Scanline texture overlay at 3% opacity to simulate CRT depth

**Color Philosophy:**
Background #0A0A0A (near-black), panel borders #1A1A1A. Primary data in amber (#F59E0B), secondary labels in muted grey (#6B7280). Status green (#4ADE80) for ACTIVE, red (#EF4444) for SOS/ALERT. The amber is intentional nostalgia — it signals "this is a real instrument."

**Layout Paradigm:**
Three-column asymmetric grid: narrow left column (node telemetry panels), wide center column (signal log), narrow right column (system stats / latency graph). Header spans full width with a single horizontal rule below it.

**Signature Elements:**
- Blinking cursor `█` appended to the last log entry
- Scanline CSS overlay on panels
- "CLASSIFIED: UNCLASSIFIED" banner in muted amber at header top-right

**Interaction Philosophy:**
Zero animation except for data updates — new log rows slide in from the bottom. TX/RX pulses are brief (200ms) opacity flashes on the node badge, not bouncing icons.

**Animation:**
- New log entry: translateY(8px) → 0, opacity 0 → 1, 180ms ease-out
- TX/RX pulse: background-color flash #4ADE80 → transparent, 220ms
- SOS row: red text with 1.5s repeating pulse on the row background

**Typography System:**
- Headers: `Space Grotesk` 700 weight, all-caps, letter-spacing 0.15em
- All data/logs: `JetBrains Mono` 400/500, 13px
- Labels: `Space Grotesk` 500, 11px, uppercase, #6B7280
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 2 — Modern C2 Glass Interface

**Design Movement:** Contemporary Defense HMI (think Palantir Gotham, Anduril Lattice)

**Core Principles:**
1. Data hierarchy through luminance — brightest element is always the most critical
2. Frosted glass panels with subtle inner glow borders
3. Strict monospace data with clean sans-serif structural labels
4. Micro-grid background pattern at 4% opacity for depth

**Color Philosophy:**
Deep slate background (#0F172A), panels with rgba(255,255,255,0.03) fill and 1px rgba(255,255,255,0.08) border. Tactical green (#4ADE80) for live data, amber (#FBBF24) for warnings, red (#EF4444) for SOS. Cool blue (#38BDF8) for timestamps and metadata.

**Layout Paradigm:**
Full-bleed dark canvas. Header bar fixed at top. Below: left sidebar (280px) for node telemetry, main content area for the signal log table, right mini-panel for connection topology diagram.

**Signature Elements:**
- Subtle hex-grid SVG background at very low opacity
- Node status indicators with animated ring pulse
- Connection topology mini-map showing T9-A ↔ T9-B link

**Interaction Philosophy:**
Smooth but purposeful — hover states reveal additional metadata. Log rows highlight on hover. Filter/search controls appear contextually.

**Animation:**
- Panel entrance: scale(0.98) → 1, opacity 0 → 1, 250ms ease-out, staggered 60ms
- Node pulse ring: scale(1) → scale(1.8), opacity 1 → 0, 1.2s infinite
- Log row entry: translateX(-4px) → 0, opacity 0 → 1, 160ms ease-out

**Typography System:**
- Headers: `Inter` 800, uppercase, tracking-widest
- Data: `JetBrains Mono` 13px
- Labels: `Inter` 500, 11px
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Idea 3 — Obsidian Tactical Grid (CHOSEN)

**Design Movement:** Precision Instrument UI — inspired by aviation MFD (Multi-Function Displays) and submarine sonar consoles

**Core Principles:**
1. Absolute data density — every panel has a defined role, no wasted space
2. Sharp rectangular geometry — zero border-radius on data panels, 2px border-radius max on badges
3. Functional color only — color encodes meaning, never decoration
4. Subtle dot-matrix grid background at 2% opacity to evoke graph paper / tactical maps

**Color Philosophy:**
True obsidian background (#0A0A0A). Panel fills #111111. Borders #262626 (exactly as specified). Muted grey text #A3A3A3 for secondary data. Tactical Green #4ADE80 for ACTIVE/TX. Amber #FBBF24 for WAIT/RX. Signal Red #EF4444 for SOS/URGENT. No gradients on data elements — flat, readable, authoritative.

**Layout Paradigm:**
Full-height split: fixed header (56px) → body split into left column (320px, node telemetry) and right column (flex-1, signal log). Left column has two equal-height node panels stacked vertically with a system stats panel below. The log is a dense, scrollable monospace table with sticky column headers.

**Signature Elements:**
- Dot-matrix CSS background pattern on the root
- "TX PULSE" and "RX PULSE" badge animations on node panels
- Blinking `▋` cursor on the last log entry line

**Interaction Philosophy:**
Instant feedback — no easing longer than 200ms. Hover on log rows shows full decoded data in a tooltip. SOS entries are visually distinct with red left border and red text.

**Animation:**
- TX/RX pulse badge: background flash #4ADE80/#FBBF24 → transparent, 200ms, then 800ms cooldown
- New log row: translateY(6px) → 0, opacity 0 → 1, 160ms cubic-bezier(0.23,1,0.32,1)
- SOS row: repeating 2s pulse on red background at 8% opacity
- Header clock: digit change with 80ms opacity crossfade

**Typography System:**
- Title: `Space Grotesk` 700, letter-spacing 0.12em, all-caps
- Section labels: `Space Grotesk` 500, 10px, uppercase, #6B7280, letter-spacing 0.1em
- All telemetry/log data: `JetBrains Mono` 13px, #A3A3A3
- Active values: `JetBrains Mono` 13px, #4ADE80 (green) or #EF4444 (red)
</text>
<probability>0.09</probability>
</response>

---

## Selected Design: **Idea 3 — Obsidian Tactical Grid**

This approach most faithfully implements the specification: obsidian background, sharp corners, muted grey borders, monospace data fonts, and strictly functional color encoding. It will produce the most credible, high-stakes appearance for IEEE judges evaluating a C3I system.
