'use client'

import Link from 'next/link'
import { GeneratorLayout, TerminalCommand } from '../components'
import { GuideCallout } from '../components/guide/GuideCallout'
import { GuideCodeBlock } from '../components/guide/GuideCodeBlock'

interface SshKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function SshKeyPageClient({ breadcrumbItems }: SshKeyPageClientProps) {
  return (
    <GeneratorLayout
      title="SSH Key Generation"
      description="SSH keys should always be generated locally on your machine. This page provides guidance and terminal commands for secure key generation — it intentionally generates nothing in the browser."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Demo badge + guide link, prominent near the H1 */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <span className="badge badge-demo">Demo Only</span>
        <span className="text-sm text-[var(--muted)]">
          Nothing is generated here — run the commands below on your own machine.
        </span>
        <Link href="/guides/ssh-setup" className="btn btn-primary">
          Full SSH setup guide →
        </Link>
      </section>

      {/* Security Warning */}
      <GuideCallout kind="danger" label="Never generate SSH keys online:">
        SSH private keys must be generated on your local machine and never transmitted
        over the internet. A compromised private key gives attackers full access to any
        system where you&apos;ve added the public key. Use the terminal commands below to
        generate keys securely on your own system.
      </GuideCallout>

      {/* Ed25519 (Recommended) */}
      <section className="mb-8 mt-8">
        <h2 className="mb-4 text-xl font-semibold">Ed25519 (recommended)</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Ed25519 is a modern, secure algorithm. It&apos;s faster and has smaller keys than RSA
          while providing equivalent security.
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command='ssh-keygen -t ed25519 -C "your_email@example.com"'
            description="Generate Ed25519 key pair"
          />
          <TerminalCommand
            command='ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_github'
            description="With custom filename"
          />
          <TerminalCommand
            command='ssh-keygen -t ed25519 -C "your_email@example.com" -N ""'
            description="Without passphrase (not recommended)"
          />
        </div>
      </section>

      {/* RSA */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">RSA (legacy compatibility)</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Use RSA if you need compatibility with older systems. Always use at least 4096 bits.
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command='ssh-keygen -t rsa -b 4096 -C "your_email@example.com"'
            description="Generate RSA 4096-bit key pair"
          />
          <TerminalCommand
            command='ssh-keygen -t rsa -b 4096 -o -a 100 -C "your_email@example.com"'
            description="With stronger key derivation"
          />
        </div>
      </section>

      {/* View & Copy */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">View &amp; copy public key</h2>
        <div className="space-y-3">
          <TerminalCommand
            command="cat ~/.ssh/id_ed25519.pub"
            description="View Ed25519 public key"
          />
          <TerminalCommand
            command="cat ~/.ssh/id_rsa.pub"
            description="View RSA public key"
          />
          <TerminalCommand
            command="pbcopy < ~/.ssh/id_ed25519.pub"
            description="Copy to clipboard (macOS)"
          />
          <TerminalCommand
            command="xclip -sel clip < ~/.ssh/id_ed25519.pub"
            description="Copy to clipboard (Linux)"
          />
        </div>
      </section>

      {/* Example Output */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Example output</h2>
        <p className="mb-2 text-sm text-[var(--muted)]">
          Your public key will look similar to this (this is an example, not a real key):
        </p>
        <GuideCodeBlock
          label="~/.ssh/id_ed25519.pub — example"
          code="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl user@example.com"
        />
      </section>

      {/* Add to SSH Agent */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Add to SSH agent</h2>
        <div className="space-y-3">
          <TerminalCommand
            command="eval $(ssh-agent -s)"
            description="Start SSH agent"
          />
          <TerminalCommand
            command="ssh-add ~/.ssh/id_ed25519"
            description="Add key to agent"
          />
          <TerminalCommand
            command="ssh-add --apple-use-keychain ~/.ssh/id_ed25519"
            description="Add to macOS Keychain"
          />
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">SSH key best practices</h2>
        <div className="card p-5">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--muted)]">
            <li>Always use a strong passphrase to protect your private key</li>
            <li>Use Ed25519 for new keys unless legacy compatibility is required</li>
            <li>Keep your private key permissions at 600 (<code className="rounded bg-[var(--band)] px-1 py-0.5 font-mono text-xs">chmod 600 ~/.ssh/id_ed25519</code>)</li>
            <li>Use different keys for different services when possible</li>
            <li>Rotate keys periodically and remove unused public keys from servers</li>
            <li>Never share your private key or store it in version control</li>
          </ul>
        </div>
      </section>

      {/* SSH Config */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">SSH config example</h2>
        <GuideCodeBlock
          label="~/.ssh/config"
          code={`# GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  AddKeysToAgent yes

# Work server
Host work
  HostName server.company.com
  User deploy
  IdentityFile ~/.ssh/id_ed25519_work
  Port 22`}
        />
      </section>

      {/* Next step */}
      <section className="mb-4">
        <GuideCallout kind="success" label="Next step:">
          Keys generated? Our step-by-step guide covers adding them to GitHub and servers,
          hardening your SSH config, and troubleshooting connections.{' '}
          <Link href="/guides/ssh-setup" className="font-semibold text-[var(--accent-strong)] hover:underline">
            Full SSH setup guide →
          </Link>
        </GuideCallout>
      </section>
    </GeneratorLayout>
  )
}
