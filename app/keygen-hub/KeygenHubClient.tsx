'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Generator {
  id: string
  name: string
  description: string
  href: string
  category: string
  icon: string
  popular: boolean
  security: 'high' | 'medium' | 'basic'
  useCases: string[]
}

// Icon renderer
const renderIcon = (iconName: string) => {
  const iconClass = "w-5 h-5"
  
  switch (iconName) {
    case 'lock':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    case 'key':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'code':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    case 'wifi':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    case 'globe':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    case 'hash':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      )
    case 'user':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'search':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
  }
}

const generators: Generator[] = [
  // Passwords & Authentication
  {
    id: 'password',
    name: 'Strong Password Generator',
    description: 'Generate secure passwords with customizable length and character sets',
    href: '/password',
    category: 'passwords',
    icon: 'lock',
    popular: true,
    security: 'high',
    useCases: ['User accounts', 'Personal security', 'Admin passwords']
  },
  {
    id: 'passphrase',
    name: 'Memorable Passphrase',
    description: 'Human-friendly passphrases using dictionary words',
    href: '/passphrase',
    category: 'passwords',
    icon: 'user',
    popular: true,
    security: 'high',
    useCases: ['Master passwords', 'Disk encryption', 'Personal vaults']
  },
  {
    id: 'wifi-password',
    name: 'WiFi Password',
    description: 'Generate secure passwords for wireless networks',
    href: '/wifi-password',
    category: 'passwords',
    icon: 'wifi',
    popular: true,
    security: 'high',
    useCases: ['Home networks', 'Business WiFi', 'Guest access']
  },

  // Encryption & Security Keys  
  {
    id: 'encryption-key',
    name: 'AES Encryption Keys',
    description: 'Generate AES-128, AES-192, and AES-256 encryption keys with IVs',
    href: '/encryption-key',
    category: 'encryption',
    icon: 'shield',
    popular: true,
    security: 'high',
    useCases: ['File encryption', 'Database security', 'Application encryption']
  },
  {
    id: 'ssh-key',
    name: 'SSH Keys',
    description: 'Generate SSH key pairs for secure server authentication',
    href: '/ssh-key',
    category: 'encryption',
    icon: 'key',
    popular: true,
    security: 'high',
    useCases: ['Server access', 'Git repositories', 'Remote administration']
  },
  {
    id: 'rsa-key',
    name: 'RSA Key Pairs',
    description: 'Generate RSA public/private key pairs for asymmetric encryption',
    href: '/rsa-key',
    category: 'encryption',
    icon: 'key',
    popular: false,
    security: 'high',
    useCases: ['Digital signatures', 'SSL certificates', 'Secure communication']
  },

  // Development & API
  {
    id: 'api-key',
    name: 'API Key Generator',
    description: 'Generate API keys and tokens for web services',
    href: '/api-key',
    category: 'development',
    icon: 'code',
    popular: true,
    security: 'high',
    useCases: ['REST APIs', 'Service authentication', 'Third-party integrations']
  },
  {
    id: 'jwt-secret',
    name: 'JWT Secret Keys',
    description: 'Generate HMAC secrets for JWT token signing',
    href: '/jwt-secret',
    category: 'development',
    icon: 'code',
    popular: true,
    security: 'high',
    useCases: ['Web authentication', 'Microservices', 'Session management']
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate unique identifiers (UUIDs) for databases and applications',
    href: '/uuid',
    category: 'development',
    icon: 'hash',
    popular: true,
    security: 'medium',
    useCases: ['Database keys', 'Session IDs', 'Resource identifiers']
  },

  // Framework-Specific
  {
    id: 'django-secret',
    name: 'Django Secret Key',
    description: 'Generate Django SECRET_KEY for application security',
    href: '/django-secret-key',
    category: 'frameworks',
    icon: 'code',
    popular: false,
    security: 'high',
    useCases: ['Django projects', 'Python web apps', 'Session security']
  },
  {
    id: 'laravel-key',
    name: 'Laravel App Key',
    description: 'Generate Laravel application encryption keys',
    href: '/laravel-key',
    category: 'frameworks',
    icon: 'code',
    popular: false,
    security: 'high',
    useCases: ['Laravel projects', 'PHP applications', 'Data encryption']
  },

  // Specialized
  {
    id: 'backup-codes',
    name: 'Backup Codes',
    description: 'Generate backup authentication codes',
    href: '/backup-codes',
    category: 'specialized',
    icon: 'shield',
    popular: false,
    security: 'high',
    useCases: ['2FA recovery', 'Account backup', 'Emergency access']
  },
]

const categories = [
  { id: 'all', name: 'All Generators', count: generators.length },
  { id: 'passwords', name: 'Passwords', count: generators.filter(g => g.category === 'passwords').length },
  { id: 'encryption', name: 'Encryption Keys', count: generators.filter(g => g.category === 'encryption').length },
  { id: 'development', name: 'Development', count: generators.filter(g => g.category === 'development').length },
  { id: 'frameworks', name: 'Frameworks', count: generators.filter(g => g.category === 'frameworks').length },
  { id: 'specialized', name: 'Specialized', count: generators.filter(g => g.category === 'specialized').length },
]

export default function KeygenHubClient() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGenerators = generators.filter(generator => {
    const matchesCategory = selectedCategory === 'all' || generator.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      generator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generator.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const popularGenerators = generators.filter(g => g.popular)

  const getSecurityBadgeColor = (security: string) => {
    switch (security) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="page-container pb-12">
      {/* Header */}
      <section className="pt-8 pb-10">
        <div className="eyebrow mb-2.5 text-12 tracking-[0.1em]">All generators</div>
        <h1 className="mb-2.5 text-2xl font-bold tracking-[-0.01em] sm:text-31">
          Keygen Hub
        </h1>
        <p className="mb-6 max-w-[68ch] text-16 leading-relaxed text-[var(--muted)]">
          Your complete collection of key generators. From passwords to encryption keys, API tokens to JWT secrets —
          everything you need for secure key generation in one place.
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            {renderIcon('search')}
          </div>
          <input
            type="text"
            placeholder="Search generators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-15"
          />
        </div>
      </section>

      {/* Popular Generators */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold tracking-[-0.01em]">Most popular</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularGenerators.map((generator) => (
            <Link 
              key={generator.id}
              href={generator.href}
              className="group p-6 bg-[var(--code-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--accent)] bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
                  {renderIcon(generator.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {generator.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-3">
                    {generator.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityBadgeColor(generator.security)}`}>
                      {generator.security} security
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Popular
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'bg-[var(--code-bg)] border border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </section>

      {/* All Generators */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory === 'all' ? 'All Generators' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <span className="text-sm text-[var(--muted)]">
            {filteredGenerators.length} generator{filteredGenerators.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenerators.map((generator) => (
            <Link 
              key={generator.id}
              href={generator.href}
              className="group p-6 bg-[var(--code-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-[var(--accent)] bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-all">
                  {renderIcon(generator.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {generator.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-3">
                    {generator.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityBadgeColor(generator.security)}`}>
                    {generator.security} security
                  </span>
                  {generator.popular && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Popular
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-1">Common uses:</p>
                  <div className="flex flex-wrap gap-1">
                    {generator.useCases.slice(0, 2).map((useCase, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-[var(--background)] rounded">
                        {useCase}
                      </span>
                    ))}
                    {generator.useCases.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-[var(--background)] rounded text-[var(--muted)]">
                        +{generator.useCases.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGenerators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--muted)] text-lg mb-4">No generators found matching your search.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="btn btn-primary"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Security Notice */}
      <section className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">
          Security & Best Practices
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li>• All generation happens locally in your browser</li>
            <li>• Keys are never transmitted to our servers</li>
            <li>• Use HTTPS-only for production deployments</li>
            <li>• Generate keys on secure, isolated machines when possible</li>
          </ul>
          <ul className="space-y-2">
            <li>• Store generated keys securely (password managers, vaults)</li>
            <li>• Rotate keys regularly based on your security policy</li>
            <li>• Never share keys via insecure channels</li>
            <li>• Test your implementation in staging environments first</li>
          </ul>
        </div>
      </section>
    </div>
  )
}