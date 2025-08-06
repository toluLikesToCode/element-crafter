# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-05

### Fixed

- Fixed double escaping bug in SSR mode when using `createText` and element children.
- Improved internal handling to prevent content from being escaped twice in server-side rendering.

### Changed

- `createText` now marks already-escaped content to avoid redundant escaping in SSR.
- `processContent` detects and skips escaping for marked content.

### Added

- (No new features in this patch)

## [1.0.0] - 2025-08-05

### Initial Release

- Initial release of Element Crafter
- Universal HTML generation for SSR and client-side environments
- Type-safe element creation with TypeScript support
- Built-in XSS protection with HTML escaping
- Attribute validation and sanitization
- Support for event handlers in client-side mode
- Component-based architecture utilities
- Page builder utilities for complete HTML documents
- Template replacement functionality
- Zero-dependency implementation
- Factory functions for easy builder creation
- Comprehensive examples and documentation
- Full TypeScript declarations
- Build system with CommonJS output
