---
title: 'Sanitize Contact Form Inputs'
type: chore
created: '2026-05-20'
status: 'done'
route: 'one-shot'
---

# Sanitize Contact Form Inputs

## Intent

**Problem:** The contact form sent raw user input to the API with only `.trim()` and length slicing — no stripping of control characters or HTML tags, no server-side email format validation, no allowlist checks on enumerated fields, and Airtable errors were proxied raw to the client.

**Approach:** Added a `sanitizeText` helper on the client and a `sanitize` function on the server. Added server-side email regex validation, source allowlist check, and service allowlist filtering. Wrapped the Airtable call in try/catch and replaced raw error proxying with a generic 502 response.

## Suggested Review Order

1. [api/submit.js](../../api/submit.js) — server sanitization, validation, error handling
2. [index.html](../../index.html) — client `sanitizeText` helper and pre-submit email check
