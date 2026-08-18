# Security Policy

## How RandomKeygen handles data

All generation on randomkeygen.com happens client-side in your browser using
the Web Crypto API (`crypto.getRandomValues()` / `crypto.subtle`). Generated
values are never transmitted, logged, or stored by the site. You can verify
this yourself: open your browser's network tab and regenerate — no requests
are made.

## Reporting a vulnerability

If you find a security issue — a generator producing biased or predictable
output, any code path that transmits generated values, or anything else —
please report it privately via
[GitHub Security Advisories](https://github.com/toddynho/randomkeygen/security/advisories/new)
rather than opening a public issue.

Reports are triaged on a best-effort basis. Please include steps to reproduce
and the affected page or module.
