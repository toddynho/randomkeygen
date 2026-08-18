# RandomKeygen

A free, client-side password and key generator. Every value is produced in your browser with the Web Crypto API — nothing is ever transmitted, logged, or stored.

🔗 **Live:** [https://randomkeygen.com](https://randomkeygen.com)

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
