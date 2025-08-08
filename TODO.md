# TODO: HTML Builder Improvements

This document outlines planned improvements to enhance the user experience and reduce cognitive load when working with the HTML Builder library.

## ✅ Completed

- **Smart Tag-Based Auto-Escaping** - Automatically determines escaping based on HTML tag type
  - Tags like `script`, `style`, `pre`, `code`, `textarea` automatically disable escaping
  - Explicit options still take precedence
  - Reduces need to manually manage escaping for common scenarios

## 🚧 Planned Features

### High Priority

#### 1. Content Type Helper Methods

Add specialized methods for different content types to make intent clearer:

```typescript
// Proposed API
builder.addRawHTML("<div>Some HTML</div>");
builder.addCSS("body { color: red; }");
builder.addJavaScript('console.log("Hello");');
builder.addUserContent(userInput); // Always escaped
builder.addTrustedText(trustedContent); // Never escaped
```

**Benefits:**

- Clear intent in code
- Automatic appropriate escaping
- Better security by default

#### 2. Content Detection Heuristics

Automatically detect content type and apply appropriate escaping:

```typescript
// Auto-detect HTML, CSS, JS, or plain text
private detectContentType(content: string): 'html' | 'css' | 'js' | 'text'
```

**Detection patterns:**

- HTML: `/<[^>]+>/` (contains tags)
- CSS: `/[.#][\w-]+\s*{|\w+\s*:\s*[^;]+;/` (selectors or properties)
- JS: `/function\s*\(|=>\s*{|console\.|document\./` (JS syntax)
- Text: Everything else

#### 3. Builder Factory Functions

Create specialized builders for different use cases:

```typescript
// Proposed API
export function createSecureBuilder(): HtmlBuilder; // Always escape unless explicit
export function createTrustedBuilder(): HtmlBuilder; // Smart escaping by default
export function createDeveloperBuilder(): HtmlBuilder; // Minimal escaping for dev
```

### Medium Priority

#### 4. Enhanced Configuration Options

Add more intuitive escaping modes:

```typescript
interface BuilderConfig {
  escapeContent?: boolean | "smart" | "auto" | "detect";
  securityLevel?: "strict" | "balanced" | "permissive";
}
```

#### 5. Template Literal Helper

For advanced users, provide template literal support:

```typescript
const page = html`
  <div>${userContent}</div>
  <style>
    ${css}
  </style>
  <script>
    ${javascript};
  </script>
`;
```

#### 6. Content Security Policy Integration

Integrate with CSP headers for enhanced security:

```typescript
interface CSPConfig {
  scriptSrc?: string[];
  styleSrc?: string[];
  nonce?: string;
}
```

### Low Priority

#### 7. Plugin System

Allow users to extend escaping behavior:

```typescript
interface EscapingPlugin {
  shouldEscape(tagName: string, content: string): boolean;
  escape(content: string): string;
}
```

#### 8. Debug Mode

Add debugging capabilities to help users understand escaping decisions:

```typescript
const builder = createSSRBuilder({ debug: true });
// Logs: "Auto-disabling escape for <script> tag"
// Logs: "Using global escape setting for <div> tag"
```

#### 9. Performance Optimizations

- Cache escaping decisions for repeated content
- Optimize regex patterns for content detection
- Lazy evaluation of content type detection

#### 10. Validation Enhancements

- Warn about potentially unsafe content patterns
- Suggest appropriate escaping settings
- Validate CSP compliance

## 📝 Documentation Improvements

### Needed Updates

1. **Usage Guides**

   - When to use each builder type
   - Security best practices
   - Migration guide for existing users

2. **Examples**

   - Real-world use cases
   - Security scenarios
   - Performance considerations

3. **API Reference**
   - Complete method documentation
   - Type definitions
   - Error handling guide

## 🎯 Success Metrics

- Reduce user reports about escaped CSS/JS content
- Minimize security vulnerabilities from improper escaping
- Improve developer satisfaction scores
- Decrease time-to-productivity for new users

## 🔄 Implementation Order

1. **Phase 1** (v1.1.0): Content Type Helper Methods
2. **Phase 2** (v1.2.0): Content Detection Heuristics
3. **Phase 3** (v1.3.0): Builder Factory Functions
4. **Phase 4** (v2.0.0): Enhanced Configuration & Breaking Changes
5. **Phase 5** (v2.1.0): Advanced Features (Templates, CSP, Plugins)

## 📋 Notes

- All changes should maintain backward compatibility until v2.0.0
- Security features take priority over convenience features
- User feedback should guide implementation priority
- Performance impact should be measured for all changes
