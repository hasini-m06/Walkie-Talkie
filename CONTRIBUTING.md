# Contributing to TDL-9 Mission Control

Thank you for your interest in contributing to TDL-9! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/Walkie-Talkie.git
   cd Walkie-Talkie
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the code style guidelines below
   - Add tests for new functionality
   - Update documentation as needed

5. **Run checks before commit**
   ```bash
   npm run check    # TypeScript type checking
   npm run format   # Prettier formatting
   npm run test     # Run test suite
   ```

6. **Commit with clear message**
   ```bash
   git commit -m "feat: add new feature description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Clear description of changes
   - Link related issues
   - Include screenshots for UI changes

---

## 📋 Code Style Guide

### TypeScript

- **Strict Mode:** Enabled by default in `tsconfig.json`
- **No `any` Type:** Use specific types or generics
- **Explicit Return Types:** All functions must declare return type

```typescript
// ✅ Good
function encodeMessage(text: string): string {
  return textToMorse(text);
}

// ❌ Bad
function encodeMessage(text) {
  return textToMorse(text);
}
```

### Component Naming

- **Components:** PascalCase (MorseEncoder.tsx)
- **Files:** Match component name
- **Exports:** Named exports preferred

```typescript
// ✅ Good: MorseEncoder.tsx
export function MorseEncoder() {
  return <div>...</div>;
}

// ❌ Bad: morseEncoder.tsx
export default function morseEncoder() {
  return <div>...</div>;
}
```

### Hooks

- **Naming:** camelCase with `use` prefix
- **File location:** `src/hooks/useHookName.ts`
- **Return type:** Explicitly typed

```typescript
// ✅ Good: useTacticalSimulation.ts
export function useTacticalSimulation(): TacticalState {
  return state;
}

// ❌ Bad: tacticalSimulationHook.ts
export function tacticalSimulationHook() {
  return state;
}
```

### Comments & JSDoc

All public functions need JSDoc comments:

```typescript
/**
 * Converts English text to Morse code representation
 * @param text - Input text (case-insensitive, A-Z 0-9 only)
 * @returns Morse code with | as character separator
 * @throws Error if text contains unsupported characters
 * @example
 * textToMorse('HELLO') // Returns '···· | · | ·-·· | ·-·· | ---'
 */
export function textToMorse(text: string): string {
  // Implementation
}
```

### Formatting

Prettier is configured to auto-format on save. Configuration in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Run manually:
```bash
npm run format
```

### Import Order

Organize imports by category:

```typescript
// 1. React/External libraries
import React, { useState } from 'react';
import { cn } from 'clsx';

// 2. Internal components
import { MorseEncoder } from '@/components/MorseEncoder';

// 3. Hooks
import { useTacticalSimulation } from '@/hooks/useTacticalSimulation';

// 4. Utils/Data
import { textToMorse } from '@/lib/tacticalData';

// 5. Types
import type { Message } from '@/types';

// 6. Styles
import '@/styles/component.css';
```

---

## 🧪 Testing Requirements

### Unit Tests

All new functions must have unit tests:

```typescript
describe('textToMorse', () => {
  it('converts single character correctly', () => {
    expect(textToMorse('A')).toBe('·─');
  });

  it('throws on unsupported characters', () => {
    expect(() => textToMorse('@')).toThrow();
  });
});
```

### Component Tests

React components need interaction tests:

```typescript
describe('MorseEncoder', () => {
  it('encodes user input in real-time', () => {
    const { getByRole } = render(<MorseEncoder />);
    const input = getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'A' } });
    
    expect(screen.getByText('·─')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode (during development)
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm run test -- morse
```

**Minimum Coverage:** 80% statements

---

## 📝 Documentation

### README Updates

If your change affects usage or features, update README.md:

```markdown
## New Feature: [Name]

Brief description of the feature.

### Usage

Code example showing how to use it.

### Technical Details

Implementation notes if relevant.
```

### JSDoc Comments

All public APIs need documentation:

```typescript
/**
 * Decodes Morse code back to English text
 * @param morse - Morse string with | separator (e.g., "·─ | ─··")
 * @returns Decoded text in uppercase
 * @example
 * morseToText('·─ | ─··') // Returns 'AB'
 */
export function morseToText(morse: string): string {
  // ...
}
```

### Add to TESTING.md

If adding new test suites:

```markdown
### [Feature] Tests

**File:** `[path to test file]`

**Purpose:** Brief description

**Coverage:** XX test cases
```

---

## 🐛 Bug Reports

When reporting bugs, include:

1. **Reproduction Steps:**
   ```
   1. Click [button]
   2. Type [text]
   3. Observe [unexpected behavior]
   ```

2. **Expected Behavior:**
   ```
   Dashboard should show [expected state]
   ```

3. **Actual Behavior:**
   ```
   Dashboard shows [actual state]
   ```

4. **Environment:**
   ```
   - Browser: Chrome 125
   - OS: macOS 14.4
   - Node: v18.17.0
   ```

5. **Console Errors:**
   ```
   Include any browser console errors/warnings
   ```

---

## 🎯 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code runs without errors (`npm run dev`)
- [ ] Type checking passes (`npm run check`)
- [ ] All tests pass (`npm run test`)
- [ ] Code is formatted (`npm run format`)
- [ ] JSDoc comments added for new functions
- [ ] README updated (if applicable)
- [ ] Tests added/updated for new code
- [ ] No console errors or warnings
- [ ] Commit messages are clear
- [ ] PR description explains the changes
- [ ] Related issues are linked

---

## 📦 Project Structure

```
Walkie-Talkie/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── MorseEncoder.tsx
│   │   │   ├── OLEDMirrorPanel.tsx
│   │   │   ├── NodePanel.tsx
│   │   │   └── __tests__/       # Component tests
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useTacticalSimulation.ts
│   │   │   └── __tests__/
│   │   ├── lib/                 # Utilities and data
│   │   │   ├── tacticalData.ts  # MORSE_TABLE, codec functions
│   │   │   ├── supabaseClient.ts
│   │   │   └── __tests__/
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/                      # Python/Node backend
│   ├── index.ts                 # Express server
│   └── requirements.txt         # Python dependencies
├── shared/                      # Shared types/constants
│   └── const.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── README.md                    # Main documentation
├── TESTING.md                   # Test guide
├── RESILIENCE.md                # Error handling guide
└── CONTRIBUTING.md              # This file
```

---

## 🔄 Development Workflow

### 1. Feature Development

```bash
# Start from main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Start dev server
npm run dev

# Make changes, test locally
# Commit early and often
git commit -m "feat: implement X functionality"

# Push to your fork
git push origin feature/my-feature

# Open PR on GitHub
```

### 2. Code Review Process

Your PR will be reviewed for:
- **Functionality:** Does it work as intended?
- **Code Quality:** Is it maintainable and readable?
- **Testing:** Is coverage adequate (>80%)?
- **Documentation:** Is it well-documented?
- **Performance:** Are there any regressions?

### 3. Addressing Feedback

```bash
# Make requested changes
# Commit with descriptive message
git commit -m "refactor: address review feedback"

# Push to update PR (no new PR needed)
git push origin feature/my-feature

# Respond to reviewer comments
# Request re-review when ready
```

### 4. Merging

Once approved:
- Maintainer squashes commits into clean history
- Merges to main branch
- Closes PR and any related issues

---

## 🚀 Performance Guidelines

### Component Optimization

```typescript
// ✅ Memoize expensive components
export const OLEDMirrorPanel = memo(function OLEDMirrorPanel(props) {
  return <canvas>...</canvas>;
});

// ✅ Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// ❌ Avoid creating objects in render
// Bad: new object created every render
render() {
  const style = { color: 'red' };  // Bad!
  return <div style={style}>...</div>;
}

// Good: object defined outside render
const style = { color: 'red' };
render() {
  return <div style={style}>...</div>;
}
```

### Bundle Size

Avoid adding large dependencies. Check before installing:

```bash
npm info package-name dist.unpackedSize
```

Ideal sizes per feature:
- **Component:** <50KB
- **Hook:** <20KB
- **Utility:** <10KB

---

## 🔐 Security

### Best Practices

- **Never commit secrets:** Use `.env` files
- **Validate inputs:** Don't trust user data
- **Sanitize outputs:** Prevent XSS attacks
- **Use HTTPS only:** All API calls must be encrypted
- **Keep dependencies updated:** Run `npm audit` regularly

### Handling Secrets

```bash
# Create .env.local (don't commit this!)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_KEY=xxx

# In code: use environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
```

---

## 💬 Communication

### Getting Help

- **Technical Questions:** Open GitHub Discussion
- **Bug Reports:** Open GitHub Issue
- **Feature Requests:** Open GitHub Issue (with "enhancement" label)
- **Code Questions:** Comment on relevant PR/Issue

### Conduct

This project follows a Code of Conduct:

- Be respectful and inclusive
- No harassment or discrimination
- Give constructive feedback
- Assume good intent

---

## 🏆 Recognition

Contributors are recognized in:

1. **README:** Added to contributors section
2. **CHANGELOG:** Mentioned in release notes
3. **GitHub:** Listed as contributor

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Testing Guide](https://vitest.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## ❓ FAQ

**Q: How long do PRs take to review?**
A: Usually 2-3 days. Complex changes may take longer.

**Q: Can I work on multiple features at once?**
A: Yes, but use separate branches for each feature.

**Q: What if my PR conflicts with main?**
A: Rebase on latest main:
```bash
git fetch origin main
git rebase origin/main
git push -f origin feature/my-feature
```

**Q: Do I need to sign a CLA?**
A: No, this project doesn't require a CLA.

**Q: How are versions numbered?**
A: We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes (1.0.0)
- MINOR: New features (1.1.0)
- PATCH: Bug fixes (1.0.1)

---

## 🎉 Thank You

Thank you for contributing to TDL-9! Your efforts help make this project better for everyone.

---

**Last Updated:** May 2026
**Maintainers:** Team 9, BMSIT&M
