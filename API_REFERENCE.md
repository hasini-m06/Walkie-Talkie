# TDL-9 API Reference

Complete API documentation for TDL-9 Mission Control.

---

## 🔤 Morse Codec API

### `textToMorse(text: string): string`

Converts English text to Morse code representation.

**Parameters:**
- `text` (string): Input text (case-insensitive, A-Z 0-9 and common punctuation)

**Returns:**
- (string): Morse code with `|` as character separator, `/` as word separator

**Throws:**
- Error if character not in MORSE_TABLE

**Example:**

```typescript
import { textToMorse } from '@/lib/tacticalData';

const morse = textToMorse('HELLO');
// Returns: '···· | · | ·-·· | ·-·· | ---'

const sos = textToMorse('SOS');
// Returns: '··· | --- | ···'

// Spaces become word separators
const sentence = textToMorse('HELLO WORLD');
// Returns: '···· | · | ·-·· | ·-·· | --- / ·-- | --- | ·-· | ·- | ·-··'
```

**Supported Characters:**
- Letters: A-Z (case-insensitive)
- Numbers: 0-9
- Punctuation: . , ? / @ ! ' " : ; = + - _ ( ) [ ] { }

---

### `morseToText(morse: string): string`

Converts Morse code back to English text.

**Parameters:**
- `morse` (string): Morse code with `|` separator for characters, `/` for words

**Returns:**
- (string): Decoded text in uppercase

**Throws:**
- Error if Morse pattern not in MORSE_TABLE

**Example:**

```typescript
import { morseToText } from '@/lib/tacticalData';

const text = morseToText('·─ | ─··');
// Returns: 'AB'

const sos = morseToText('··· | --- | ···');
// Returns: 'SOS'

// Flexible spacing variations allowed
const flexible = morseToText('· ─  │ ─··');
// Returns: 'AB' (automatically normalizes)
```

---

### `detectSOS(input: string): boolean`

Detects SOS pattern in text or Morse input.

**Parameters:**
- `input` (string): Either text "SOS" or Morse "··· --- ···" or mixed

**Returns:**
- (boolean): true if SOS pattern detected, false otherwise

**Example:**

```typescript
import { detectSOS } from '@/lib/tacticaldata';

// Detect in text
detectSOS('SOS');           // true
detectSOS('HELP');          // false
detectSOS('SOS RECEIVED');  // true (substring match)

// Detect in Morse
detectSOS('··· | --- | ···');  // true
detectSOS('···');              // false

// Case insensitive
detectSOS('sos');           // true
```

---

### `MORSE_TABLE: Record<string, string>`

Lookup table for all supported characters.

**Type:**

```typescript
const MORSE_TABLE: Record<string, string> = {
  'A': '·─',
  'B': '─···',
  'C': '─·─·',
  // ... etc
  '0': '─────',
  '1': '·────',
  // ... etc
  '.': '·────·',
  ',': '──··──',
  // ... etc
  'SOS': '···|---|···'
};
```

**Usage:**

```typescript
import { MORSE_TABLE } from '@/lib/tacticalData';

// Look up a character
const morseA = MORSE_TABLE['A'];  // '·─'

// Check if character is supported
if (MORSE_TABLE[char]) {
  // Character is supported
}

// Iterate all characters
Object.entries(MORSE_TABLE).forEach(([char, morse]) => {
  console.log(`${char} = ${morse}`);
});
```

---

## 🎣 Hooks API

### `useTacticalSimulation(): TacticalState`

Main simulation hook providing realistic telemetry and message generation.

**Returns:**

```typescript
interface TacticalState {
  // RSSI (Signal Strength)
  rssi: number;              // -120 to -40 dBm
  
  // Battery
  batteryVoltage: number;    // 0.0 to 5.0 V
  batteryPercent: number;    // 0 to 100%
  
  // Temperature
  temperature: number;       // 15 to 40°C
  
  // Status
  isOnline: boolean;         // Link status
  lastUpdate: Date;          // Last update timestamp
  
  // Messages
  newMessage?: Message;      // Latest message
  allMessages: Message[];    // All messages
  
  // SOS
  sosTriggered: boolean;     // SOS active
  
  // Unit Information
  units: Record<string, Unit>;  // T9-A, T9-B
}

interface Message {
  id: string;
  sender: string;
  content: string;
  morse: string;
  timestamp: Date;
  sos: boolean;
}

interface Unit {
  id: string;
  status: 'active' | 'idle' | 'offline';
  rssi: number;
  battery: number;
  temperature: number;
}
```

**Example:**

```typescript
import { useTacticalSimulation } from '@/hooks/useTacticalSimulation';

function Dashboard() {
  const state = useTacticalSimulation();
  
  return (
    <div>
      <p>RSSI: {state.rssi} dBm</p>
      <p>Battery: {state.batteryPercent}%</p>
      <p>Temp: {state.temperature}°C</p>
      
      {state.sosTriggered && <p>⚠️ SOS ACTIVE</p>}
      
      {state.newMessage && (
        <p>Message: {state.newMessage.content}</p>
      )}
    </div>
  );
}
```

---

### `useUTCClock(): { hours: number; minutes: number; seconds: number; }`

Provides real-time UTC clock for dashboard display.

**Returns:**

```typescript
interface UTCTime {
  hours: number;     // 0-23
  minutes: number;   // 0-59
  seconds: number;   // 0-59
  iso: string;       // ISO 8601 string
}
```

**Example:**

```typescript
import { useUTCClock } from '@/hooks/useUTCClock';

function TacticalHeader() {
  const clock = useUTCClock();
  
  return (
    <div>
      {String(clock.hours).padStart(2, '0')}:
      {String(clock.minutes).padStart(2, '0')}:
      {String(clock.seconds).padStart(2, '0')} UTC
    </div>
  );
}
```

---

### `useMobile(): boolean`

Detects if device is mobile (viewport < 768px).

**Returns:**
- (boolean): true if mobile, false otherwise

**Example:**

```typescript
import { useMobile } from '@/hooks/useMobile';

function ResponsiveLayout() {
  const isMobile = useMobile();
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

---

## 🌐 Supabase API

### Database Schemas

#### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender VARCHAR(10) NOT NULL,      -- 'T9-A', 'T9-B', 'Control'
  content TEXT NOT NULL,             -- Decoded message text
  morse_sequence TEXT,               -- Morse representation
  sequence_num INT,                  -- 0-65535 packet counter
  sos_priority BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMP DEFAULT NOW(),
  ack_received BOOLEAN DEFAULT FALSE,
  latency_ms INT,
  
  FOREIGN KEY (sender) REFERENCES units(id)
);

-- Indexes
CREATE INDEX idx_messages_sender ON messages(sender);
CREATE INDEX idx_messages_received_at ON messages(received_at DESC);
CREATE INDEX idx_messages_sos ON messages(sos_priority) WHERE sos_priority = true;
```

**Inserting a Message:**

```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    sender: 'T9-A',
    content: 'HELLO WORLD',
    morse_sequence: '···· | · | ·-·· | ·-·· | --- / ·-- | --- | ·-· | ·- | ·-··',
    sequence_num: 42,
    sos_priority: false,
  });

if (error) console.error('Insert failed:', error);
else console.log('Message saved:', data);
```

**Subscribing to New Messages:**

```typescript
const channel = supabase
  .channel('public:messages')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Cleanup on unmount
channel.unsubscribe();
```

#### Telemetry Table

```sql
CREATE TABLE telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id VARCHAR(10) NOT NULL,      -- 'T9-A', 'T9-B'
  rssi_dbm INT,                      -- -120 to 0
  battery_voltage DECIMAL(3,2),      -- 0.0 to 5.0
  battery_percent INT,               -- 0-100
  temperature_c DECIMAL(4,1),        -- -10 to +50
  crypto_verified BOOLEAN,           -- AES handshake
  recorded_at TIMESTAMP DEFAULT NOW(),
  link_quality VARCHAR(20),          -- 'excellent', 'good', 'fair', 'poor'
  
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

-- Index for latest readings
CREATE INDEX idx_telemetry_unit_recorded ON telemetry(unit_id, recorded_at DESC);
```

**Inserting Telemetry:**

```typescript
const { data, error } = await supabase
  .from('telemetry')
  .insert({
    unit_id: 'T9-A',
    rssi_dbm: -75,
    battery_voltage: 4.2,
    battery_percent: 84,
    temperature_c: 23.5,
    crypto_verified: true,
    link_quality: 'good',
  });
```

**Querying Latest Telemetry:**

```typescript
const { data: latestTelemetry } = await supabase
  .from('telemetry')
  .select()
  .eq('unit_id', 'T9-A')
  .order('recorded_at', { ascending: false })
  .limit(1)
  .single();
```

#### Units Table

```sql
CREATE TABLE units (
  id VARCHAR(10) PRIMARY KEY,         -- 'T9-A', 'T9-B'
  status VARCHAR(20),                -- 'active', 'idle', 'offline'
  last_seen TIMESTAMP,
  total_packets INT DEFAULT 0,
  error_count INT DEFAULT 0,
  uptime_seconds INT DEFAULT 0
);
```

---

## 🎨 Component API

### MorseEncoder

Interactive Morse encoder component.

**Props:** None

**Example:**

```typescript
import { MorseEncoder } from '@/components/MorseEncoder';

export function EncodingPanel() {
  return <MorseEncoder />;
}
```

---

### OLEDMirrorPanel

128x64 OLED display mirror.

**Props:**

```typescript
interface OLEDMirrorPanelProps {
  text?: string;           // Text to display
  x?: number;              // X position (0-127)
  y?: number;              // Y position (0-63)
  brightness?: number;     // 0-100%
}
```

**Example:**

```typescript
import { OLEDMirrorPanel } from '@/components/OLEDMirrorPanel';

export function Display() {
  return (
    <OLEDMirrorPanel 
      text="HELLO" 
      brightness={100}
    />
  );
}
```

---

### NodePanel

Individual node health display.

**Props:**

```typescript
interface NodePanelProps {
  id: string;              // 'T9-A' or 'T9-B'
  rssi: number;            // -120 to -40 dBm
  battery: number;         // 0-100%
  temperature: number;     // °C
  status: 'active' | 'idle' | 'offline';
}
```

**Example:**

```typescript
import { NodePanel } from '@/components/NodePanel';

export function UnitHealth() {
  return (
    <NodePanel
      id="T9-A"
      rssi={-75}
      battery={84}
      temperature={23.5}
      status="active"
    />
  );
}
```

---

### SignalLog

Message history and stream display.

**Props:**

```typescript
interface SignalLogProps {
  messages: Message[];
  maxHeight?: string;      // CSS height
}
```

**Example:**

```typescript
import { SignalLog } from '@/components/SignalLog';

export function MessageHistory() {
  const messages = [
    { id: '1', sender: 'T9-A', content: 'HELLO', sos: false },
    { id: '2', sender: 'Control', content: 'SOS', sos: true },
  ];
  
  return <SignalLog messages={messages} />;
}
```

---

## 🔊 Audio API

### `playMorseAudio(morse: string, frequency?: number, speed?: number): Promise<void>`

Generates and plays Morse code audio.

**Parameters:**
- `morse` (string): Morse sequence (e.g., "·─")
- `frequency` (number): Frequency in Hz (default: 800)
- `speed` (number): WPM (default: 20)

**Example:**

```typescript
import { playMorseAudio } from '@/lib/audio';

// Play "A" (·─)
await playMorseAudio('·─');

// Custom frequency (higher pitch)
await playMorseAudio('·─', 1000);

// Slow Morse (10 WPM)
await playMorseAudio('·─', 800, 10);
```

---

### `playAlert(type: 'error' | 'warning' | 'success'): void`

Plays a system alert sound.

**Parameters:**
- `type`: Alert type (error=buzzer, warning=beep, success=chime)

**Example:**

```typescript
import { playAlert } from '@/lib/audio';

if (linkLost) {
  playAlert('error');  // Buzzer sound
}
```

---

## 🎯 State Management

### Global Store (Zustand)

TDL-9 uses Zustand for simple state management.

**Example:**

```typescript
import { create } from 'zustand';

interface DashboardStore {
  // State
  sosActive: boolean;
  selectedUnit: string | null;
  messageQueue: Message[];
  
  // Actions
  setSOS: (active: boolean) => void;
  selectUnit: (id: string) => void;
  queueMessage: (msg: Message) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sosActive: false,
  selectedUnit: null,
  messageQueue: [],
  
  setSOS: (active) => set({ sosActive: active }),
  selectUnit: (id) => set({ selectedUnit: id }),
  queueMessage: (msg) => set((state) => ({
    messageQueue: [...state.messageQueue, msg],
  })),
}));

// In a component
function SOSButton() {
  const { sosActive, setSOS } = useDashboardStore();
  
  return (
    <button onClick={() => setSOS(!sosActive)}>
      {sosActive ? 'CANCEL' : 'EMERGENCY'}
    </button>
  );
}
```

---

## 🔐 Security APIs

### `verifyPacket(packet: Uint8Array, crc: number): boolean`

Verifies packet integrity using CRC16.

**Parameters:**
- `packet` (Uint8Array): Packet data (max 32 bytes)
- `crc` (number): Expected CRC16 checksum

**Returns:**
- (boolean): true if CRC matches, false otherwise

**Example:**

```typescript
import { verifyPacket, calculateCRC16 } from '@/lib/radioLink';

const packet = new Uint8Array([0x02, 0xC8, 0x32, 0x17]);
const crc = calculateCRC16(packet);

if (verifyPacket(packet, crc)) {
  console.log('Packet is valid');
} else {
  console.error('Corrupted packet detected');
}
```

---

## 📊 Utility APIs

### `calculateLinkQuality(rssi: number): 'excellent' | 'good' | 'fair' | 'poor'`

Maps RSSI value to human-readable link quality.

**Parameters:**
- `rssi` (number): RSSI in dBm (-120 to -40)

**Returns:**
- (string): Quality level

**Example:**

```typescript
import { calculateLinkQuality } from '@/lib/utils';

const quality = calculateLinkQuality(-75);
// Returns: 'good'

// Quality thresholds
// -40 to -70: excellent
// -70 to -85: good
// -85 to -100: fair
// -100+: poor
```

---

**Last Updated:** May 2026
**API Version:** 1.0.0
