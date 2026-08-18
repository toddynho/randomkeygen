import type { Metadata } from 'next'
import Link from 'next/link'
import { DetailSubnav } from '../components/DetailSubnav'

export const metadata: Metadata = {
  title: 'Privacy Policy | RandomKeygen',
  description: 'Privacy policy for RandomKeygen password and key generator',
  openGraph: {
    title: 'Privacy Policy | RandomKeygen',
    description: 'Privacy policy for RandomKeygen password and key generator',
    url: 'https://randomkeygen.com/privacy',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <DetailSubnav
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />
      <div className="page-container">
        <article className="max-w-[760px] py-9">
          <h1 className="mb-2 text-28 font-bold leading-[1.15] tracking-[-0.015em] sm:text-35">
            Privacy Policy
          </h1>
          <p className="mb-7 border-b border-[var(--border)] pb-7 text-14 text-[var(--muted-foreground)]">
            Last updated: January 2025
          </p>

          <section>
            <h2 className="mb-3 mt-10 text-22 font-bold tracking-[-0.01em]">Overview</h2>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              RandomKeygen is committed to protecting your privacy. This privacy policy explains
              how our password and key generator handles your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-12 text-22 font-bold tracking-[-0.01em]">Data Collection</h2>
            <p className="mb-2 text-16 font-medium leading-[1.75]">We do not collect any personal data.</p>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              All password and key generation happens entirely within your web browser using
              the Web Crypto API. No passwords, keys, or any generated content is ever sent
              to our servers or stored anywhere.
            </p>
            <Link
              href="/guides/how-randomkeygen-works"
              className="mt-3 inline-flex text-sm font-medium text-[var(--accent-strong)] hover:text-[var(--accent)]"
            >
              Learn how local generation works →
            </Link>
          </section>

          <section>
            <h2 className="mb-3 mt-12 text-22 font-bold tracking-[-0.01em]">Cookies</h2>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              This site does not use cookies for tracking. We may use essential cookies for
              basic functionality like remembering your preferences.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-12 text-22 font-bold tracking-[-0.01em]">Analytics</h2>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              We may use privacy-respecting analytics to understand how many people visit
              the site. This data is aggregated and does not identify individual users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-12 text-22 font-bold tracking-[-0.01em]">Third-Party Services</h2>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              This site may load fonts from Google Fonts. Please refer to Google&apos;s privacy
              policy for information about how they handle data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 mt-12 text-22 font-bold tracking-[-0.01em]">Contact</h2>
            <p className="text-16 leading-[1.75] text-[var(--body)]">
              If you have questions about this privacy policy, please contact us.
            </p>
          </section>
        </article>
      </div>
    </>
  )
}
