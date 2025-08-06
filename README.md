# HTML Builder

A zero-dependency TypeScript library for creating HTML elements in both server-side rendering (SSR) and client-side environments.

## Features

- 🚀 **Universal Rendering** - Works in both SSR and client-side environments
- 🔒 **Type Safe** - Full TypeScript support with proper type definitions
- 🛡️ **XSS Protection** - Built-in HTML escaping and attribute validation
- 📦 **Zero Dependencies** - No external dependencies, lightweight and fast
- 🎯 **Component-Based** - Easy to create reusable UI components
- ⚡ **Performance Optimized** - Efficient rendering for both environments

## Installation

```bash
npm install html-builder
```

## Quick Start

### Server-Side Rendering (SSR)

```typescript
import { createSSRBuilder } from "html-builder";

const builder = createSSRBuilder();

// Create HTML string
const html = builder.createElement(
  "div",
  { class: "container" },
  undefined,
  "Hello, ",
  builder.createElement("strong", {}, undefined, "World!")
);

console.log(html);
// Output: <div class="container">Hello, <strong>World!</strong></div>
```

### Client-Side Rendering

```typescript
import { createClientBuilder } from "html-builder";

const builder = createClientBuilder();

// Create actual DOM elements
const button = builder.createElement(
  "button",
  {
    class: "btn",
    onclick: (event) => alert("Clicked!"),
  },
  undefined,
  "Click Me!"
);

document.body.appendChild(button);
```

## API Reference

### Core Classes

#### `HtmlBuilder`

The main class for creating HTML elements.

```typescript
const builder = new HtmlBuilder({
  isSsr: true, // SSR mode
  escapeContent: true, // Escape HTML by default
  validateAttributes: true, // Validate attributes
});
```

#### Configuration Options

- `isSsr: boolean` - Whether to generate HTML strings (SSR) or DOM elements (client)
- `escapeContent?: boolean` - Whether to escape HTML content by default (default: `true`)
- `validateAttributes?: boolean` - Whether to validate attributes (default: `true`)
- `customVoidTags?: Set<string>` - Additional void tags beyond HTML5 standard

### Methods

#### `createElement(tagName, attributes?, options?, ...children)`

Creates an HTML element or string.

```typescript
// Basic element
builder.createElement("div", { class: "container" }, undefined, "Content");

// With event handlers (client-side only)
builder.createElement(
  "button",
  {
    onclick: () => console.log("clicked"),
  },
  undefined,
  "Click me"
);

// Nested elements
builder.createElement(
  "div",
  {},
  undefined,
  builder.createElement("h1", {}, undefined, "Title"),
  builder.createElement("p", {}, undefined, "Content")
);
```

#### `createText(text, escape?)`

Creates a text node or escaped text string.

```typescript
const text = builder.createText("Hello & welcome", true); // Escapes HTML
```

#### `createFragment(...children)`

Creates a document fragment or concatenated HTML string.

```typescript
const fragment = builder.createFragment(
  builder.createElement("h2", {}, undefined, "Title"),
  builder.createElement("p", {}, undefined, "Content")
);
```

### Factory Functions

#### `createSSRBuilder(options?)`

Creates a builder configured for server-side rendering.

```typescript
const ssrBuilder = createSSRBuilder({
  escapeContent: true,
  validateAttributes: true,
});
```

#### `createClientBuilder(options?)`

Creates a builder configured for client-side rendering.

```typescript
const clientBuilder = createClientBuilder({
  escapeContent: false, // Don't escape for DOM manipulation
});
```

### Page Builder Utilities

#### `PageBuilder.buildPage(options)`

Creates a complete HTML document.

```typescript
import { PageBuilder } from "html-builder";

const html = PageBuilder.buildPage({
  title: "My App",
  head: '<meta name="description" content="My app">',
  body: '<div class="app">Hello World</div>',
  scripts: '<script src="/app.js"></script>',
  lang: "en",
  charset: "utf-8",
});
```

#### `PageBuilder.buildFromTemplate(template, replacements)`

Process templates with placeholder replacement.

```typescript
const html = PageBuilder.buildFromTemplate(templateString, {
  "{{TITLE}}": "My Page",
  "{{CONTENT}}": "<div>Content here</div>",
});
```

## Examples

### Creating a Form

```typescript
const form = builder.createElement(
  "form",
  { method: "post", action: "/submit" },
  undefined,
  builder.createElement("input", {
    type: "email",
    name: "email",
    required: true,
    placeholder: "Enter email",
  }),
  builder.createElement("button", { type: "submit" }, undefined, "Submit")
);
```

### Reusable Components

```typescript
function createCard(title: string, content: string, imageUrl?: string) {
  return builder.createElement(
    "div",
    { class: "card" },
    undefined,
    imageUrl
      ? builder.createElement("img", {
          src: imageUrl,
          alt: title,
        })
      : null,
    builder.createElement(
      "div",
      { class: "card-body" },
      undefined,
      builder.createElement("h5", {}, undefined, title),
      builder.createElement("p", {}, undefined, content)
    )
  );
}

const card = createCard("My Card", "Card content here", "/image.jpg");
```

### Dynamic Lists

```typescript
const items = ["Apple", "Banana", "Cherry"];
const list = builder.createElement(
  "ul",
  { class: "fruit-list" },
  undefined,
  ...items.map((item) => builder.createElement("li", {}, undefined, item))
);
```

## Security

The library includes built-in XSS protection:

- **HTML Escaping**: Content is escaped by default to prevent XSS attacks
- **Attribute Validation**: Dangerous attributes are validated and rejected
- **Safe Event Handlers**: Event handlers are properly bound without inline JavaScript

## TypeScript Support

Full TypeScript support with proper type definitions:

```typescript
// Type-safe element creation
const div: HTMLDivElement | string = builder.createElement(
  "div",
  {
    class: "container",
  },
  undefined,
  "Content"
);

// Event handlers are properly typed
const button = builder.createElement(
  "button",
  {
    onclick: (event: Event) => console.log("Clicked", event),
  },
  undefined,
  "Click me"
);
```

## Performance

- **Zero Dependencies**: No external dependencies for maximum performance
- **Optimized Rendering**: Efficient algorithms for both SSR and client rendering
- **Memory Efficient**: Minimal memory footprint and garbage collection

## Browser Support

- Modern browsers (ES2018+)
- Node.js 14+
- Full TypeScript support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
