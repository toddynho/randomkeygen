import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideCodeBlock } from '@/app/components/guide/GuideCodeBlock'

export const metadata: Metadata = {
  title: 'How Password Managers Work: Encryption, Keys & Recovery | RandomKeygen',
  description: 'Learn how password manager encryption works, what zero knowledge means, how master passwords derive vault keys, and how 1Password, Bitwarden, Proton Pass, Apple Passwords, and KeePassXC differ.',
  keywords: [
    'how password managers work',
    'password manager architecture',
    'password manager encryption',
    'zero knowledge password manager',
    'password manager key derivation',
    'are password managers safe',
  ],
  authors: [{ name: 'Todd Garland' }],
  openGraph: {
    title: 'How Password Managers Work: Encryption, Keys & Recovery',
    description: 'A source-backed guide to vault encryption, key derivation, sync, authentication, and recovery.',
    url: 'https://randomkeygen.com/guides/how-password-managers-work',
    type: 'article',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/how-password-managers-work',
  },
}

const architectures = [
  {
    name: '1Password',
    unlock: 'Account password plus a 128-bit Secret Key',
    derivation: 'PBKDF2-HMAC-SHA256 (currently 650,000 iterations)',
    encryption: 'AES-GCM-256',
    storage: 'Hosted encrypted vault; Secret Key is not stored with the server data',
    source: 'https://support.1password.com/pbkdf2/',
  },
  {
    name: 'Bitwarden',
    unlock: 'Master password',
    derivation: 'PBKDF2-SHA256 or Argon2id',
    encryption: 'AES-CBC-256 plus HMAC',
    storage: 'Hosted or self-hosted encrypted vault',
    source: 'https://bitwarden.com/help/what-encryption-is-used/',
  },
  {
    name: 'Proton Pass',
    unlock: 'Proton account credentials and locally protected keys',
    derivation: 'bcrypt-derived user key plus SRP authentication',
    encryption: 'AES-GCM-256 with vault and item keys',
    storage: 'Hosted end-to-end encrypted vault',
    source: 'https://proton.me/blog/proton-pass-security-model',
  },
  {
    name: 'Apple Passwords',
    unlock: 'Device authentication and Apple Account trust',
    derivation: 'iCloud Keychain and trusted-device key hierarchy',
    encryption: 'End-to-end encrypted iCloud Keychain records',
    storage: 'Apple ecosystem sync with recovery protections',
    source: 'https://support.apple.com/guide/security/icloud-keychain-security-overview-sec1c89c6f3b/web',
  },
  {
    name: 'KeePassXC',
    unlock: 'Database password, optionally a key file or hardware key',
    derivation: 'Argon2id recommended; AES-KDF also supported',
    encryption: 'Encrypted KDBX database',
    storage: 'Local file; you choose backup and sync',
    source: 'https://keepassxc.org/docs/KeePassXC_UserGuide',
  },
]

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Password Managers Work: Encryption, Keys, Sync, and Recovery',
  description: 'A source-backed explanation of password manager architecture, including key derivation, vault encryption, authentication, sync, and recovery.',
  dateModified: '2026-07-25',
  author: {
    '@type': 'Person',
    name: 'Todd Garland',
  },
  publisher: {
    '@type': 'Organization',
    name: 'RandomKeygen',
    url: 'https://randomkeygen.com',
  },
  mainEntityOfPage: 'https://randomkeygen.com/guides/how-password-managers-work',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do password managers work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A password manager encrypts vault data on your device using keys protected by your account password, device security, or both. A hosted manager syncs encrypted data so its apps can decrypt it on approved devices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are password managers safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A reputable password manager is generally safer than password reuse because it makes a unique password practical for every account. Risk still depends on the product design, account password, device security, recovery setup, and software updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a password manager know my master password?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Well-designed hosted managers avoid sending the account password or usable vault decryption key to the provider. Exact designs differ, so verify the vendor security documentation instead of relying on the zero-knowledge label alone.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best key derivation function for a password manager?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Argon2id is a modern memory-hard choice. PBKDF2 remains widely used when configured with a high iteration count. The complete design also matters, including salts, device-held secrets, authenticated encryption, and upgradeable parameters.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if a password manager is hacked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An attacker may obtain encrypted vaults, account metadata, or service infrastructure. Strong client-side encryption limits plaintext exposure, but weak account passwords can face offline guessing and compromised clients or devices can still expose data after unlock.',
      },
    },
  ],
}

export default function HowPasswordManagersWorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="guide-article">
        <header className="guide-article-header">
          <p className="eyebrow">Guide · Passwords</p>
          <h1>How Password Managers Work</h1>
          <p className="guide-deck">
            A password manager is less like a locked spreadsheet and more like a key system:
            one layer unlocks the app, another protects the vault, and another safely syncs it.
          </p>
          <p className="guide-byline">
            11 min read · <time dateTime="2026-07-25">Updated July 25, 2026</time> · By <a href="https://x.com/toddo">Todd Garland</a>
          </p>
        </header>

        <GuideCallout kind="success" label="The short answer:">
          A password manager encrypts your vault on your device. Your account password,
          a device-held secret, or both protect the encryption keys. Hosted managers sync
          encrypted data and approved devices decrypt it locally. That design makes unique
          passwords practical, but it does not eliminate device compromise, phishing,
          recovery mistakes, or weak account passwords.
        </GuideCallout>

        <h2 id="five-layers">The five layers of a password manager</h2>
        <ol className="list-decimal pl-6">
          <li>
            <strong>Vault data.</strong> Logins are the core, but many products also
            store passkeys, secure notes, payment cards, identities, and one-time-password
            seeds. Which fields and metadata are encrypted differs by product.
          </li>
          <li>
            <strong>Vault encryption.</strong> The app encrypts vault records before
            hosted data leaves the device. Modern designs use authenticated encryption,
            or encryption plus a separate integrity check, so tampering can be detected.
          </li>
          <li>
            <strong>Key protection.</strong> A random vault key encrypts the data. A
            key derived from your account password, sometimes combined with a device-held
            secret, protects that vault key.
          </li>
          <li>
            <strong>Authentication and sync.</strong> Signing in proves to the service
            that you may download the encrypted vault. Authentication should not require
            giving the provider a usable vault key.
          </li>
          <li>
            <strong>Device unlock and recovery.</strong> Biometrics can release a key
            already protected by the operating system; they do not replace the underlying
            vault cryptography. Recovery determines what happens when every trusted device
            or secret is lost.
          </li>
        </ol>

        <h2 id="key-derivation">From account password to encryption key</h2>
        <p>
          Passwords are variable-length, human-created input. Encryption needs a fixed-size,
          high-quality key. A key derivation function (KDF) combines the password with a
          unique salt and deliberately repeats expensive work to produce that key.
        </p>
        <GuideCodeBlock
          label="Key derivation"
          code={`account password + unique salt + KDF parameters → derived key → protected vault key → encrypted records`}
        />
        <p>
          A salt prevents attackers from reusing one precomputed table across many users.
          Expensive KDF parameters make every password guess costlier. Argon2id also requires
          memory, which makes large parallel guessing systems more expensive. PBKDF2 is older
          but remains common when configured with a sufficiently high iteration count.
        </p>
        <p>
          KDF names alone do not decide security. A long unique account password, a
          device-generated secret such as 1Password&apos;s Secret Key, rate limits for online
          login, authenticated encryption, and an upgrade path for parameters all matter.
        </p>

        <h2 id="authentication-vs-decryption">Authentication is not decryption</h2>
        <p>
          These are separate jobs. Authentication tells the service which encrypted vault
          you may download. Decryption turns that encrypted data into readable records on
          an approved device. A strong architecture keeps the provider from receiving the
          material needed for the second job.
        </p>
        <p>
          &quot;Zero knowledge&quot; is useful shorthand, but not a complete specification.
          Check what data is end-to-end encrypted, which metadata remains visible, how new
          devices are approved, and whether recovery can recreate decryption access.
        </p>

        <h2 id="architectures">How current password-manager architectures differ</h2>
        <p>
          The products below all protect credentials, but they make different choices about
          password hardening, device secrets, storage, sync, and recovery. This is an
          architecture comparison from published documentation, not a security ranking.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Unlock material</th>
                <th>KDF / key design</th>
                <th>Vault protection</th>
                <th>Storage model</th>
              </tr>
            </thead>
            <tbody>
              {architectures.map((manager) => (
                <tr key={manager.name}>
                  <td>
                    <a href={manager.source} target="_blank" rel="noopener noreferrer">
                      {manager.name}
                    </a>
                  </td>
                  <td>{manager.unlock}</td>
                  <td>{manager.derivation}</td>
                  <td>{manager.encryption}</td>
                  <td>{manager.storage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="sync">What happens during sync?</h2>
        <p>
          In a hosted end-to-end encrypted manager, a device encrypts a change and sends the
          ciphertext to the service. Another approved device downloads the ciphertext and
          decrypts it locally. The server still handles account routing, versions, sharing
          membership, and availability, so it may retain operational metadata even when it
          cannot read vault fields.
        </p>
        <p>
          Local-first tools such as KeePassXC remove the hosted vault service from this
          picture. You control the encrypted database file and may sync it through a separate
          file service. That increases control but makes conflict handling, backup, and
          recovery your responsibility.
        </p>

        <h2 id="recovery">Recovery is part of the security model</h2>
        <p>
          If only you hold the decryption material, losing every copy can make the vault
          unrecoverable. Products address this with trusted devices, emergency kits, family
          or administrator recovery, recovery contacts, or escrowed keys protected by other
          credentials. Each convenience changes who can restore access and under what conditions.
        </p>
        <p>
          Before committing to a manager, test recovery without deleting your working vault.
          Confirm that you can locate required secrets, understand what a helper or administrator
          can do, and have a safe physical backup where appropriate.
        </p>

        <h2 id="browser-managers">Are browser password managers different?</h2>
        <p>
          Built-in managers from Google, Apple, and Mozilla now generate, save, sync, and fill
          passwords; several also support passkeys, sharing, and breach alerts. They can be the
          right answer for someone who lives in one ecosystem.
        </p>
        <p>
          Dedicated managers usually earn their keep through broader browser and operating-system
          support, richer vault types, family or team controls, and more deliberate export and
          recovery workflows. The security question is not &quot;browser bad, app good&quot;;
          it is which trust boundary and workflow fit you.
        </p>
        <p className="guide-inline-cta">
          <Link href="/guides/password-manager-vs-browser">Compare browser and dedicated password managers →</Link>
        </p>

        <h2 id="compromise">What if the service or device is compromised?</h2>
        <ul>
          <li>
            <strong>Stolen server data:</strong> attackers may try account-password guesses
            against encrypted vaults offline. Strong KDFs and high-entropy secrets reduce this risk.
          </li>
          <li>
            <strong>Compromised client update:</strong> code running on an unlocked device can
            potentially capture readable data. Signed updates, reviews, and rapid patching matter.
          </li>
          <li>
            <strong>Compromised device:</strong> malware or an attacker controlling an unlocked
            session may read filled or displayed credentials regardless of server-side design.
          </li>
          <li>
            <strong>Phishing:</strong> autofill can help by matching domains, but users can still
            reveal credentials or recovery material to a convincing attacker.
          </li>
        </ul>

        <h2 id="safety-checklist">A practical safety checklist</h2>
        <ul>
          <li>Use a long, unique account passphrase and never reuse it elsewhere.</li>
          <li>Enable multi-factor authentication and protect recovery codes.</li>
          <li>Keep the manager, browser, and operating system updated.</li>
          <li>Review signed-in devices and remove ones you no longer control.</li>
          <li>Test recovery and export before an emergency.</li>
          <li>Lock devices quickly and use full-disk encryption.</li>
        </ul>

        <h2 id="faq">Frequently asked questions</h2>

        <h3>Are password managers safe?</h3>
        <p>
          Generally, yes—especially compared with reusing passwords. Choose a reputable
          product, use a strong unique account password, enable MFA, secure your devices,
          and understand recovery. No architecture eliminates every endpoint or human risk.
        </p>

        <h3>Can the company see my passwords?</h3>
        <p>
          In a documented end-to-end encrypted design, the provider should not possess a
          usable vault decryption key. It may still see account and operational metadata,
          and software delivered to your device remains part of the trust model.
        </p>

        <h3>Is AES-256 enough?</h3>
        <p>
          AES-256 is a strong primitive, but the system also needs safe modes of operation,
          integrity protection, secure randomness, good key derivation, protected devices,
          and a sound recovery design.
        </p>

        <h3>Is Argon2id better than PBKDF2?</h3>
        <p>
          Argon2id adds memory cost and is a strong modern choice. Properly configured PBKDF2
          remains widely deployed. The account password&apos;s strength and the complete key
          design can matter more than comparing names in isolation.
        </p>

        <h3>What if I forget my account password?</h3>
        <p>
          Recovery varies: a trusted device, family organizer, administrator, emergency kit,
          or recovery contact may help. A local database may have no recovery path. Verify
          the exact process before moving your only copy of important credentials.
        </p>

        <h2 id="sources">Primary sources</h2>
        <ul>
          <li><a href="https://1password.com/security" target="_blank" rel="noopener noreferrer">1Password security design</a></li>
          <li><a href="https://bitwarden.com/help/bitwarden-security-white-paper/" target="_blank" rel="noopener noreferrer">Bitwarden security white paper</a></li>
          <li><a href="https://proton.me/blog/proton-pass-security-model" target="_blank" rel="noopener noreferrer">Proton Pass security model</a></li>
          <li><a href="https://support.apple.com/guide/security/icloud-keychain-security-overview-sec1c89c6f3b/web" target="_blank" rel="noopener noreferrer">Apple iCloud Keychain security overview</a></li>
          <li><a href="https://keepassxc.org/docs/KeePassXC_UserGuide" target="_blank" rel="noopener noreferrer">KeePassXC user guide</a></li>
        </ul>
        <p>
          Product details were checked against these vendor sources on July 25, 2026.
        </p>

        <section className="guide-related" aria-labelledby="related-tools-title">
          <h2 id="related-tools-title">Related tools</h2>
          <p>
            Compare device support, recovery, portability, autofill, and security model before
            moving your full vault.
          </p>
          <div className="guide-card-grid">
            <Link href="/guides/choosing-a-password-manager"><strong>Use the selection checklist →</strong><span>An evidence-based guide to choosing a password manager.</span></Link>
            <Link href="/passphrase"><strong>Generate an account passphrase →</strong><span>Long, memorable master passwords, created locally.</span></Link>
          </div>
        </section>
      </article>
    </>
  )
}
