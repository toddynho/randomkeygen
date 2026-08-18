'use client'

import { useState } from 'react'
import { SecurityNotice, TerminalCommand, CodeBlock } from '../../components'

interface SshSetupGuideClientProps {
  breadcrumbItems?: Array<{ name: string; url: string }>
}

export default function SshSetupGuideClient(_props: SshSetupGuideClientProps) {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux'>('windows')

  return (
    <article className="guide-article">
      <header className="guide-article-header">
        <p className="eyebrow">Guide · Developer security</p>
        <h1>SSH Key Setup Guide</h1>
        <p className="guide-deck">
          Complete step-by-step SSH key setup guide for Windows, Mac, and Linux. Learn to generate, configure, and troubleshoot SSH keys for GitHub, GitLab, and secure server access.
        </p>
      </header>
      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What are SSH Keys?</h2>
        <div className="prose max-w-none">
          <p className="mb-4">
            SSH (Secure Shell) keys are a secure way to authenticate with remote servers and services like GitHub, GitLab, 
            and cloud platforms. Instead of typing passwords, SSH keys use cryptographic key pairs to verify your identity.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔑 Public Key</h3>
              <p className="text-sm text-blue-700">
                Shared with servers and services. Safe to copy and paste anywhere. 
                Acts like a padlock that others can see.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔐 Private Key</h3>
              <p className="text-sm text-green-700">
                Kept secret on your computer. Never share this! 
                Acts like the key that opens the padlock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating System Selection */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Choose Your Operating System</h2>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { os: 'windows', label: 'Windows', icon: '🪟' },
            { os: 'mac', label: 'macOS', icon: '🍎' },
            { os: 'linux', label: 'Linux', icon: '🐧' }
          ].map(({ os, label, icon }) => (
            <button
              key={os}
              onClick={() => setSelectedOS(os as any)}
              className={`p-4 text-center border rounded-lg transition-colors ${
                selectedOS === os 
                  ? 'bg-blue-50 border-blue-200 text-blue-800' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-medium">{label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Step-by-Step Instructions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Step-by-Step Setup</h2>

        {/* Step 1: Generate SSH Key */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Step 1: Generate Your SSH Key</h3>
          
          {selectedOS === 'windows' && (
            <div className="space-y-4">
              <p className="mb-3">
                <strong>Option A: Using Windows Terminal or PowerShell (Recommended)</strong>
              </p>
              <TerminalCommand 
                command="ssh-keygen -t ed25519 -C 'your.email@example.com'"
                description="Generate Ed25519 key (most secure and fast)"
              />
              <p className="text-sm text-gray-600 mb-3">
                If your system doesn't support Ed25519, use RSA instead:
              </p>
              <TerminalCommand 
                command="ssh-keygen -t rsa -b 4096 -C 'your.email@example.com'"
                description="Generate 4096-bit RSA key (older systems)"
              />
              <p className="mb-3">
                <strong>Option B: Using Git Bash</strong>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                If you have Git for Windows installed, open Git Bash and use the same commands above.
              </p>
            </div>
          )}

          {selectedOS === 'mac' && (
            <div className="space-y-4">
              <p className="mb-3">Open Terminal (Applications → Utilities → Terminal) and run:</p>
              <TerminalCommand 
                command="ssh-keygen -t ed25519 -C 'your.email@example.com'"
                description="Generate Ed25519 key (recommended for macOS 10.12+)"
              />
              <p className="text-sm text-gray-600 mb-3">
                For older macOS versions, use RSA:
              </p>
              <TerminalCommand 
                command="ssh-keygen -t rsa -b 4096 -C 'your.email@example.com'"
                description="Generate 4096-bit RSA key (older macOS versions)"
              />
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="space-y-4">
              <p className="mb-3">Open your terminal and run:</p>
              <TerminalCommand 
                command="ssh-keygen -t ed25519 -C 'your.email@example.com'"
                description="Generate Ed25519 key (recommended)"
              />
              <p className="text-sm text-gray-600 mb-3">
                If Ed25519 is not available, use RSA:
              </p>
              <TerminalCommand 
                command="ssh-keygen -t rsa -b 4096 -C 'your.email@example.com'"
                description="Generate 4096-bit RSA key (alternative)"
              />
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚡ During Key Generation:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li><strong>File location:</strong> Press Enter to use default location (~/.ssh/id_ed25519)</li>
              <li><strong>Passphrase:</strong> Enter a strong passphrase for extra security (recommended)</li>
              <li><strong>Confirm passphrase:</strong> Enter the same passphrase again</li>
            </ul>
          </div>
        </div>

        {/* Step 2: Add to SSH Agent */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Step 2: Add Key to SSH Agent</h3>

          {selectedOS === 'windows' && (
            <div className="space-y-4">
              <p className="mb-3">Start the SSH agent and add your key:</p>
              <TerminalCommand 
                command="eval $(ssh-agent -s)"
                description="Start SSH agent"
              />
              <TerminalCommand 
                command="ssh-add ~/.ssh/id_ed25519"
                description="Add your SSH key to the agent"
              />
              <p className="text-sm text-gray-600">
                If you used RSA, replace <code>id_ed25519</code> with <code>id_rsa</code>
              </p>
            </div>
          )}

          {selectedOS === 'mac' && (
            <div className="space-y-4">
              <p className="mb-3">Start the SSH agent and add your key to the keychain:</p>
              <TerminalCommand 
                command='eval "$(ssh-agent -s)"'
                description="Start SSH agent"
              />
              <TerminalCommand 
                command="ssh-add --apple-use-keychain ~/.ssh/id_ed25519"
                description="Add key to macOS keychain"
              />
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Create or modify <code>~/.ssh/config</code> to automatically load keys:
                </p>
                <CodeBlock
                  code={`Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

Host gitlab.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519`}
                  filename="~/.ssh/config"
                />
              </div>
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="space-y-4">
              <p className="mb-3">Start the SSH agent and add your key:</p>
              <TerminalCommand 
                command='eval "$(ssh-agent -s)"'
                description="Start SSH agent"
              />
              <TerminalCommand 
                command="ssh-add ~/.ssh/id_ed25519"
                description="Add your SSH key to the agent"
              />
            </div>
          )}
        </div>

        {/* Step 3: Copy Public Key */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Step 3: Copy Your Public Key</h3>

          {selectedOS === 'windows' && (
            <div className="space-y-4">
              <p className="mb-3">Copy your public key to clipboard:</p>
              <TerminalCommand 
                command="clip < ~/.ssh/id_ed25519.pub"
                description="Copy public key to clipboard (Windows)"
              />
              <p className="text-sm text-gray-600 mb-3">
                Alternative method if clip doesn't work:
              </p>
              <TerminalCommand 
                command="cat ~/.ssh/id_ed25519.pub"
                description="Display public key to copy manually"
              />
            </div>
          )}

          {selectedOS === 'mac' && (
            <div className="space-y-4">
              <p className="mb-3">Copy your public key to clipboard:</p>
              <TerminalCommand 
                command="pbcopy < ~/.ssh/id_ed25519.pub"
                description="Copy public key to clipboard (macOS)"
              />
              <p className="text-sm text-gray-600 mb-3">
                Alternative method:
              </p>
              <TerminalCommand 
                command="cat ~/.ssh/id_ed25519.pub"
                description="Display public key to copy manually"
              />
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="space-y-4">
              <p className="mb-3">Copy your public key:</p>
              <TerminalCommand 
                command="cat ~/.ssh/id_ed25519.pub"
                description="Display public key to copy"
              />
              <p className="text-sm text-gray-600 mb-3">
                If you have xclip installed, you can copy to clipboard:
              </p>
              <TerminalCommand 
                command="xclip -selection clipboard < ~/.ssh/id_ed25519.pub"
                description="Copy to clipboard (if xclip is installed)"
              />
            </div>
          )}
        </div>
      </section>

      {/* Platform-Specific Setup */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Platform Setup</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* GitHub Setup */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🐙</span> GitHub Setup
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://github.com/settings/keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener">GitHub SSH Settings</a></li>
              <li>Click "New SSH key"</li>
              <li>Give it a descriptive title (e.g., "My Laptop - 2024")</li>
              <li>Paste your public key into the "Key" field</li>
              <li>Click "Add SSH key"</li>
              <li>Test with: <code className="bg-white px-1 rounded">ssh -T git@github.com</code></li>
            </ol>
          </div>

          {/* GitLab Setup */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🦊</span> GitLab Setup
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://gitlab.com/-/profile/keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener">GitLab SSH Keys</a></li>
              <li>Paste your public key into the "Key" field</li>
              <li>Add a descriptive title</li>
              <li>Set expiration date (optional but recommended)</li>
              <li>Click "Add key"</li>
              <li>Test with: <code className="bg-white px-1 rounded">ssh -T git@gitlab.com</code></li>
            </ol>
          </div>

          {/* Cloud Providers */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">☁️</span> Cloud Providers
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong>AWS:</strong>
                <p>Import key in EC2 Console → Key Pairs → Import Key Pair</p>
              </div>
              <div>
                <strong>Google Cloud:</strong>
                <p>Add in Compute Engine → Metadata → SSH Keys</p>
              </div>
              <div>
                <strong>DigitalOcean:</strong>
                <p>Add in Account → Security → SSH Keys</p>
              </div>
            </div>
          </div>

          {/* Server Setup */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🖥️</span> Your Own Server
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Connect to your server via password/existing method</li>
              <li>Create SSH directory: <code className="bg-white px-1 rounded">mkdir -p ~/.ssh</code></li>
              <li>Add your public key: <code className="bg-white px-1 rounded">echo "your-public-key" &gt;&gt; ~/.ssh/authorized_keys</code></li>
              <li>Set permissions: <code className="bg-white px-1 rounded">chmod 600 ~/.ssh/authorized_keys</code></li>
              <li>Set directory permissions: <code className="bg-white px-1 rounded">chmod 700 ~/.ssh</code></li>
            </ol>
          </div>
        </div>
      </section>

      {/* Testing Your Setup */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Testing Your Setup</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Test GitHub Connection</h3>
            <TerminalCommand 
              command="ssh -T git@github.com"
              description="Should return: Hi username! You've successfully authenticated..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Test GitLab Connection</h3>
            <TerminalCommand 
              command="ssh -T git@gitlab.com"
              description="Should return: Welcome to GitLab, username!"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Clone a Repository</h3>
            <TerminalCommand 
              command="git clone git@github.com:username/repository.git"
              description="Clone using SSH instead of HTTPS"
            />
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Common Issues & Solutions</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❌ "Permission denied (publickey)"</h3>
            <div className="text-sm text-red-700 space-y-2">
              <p><strong>Causes & Solutions:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>SSH agent not running: Run <code>eval $(ssh-agent -s)</code></li>
                <li>Key not added to agent: Run <code>ssh-add ~/.ssh/id_ed25519</code></li>
                <li>Wrong key file: Check if you're using the right key name</li>
                <li>Public key not added to platform: Re-add your public key</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ "Could not open a connection to your authentication agent"</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>Solution:</strong> Start the SSH agent first:</p>
              <TerminalCommand command="eval $(ssh-agent -s)" />
              <p>Then add your key: <code>ssh-add ~/.ssh/id_ed25519</code></p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ "Host key verification failed"</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Solution:</strong> Remove the problematic host key:</p>
              <TerminalCommand command="ssh-keygen -R hostname-or-ip" />
              <p>Then try connecting again to accept the new host key.</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">💡 Debug Connection Issues</h3>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>Use verbose mode to see what's happening:</strong></p>
              <TerminalCommand command="ssh -vT git@github.com" />
              <p>This will show detailed connection information to help debug issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security Best Practices</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">🔒 Key Security</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Always use a strong passphrase for your private key</li>
              <li>Never share your private key with anyone</li>
              <li>Use Ed25519 keys for better security and performance</li>
              <li>Generate separate keys for different purposes if needed</li>
              <li>Regularly rotate your SSH keys (annually)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">⚙️ Configuration Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Set up SSH config file (~/.ssh/config) for convenience</li>
              <li>Use different keys for personal and work accounts</li>
              <li>Set key expiration dates where supported</li>
              <li>Keep your SSH client updated</li>
              <li>Monitor your account's SSH key list regularly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Advanced SSH Config */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Advanced: SSH Config File</h2>
        <p className="mb-4">
          Create a <code>~/.ssh/config</code> file to simplify SSH connections and manage multiple accounts:
        </p>
        
        <CodeBlock
          filename="~/.ssh/config"
          code={`# Personal GitHub account
Host github.com
  HostName github.com
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

# Work GitHub account
Host github-work
  HostName github.com
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519_work

# GitLab
Host gitlab.com
  HostName gitlab.com
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

# Custom server
Host myserver
  HostName your-server.com
  User yourusername
  Port 22
  IdentityFile ~/.ssh/id_ed25519
  ForwardAgent yes`}
        />

        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Usage:</strong> With this config, you can simply use <code>git clone github-work:company/repo.git</code> 
            or <code>ssh myserver</code> instead of typing full commands.
          </p>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Related Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/ssh-key" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-blue-600">SSH Key Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Generate SSH key pairs online</p>
          </a>
          <a href="/password" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-blue-600">Password Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Create strong passphrases for your keys</p>
          </a>
          <a href="/pgp-key" className="block p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors">
            <h3 className="font-semibold text-blue-600">PGP Key Generator</h3>
            <p className="text-sm text-gray-600 mt-1">Generate PGP keys for encryption</p>
          </a>
        </div>
      </section>

      {/* Security Notice */}
      <SecurityNotice type="warning">
        <strong>Security Reminder:</strong> Your private SSH key is like a password to all your accounts. 
        Never share it, always use a passphrase, and store it securely. If you suspect your key has been 
        compromised, immediately remove it from all services and generate a new one.
      </SecurityNotice>
    </article>
  )
}
