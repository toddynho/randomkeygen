import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/app/components/BreadcrumbSchema';
import { GuideCallout } from '@/app/components/guide/GuideCallout';
import { GuideRows } from '@/app/components/guide/GuideRows';

export const metadata: Metadata = {
  title: 'Router WiFi Password Setup Guide: Step-by-Step for All Brands | RandomKeygen',
  description: 'Complete guide to setting up WiFi passwords on all router brands. Includes step-by-step instructions for Netgear, Linksys, TP-Link, ASUS, D-Link, and ISP routers with WPA3 setup.',
  keywords: ['router password setup', 'wifi password setup', 'wpa3 setup', 'router configuration', 'wireless security setup', 'netgear password setup', 'linksys password setup'],
  openGraph: {
    title: 'Router WiFi Password Setup Guide: Step-by-Step for All Brands',
    description: 'Complete guide to setting up WiFi passwords on all router brands. Includes step-by-step instructions for Netgear, Linksys, TP-Link, ASUS, D-Link, and ISP routers with WPA3 setup.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/router-password-setup',
  },
};

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Guides', url: '/guides' },
  { name: 'Router Password Setup', url: '/guides/router-password-setup' },
];

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]'
const cardTitleClass = 'mb-2 font-semibold text-[var(--foreground)]'
const cardListClass = 'list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'
const cardOlClass = 'list-decimal space-y-1 pl-5 text-sm leading-6 text-[var(--body)]'

function BrandCard({ title, access, path, wpa3Label, wpa3, steps }: {
  title: string
  access: React.ReactNode
  path: string
  wpa3Label: string
  wpa3: string
  steps: string[]
}) {
  return (
    <div className={cardClass}>
      <h3 className={cardTitleClass}>{title}</h3>
      <div className="space-y-2 text-sm leading-6 text-[var(--body)]">
        <div><strong>Access:</strong> {access}</div>
        <div><strong>Path:</strong> {path}</div>
        <div><strong>{wpa3Label}:</strong> {wpa3}</div>
        <div className="rounded-lg bg-[var(--band)] p-3">
          <strong className="text-[var(--foreground)]">Quick Steps:</strong>
          <ol className={`mt-1 ${cardOlClass}`}>
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function RouterPasswordSetupGuide() {
  return (
    <article className="guide-article">
      <BreadcrumbSchema items={breadcrumbItems} />

      <header className="guide-article-header">
        <p className="eyebrow">Guide · Passwords</p>
        <h1>Complete Router Password Setup Guide</h1>
        <p className="guide-deck">
          Step-by-step instructions for setting up secure WiFi passwords on all major router brands.
          Includes WPA3 configuration, security best practices, and troubleshooting tips.
        </p>
      </header>

      <h2 id="before-you-begin">Before You Begin</h2>
      <h3>What You&apos;ll Need</h3>
      <ul>
        <li>A computer or smartphone connected to your network</li>
        <li>Your router&apos;s admin username and password</li>
        <li>Your new WiFi password (generated using a secure password generator)</li>
        <li>List of all devices that need to reconnect</li>
      </ul>
      <GuideCallout kind="warning" label="Important notes:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong>All devices will disconnect:</strong> Changing your WiFi password will disconnect all currently connected devices</li>
          <li><strong>Have backups ready:</strong> Know how to access your router if something goes wrong</li>
          <li><strong>Document the change:</strong> Write down your new password before starting</li>
          <li><strong>Plan for reconnection:</strong> Make a list of all devices that will need the new password</li>
        </ul>
      </GuideCallout>

      <h2 id="universal-steps">Universal Steps (All Routers)</h2>

      <h3>Step 1: Access Router Admin Panel</h3>
      <p>
        Open a web browser and navigate to your router&apos;s IP address. If you&apos;re unsure, try these common addresses:
      </p>
      <p>
        <code>192.168.1.1</code> · <code>192.168.0.1</code> · <code>10.0.0.1</code> · <code>192.168.1.254</code>
      </p>
      <GuideCallout kind="success" label="Can't find your router's IP?">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li><strong>Windows:</strong> Open Command Prompt, type <code>ipconfig</code>, look for &quot;Default Gateway&quot;</li>
          <li><strong>Mac:</strong> System Preferences → Network → Advanced → TCP/IP</li>
          <li><strong>iPhone:</strong> Settings → WiFi → Tap your network → Router field</li>
          <li><strong>Android:</strong> Settings → WiFi → Tap your network → Advanced</li>
        </ul>
      </GuideCallout>

      <h3>Step 2: Login with Admin Credentials</h3>
      <p>
        Enter your router&apos;s admin username and password. If you haven&apos;t changed these, check the router label or manual for defaults.
      </p>
      <GuideCallout kind="danger" label="Common default credentials:">
        <strong>admin</strong> / <strong>password</strong>, <strong>admin</strong> / <strong>admin</strong>, <strong>admin</strong> / <strong>(blank)</strong>, <strong>admin</strong> / <strong>1234</strong>, <strong>root</strong> / <strong>admin</strong>, <strong>(blank)</strong> / <strong>admin</strong>.
        Change these default credentials immediately after setup for security!
      </GuideCallout>

      <h3>Step 3: Navigate to WiFi Settings</h3>
      <p>
        Look for sections labeled <strong>Wireless</strong>, <strong>WiFi</strong>, <strong>Security</strong>, or <strong>Network</strong>.
        The exact location varies by manufacturer, but these are the most common menu names.
      </p>

      <h3>Step 4: Configure Security Settings</h3>
      <p><strong>Security Mode</strong></p>
      <GuideRows items={[
        ['Recommended', 'WPA2/WPA3-Personal (Mixed Mode) — best compatibility with modern security'],
        ['If available', 'WPA3-Personal Only — maximum security, but older devices may not connect'],
        ['Fallback', 'WPA2-Personal — compatible with older devices'],
      ]} />
      <p><strong>Encryption Type</strong></p>
      <p>
        If asked to choose encryption, select <strong>AES</strong> or <strong>CCMP</strong>.
        Avoid TKIP as it&apos;s outdated and insecure.
      </p>

      <h3>Step 5: Set Your WiFi Password</h3>
      <p>
        Paste your generated password into the passphrase, password, or key field.
      </p>
      <p><strong>Password Requirements by Security Type</strong></p>
      <ul>
        <li><strong>WPA3:</strong> Minimum 12 characters (SAE provides additional security)</li>
        <li><strong>WPA2:</strong> Minimum 16 characters recommended (due to PSK vulnerabilities)</li>
        <li><strong>General:</strong> Use mix of letters, numbers, and symbols for maximum security</li>
      </ul>
      <GuideCallout kind="success" label="Pro tips:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Save the password in a secure location before applying changes</li>
          <li>Some routers show the password as you type, others hide it with dots</li>
          <li>Double-check for typos – you&apos;ll need this exact password on all devices</li>
          <li>Consider generating a backup password in case you need to change it again</li>
        </ul>
      </GuideCallout>

      <h3>Step 6: Apply and Save Changes</h3>
      <p>
        Look for buttons labeled &quot;Apply,&quot; &quot;Save,&quot; &quot;Submit,&quot; or &quot;Update Settings.&quot;
      </p>
      <GuideCallout kind="warning" label="What happens next:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Router will apply the new settings (30-60 seconds)</li>
          <li>WiFi network may briefly disappear</li>
          <li>All connected devices will be disconnected</li>
          <li>Network will reappear with new password requirement</li>
        </ul>
      </GuideCallout>

      <h2 id="brand-specific">Brand-Specific Instructions</h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <BrandCard
          title="NETGEAR Routers"
          access={<><code>192.168.1.1</code> or <code>routerlogin.net</code></>}
          path="Wireless → Security Options → WiFi Security"
          wpa3Label="WPA3 Models"
          wpa3="Nighthawk AX series, Orbi AX series"
          steps={[
            'Advanced → Wireless → WiFi Security',
            'Select "WPA2-PSK [AES]" or "WPA3-Personal"',
            'Enter password in "Password (Network Key)" field',
            'Click "Apply"',
          ]}
        />
        <BrandCard
          title="Linksys Routers"
          access={<><code>192.168.1.1</code> or <code>myrouter.local</code></>}
          path="WiFi Settings → Security → WiFi Password"
          wpa3Label="WPA3 Models"
          wpa3="Velop series, Max-Stream AX series"
          steps={[
            'WiFi Settings → Edit (pencil icon)',
            'Select "WPA2/WPA3 Mixed" or "WPA3 Personal"',
            'Enter password in "WiFi Password" field',
            'Click "Apply" then "Save"',
          ]}
        />
        <BrandCard
          title="ASUS Routers"
          access={<><code>192.168.1.1</code> or <code>router.asus.com</code></>}
          path="Wireless → General → Authentication Method"
          wpa3Label="WPA3 Models"
          wpa3="RT-AX series, ZenWiFi AX series"
          steps={[
            'Wireless → General tab',
            'Set Authentication Method to "WPA2-Personal" or "WPA3-Personal"',
            'Enter password in "WPA Pre-Shared Key" field',
            'Click "Apply"',
          ]}
        />
        <BrandCard
          title="TP-Link Routers"
          access={<><code>192.168.0.1</code> or <code>tplinkwifi.net</code></>}
          path="Wireless → Wireless Security"
          wpa3Label="WPA3 Models"
          wpa3="Archer AX series, Deco AX series"
          steps={[
            'Wireless → Wireless Security',
            'Select "WPA/WPA2-Personal" or "WPA3-Personal"',
            'Enter password in "PSK Password" field',
            'Click "Save"',
          ]}
        />
        <BrandCard
          title="D-Link Routers"
          access={<><code>192.168.0.1</code> or <code>dlinkrouter.local</code></>}
          path="Setup → Wireless Settings → Security Mode"
          wpa3Label="WPA3 Models"
          wpa3="DIR-X series, EAGLE PRO AI series"
          steps={[
            'Setup → Wireless Settings',
            'Set Security Mode to "WPA2-PSK" or "WPA3-SAE"',
            'Enter password in "PSK/EAP Passphrase" field',
            'Click "Apply"',
          ]}
        />
        <BrandCard
          title="Eero (Amazon) Systems"
          access="Eero app only (no web interface)"
          path="Settings → Network → Password"
          wpa3Label="WPA3 Support"
          wpa3="All current Eero models support WPA3"
          steps={[
            'Open Eero app → Settings',
            'Tap "Network" → "Password"',
            'Enter new password',
            'Tap "Save" and confirm',
          ]}
        />
      </div>

      <h2 id="isp-routers">ISP-Provided Router Setup</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Xfinity/Comcast Gateways</h3>
          <div className="space-y-1.5 text-sm leading-6 text-[var(--body)]">
            <div><strong>Access:</strong> <code>10.0.0.1</code> (usually)</div>
            <div><strong>Login:</strong> admin / password (check label)</div>
            <div><strong>Path:</strong> Gateway → Connection → WiFi → Edit</div>
            <div><strong>Note:</strong> May require Xfinity app for some models</div>
          </div>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Verizon FiOS Routers</h3>
          <div className="space-y-1.5 text-sm leading-6 text-[var(--body)]">
            <div><strong>Access:</strong> <code>192.168.1.1</code></div>
            <div><strong>Login:</strong> admin / password</div>
            <div><strong>Path:</strong> Wireless Settings → Basic Security Settings</div>
            <div><strong>Note:</strong> Some newer models use My Fios app</div>
          </div>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Spectrum Routers</h3>
          <div className="space-y-1.5 text-sm leading-6 text-[var(--body)]">
            <div><strong>Access:</strong> <code>192.168.1.1</code> or <code>192.168.0.1</code></div>
            <div><strong>Login:</strong> admin / password</div>
            <div><strong>Path:</strong> Wireless → Security</div>
            <div><strong>Note:</strong> Interface varies by router model</div>
          </div>
        </div>
        <div className={cardClass}>
          <h3 className={cardTitleClass}>AT&amp;T Gateways</h3>
          <div className="space-y-1.5 text-sm leading-6 text-[var(--body)]">
            <div><strong>Access:</strong> <code>192.168.1.254</code> or <code>192.168.1.1</code></div>
            <div><strong>Login:</strong> admin / password (check label)</div>
            <div><strong>Path:</strong> Settings → WiFi → Edit Network</div>
            <div><strong>Note:</strong> May use Smart Home Manager app</div>
          </div>
        </div>
      </div>

      <h2 id="reconnecting">After Setup: Reconnecting Devices</h2>
      <h3>Device Reconnection Checklist</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Quick Reconnect Devices</h4>
          <ul className={cardListClass}>
            <li>Smartphones and tablets</li>
            <li>Laptops and computers</li>
            <li>Gaming consoles</li>
            <li>Streaming devices</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>May Need Manual Setup</h4>
          <ul className={cardListClass}>
            <li>Smart home devices (thermostats, cameras)</li>
            <li>Printers</li>
            <li>IoT devices</li>
            <li>Older devices without auto-connect</li>
          </ul>
        </div>
      </div>

      <h3>Step-by-Step Reconnection</h3>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Mobile Devices (iOS/Android)</h4>
          <ol className={cardOlClass}>
            <li>Go to Settings → WiFi</li>
            <li>Tap your network name</li>
            <li>Enter new password</li>
            <li>Tap &quot;Join&quot; or &quot;Connect&quot;</li>
          </ol>
          <p className="mt-2 text-xs text-[var(--muted)]">
            iOS may ask to update keychain for other Apple devices
          </p>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Windows Computers</h4>
          <ol className={cardOlClass}>
            <li>Click WiFi icon in system tray</li>
            <li>Select your network</li>
            <li>Check &quot;Connect automatically&quot;</li>
            <li>Enter new password and click &quot;Next&quot;</li>
          </ol>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Windows will remember the new password for future connections
          </p>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Mac Computers</h4>
          <ol className={cardOlClass}>
            <li>Click WiFi icon in menu bar</li>
            <li>Select your network</li>
            <li>Enter new password</li>
            <li>Click &quot;Join&quot;</li>
          </ol>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Password may sync to other Apple devices via iCloud Keychain
          </p>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Gaming Consoles</h4>
          <div className="space-y-1.5 text-sm leading-6 text-[var(--body)]">
            <div><strong>PlayStation:</strong> Settings → Network → Set Up Connection</div>
            <div><strong>Xbox:</strong> Settings → Network → Set Up wireless network</div>
            <div><strong>Nintendo Switch:</strong> System Settings → Internet</div>
          </div>
        </div>
      </div>

      <h2 id="troubleshooting">Troubleshooting Common Issues</h2>

      <h3>Can&apos;t Access Router Admin Panel</h3>
      <GuideCallout kind="danger" label="Try these solutions:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Make sure you&apos;re connected to the router&apos;s WiFi network</li>
          <li>Try different IP addresses: 192.168.1.1, 192.168.0.1, 10.0.0.1</li>
          <li>Clear browser cache or try a different browser</li>
          <li>Disable VPN or proxy if enabled</li>
          <li>Check router label for specific IP address</li>
          <li>Reset router to factory settings (last resort)</li>
        </ul>
      </GuideCallout>

      <h3>Forgot Admin Password</h3>
      <GuideCallout kind="warning" label="Recovery options:">
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Check router label for default credentials</li>
          <li>Try common defaults: admin/admin, admin/password</li>
          <li>Look for password reset button (usually recessed)</li>
          <li>Contact ISP if it&apos;s their provided router</li>
          <li>Factory reset as last option (loses all settings)</li>
        </ol>
      </GuideCallout>

      <h3>WiFi Network Not Appearing</h3>
      <GuideCallout kind="success" label="Check these settings:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Verify WiFi is enabled in router settings</li>
          <li>Check if network name (SSID) broadcast is enabled</li>
          <li>Confirm you&apos;re looking at the correct frequency (2.4GHz vs 5GHz)</li>
          <li>Restart router and wait 2-3 minutes</li>
          <li>Check for interference from other networks</li>
        </ul>
      </GuideCallout>

      <h3>Devices Won&apos;t Connect with New Password</h3>
      <GuideCallout kind="success" label="Troubleshooting steps:">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Double-check password spelling and case sensitivity</li>
          <li>&quot;Forget&quot; the network on device and reconnect from scratch</li>
          <li>Restart the device and try connecting again</li>
          <li>Ensure device supports the security type (WPA3 compatibility)</li>
          <li>Try connecting to guest network if available</li>
          <li>Contact device manufacturer for older device issues</li>
        </ul>
      </GuideCallout>

      <h2 id="security-best-practices">Security Best Practices</h2>
      <h3>Router Security</h3>
      <ul>
        <li>Change default admin username and password</li>
        <li>Enable automatic firmware updates</li>
        <li>Disable WPS (WiFi Protected Setup)</li>
        <li>Enable guest network for visitors</li>
        <li>Consider hiding network name (SSID)</li>
        <li>Enable MAC address filtering for high security</li>
      </ul>
      <h3>Password Management</h3>
      <ul>
        <li>Use a password manager to store WiFi passwords</li>
        <li>Generate new passwords every 6-12 months</li>
        <li>Share passwords securely (avoid text messages)</li>
        <li>Keep a secure physical backup of critical passwords</li>
        <li>Don&apos;t use personal information in passwords</li>
        <li>Consider separate IoT device network</li>
      </ul>

      <h2 id="quick-reference">Quick Reference Cards</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Home Setup Checklist</h4>
          <ul className={cardListClass}>
            <li>Generate strong password</li>
            <li>Access router admin panel</li>
            <li>Set WPA2/WPA3 security</li>
            <li>Apply new password</li>
            <li>Reconnect all devices</li>
            <li>Test internet on each device</li>
            <li>Document password securely</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Business Setup Checklist</h4>
          <ul className={cardListClass}>
            <li>Plan downtime window</li>
            <li>Notify all users in advance</li>
            <li>Set enterprise security mode</li>
            <li>Configure guest network</li>
            <li>Update network documentation</li>
            <li>Test critical business devices</li>
            <li>Train staff on new procedures</li>
          </ul>
        </div>
        <div className={cardClass}>
          <h4 className={cardTitleClass}>Emergency Recovery</h4>
          <ul className={cardListClass}>
            <li>Try default credentials</li>
            <li>Check router label/manual</li>
            <li>Contact ISP for support</li>
            <li>Factory reset if necessary</li>
            <li>Reconfigure from scratch</li>
            <li>Restore from backup if available</li>
            <li>Document new settings</li>
          </ul>
        </div>
      </div>

      <GuideCallout kind="success" label="Need a strong WiFi password?">
        Generate secure, router-compatible WiFi passwords with our specialized WiFi password generator.
        It creates passwords optimized for WPA2 and WPA3 networks with the right length and character requirements.
        Use strong passwords (16+ characters for WPA2, 12+ for WPA3) with a mix of letters, numbers, and symbols
        for maximum security against brute force attacks.
      </GuideCallout>
    </article>
  );
}
