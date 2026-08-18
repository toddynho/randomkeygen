'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generators } from '../lib/crypto'
import {
  GeneratorLayout,
  GeneratorControls,
  OutputDisplay,
  ControlField,
  Toast,
  useToast,
  useRegenerateHotkey,
  SecurityNotice,
  TerminalCommand,
  BulkGenerator,
  CodeBlock,
} from '../components'

// Mirrors generators.djangoSecret: 50 characters drawn from this 50-character pool.
const DJANGO_CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
const KEY_LENGTH = 50
const KEY_BITS = Math.round(KEY_LENGTH * Math.log2(DJANGO_CHARSET.length))

interface DjangoSecretKeyPageClientProps {
  breadcrumbItems: Array<{ name: string; url: string }>
  schema?: Record<string, unknown>[]
}

export default function DjangoSecretKeyPageClient({ breadcrumbItems, schema }: DjangoSecretKeyPageClientProps) {
  const [values, setValues] = useState<string[]>(() => Array.from({ length: 4 }, () => ''))
  const [toastMessage, flash] = useToast()

  const generateSecret = useCallback(() => {
    return generators.djangoSecret()
  }, [])

  const generateAll = useCallback(() => {
    setValues(Array.from({ length: 4 }, () => generateSecret()))
  }, [generateSecret])

  const regenerateValue = useCallback((index: number) => {
    setValues((current) => {
      const next = [...current]
      next[index] = generateSecret()
      return next
    })
  }, [generateSecret])

  useEffect(() => {
    generateAll()
  }, [generateAll])

  const handleGenerate = useCallback(() => {
    generateAll()
    flash('Generated new secrets')
  }, [generateAll, flash])

  const handleRegenerateAll = useCallback(() => {
    generateAll()
    flash('Regenerated all')
  }, [generateAll, flash])

  // `R` regenerates everything when no field has focus
  useRegenerateHotkey(handleRegenerateAll)

  const getBits = useCallback(() => KEY_BITS, [])

  return (
    <GeneratorLayout
      title="Django SECRET_KEY Generator"
      description="Generate secure SECRET_KEY values for Django projects. Uses the same character set and length as Django's default key generation."
      breadcrumbItems={breadcrumbItems}
      schema={schema}
      storageCallout={
        <div className="space-y-4">
          <SecurityNotice type="warning" title="Never commit secrets">
            <p>
              Store your SECRET_KEY in environment variables or a secrets manager.
              Never commit it to version control. Consider using packages like
              <code className="mx-1">python-decouple</code> or <code className="mx-1">django-environ</code>.
            </p>
            <p className="mt-2">
              <Link href="/guides/api-key-best-practices" className="font-semibold text-[var(--accent)] hover:underline">
                API key &amp; secret handling best practices →
              </Link>
            </p>
          </SecurityNotice>

          <SecurityNotice type="info" title="What SECRET_KEY is used for">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Cryptographic signing (sessions, cookies, password reset tokens)</li>
              <li>CSRF protection tokens</li>
              <li>Unique salts for password hashing</li>
              <li>Any use of Django&apos;s signing framework</li>
            </ul>
            <p className="mt-2">
              Changing SECRET_KEY will invalidate all existing sessions and signed data.
            </p>
          </SecurityNotice>
        </div>
      }
    >
      {/* Options */}
      <GeneratorControls
        onGenerate={handleGenerate}
        generateLabel="Generate secrets"
        readout={{ bits: KEY_BITS, poolSize: DJANGO_CHARSET.length }}
      >
        <ControlField label="Format">
          <span className="text-sm">
            {KEY_LENGTH} characters, Django&apos;s default charset
          </span>
        </ControlField>
      </GeneratorControls>

      {/* Generated secrets */}
      <OutputDisplay
        values={values}
        noun="secrets"
        getBits={getBits}
        onRegenerate={regenerateValue}
        onRegenerateAll={handleRegenerateAll}
      />

      {/* Usage Examples */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Use in Django</h2>
        <div className="space-y-4">
          <h3 className="font-medium">Basic settings.py</h3>
          <CodeBlock
            filename="myproject/settings.py"
            language="python"
            code={`# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '${values[0] || 'your-secret-key-here'}'

# Other settings...
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']`}
          />

          <h3 className="font-medium">Environment Variables (Recommended)</h3>
          <CodeBlock
            filename=".env"
            code={`DJANGO_SECRET_KEY=${values[0] || 'your-secret-key-here'}
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`}
          />

          <CodeBlock
            filename="myproject/settings.py"
            language="python"
            code={`import os
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name):
    """Get the environment variable or return exception."""
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = f"Set the {var_name} environment variable"
        raise ImproperlyConfigured(error_msg)

SECRET_KEY = get_env_variable('DJANGO_SECRET_KEY')
DEBUG = get_env_variable('DJANGO_DEBUG') == 'True'
ALLOWED_HOSTS = get_env_variable('DJANGO_ALLOWED_HOSTS').split(',')`}
          />

          <h3 className="font-medium">Docker Compose</h3>
          <CodeBlock
            filename="docker-compose.yml"
            language="yaml"
            code={`version: '3.8'
services:
  web:
    build: .
    environment:
      - DJANGO_SECRET_KEY=${values[0] || 'your-secret-key-here'}
      - DJANGO_DEBUG=False
    ports:
      - "8000:8000"`}
          />

          <h3 className="font-medium">Using python-decouple</h3>
          <CodeBlock
            filename="requirements.txt"
            code="python-decouple==3.8"
          />
          <CodeBlock
            filename="myproject/settings.py"
            language="python"
            code={`from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)`}
          />
        </div>
      </section>

      {/* Django Version Compatibility */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Django Version Compatibility</h2>
        <div className="card p-4">
          <div className="space-y-4 text-[var(--muted)]">
            <p>
              Our SECRET_KEY format is compatible with all Django versions:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-2">Django 4.x+ (Current LTS)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Full compatibility with new security features</li>
                  <li>Works with new CSRF and session implementations</li>
                  <li>Compatible with async views and middleware</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-2">Django 3.x (LTS)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Fully compatible with all 3.x features</li>
                  <li>Same character set as django-admin startproject</li>
                  <li>Works with all cryptographic signing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-2">Django 2.x</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Compatible with legacy 2.x installations</li>
                  <li>Supports all session and CSRF functionality</li>
                  <li>Works with older Python versions (3.6+)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[var(--foreground)] mb-2">Django 1.x</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Works with Django 1.8+ (older LTS versions)</li>
                  <li>Compatible with legacy project structures</li>
                  <li>Note: Consider upgrading to supported versions</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 rounded-[10px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-3">
              <div className="font-medium text-[var(--accent-strong)]">Migration Tip</div>
              <p className="text-sm mt-1 text-[var(--muted)]">
                When upgrading Django versions, you typically don&apos;t need to regenerate your SECRET_KEY.
                The same key will work across versions, maintaining session continuity for users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Generation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bulk Generation</h2>
        <BulkGenerator
          generateFn={generateSecret}
          getBits={getBits}
          label="secrets"
        />
      </section>

      {/* Terminal Commands */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Generate in Terminal</h2>
        <p className="text-[var(--muted)] text-sm mb-4">
          For production, generate the key on your server:
        </p>
        <div className="space-y-3">
          <TerminalCommand
            command={`python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`}
            description="Django's built-in generator"
          />
          <TerminalCommand
            command={`python3 -c "import secrets; import string; chars = string.ascii_lowercase + string.digits + '!@#$%^&*(-_=+)'; print(''.join(secrets.choice(chars) for _ in range(50)))"`}
            description="Python secrets module"
          />
          <TerminalCommand
            command="openssl rand -base64 50 | tr -dc 'a-zA-Z0-9!@#$%^&*(-_=+)' | head -c 50"
            description="OpenSSL"
          />
        </div>
      </section>

      <Toast message={toastMessage} />
    </GeneratorLayout>
  )
}
