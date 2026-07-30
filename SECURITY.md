# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in this repository, please report it responsibly:

### For Repository Code Issues
- **Preferred**: Use [GitHub Security Advisories](https://github.com/egor-xyz/egor-xyz-site/security/advisories) to report vulnerabilities privately
- **Alternative**: Open a private issue if Security Advisories are not available
- **Do not** publicly disclose vulnerabilities until they have been reviewed and addressed

### For Client-Side Security Issues
This is a frontend React application. Please report issues related to:
- Cross-Site Scripting (XSS) vulnerabilities
- Content Security Policy bypass
- Client-side authentication/authorization flaws
- Malicious dependency injection
- Build process security issues

### Report Details
Include comprehensive information in your report:
- **Description**: Clear explanation of the vulnerability
- **Steps to reproduce**: Detailed reproduction steps
- **Impact**: Potential security implications
- **Affected components**: Specific code areas or dependencies
- **Environment**: Browser, OS, and version information
- **Supporting evidence**: Screenshots, logs, or proof-of-concept code

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Active support  |
| Previous| ❌ End-of-life     |

Only the latest deployed version of the site receives active security support. This is a continuously deployed application where security fixes are applied to the main branch and automatically released.

## Automated Security Measures

This repository implements several automated security practices:

### Dependency Management
- **Dependabot**: Automatically monitors and updates dependencies weekly
- **Vulnerability scanning**: GitHub automatically scans for known vulnerabilities
- **Semantic versioning**: Automated releases ensure consistent versioning

### Development Security
- **ESLint security rules**: Code is automatically scanned for security anti-patterns
- **TypeScript**: Strong typing helps prevent common security issues
- **Build-time checks**: Vite performs security validations during build

## Security Scope

### In Scope
- Repository source code vulnerabilities
- Build and deployment process security
- Client-side application security
- Dependency vulnerabilities affecting this project
- Configuration and infrastructure as code

### Out of Scope
- General web security best practices (unless specific to this application)
- Third-party service vulnerabilities (GitHub Pages, CDNs)
- End-user device security
- Network infrastructure security

## Response Timeline

- **Initial response**: Within 48 hours of report
- **Triage and assessment**: Within 1 week
- **Fix development**: Depends on severity and complexity
- **Public disclosure**: After fix is deployed and users have time to update

## Responsible Disclosure Guidelines

We appreciate responsible disclosure and ask that you:

1. **Test responsibly**: Do not exploit vulnerabilities beyond what's necessary for demonstration
2. **Respect privacy**: Do not access or modify user data
3. **Allow response time**: Give us reasonable time to address issues before public disclosure
4. **Coordinate disclosure**: Work with us on the timing and content of public disclosures

## Dependencies and Third-Party Security

This project uses numerous third-party dependencies:

### Main Dependencies
- **React 19**: Frontend framework with active security monitoring
- **Three.js & React Three Fiber**: 3D graphics libraries
- **Vite**: Build tool with security-focused defaults
- **TypeScript**: Type safety and compile-time checks

### Security Updates
- Dependencies are automatically monitored via Dependabot
- Critical security updates are prioritized and applied immediately
- For upstream vulnerabilities, please report to the respective maintainers:
  - React: [React Security](https://reactjs.org/community/security.html)
  - Three.js: [Three.js GitHub Issues](https://github.com/mrdoob/three.js/issues)
  - Vite: [Vite GitHub Security](https://github.com/vitejs/vite/security)

## Security Best Practices

This project follows security best practices including:

- **Content Security Policy**: Implemented for XSS protection
- **Dependency pinning**: Exact version control for reproducible builds
- **Minimal attack surface**: Static site with no server-side processing
- **Regular updates**: Automated dependency updates and monitoring
- **Code quality**: ESLint rules and TypeScript for safer code

## Contact

For security-related questions or urgent security issues:
- **Primary**: Use GitHub Security Advisories (preferred)
- **Alternative**: Repository issues (for non-sensitive questions only)

## Acknowledgements

We appreciate the efforts of the security research community and acknowledge:
- Security researchers who practice responsible disclosure
- Open source maintainers who quickly address security issues
- Automated security tools that help identify vulnerabilities
- The broader web security community for establishing best practices