// Service Worker Registration
// Optimized for performance and Core Web Vitals

(function() {
  'use strict';
  
  // Only register SW on production or when explicitly enabled
  const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const enableSW = localStorage.getItem('enable-sw') === 'true';
  
  if (isDev && !enableSW) {
    console.log('SW: Disabled in development. Set enable-sw=true in localStorage to test.');
    return;
  }
  
  if (!('serviceWorker' in navigator)) {
    console.log('SW: Not supported in this browser');
    return;
  }
  
  // Register SW after page load to avoid impacting Core Web Vitals
  function registerSW() {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'imports' // Better caching strategy
    })
    .then(function(registration) {
      console.log('SW: Registered successfully', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', function() {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              showUpdateNotification();
            }
          });
        }
      });
      
      // Auto-update check every 5 minutes
      setInterval(function() {
        registration.update();
      }, 5 * 60 * 1000);
    })
    .catch(function(error) {
      console.log('SW: Registration failed', error);
    });
  }
  
  // Show user-friendly update notification
  function showUpdateNotification() {
    // Create a subtle notification bar
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 10000;
      font-family: system-ui, sans-serif;
      font-size: 0.9rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transform: translateY(-100%);
      transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
      <span>🚀 A new version of RandomKeygen is available!</span>
      <button onclick="window.location.reload()" style="
        margin-left: 1rem;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.85rem;
      ">Update Now</button>
      <button onclick="this.parentElement.style.display='none'" style="
        margin-left: 0.5rem;
        background: transparent;
        border: none;
        color: white;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.8;
      ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, 10000);
  }
  
  // Register after page load for optimal performance
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', registerSW);
  } else if (document.readyState === 'interactive') {
    // Give main thread time for initial render
    setTimeout(registerSW, 100);
  } else {
    // Page already loaded
    registerSW();
  }
  
  // Handle SW messages
  navigator.serviceWorker.addEventListener('message', function(event) {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        console.log('SW: Cache updated for', payload.url);
        break;
      case 'OFFLINE_READY':
        console.log('SW: App ready for offline use');
        // Could show a toast notification here
        break;
      case 'UPDATE_AVAILABLE':
        showUpdateNotification();
        break;
    }
  });
  
  // Preload critical resources based on current page
  function preloadForCurrentPage() {
    const path = location.pathname;
    const preloadMap = {
      '/jwt-token': ['/api/jwt-keys', '/_next/static/chunks/jwt-generator.js'],
      '/password': ['/_next/static/chunks/password-generator.js'],
      '/hash-generator': ['/_next/static/chunks/hash-generator.js'],
      '/': ['/_next/static/chunks/homepage.js']
    };
    
    const resources = preloadMap[path] || [];
    
    resources.forEach(function(href) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = href;
      document.head.appendChild(link);
    });
  }
  
  // Preload after SW registration
  setTimeout(preloadForCurrentPage, 200);
  
})();