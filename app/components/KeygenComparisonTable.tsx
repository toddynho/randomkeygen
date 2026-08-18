'use client';

import React, { useState } from 'react';

interface KeygenTool {
  name: string;
  type: 'Online' | 'Offline' | 'Hybrid';
  keyTypes: string[];
  security: 'High' | 'Medium' | 'Low';
  easeOfUse: 'Easy' | 'Medium' | 'Advanced';
  cost: 'Free' | 'Paid' | 'Freemium';
  platforms: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  website?: string;
}

const keygenTools: KeygenTool[] = [
  {
    name: 'RandomKeygen',
    type: 'Online',
    keyTypes: ['Passwords', 'API Keys', 'JWT Secrets', 'Encryption Keys', 'SSH Keys'],
    security: 'High',
    easeOfUse: 'Easy',
    cost: 'Free',
    platforms: ['Web Browser', 'All Platforms'],
    pros: [
      'Client-side generation',
      'No data transmission',
      'Multiple key types',
      'Instant access',
      'No installation required'
    ],
    cons: [
      'Requires internet connection',
      'Browser-dependent security'
    ],
    bestFor: ['Development', 'Testing', 'Quick password generation', 'API keys'],
    website: 'https://randomkeygen.com'
  },
  {
    name: 'OpenSSL',
    type: 'Offline',
    keyTypes: ['RSA Keys', 'ECDSA Keys', 'Certificates', 'Random Bytes'],
    security: 'High',
    easeOfUse: 'Advanced',
    cost: 'Free',
    platforms: ['Linux', 'macOS', 'Windows'],
    pros: [
      'Industry standard',
      'Completely offline',
      'Highly configurable',
      'Audited and trusted',
      'Professional-grade'
    ],
    cons: [
      'Command-line only',
      'Steep learning curve',
      'Complex syntax'
    ],
    bestFor: ['Production systems', 'TLS certificates', 'Professional use'],
  },
  {
    name: 'Password Managers (Built-in)',
    type: 'Hybrid',
    keyTypes: ['Passwords', 'Notes', 'Secure Records'],
    security: 'High',
    easeOfUse: 'Easy',
    cost: 'Freemium',
    platforms: ['iOS', 'Android', 'Windows', 'macOS', 'Web'],
    pros: [
      'Integrated storage',
      'Automatic sync',
      'Strong encryption',
      'User-friendly',
      'Cross-platform'
    ],
    cons: [
      'Limited to passwords',
      'Subscription costs',
      'Vendor lock-in'
    ],
    bestFor: ['Personal passwords', 'Team password management', 'Everyday use'],
  },
  {
    name: 'Hardware Security Modules (HSM)',
    type: 'Offline',
    keyTypes: ['Encryption Keys', 'Signing Keys', 'Root Certificates'],
    security: 'High',
    easeOfUse: 'Advanced',
    cost: 'Paid',
    platforms: ['Enterprise Hardware', 'Cloud Services'],
    pros: [
      'Hardware-based security',
      'FIPS 140-2 compliance',
      'Tamper resistance',
      'Enterprise-grade',
      'Audit trails'
    ],
    cons: [
      'Very expensive',
      'Complex setup',
      'Requires expertise',
      'Vendor-specific'
    ],
    bestFor: ['Enterprise encryption', 'PKI root keys', 'Compliance requirements'],
  },
  {
    name: 'KeePass',
    type: 'Offline',
    keyTypes: ['Passwords', 'Secure Notes', 'File Attachments'],
    security: 'High',
    easeOfUse: 'Medium',
    cost: 'Free',
    platforms: ['Windows', 'Linux', 'macOS', 'Mobile Apps'],
    pros: [
      'Open source',
      'Local database',
      'Strong encryption',
      'Plugin ecosystem',
      'No cloud dependency'
    ],
    cons: [
      'Manual sync',
      'Basic interface',
      'Setup complexity'
    ],
    bestFor: ['Privacy-conscious users', 'Offline environments', 'Open-source preference'],
  },
  {
    name: 'Cloud Key Management Services',
    type: 'Online',
    keyTypes: ['Encryption Keys', 'Signing Keys', 'Secrets Management'],
    security: 'High',
    easeOfUse: 'Medium',
    cost: 'Paid',
    platforms: ['AWS', 'Azure', 'Google Cloud', 'API Access'],
    pros: [
      'Enterprise integration',
      'Automatic rotation',
      'Audit logging',
      'High availability',
      'Compliance features'
    ],
    cons: [
      'Ongoing costs',
      'Vendor dependency',
      'Internet required',
      'Complex pricing'
    ],
    bestFor: ['Cloud applications', 'Enterprise systems', 'DevOps workflows'],
  }
];

const filterOptions = {
  type: ['All', 'Online', 'Offline', 'Hybrid'],
  security: ['All', 'High', 'Medium', 'Low'],
  cost: ['All', 'Free', 'Paid', 'Freemium'],
  easeOfUse: ['All', 'Easy', 'Medium', 'Advanced']
};

export default function KeygenComparisonTable() {
  const [filters, setFilters] = useState({
    type: 'All',
    security: 'All',
    cost: 'All',
    easeOfUse: 'All'
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredTools = keygenTools.filter(tool => {
    return (filters.type === 'All' || tool.type === filters.type) &&
           (filters.security === 'All' || tool.security === filters.security) &&
           (filters.cost === 'All' || tool.cost === filters.cost) &&
           (filters.easeOfUse === 'All' || tool.easeOfUse === filters.easeOfUse);
  });

  const toggleExpanded = (toolName: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(toolName)) {
      newExpanded.delete(toolName);
    } else {
      newExpanded.add(toolName);
    }
    setExpandedRows(newExpanded);
  };

  const getSecurityBadgeColor = (security: string) => {
    switch (security) {
      case 'High': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-[var(--band)] text-[var(--body)] border-[var(--border-strong)]';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Online': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Offline': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Hybrid': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-[var(--band)] text-[var(--body)] border-[var(--border-strong)]';
    }
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 p-4 bg-[var(--band)] border border-[var(--band-border)] rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Filter Tools:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[var(--body)] mb-1 capitalize">
                {key === 'easeOfUse' ? 'Ease of Use' : key}:
              </label>
              <select
                value={filters[key as keyof typeof filters]}
                onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full p-2 border border-[var(--border-strong)] rounded bg-[var(--surface)] text-sm text-[var(--foreground)]"
              >
                {options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Table */}
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {filteredTools.map((tool) => {
            const isExpanded = expandedRows.has(tool.name);
            
            return (
              <div key={tool.name} className="border border-[var(--border)] rounded-lg bg-[var(--surface)] shadow-[var(--shadow-sm)]">
                {/* Tool Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-[var(--band)] transition-colors"
                  onClick={() => toggleExpanded(tool.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-[var(--foreground)]">{tool.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded border ${getTypeBadgeColor(tool.type)}`}>
                        {tool.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded border ${getSecurityBadgeColor(tool.security)}`}>
                        {tool.security} Security
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[var(--muted)]">{tool.cost}</span>
                      <svg
                        className={`w-5 h-5 text-[var(--muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tool.keyTypes.slice(0, 3).map((type, index) => (
                      <span key={index} className="px-2 py-1 bg-[var(--band)] text-[var(--body)] text-xs rounded">
                        {type}
                      </span>
                    ))}
                    {tool.keyTypes.length > 3 && (
                      <span className="px-2 py-1 bg-[var(--band)] text-[var(--body)] text-xs rounded">
                        +{tool.keyTypes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[var(--border)] p-4 bg-[var(--band)]">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-green-800 mb-2">✅ Pros:</h5>
                        <ul className="list-disc list-inside text-sm text-[var(--body)] space-y-1">
                          {tool.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-red-800 mb-2">❌ Cons:</h5>
                        <ul className="list-disc list-inside text-sm text-[var(--body)] space-y-1">
                          {tool.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-2">🎯 Best For:</h5>
                        <ul className="list-disc list-inside text-sm text-[var(--body)] space-y-1">
                          {tool.bestFor.map((use, index) => (
                            <li key={index}>{use}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-purple-800 mb-2">💻 Platforms:</h5>
                        <div className="flex flex-wrap gap-1">
                          {tool.platforms.map((platform, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-semibold text-[var(--foreground)] mb-2">🔑 Supported Key Types:</h5>
                      <div className="flex flex-wrap gap-1">
                        {tool.keyTypes.map((type, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-[var(--muted)]">
                      <span><strong>Ease of Use:</strong> {tool.easeOfUse}</span>
                      <span><strong>Cost:</strong> {tool.cost}</span>
                      <span><strong>Security Level:</strong> {tool.security}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-8 text-[var(--muted)]">
          No tools match your current filters. Try adjusting the filter criteria.
        </div>
      )}
      
      <div className="mt-6 text-sm text-[var(--muted)]">
        <p>
          <strong>Note:</strong> This comparison includes both online and offline tools for different security needs. 
          Always choose tools appropriate for your security requirements and compliance needs.
        </p>
      </div>
    </div>
  );
}