import React from 'react';

interface SoftwareApplicationStructuredDataProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  softwareVersion?: string;
  screenshot?: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  steps: {
    name: string;
    text: string;
    url?: string;
  }[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

interface FAQStructuredDataProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function SoftwareApplicationStructuredData({ 
  name, 
  description, 
  url, 
  applicationCategory = "SecurityApplication",
  operatingSystem = "Any",
  offers = { price: "0", priceCurrency: "USD" },
  softwareVersion = "1.0",
  screenshot
}: SoftwareApplicationStructuredDataProps) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.priceCurrency
    },
    "softwareVersion": softwareVersion,
    "author": {
      "@type": "Organization",
      "name": "RandomKeygen"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "RandomKeygen"
    },
    "downloadUrl": url,
    "featureList": [
      "Cryptographically secure generation",
      "Client-side processing", 
      "No data storage",
      "Open source",
      "Free to use"
    ],
    "requirements": "Web browser with JavaScript enabled",
    "softwareHelp": {
      "@type": "CreativeWork",
      "url": url
    }
  };

  if (screenshot) {
    structuredData.screenshot = screenshot;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

export function HowToStructuredData({ 
  name, 
  description, 
  steps, 
  totalTime,
  estimatedCost 
}: HowToStructuredDataProps) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url
    }))
  };

  if (totalTime) {
    structuredData.totalTime = totalTime;
  }

  if (estimatedCost) {
    structuredData.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
