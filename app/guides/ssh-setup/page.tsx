import type { Metadata } from 'next'
import SshSetupGuideClient from './SshSetupGuideClient'

export const metadata: Metadata = {
  title: 'SSH Key Setup Guide - Complete Tutorial for GitHub, GitLab & More | RandomKeygen',
  description: 'Complete step-by-step SSH key setup guide for Windows, Mac, and Linux. Learn to generate, configure, and troubleshoot SSH keys for GitHub, GitLab, and secure server access.',
  keywords: ['ssh key setup guide', 'ssh key tutorial', 'github ssh key', 'gitlab ssh key', 'ssh key configuration', 'ssh key troubleshooting', 'ssh key security', 'generate ssh key'],
  openGraph: {
    title: 'SSH Key Setup Guide - Complete Tutorial for GitHub & GitLab',
    description: 'Complete step-by-step SSH key setup guide for all operating systems with troubleshooting tips.',
    url: 'https://randomkeygen.com/guides/ssh-setup',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/guides/ssh-setup',
  },
}

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Guides', url: '/guides' },
  { name: 'SSH Key Setup', url: '/guides/ssh-setup' }
]

export default function SshSetupGuidePage() {
  return <SshSetupGuideClient breadcrumbItems={breadcrumbItems} />
}