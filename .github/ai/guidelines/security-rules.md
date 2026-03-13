# Security Rules for Angular Applications

> **Applicable to:** Angular v21 TypeScript/HTML projects

---

## Critical — Must Block

| Rule | Description |
|------|-------------|
| SEC-001 | No hardcoded secrets, API keys, passwords, or tokens in source code. |
| SEC-002 | No `eval()`, `new Function()`, or equivalent dynamic code execution. |
| SEC-003 | All SQL/NoSQL queries must use parameterised statements (no string concatenation). |
| SEC-004 | No `bypassSecurityTrustHtml`, `bypassSecurityTrustScript`, `bypassSecurityTrustStyle`, `bypassSecurityTrustUrl`, or `bypassSecurityTrustResourceUrl` without proper sanitization and explicit justification. |
| SEC-005 | No disabled SSL/TLS certificate verification in HTTP clients. |
| SEC-006 | No `innerHTML` binding without using `DomSanitizer` properly. |

---

## Warning — Should Fix

| Rule | Description |
|------|-------------|
| SEC-010 | User input must be validated before use in templates or API calls. |
| SEC-011 | Avoid storing sensitive data in `localStorage` or `sessionStorage` — use secure, HttpOnly cookies when possible. |
| SEC-012 | File paths from user input must be validated to prevent directory traversal. |
| SEC-013 | HTTP responses should include security headers (CSP, X-Frame-Options, etc.). |
| SEC-014 | Avoid using `window.location`, `document.location`, or `location.href` with user-controlled input. |
| SEC-015 | Authentication tokens should not be logged or exposed in error messages. |

---

## Angular-Specific Security

### Template Security

- **Never** use `[innerHTML]` with untrusted content directly.
- Use Angular's built-in sanitization via `DomSanitizer` service when displaying user-generated HTML.
- Prefer interpolation `{{ value }}` over property binding `[innerHTML]` when possible.

### HTTP Security

- Always use `HttpClient` from `@angular/common/http` — never raw `XMLHttpRequest` or `fetch`.
- Implement HTTP interceptors for:
  - Adding authentication headers
  - Handling 401/403 responses globally
  - Adding CSRF tokens when required

### Route Security

- Use route guards (`canActivate`, `canMatch`) to protect sensitive routes.
- Never expose sensitive data in route parameters that appear in URLs.
- Implement proper authorization checks on both client and server side.

### Third-Party Libraries

- Keep all dependencies updated to avoid known vulnerabilities.
- Review npm audit warnings before deploying.
- Avoid packages with known security issues.

---

## Info — Best Practices

| Rule | Description |
|------|-------------|
| SEC-020 | Use strict Content Security Policy (CSP) headers. |
| SEC-021 | Implement rate limiting on API endpoints. |
| SEC-022 | Log security-relevant events (login attempts, permission changes). |
| SEC-023 | Use HTTPS everywhere — redirect HTTP to HTTPS. |
| SEC-024 | Implement proper session management with secure, HttpOnly cookies. |
