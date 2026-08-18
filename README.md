# RandomKeygen

[![Live site](https://img.shields.io/badge/live-randomkeygen.com-047857)](https://randomkeygen.com)
[![Client-side](https://img.shields.io/badge/security-100%25%20client--side-065f46)](https://randomkeygen.com/guides/how-randomkeygen-works)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-1c1917)](LICENSE)

A free, open-source password and key generator for developers and security-conscious users. Generate secure passwords, API keys, UUIDs, JWT secrets, encryption keys, and more—locally in your browser with the Web Crypto API.

**Nothing is ever transmitted, logged, or stored.**

🔗 **Live:** [https://randomkeygen.com](https://randomkeygen.com)

## Popular generators

- [Secure Password Generator](https://randomkeygen.com/password) — random, memorable, pronounceable, and passphrase modes
- [API Key Generator](https://randomkeygen.com/api-key) — prefixed, production-style API credentials
- [JWT Secret Generator](https://randomkeygen.com/jwt-secret) — HS256, HS384, and HS512 signing secrets
- [UUID Generator](https://randomkeygen.com/uuid) — browser-generated UUIDs
- [Encryption Key Generator](https://randomkeygen.com/encryption-key) — AES and general-purpose encryption keys
- [Security Guides](https://randomkeygen.com/guides) — practical guidance for passwords, JWTs, OAuth, encryption, and key management

## Why it's safe to use

- **100% client-side** — generation uses `crypto.getRandomValues()` and `crypto.subtle`. Open your network tab and regenerate: no requests are made.
- **No accounts, no tracking of generated values, no history.** Your board layout and theme preference live in your own localStorage.
- **Honest strength math** — every generator shows estimated entropy in bits with a plain-English crack-time estimate ("a gaming PC guessing a million passwords per second would need…"), never bare exponents.
- **Open source (MIT)** — read the generation code yourself: [`app/lib/crypto.ts`](app/lib/crypto.ts). Found a problem? See [SECURITY.md](SECURITY.md).

## What it generates

**60+ specialized tools** across four areas:

- **Passwords** — random, passphrases, pronounceable, memorable, fixed lengths (8–32), letters-only / no-symbols / numbers-only, WiFi/WPA, PINs, temporary and gaming passwords, backup codes, recovery keys, plus a strength checker and entropy calculator
- **Developer** — API keys with custom prefixes, JWT secrets (with decoder, expiry calculator, and claims builder), OAuth tokens, UUIDs, TOTP/2FA secrets and live codes, WebAuthn test credentials, random strings, VAPID keys, test credit card numbers
- **Frameworks** — Django `SECRET_KEY`, Laravel `APP_KEY`, Flask secrets, WordPress salts
- **Encryption** — AES keys and IVs, RSA key pairs, HMAC secrets, salts, general-purpose secrets, SHA-256/512 hashing, real bcrypt hashing, plus SSH and WireGuard setup guides

## Features

- 🧩 **Modular homepage board** — drag to rearrange generators, add/remove them, set how many values each card shows; your layout persists on-device
- ⌨️ **Keyboard-first** — press `R` anywhere to regenerate everything
- 📊 **Entropy readouts** — bits, pool size, a colored strength scale, and plain-English crack-time estimates on every generator
- 📦 **Bulk generation** — CSV export with entropy per value (and a reminder to delete the file)
- 🌗 **Dark mode** — follows your system preference, with a manual toggle in the header
- 📚 **22 security guides** — JWT security, password managers, encryption, UUIDs, SSH setup, and more
- 📱 **Responsive** — works on any device; static prerendered pages, instant generation

## Development

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Type-check, test, and build
npx tsc --noEmit
npm test
npm run build
```

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. All routes prerender as static content.

### Where things live

| Path | What |
|---|---|
| `app/lib/crypto.ts` | All generation logic (Web Crypto only) |
| `app/components/generator/` | The shared tool-page template (layout, entropy readout, result rows) |
| `app/components/guide/` | The guide template (code blocks, callouts, checklists) |
| `app/guides/guide-meta.ts` | Single source of truth for guide titles, categories, and order |
| `app/lib/tool-directory.ts` | Tool catalog driving the category index pages and nav |
| `app/globals.css` | Design tokens (light + dark) and the type scale — retune the whole site here |

## License

[MIT](LICENSE) © Todd Garland

## Credits

Built by [@toddo](https://x.com/toddo). Hosted by [ready.dev](https://ready.dev?ref=randomkeygen.com).

## Related developer tools

- [JSONLint](https://jsonlint.com) — JSON validator and formatter
- [JSCompress](https://jscompress.com) — JavaScript and CSS minifier
- [DNS Lookup](https://dns-lookup.com) — DNS and IP tools
- [JSONCompare](https://jsoncompare.com) — JSON comparison and diff tool
- [Colors.to](https://colors.to) — color conversion and palette tools
- [Design.dev](https://design.dev) — design resources for developers
