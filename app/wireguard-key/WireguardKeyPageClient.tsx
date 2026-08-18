'use client'

import Link from 'next/link'
import { GeneratorLayout, TerminalCommand } from '../components'
import { GuideCallout } from '../components/guide/GuideCallout'
import { GuideCodeBlock } from '../components/guide/GuideCodeBlock'

interface WireguardKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
}

export default function WireguardKeyPageClient({ breadcrumbItems }: WireguardKeyPageClientProps) {
  return (
    <GeneratorLayout
      title="WireGuard Key Generation"
      description="WireGuard VPN keys should be generated locally using the wg command. This page provides guidance for secure key generation and configuration — it intentionally generates nothing in the browser."
      breadcrumbItems={breadcrumbItems}
    >
      {/* Demo badge, prominent near the H1 */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <span className="badge badge-demo">Demo Only</span>
        <span className="text-sm text-[var(--muted)]">
          Nothing is generated here — run the commands below on your own machine.
        </span>
      </section>

      {/* Security Warning */}
      <GuideCallout kind="danger" label="Never generate VPN keys online:">
        WireGuard private keys control access to your VPN network. Always generate them
        locally on the machine where they will be used. A compromised private key allows
        attackers to intercept all your VPN traffic.
      </GuideCallout>

      {/* Install WireGuard */}
      <section className="mb-8 mt-8">
        <h2 className="mb-4 text-xl font-semibold">Install WireGuard</h2>
        <div className="space-y-3">
          <TerminalCommand
            command="brew install wireguard-tools"
            description="macOS (Homebrew)"
          />
          <TerminalCommand
            command="sudo apt install wireguard"
            description="Debian/Ubuntu"
          />
          <TerminalCommand
            command="sudo dnf install wireguard-tools"
            description="Fedora"
          />
        </div>
      </section>

      {/* Generate Keys */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Generate key pair</h2>
        <div className="space-y-3">
          <TerminalCommand
            command="wg genkey | tee privatekey | wg pubkey > publickey"
            description="Generate private and public key files"
          />
          <TerminalCommand
            command="wg genkey"
            description="Generate private key only (outputs to stdout)"
          />
          <TerminalCommand
            command="echo 'PRIVATE_KEY' | wg pubkey"
            description="Derive public key from private key"
          />
        </div>
      </section>

      {/* Generate Preshared Key */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Preshared key (optional)</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">
          For additional security, you can add a preshared key between peers:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command="wg genpsk"
            description="Generate preshared key"
          />
          <TerminalCommand
            command="wg genpsk > preshared.key"
            description="Save to file"
          />
        </div>
      </section>

      {/* Example Configuration */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Example configuration</h2>
        <div className="space-y-4">
          <GuideCodeBlock
            label="/etc/wireguard/wg0.conf — server"
            code={`[Interface]
# Server's private key
PrivateKey = SERVER_PRIVATE_KEY_HERE
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT

[Peer]
# Client's public key
PublicKey = CLIENT_PUBLIC_KEY_HERE
AllowedIPs = 10.0.0.2/32`}
          />
          <GuideCodeBlock
            label="/etc/wireguard/wg0.conf — client"
            code={`[Interface]
# Client's private key
PrivateKey = CLIENT_PRIVATE_KEY_HERE
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
# Server's public key
PublicKey = SERVER_PUBLIC_KEY_HERE
Endpoint = vpn.example.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`}
          />
        </div>
      </section>

      {/* Management Commands */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Management commands</h2>
        <div className="space-y-3">
          <TerminalCommand
            command="sudo wg-quick up wg0"
            description="Start WireGuard interface"
          />
          <TerminalCommand
            command="sudo wg-quick down wg0"
            description="Stop WireGuard interface"
          />
          <TerminalCommand
            command="sudo wg show"
            description="Show WireGuard status"
          />
          <TerminalCommand
            command="sudo systemctl enable wg-quick@wg0"
            description="Enable on boot (systemd)"
          />
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">WireGuard best practices</h2>
        <div className="card p-5">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--muted)]">
            <li>Generate unique key pairs for each device</li>
            <li>Never share private keys between devices</li>
            <li>Set restrictive permissions on config files (<code className="rounded bg-[var(--band)] px-1 py-0.5 font-mono text-xs">chmod 600</code>)</li>
            <li>Use preshared keys for additional security on sensitive connections</li>
            <li>Regularly rotate keys, especially if a device is lost or compromised</li>
            <li>Keep the AllowedIPs as restrictive as possible</li>
          </ul>
        </div>
      </section>

      {/* Related reading */}
      <section className="mb-4">
        <GuideCallout kind="success" label="Related reading:">
          Setting up key-based access to servers too?{' '}
          <Link href="/ssh-key" className="font-semibold text-[var(--accent-strong)] hover:underline">
            SSH key generation commands →
          </Link>{' '}
          or browse all{' '}
          <Link href="/guides" className="font-semibold text-[var(--accent-strong)] hover:underline">
            security guides →
          </Link>
        </GuideCallout>
      </section>
    </GeneratorLayout>
  )
}
