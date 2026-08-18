'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators, calculateEntropy, ALPHANUMERIC, SYMBOLS_SAFE } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  CheckboxField,
  Toast,
  useToast,
  useRegenerateHotkey,
  BulkGenerator,
} from '../components'

type SecurityStandard = 'wpa2' | 'wpa3' | 'auto'

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Password Generators', url: '/passwords' },
  { name: 'WiFi Password Generator', url: '/wifi-password' },
]

const HOW_TO_STEPS = [
  {
    title: 'Access your router admin panel',
    body: "Open a browser and go to your router's admin page. Common addresses: 192.168.1.1, 192.168.0.1, 10.0.0.1, or 192.168.1.254.",
  },
  {
    title: 'Log in with admin credentials',
    body: 'Use admin credentials (check the router label or manual if you are still using the defaults).',
  },
  {
    title: 'Navigate to WiFi security settings',
    body: 'Look for sections named Wireless, WiFi, Security, or Network settings, paste the new password, and save.',
  },
]

const WPA_CHARSET = ALPHANUMERIC + SYMBOLS_SAFE

export default function WifiPasswordPage() {
  const [length, setLength] = useState(20)
  const [securityStandard, setSecurityStandard] = useState<SecurityStandard>('auto')
  const [ssid, setSsid] = useState('')
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 5 }, () => ''))
  const [showQrCode, setShowQrCode] = useState(false)
  const [toastMessage, flash] = useToast()

  // WPA3's SAE handshake tolerates shorter passwords; WPA2-PSK needs longer ones
  const effectiveLength = securityStandard === 'wpa3' ? Math.max(12, length) : Math.max(16, length)

  const generatePassword = useCallback(() => {
    if (securityStandard === 'wpa3') {
      return generators.wpaPassword(Math.max(12, length))
    }
    return generators.wpaPassword(Math.max(16, length))
  }, [length, securityStandard])

  const generateQrCodeData = useCallback((password: string) => {
    if (!ssid || !password) return ''
    const security = securityStandard === 'wpa3' ? 'WPA3' : 'WPA2'
    return `WIFI:T:${security};S:${ssid};P:${password};;`
  }, [ssid, securityStandard])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 5 }, () => generatePassword()))
  }, [generatePassword])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new WiFi passwords')
  }, [generateAll, flash])

  useRegenerateHotkey(handleGenerate)

  const estimateBits = useCallback((value?: string): number => {
    return calculateEntropy(value?.length || effectiveLength, WPA_CHARSET.length)
  }, [effectiveLength])
  const entropy = estimateBits()

  return (
    <GeneratorLayout
      title="WiFi Password Generator with WPA3 Support"
      description="Generate strong, secure WiFi passwords optimized for WPA2 and WPA3 networks. Includes QR code generation for easy sharing and supports all router brands including Netgear, Linksys, TP-Link, ASUS, and D-Link."
      breadcrumbItems={breadcrumbItems}
      howToSteps={HOW_TO_STEPS}
      howToHeading="How to set your WiFi password"
      storageCallout={
        <aside className="card p-5">
          <h2 className="mb-2 text-16 font-semibold">WiFi security tips.</h2>
          <ul className="mb-3 list-inside list-disc space-y-1 text-14 leading-5 text-[var(--muted)]">
            <li>Use WPA3 if your router supports it, otherwise WPA2</li>
            <li>Never use WEP - it&apos;s broken and easily cracked</li>
            <li>Use at least 12 characters (20+ is better)</li>
            <li>Change default router admin password too</li>
            <li>Consider hiding your network name (SSID) for extra privacy</li>
            <li>Create a separate guest network for visitors</li>
          </ul>
          <Link href="/guides/router-password-setup" className="text-14 font-semibold text-[var(--accent)] hover:underline">
            Router password setup guide →
          </Link>
        </aside>
      }
    >
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate WiFi passwords"
        readout={{ bits: entropy, poolSize: WPA_CHARSET.length }}
      >
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <ControlField
              label="Security Standard"
              type="select"
              value={securityStandard}
              onChange={(value) => setSecurityStandard(value as SecurityStandard)}
              options={[
                { value: 'auto', label: 'Auto (WPA2/WPA3 Compatible)' },
                { value: 'wpa3', label: 'WPA3 Optimized' },
                { value: 'wpa2', label: 'WPA2 Only' },
              ]}
            />
            <p className="mt-1 text-xs text-[var(--muted)]">
              {securityStandard === 'wpa3' && 'Requires WPA3-capable router and devices'}
              {securityStandard === 'wpa2' && 'Compatible with older devices'}
              {securityStandard === 'auto' && 'Works with mixed WPA2/WPA3 networks'}
            </p>
          </div>

          <ControlField
            label="Password Length"
            type="select"
            value={length}
            onChange={(value) => setLength(Number(value))}
            options={[
              { value: 12, label: `12 characters${securityStandard === 'wpa3' ? ' (WPA3 minimum)' : ''}` },
              { value: 16, label: `16 characters${securityStandard === 'wpa2' ? ' (WPA2 recommended)' : ''}` },
              { value: 20, label: '20 characters (recommended)' },
              { value: 24, label: '24 characters' },
              { value: 32, label: '32 characters (high security)' },
              { value: 63, label: '63 characters (maximum)' },
            ]}
          />
        </div>

        {/* QR Code Settings */}
        <div className="w-full border-t border-[var(--hairline)] pt-4">
          <div className="mb-3">
            <CheckboxField
              label="Generate QR codes for easy sharing"
              checked={showQrCode}
              onChange={setShowQrCode}
            />
          </div>
          {showQrCode && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="wifi-ssid">Network Name (SSID)</label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="MyWiFi"
                  className="form-input w-full"
                />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-[var(--muted)]">
                  Guests can scan QR code to connect automatically
                </div>
              </div>
            </div>
          )}
        </div>
      </GeneratorControls>

      <OutputDisplay
        values={values}
        noun="passwords"
        getBits={(value) => estimateBits(value)}
        onRegenerate={(index) => {
          setValues((current) => {
            const next = [...current]
            next[index] = generatePassword()
            return next
          })
        }}
        onRegenerateAll={handleGenerate}
      />

      {/* Per-password QR code data */}
      {showQrCode && ssid && (
        <section className="mb-8 card p-4">
          <h2 className="mb-1 text-16 font-semibold">WiFi QR code data</h2>
          <p className="mb-3 text-xs text-[var(--muted)]">
            Use a QR code app or your phone&apos;s camera to generate the actual QR code from the data below.
            Guests can scan it to connect without typing the password.
          </p>
          <div className="space-y-2">
            {values.map((value, i) => (
              <code key={i} className="block break-all rounded border border-[var(--border)] bg-[var(--band)] p-2.5 font-mono text-xs text-[var(--muted)]">
                {generateQrCodeData(value)}
              </code>
            ))}
          </div>
        </section>
      )}

      {/* Router Brand Examples */}
      <section className="mb-8 card p-4">
        <h2 className="text-lg font-medium mb-3">Popular Router Brands &amp; Admin URLs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium mb-1">Netgear</div>
            <div className="text-[var(--muted)]">routerlogin.net</div>
            <div className="text-[var(--muted)]">192.168.1.1</div>
          </div>
          <div>
            <div className="font-medium mb-1">Linksys</div>
            <div className="text-[var(--muted)]">192.168.1.1</div>
            <div className="text-[var(--muted)]">myrouter.local</div>
          </div>
          <div>
            <div className="font-medium mb-1">TP-Link</div>
            <div className="text-[var(--muted)]">tplinkwifi.net</div>
            <div className="text-[var(--muted)]">192.168.0.1</div>
          </div>
        </div>
      </section>

      {/* Router Brand Specific Instructions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Router-Specific Instructions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">NETGEAR</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Address:</strong> <code>192.168.1.1</code> or <code>routerlogin.net</code></p>
              <p><strong>Path:</strong> Wireless → Security Options</p>
              <p><strong>WPA3:</strong> Available on newer models (AX series)</p>
              <p><strong>Setting:</strong> WPA2-PSK [AES] or WPA3-Personal</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">Linksys</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Address:</strong> <code>192.168.1.1</code> or <code>myrouter.local</code></p>
              <p><strong>Path:</strong> WiFi Settings → Security</p>
              <p><strong>WPA3:</strong> Velop series and newer WiFi 6 routers</p>
              <p><strong>Setting:</strong> WPA2/WPA3 Mixed or WPA3 Only</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">ASUS</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Address:</strong> <code>192.168.1.1</code> or <code>router.asus.com</code></p>
              <p><strong>Path:</strong> Wireless → General</p>
              <p><strong>WPA3:</strong> AX series and newer AC routers</p>
              <p><strong>Setting:</strong> WPA2/WPA3-Personal</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">TP-Link</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Address:</strong> <code>192.168.0.1</code> or <code>tplinkwifi.net</code></p>
              <p><strong>Path:</strong> Wireless → Wireless Security</p>
              <p><strong>WPA3:</strong> Archer AX series and newer models</p>
              <p><strong>Setting:</strong> WPA/WPA2/WPA3-Personal</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">D-Link</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Address:</strong> <code>192.168.0.1</code> or <code>dlinkrouter.local</code></p>
              <p><strong>Path:</strong> Setup → Wireless Settings</p>
              <p><strong>WPA3:</strong> DIR-X series and newer models</p>
              <p><strong>Setting:</strong> WPA2-PSK/WPA3-SAE</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2 text-[var(--accent-strong)]">Eero (Amazon)</h3>
            <div className="text-sm space-y-1 text-[var(--muted)]">
              <p><strong>Setup:</strong> Eero app only (no web interface)</p>
              <p><strong>Path:</strong> Settings → Network → Password</p>
              <p><strong>WPA3:</strong> All current models support WPA3</p>
              <p><strong>Setting:</strong> Automatic WPA2/WPA3 selection</p>
            </div>
          </div>
        </div>

        {/* ISP Router Notes */}
        <div className="rounded-[14px] border border-[var(--band-border)] bg-[var(--band)] p-4">
          <h3 className="font-medium mb-2">ISP-Provided Router Notes</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-[var(--muted)]">
            <div>
              <p><strong>Xfinity/Comcast:</strong> Gateway address usually <code>10.0.0.1</code></p>
              <p><strong>Verizon FiOS:</strong> Address typically <code>192.168.1.1</code></p>
              <p><strong>Spectrum:</strong> Varies by model, try <code>192.168.1.1</code> first</p>
            </div>
            <div>
              <p><strong>AT&amp;T:</strong> Often <code>192.168.1.254</code> or <code>192.168.1.1</code></p>
              <p><strong>CenturyLink:</strong> Usually <code>192.168.0.1</code></p>
              <p><strong>Cox:</strong> Typically <code>192.168.0.1</code></p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Network Best Practices */}
      <section className="mb-8 card p-6">
        <h2 className="text-xl font-medium mb-4">Guest Network Best Practices</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Why Set Up a Guest Network?</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-1">
              <li>Isolates visitor devices from your main network</li>
              <li>Protects your personal files and devices</li>
              <li>Easier to share simple credentials</li>
              <li>Can set bandwidth limits for guests</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Guest Network Setup Tips</h3>
            <ul className="list-disc pl-6 text-[var(--muted)] space-y-1">
              <li>Use a memorable but secure password (16+ characters)</li>
              <li>Enable client isolation to prevent guest-to-guest communication</li>
              <li>Set time limits if your router supports it</li>
              <li>Consider simpler names like "YourNameGuest" for easy identification</li>
              <li>Regularly change guest password, especially after events</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WPA2 vs WPA3 Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">WPA2 vs WPA3: Which Should You Choose?</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-4">
            <h3 className="font-semibold text-lg mb-3 text-[var(--accent-strong)]">WPA2 (2004)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span>
                <span>Universal device support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span>
                <span>AES-256 encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--warn-text)]">⚠</span>
                <span>Vulnerable to KRACK attacks (patched)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--warn-text)]">⚠</span>
                <span>Susceptible to dictionary attacks</span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mt-3">
              <strong>Password recommendation:</strong> Minimum 20 characters with mixed case, numbers, and symbols
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-lg mb-3 text-[var(--accent-strong)]">WPA3 (2018)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span>
                <span>Protected Management Frames</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span>
                <span>SAE (Simultaneous Authentication)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--success)]">✓</span>
                <span>Stronger against brute force</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--danger-text)]">✗</span>
                <span>Limited older device support</span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mt-3">
              <strong>Password recommendation:</strong> 12+ characters sufficient due to improved security
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4">Standard</th>
                <th className="text-left py-2 pr-4">Security</th>
                <th className="text-left py-2">Recommendation</th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-mono">WEP</td>
                <td className="py-2 pr-4 font-semibold text-[var(--danger-text)]">Broken</td>
                <td className="py-2">Never use - can be cracked in minutes</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-mono">WPA</td>
                <td className="py-2 pr-4 font-semibold text-[var(--warn-text)]">Weak</td>
                <td className="py-2">Avoid - vulnerable to attacks</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-mono">WPA2</td>
                <td className="py-2 pr-4 font-semibold text-[var(--success)]">Good</td>
                <td className="py-2">Recommended minimum standard</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">WPA3</td>
                <td className="py-2 pr-4 font-semibold text-[var(--success)]">Best</td>
                <td className="py-2">Use if supported by all your devices</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[14px] border border-[var(--band-border)] bg-[var(--band)] p-4">
            <h3 className="font-medium mb-2">Migration Strategy</h3>
            <p className="text-sm text-[var(--muted)] mb-3">
              Start with WPA2/WPA3 mixed mode if available. This ensures older devices can connect while newer ones use WPA3.
              Once all devices support WPA3, switch to WPA3-only for maximum security.
            </p>
            <div className="text-xs text-[var(--muted)] space-y-1">
              <p><strong>Phase 1:</strong> Enable WPA2/WPA3 mixed mode (6-12 months)</p>
              <p><strong>Phase 2:</strong> Audit device compatibility</p>
              <p><strong>Phase 3:</strong> Switch to WPA3-only when all devices support it</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">WPA3 Technical Improvements</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-[var(--accent-strong)]">Enhanced Security Features</h4>
                <ul className="space-y-1 text-[var(--muted)]">
                  <li>• <strong>SAE (Dragonfly):</strong> Replaces PSK with forward secrecy</li>
                  <li>• <strong>192-bit Security:</strong> Available in WPA3-Enterprise</li>
                  <li>• <strong>Protected Management Frames:</strong> Prevents deauth attacks</li>
                  <li>• <strong>Opportunistic Wireless Encryption:</strong> Open network protection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-[var(--accent-strong)]">Attack Resistance</h4>
                <ul className="space-y-1 text-[var(--muted)]">
                  <li>• <strong>KRACK immunity:</strong> Not vulnerable to key reinstallation</li>
                  <li>• <strong>Dictionary attack protection:</strong> SAE makes offline attacks impossible</li>
                  <li>• <strong>Brute force resistance:</strong> Built-in rate limiting</li>
                  <li>• <strong>Perfect Forward Secrecy:</strong> Past traffic stays secure</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[var(--band-border)] bg-[var(--band)] p-4">
            <h3 className="font-medium mb-2">WPA3 Device Compatibility (2024)</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--muted)]">
              <div>
                <p className="font-medium mb-1 text-[var(--foreground)]">Smartphones</p>
                <ul className="space-y-1 text-xs">
                  <li>• iPhone: iOS 13+ (2019+)</li>
                  <li>• Android: 10+ (2019+)</li>
                  <li>• Samsung: Galaxy S10+ (2019+)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1 text-[var(--foreground)]">Computers</p>
                <ul className="space-y-1 text-xs">
                  <li>• Windows: 10 May 2019+</li>
                  <li>• macOS: 10.15 Catalina+</li>
                  <li>• Linux: Recent kernels</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1 text-[var(--foreground)]">Other Devices</p>
                <ul className="space-y-1 text-xs">
                  <li>• Smart TVs: 2020+ models</li>
                  <li>• Gaming consoles: PS5, Xbox Series</li>
                  <li>• IoT: Varies widely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code tip */}
      <section className="mb-8">
        <div className="card p-4">
          <h3 className="font-medium mb-2">Share via QR Code</h3>
          <p className="text-sm text-[var(--muted)]">
            Most phones can generate a WiFi QR code from Settings &gt; WiFi &gt; Share.
            Guests can scan it to connect without typing the password.
          </p>
        </div>
      </section>

      {/* Bulk Generation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generatePassword}
          getBits={(value) => estimateBits(value)}
          label="passwords"
        />
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
