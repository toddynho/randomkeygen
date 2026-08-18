// Performance Optimization Utilities
// RandomKeygen Site-wide Speed Enhancements

/**
 * Resource hints for critical performance paths
 * These should be added to pages that need fastest loading
 */
export const CRITICAL_RESOURCE_HINTS = {
  // DNS prefetching for external resources
  dnsPrefetch: [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//github.com',
    '//api.github.com'
  ],
  
  // Preconnect for resources we'll definitely use
  preconnect: [
    { href: 'https://fonts.googleapis.com' },
    { href: 'https://fonts.gstatic.com', crossOrigin: true }
  ],
  
  // Preload critical assets
  preload: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Berkeley+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap',
      as: 'style'
    }
  ]
};

/**
 * Critical CSS inlining for above-the-fold content
 * Reduces render-blocking requests for key pages
 */
export const CRITICAL_CSS = `
  /* Critical CSS for initial render - prevents FOUC */
  body { 
    font-family: system-ui, -apple-system, sans-serif; 
    margin: 0;
    line-height: 1.6;
  }
  .header { 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
  }
  .container { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 1rem; 
  }
  .generator-form {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 2rem 0;
  }
  .btn-primary {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
`;

/**
 * Font loading optimization strategies
 */
export const FONT_LOADING_STRATEGY = {
  // Use font-display: swap for better perceived performance
  fontDisplay: 'swap',
  
  // Preload key font variants
  preloadFonts: [
    '/fonts/berkeley-mono-regular.woff2',
    '/fonts/geist-regular.woff2',
    '/fonts/geist-medium.woff2'
  ],
  
  // Font fallback stack
  fallbackStack: {
    mono: 'ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
};

/**
 * Third-party script optimization using Partytown approach
 * Moves non-critical scripts to web workers
 */
export const THIRD_PARTY_SCRIPTS = {
  // Scripts that can run in web workers
  nonCritical: [
    {
      src: '/analytics/analytics.js',
      strategy: 'worker',
      defer: true
    }
  ],
  
  // Critical scripts that must run on main thread
  critical: [
    {
      src: '/sw-register.js',
      strategy: 'beforeInteractive'
    }
  ]
};

/**
 * Image optimization settings
 */
export const IMAGE_OPTIMIZATION = {
  // Lazy loading for images below the fold
  lazyLoadingOffset: '50px',
  
  // WebP/AVIF formats with fallbacks
  modernFormats: ['avif', 'webp'],
  
  // Responsive image sizes
  responsiveSizes: {
    mobile: '(max-width: 640px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw'
  }
};

/**
 * Service Worker registration with performance focus
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Update available notification
          registration.addEventListener('updatefound', () => {
            console.log('New SW version available');
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

/**
 * Core Web Vitals optimization helpers
 */
export const CORE_WEB_VITALS = {
  // Largest Contentful Paint optimization
  LCP: {
    // Preload hero images
    preloadHeroImage: (src: string) => `<link rel="preload" as="image" href="${src}">`,
    
    // Remove render-blocking resources
    criticalCSS: CRITICAL_CSS
  },
  
  // First Input Delay optimization
  FID: {
    // Break up long tasks
    yieldToMainThread: () => new Promise(resolve => setTimeout(resolve, 0)),
    
    // Use passive event listeners
    passiveEvents: ['touchstart', 'touchmove', 'scroll']
  },
  
  // Cumulative Layout Shift optimization
  CLS: {
    // Reserve space for dynamic content
    reserveSpace: {
      generator: 'min-height: 400px',
      result: 'min-height: 100px'
    },
    
    // Use CSS containment
    containment: 'layout style paint'
  }
};

/**
 * JWT Token Generator specific optimizations
 * Since this is high-priority for page 1 ranking
 */
export const JWT_OPTIMIZATIONS = {
  // Critical rendering path
  criticalPath: [
    'JWT form interface',
    'Generate button',
    'Token display area'
  ],
  
  // Bundle size reduction
  bundleOptimization: {
    // Tree-shake unused JWT library functions
    treeShaking: true,
    
    // Code split JWT validation
    codeSplit: 'jwt-validation.js',
    
    // Compress JWT algorithms map
    algorithmMap: 'compressed'
  },
  
  // Structured data for search engines
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'JWT Token Generator',
    'applicationCategory': 'DeveloperApplication',
    'description': 'Generate and validate JSON Web Tokens (JWT) securely in your browser',
    'url': 'https://randomkeygen.com/jwt-token',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'featureList': [
      'JWT Token Generation',
      'HS256, HS384, HS512 algorithms',
      'Custom payload support',
      'Token validation',
      'Offline functionality'
    ]
  }
};

/**
 * Performance monitoring and metrics
 */
export function trackCoreWebVitals() {
  // Web Vitals library integration would go here
  // For now, using basic Performance API with proper type safety
  
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      // Track LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Track FID (simplified)
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          // Safe property access
          const processingStart = (entry as any).processingStart;
          if (typeof processingStart === 'number') {
            console.log('FID:', processingStart - entry.startTime);
          }
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // Track CLS
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach((entry) => {
          const layoutEntry = entry as any;
          if (!layoutEntry.hadRecentInput && typeof layoutEntry.value === 'number') {
            clsValue += layoutEntry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.log('Performance monitoring not supported:', error);
    }
  }
}

/**
 * Preload critical resources for high-priority pages
 */
export function preloadCriticalResources(page: 'jwt' | 'password' | 'keygen' | 'hash') {
  const preloadMap = {
    jwt: [
      '/api/jwt-algorithms',
      '/_next/static/chunks/jwt-generator.js'
    ],
    password: [
      '/_next/static/chunks/password-generator.js'
    ],
    keygen: [
      '/_next/static/chunks/key-generator.js'
    ],
    hash: [
      '/_next/static/chunks/hash-generator.js'
    ]
  };
  
  const resources = preloadMap[page] || [];
  
  resources.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = href;
    document.head.appendChild(link);
  });
}