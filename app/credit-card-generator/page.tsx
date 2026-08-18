import type { Metadata } from 'next'
import CreditCardGeneratorPageClient from './CreditCardGeneratorPageClient'

export const metadata: Metadata = {
  title: 'Test Credit Card Generator - Generate Valid Test Card Numbers | RandomKeygen',
  description: 'Generate valid test credit card numbers for development and testing. Creates Luhn-valid card numbers for Visa, Mastercard, Amex. For testing only - not real cards.',
  keywords: ['test credit card generator', 'fake credit card for testing', 'credit card number generator', 'test card numbers', 'stripe test card', 'development credit card'],
  openGraph: {
    title: 'Test Credit Card Generator - Development Testing Cards',
    description: 'Generate valid test credit card numbers for development and testing.',
    url: 'https://randomkeygen.com/credit-card-generator',
  },
  alternates: {
    canonical: 'https://randomkeygen.com/credit-card-generator',
  },
}

export default function CreditCardGeneratorPage() {
  return <CreditCardGeneratorPageClient />
}
