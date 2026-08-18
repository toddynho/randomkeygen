import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideCallout } from '@/app/components/guide/GuideCallout'
import { GuideRows } from '@/app/components/guide/GuideRows'

export const metadata: Metadata = {
  title: 'Password Security Best Practices in 2025 | RandomKeygen',
  description: 'Complete guide to password security: length requirements, character complexity, 2FA, password managers, and avoiding common mistakes that put your accounts at risk.',
  keywords: ['password security', 'strong password', 'password best practices', '2FA', 'two factor authentication', 'password tips', 'secure password'],
  openGraph: {
    title: 'Password Security Best Practices in 2025',
    description: 'Everything you need to know about creating and managing secure passwords.',
    url: 'https://randomkeygen.com/guides/password-security-best-practices',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/password-security-best-practices',
  },
}

export default function PasswordSecurityGuidePage() {
  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Passwords</p>
        <h1>Password Security Best Practices in 2025</h1>
        <p className="guide-deck">
          Your passwords are the keys to your digital life. Here&apos;s everything you need
          to know about creating, managing, and protecting them.
        </p>
        <p className="guide-byline">8 min read · Updated January 2025</p>
      </header>

      <h2 id="length">1. Length Matters More Than Complexity</h2>
      <p>
        The single most important factor in password strength is <strong>length</strong>.
        A 16-character password with just lowercase letters is harder to crack than an
        8-character password with uppercase, lowercase, numbers, and symbols.
      </p>

      <h3>Recommended Minimum Lengths</h3>
      <GuideRows compact items={[
        ['12 characters', 'Minimum for most accounts'],
        ['16 characters', 'Recommended for important accounts'],
        ['20+ characters', 'For high-security (banking, email, password manager)'],
      ]} />

      <p>
        That said, mixing character types is still good practice. The ideal password is
        both long AND uses a mix of uppercase, lowercase, numbers, and symbols.
      </p>

      <p className="guide-inline-cta">
        <Link href="/password">Generate a strong password</Link> or <Link href="/password-strength">test your password</Link> — everything runs locally in your browser.
      </p>

      <h2 id="unique">2. Use Unique Passwords Everywhere</h2>
      <p>
        If you use the same password for multiple accounts, a breach on one site
        compromises all of them. Attackers use &quot;credential stuffing&quot; - automatically
        trying leaked username/password combinations across thousands of sites.
      </p>

      <GuideCallout kind="danger" label="Real Example:">
        In 2024, a credential stuffing attack on 23andMe affected 6.9 million accounts -
        not because 23andMe was hacked, but because users reused passwords from other
        breached sites.
      </GuideCallout>

      <p>
        Yes, this means you might have hundreds of unique passwords. That&apos;s exactly
        why you need a password manager (see section 4).
      </p>

      <h2 id="2fa">3. Enable Two-Factor Authentication (2FA)</h2>
      <p>
        Even the strongest password can be compromised through phishing or data breaches.
        2FA adds a second layer of security that makes it much harder for attackers to
        access your account.
      </p>

      <table>
        <thead>
          <tr>
            <th>2FA Method</th>
            <th>Security</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hardware Key (YubiKey)</td>
            <td>Best</td>
            <td>Phishing-resistant, works offline</td>
          </tr>
          <tr>
            <td>Authenticator App (TOTP)</td>
            <td>Excellent</td>
            <td>Google/Microsoft Authenticator, Authy</td>
          </tr>
          <tr>
            <td>Push Notification</td>
            <td>Good</td>
            <td>Convenient but can be socially engineered</td>
          </tr>
          <tr>
            <td>SMS Code</td>
            <td>Acceptable</td>
            <td>Better than nothing, but vulnerable to SIM swap</td>
          </tr>
        </tbody>
      </table>

      <p>
        At minimum, enable 2FA on your email (it&apos;s used to reset other passwords),
        banking, and password manager.
      </p>

      <p className="guide-inline-cta">
        Setting up TOTP? <Link href="/totp-secret">Generate a TOTP secret</Link> — created locally, never transmitted.
      </p>

      <h2 id="manager">4. Use a Password Manager</h2>
      <p>
        A password manager is the only practical way to use unique, strong passwords
        for every account. It encrypts and stores your passwords, and can generate
        new ones when needed.
      </p>

      <h3>What to Look For</h3>
      <ul>
        <li>Zero-knowledge architecture (provider can&apos;t see your passwords)</li>
        <li>Cross-platform sync (desktop, mobile, browser extension)</li>
        <li>Strong master password requirements</li>
        <li>2FA support for the manager itself</li>
        <li>Breach monitoring alerts</li>
      </ul>

      <p>
        Your master password is the one password you need to memorize. Make it a
        passphrase of 4-5 random words - long but memorable.
      </p>

      <p className="guide-inline-cta">
        Need a master password? <Link href="/passphrase">Generate a passphrase</Link> — created locally, never transmitted.
      </p>

      <h2 id="avoid">5. What to Avoid</h2>

      <GuideCallout kind="danger" label="Don't Do This:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Personal info (names, birthdays, pets)</li>
          <li>Dictionary words by themselves</li>
          <li>Keyboard patterns (qwerty, 123456)</li>
          <li>Simple substitutions (p@ssw0rd)</li>
          <li>Storing in browser without master password</li>
          <li>Writing on sticky notes</li>
          <li>Sharing via email or text</li>
        </ul>
      </GuideCallout>
      <GuideCallout kind="success" label="Do This Instead:">
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Random characters or word combinations</li>
          <li>12+ characters minimum</li>
          <li>Unique for every account</li>
          <li>Stored in a password manager</li>
          <li>Changed if potentially compromised</li>
          <li>Protected by 2FA</li>
        </ul>
      </GuideCallout>

      <h2 id="breach">6. What to Do After a Breach</h2>
      <p>
        If a service you use is breached, act quickly:
      </p>

      <ol className="list-decimal pl-6">
        <li><strong>Change the password immediately</strong> on the breached site</li>
        <li><strong>Change it everywhere</strong> you used the same password</li>
        <li><strong>Enable 2FA</strong> if you haven&apos;t already</li>
        <li><strong>Check for unauthorized access</strong> - review account activity</li>
        <li><strong>Monitor your email</strong> for password reset attempts</li>
      </ol>

      <p>
        Services like <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer">Have I Been Pwned</a> let
        you check if your email appears in known breaches.
      </p>

      <section className="guide-related" aria-labelledby="related-tools-title">
        <h2 id="related-tools-title">Related tools</h2>
        <div className="guide-card-grid">
          <Link href="/password"><strong>Password Generator →</strong><span>Generate strong random passwords locally.</span></Link>
          <Link href="/passphrase"><strong>Passphrase Generator →</strong><span>Generate memorable multi-word passphrases.</span></Link>
          <Link href="/password-strength"><strong>Strength Checker →</strong><span>Test how strong your password really is.</span></Link>
        </div>
      </section>
    </article>
  )
}
