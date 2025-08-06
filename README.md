# Element Crafter

[](https://www.google.com/search?q=https://badge.fury.io/js/element-crafter)
[](https://opensource.org/licenses/MIT)

**A zero-dependency TypeScript library for creating HTML elements in both server-side rendering (SSR) and client-side environments.**

---

## 🚀 Features

- **Universal Rendering**: Works seamlessly in both SSR and client-side environments, allowing you to write your UI logic once and render it anywhere.
- **Type Safe**: Full TypeScript support with proper type definitions for attributes, event handlers, and elements, ensuring robust and error-free code.
- **XSS Protection**: Built-in HTML escaping and attribute validation to protect your application from cross-site scripting (XSS) attacks.
- **Zero Dependencies**: A lightweight and fast library with no external dependencies, ensuring a small bundle size and optimal performance.
- **Component-Based**: Easily create reusable UI components for a more organized and maintainable codebase.
- **Performance Optimized**: Efficient rendering for both SSR and client-side environments, with a minimal memory footprint.

---

## Why Element Crafter?

Element Crafter is designed for developers who need a simple, fast, and reliable way to generate HTML. Unlike other libraries, it offers:

- **Simplicity**: A straightforward and intuitive API that is easy to learn and use.
- **Flexibility**: The ability to switch between SSR and client-side rendering with a simple configuration change.
- **Safety**: Automatic security features that you don't have to think about.
- **Performance**: A lightweight design that won't slow down your application.

---

## 📦 Installation

```bash
npm install element-crafter
```

---

## Quick Start

### Server-Side Rendering (SSR)

```typescript
import { createSSRBuilder } from "element-crafter";

const builder = createSSRBuilder();

// Create an HTML string
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
import { createClientBuilder } from "element-crafter";

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

---

## 📖 API Reference

### Core Classes

#### `HtmlBuilder`

The main class for creating HTML elements. You can instantiate it directly for more control over the configuration.

```typescript
import { HtmlBuilder } from "element-crafter";

const builder = new HtmlBuilder({
  isSsr: true, // SSR mode
  escapeContent: true, // Escape HTML by default
  validateAttributes: true, // Validate attributes
});
```

#### Configuration Options

- `isSsr: boolean`: Determines whether to generate HTML strings (for SSR) or DOM elements (for the client).
- `escapeContent?: boolean`: When `true`, escapes HTML content by default to prevent XSS attacks. Defaults to `true`.
- `validateAttributes?: boolean`: When `true`, validates attributes to prevent potentially unsafe values. Defaults to `true`.
- `customVoidTags?: Set<string>`: A set of additional void tags to be recognized beyond the HTML5 standard.

### Methods

#### `createElement(tagName, attributes?, options?, ...children)`

Creates an HTML element or an HTML string, depending on the builder's configuration.

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

Creates a text node (client-side) or an escaped text string (SSR).

```typescript
const text = builder.createText("Hello & welcome", true); // Escapes HTML special characters
```

#### `createFragment(...children)`

Creates a document fragment (client-side) or a concatenated HTML string (SSR) from a list of children.

```typescript
const fragment = builder.createFragment(
  builder.createElement("h2", {}, undefined, "Title"),
  builder.createElement("p", {}, undefined, "Content")
);
```

### Factory Functions

For convenience, you can use these factory functions to create a builder instance with a predefined configuration.

#### `createSSRBuilder(options?)`

Creates a builder instance that is pre-configured for server-side rendering.

```typescript
const ssrBuilder = createSSRBuilder({
  escapeContent: true,
  validateAttributes: true,
});
```

#### `createClientBuilder(options?)`

Creates a builder instance that is pre-configured for client-side rendering.

```typescript
const clientBuilder = createClientBuilder({
  escapeContent: false, // You might disable escaping if you trust the content source
});
```

### Page Builder Utilities

#### `PageBuilder.buildPage(options)`

A static method to create a complete HTML document from a set of options.

```typescript
import { PageBuilder } from "element-crafter";

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

A static method to process a template string with placeholder replacements.

```typescript
const templateString = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>{{TITLE}}</title>
    </head>
    <body>
      {{CONTENT}}
    </body>
  </html>
`;

const html = PageBuilder.buildFromTemplate(templateString, {
  "{{TITLE}}": "My Page",
  "{{CONTENT}}": "<div>Content here</div>",
});
```

---

## ✨ Examples

### Creating a Form

Here's how to create a simple form with an email input and a submit button.

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

You can create functions that act as reusable components to build complex UIs.

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

Easily generate lists from an array of data.

```typescript
const items = ["Apple", "Banana", "Cherry"];
const list = builder.createElement(
  "ul",
  { class: "fruit-list" },
  undefined,
  ...items.map((item) => builder.createElement("li", {}, undefined, item))
);
```

---

## 🛡️ Security

The library is designed with security in mind and includes the following features to protect against XSS attacks:

- **HTML Escaping**: By default, all content is escaped to prevent malicious scripts from being injected into your HTML.
- **Attribute Validation**: Dangerous attributes and attribute values are validated and rejected to prevent common XSS vectors.
- **Safe Event Handlers**: Event handlers are properly bound without using inline JavaScript, which is a common security risk.

---

## 🔷 TypeScript Support

Element Crafter is written in TypeScript and provides full type definitions for a better development experience.

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

---

## ⚡ Performance

- **Zero Dependencies**: No external dependencies mean a smaller bundle size and faster load times.
- **Optimized Rendering**: The library uses efficient algorithms for both SSR and client-side rendering.
- **Memory Efficient**: Designed to have a minimal memory footprint and reduce garbage collection.

---

## 🌐 Browser Support

- Modern browsers (ES2018+)
- Node.js 14+
- Full TypeScript support

---

## 🤝 Contributing

Contributions are welcome\! If you have a feature request, bug report, or want to contribute to the code, please feel free to submit a pull request.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
