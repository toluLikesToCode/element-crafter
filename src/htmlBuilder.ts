/**
 * Universal HTML Builder Module
 *
 * @remarks
 * This module provides a unified interface for generating HTML content in both
 * server-side rendering (SSR) and client-side environments. It includes utilities
 * for creating DOM elements, managing attributes, and building complex UI components.
 *
 * Key features:
 * - Universal rendering (SSR/Client)
 * - Type-safe element creation
 * - Attribute validation and sanitization
 * - Component-based architecture
 * - Performance optimizations
 *
 * @example
 * ```typescript
 * const builder = new HtmlBuilder({ isSsr: true });
 * const element = builder.createElement('div', { class: 'container' }, 'Hello World');
 * ```
 */

// =============================================================================
// Core Types and Interfaces
// =============================================================================

/**
 * Supported attribute value types for HTML elements.
 */
export type AttributeValue = string | number | boolean | null | undefined;

/**
 * Event handler function type for DOM events.
 */
export type EventHandler = (event: Event) => void;

/**
 * HTML element attributes including event handlers.
 */
export interface Attributes {
  [key: string]: AttributeValue | EventHandler;
}

/**
 * Content that can be rendered as HTML.
 */
export type RenderableContent =
  | string
  | number
  | Node
  | null
  | undefined
  | RenderableContent[];

/**
 * Configuration for the HTML builder.
 */
export interface BuilderConfig {
  /** Whether to generate SSR-compatible HTML strings */
  isSsr: boolean;
  /** Whether to escape HTML content by default */
  escapeContent?: boolean;
  /** Whether to validate attributes */
  validateAttributes?: boolean;
  /** Custom void tags (in addition to standard HTML5 void tags) */
  customVoidTags?: Set<string>;
}

/**
 * Options for creating HTML elements.
 */
export interface CreateElementOptions {
  /** Whether to escape the content of this specific element */
  escapeContent?: boolean;
  /** Whether to validate attributes for this specific element */
  validateAttributes?: boolean;
}

// =============================================================================
// Core HTML Builder Class
// =============================================================================

/**
 * Universal HTML builder for SSR and client-side rendering.
 *
 * @remarks
 * Provides a consistent API for creating HTML elements and managing content
 * across different rendering environments. Supports attribute validation,
 * content escaping, and performance optimizations.
 *
 * @example
 * ```typescript
 * // SSR usage
 * const ssrBuilder = new HtmlBuilder({ isSsr: true });
 * const html = ssrBuilder.createElement('div', { class: 'container' }, 'Content');
 *
 * // Client usage
 * const clientBuilder = new HtmlBuilder({ isSsr: false });
 * const element = clientBuilder.createElement('button', { onclick: handleClick }, 'Click me');
 * ```
 */
export class HtmlBuilder {
  private readonly config: Required<BuilderConfig>;

  /** Standard HTML5 void elements */
  private static readonly STANDARD_VOID_TAGS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  /** Boolean attributes that don't need values */
  private static readonly BOOLEAN_ATTRIBUTES = new Set([
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "defer",
    "disabled",
    "hidden",
    "loop",
    "multiple",
    "muted",
    "open",
    "readonly",
    "required",
    "reversed",
    "selected",
  ]);

  /**
   * Creates a new HTML builder instance.
   *
   * @param config - Builder configuration
   */
  constructor(config: BuilderConfig) {
    this.config = {
      escapeContent: true,
      validateAttributes: true,
      customVoidTags: new Set(),
      ...config,
    };
  }

  /**
   * Gets whether the builder is in SSR mode.
   */
  public get isSsr(): boolean {
    return this.config.isSsr;
  }

  /**
   * Gets all void tags (standard + custom).
   */
  private get voidTags(): Set<string> {
    return new Set([
      ...HtmlBuilder.STANDARD_VOID_TAGS,
      ...this.config.customVoidTags,
    ]);
  }

  /**
   * Escapes HTML content to prevent XSS attacks.
   *
   * @param content - Content to escape
   * @returns Escaped content
   */
  public static escapeHtml(content: unknown): string {
    if (content == null) return "";
    return String(content)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Validates attribute name and value.
   *
   * @param name - Attribute name.
   * @param value - Attribute value.
   * @throws {TypeError} If the attribute name is invalid.
   * @throws {DOMException} If the attribute value is potentially unsafe.
   */
  private validateAttribute(
    name: string,
    value: AttributeValue | EventHandler
  ): void {
    if (!this.config.validateAttributes) return;

    // Validate attribute name
    if (typeof name !== "string" || name.length === 0) {
      throw new TypeError(`Invalid attribute name: ${name}`);
    }

    // Check for potentially dangerous attributes
    const dangerousAttributes = ["srcdoc", "formaction"];
    if (
      dangerousAttributes.includes(name.toLowerCase()) &&
      typeof value === "string"
    ) {
      if (value.includes("javascript:") || value.includes("data:text/html")) {
        throw new DOMException(
          `Potentially unsafe value for attribute ${name}: ${value}`
        );
      }
    }
  }

  /**
   * Builds attribute string for SSR.
   *
   * @param attributes - Element attributes
   * @returns Formatted attribute string
   */
  private buildAttributeString(attributes: Attributes): string {
    const parts: string[] = [];

    for (const [name, value] of Object.entries(attributes)) {
      // Skip event handlers in SSR mode
      if (typeof value === "function") continue;

      this.validateAttribute(name, value);

      if (value === null || value === undefined || value === false) {
        continue;
      }

      if (value === true || HtmlBuilder.BOOLEAN_ATTRIBUTES.has(name)) {
        parts.push(name);
      } else {
        const escapedValue = HtmlBuilder.escapeHtml(value);
        parts.push(`${name}="${escapedValue}"`);
      }
    }

    return parts.length > 0 ? ` ${parts.join(" ")}` : "";
  }

  /**
   * Flattens nested content arrays.
   *
   * @param content - Content to flatten
   * @returns Flattened content array
   */
  private flattenContent(content: RenderableContent[]): unknown[] {
    const result: unknown[] = [];

    for (const item of content) {
      if (Array.isArray(item)) {
        result.push(...this.flattenContent(item));
      } else {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Processes content for rendering.
   *
   * @param content - Raw content
   * @param escapeContent - Whether to escape content
   * @returns Processed content string
   */
  private processContent(content: unknown, escapeContent: boolean): string {
    if (content == null) return "";

    if (typeof content === "string") {
      return escapeContent ? HtmlBuilder.escapeHtml(content) : content;
    }

    if (typeof content === "number") {
      return String(content);
    }

    if (this.config.isSsr) {
      // In SSR mode, convert everything to string
      return String(content);
    } else {
      // In client mode, handle DOM nodes
      if (content instanceof Node) {
        return content.textContent || "";
      }
      return String(content);
    }
  }

  /**
   * Creates an HTML element.
   *
   * @param tagName - HTML tag name
   * @param attributes - Element attributes
   * @param options - Creation options
   * @param children - Child content
   * @returns DOM element or HTML string
   */
  public createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: Attributes,
    options?: CreateElementOptions,
    ...children: RenderableContent[]
  ): HTMLElementTagNameMap[K] | string {
    if (this.config.isSsr) {
      return this.createElementSSR(
        tagName as string,
        attributes,
        options,
        children
      );
    } else {
      return this.createElementClient(tagName, attributes, options, children);
    }
  }

  /**
   * Creates an element for SSR (returns HTML string).
   */
  private createElementSSR(
    tagName: string,
    attributes?: Attributes,
    options?: CreateElementOptions,
    children: RenderableContent[] = []
  ): string {
    const attrs = attributes || {};
    const opts = { ...this.config, ...options };

    const attributeString = this.buildAttributeString(attrs);
    const isVoid = this.voidTags.has(tagName.toLowerCase());

    if (isVoid) {
      return `<${tagName}${attributeString}>`;
    }

    const flatChildren = this.flattenContent(children);
    const childContent = flatChildren
      .map((child) => this.processContent(child, opts.escapeContent))
      .join("");

    return `<${tagName}${attributeString}>${childContent}</${tagName}>`;
  }

  /**
   * Creates an element for client-side (returns DOM element).
   */
  private createElementClient<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: Attributes,
    options?: CreateElementOptions,
    children: RenderableContent[] = []
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    const attrs = attributes || {};
    const opts = { ...this.config, ...options };

    // Set attributes
    for (const [name, value] of Object.entries(attrs)) {
      if (typeof value === "function") {
        // Handle event listeners
        const eventName = name.toLowerCase().startsWith("on")
          ? name.slice(2)
          : name;
        element.addEventListener(eventName, value as EventHandler);
      } else if (value !== null && value !== undefined && value !== false) {
        this.validateAttribute(name, value);

        if (value === true || HtmlBuilder.BOOLEAN_ATTRIBUTES.has(name)) {
          element.setAttribute(name, "");
        } else {
          element.setAttribute(name, String(value));
        }
      }
    }

    // Add children
    const flatChildren = this.flattenContent(children);
    for (const child of flatChildren) {
      if (child instanceof Node) {
        element.appendChild(child);
      } else if (child != null) {
        const textContent = this.processContent(child, opts.escapeContent);
        if (textContent) {
          element.appendChild(document.createTextNode(textContent));
        }
      }
    }

    return element;
  }

  /**
   * Creates a text node or text content.
   *
   * @param text - Text content
   * @param escape - Whether to escape the text
   * @returns Text node or escaped string
   */
  public createText(text: string, escape = true): Text | string {
    const content = escape ? HtmlBuilder.escapeHtml(text) : text;

    if (this.config.isSsr) {
      return content;
    } else {
      return document.createTextNode(text); // Don't escape for text nodes
    }
  }

  /**
   * Creates a document fragment or concatenated HTML.
   *
   * @param children - Child content
   * @returns Document fragment or HTML string
   */
  public createFragment(
    ...children: RenderableContent[]
  ): DocumentFragment | string {
    if (this.config.isSsr) {
      const flatChildren = this.flattenContent(children);
      return flatChildren
        .map((child) => this.processContent(child, this.config.escapeContent))
        .join("");
    } else {
      const fragment = document.createDocumentFragment();
      const flatChildren = this.flattenContent(children);

      for (const child of flatChildren) {
        if (child instanceof Node) {
          fragment.appendChild(child);
        } else if (child != null) {
          const textContent = this.processContent(
            child,
            this.config.escapeContent
          );
          if (textContent) {
            fragment.appendChild(document.createTextNode(textContent));
          }
        }
      }

      return fragment;
    }
  }
}

// =============================================================================
// Page Builder Utilities
// =============================================================================

/**
 * Page builder utilities for creating complete HTML documents.
 *
 * @remarks
 * Provides utilities for building complete HTML pages with proper structure,
 * meta tags, and content integration.
 */
export class PageBuilder {
  /**
   * Builds a complete HTML page with proper document structure.
   *
   * @param options - Page configuration options
   * @returns Complete HTML document string
   *
   * @example
   * ```typescript
   * const html = PageBuilder.buildPage({
   *   title: 'My App',
   *   head: '<meta name="description" content="My awesome app">',
   *   body: '<div class="app">Hello World</div>',
   *   scripts: '<script src="/app.js"></script>'
   * });
   * ```
   */
  static buildPage(options: {
    title: string;
    head?: string;
    body: string;
    scripts?: string;
    lang?: string;
    charset?: string;
  }): string {
    const {
      title,
      head = "",
      body,
      scripts = "",
      lang = "en",
      charset = "utf-8",
    } = options;

    return `<!DOCTYPE html>
<html lang="${HtmlBuilder.escapeHtml(lang)}">
<head>
  <meta charset="${HtmlBuilder.escapeHtml(charset)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${HtmlBuilder.escapeHtml(title)}</title>
  ${head}
</head>
<body>
  ${body}
  ${scripts}
</body>
</html>`;
  }

  /**
   * Builds an HTML page using template replacement.
   *
   * @param templateContent - The HTML template content with placeholders
   * @param replacements - Object containing placeholder replacements
   * @returns Processed HTML string
   *
   * @example
   * ```typescript
   * const html = PageBuilder.buildFromTemplate(templateHtml, {
   *   '{{TITLE}}': 'My App',
   *   '{{CONTENT}}': '<div>Hello World</div>'
   * });
   * ```
   */
  static buildFromTemplate(
    templateContent: string,
    replacements: Record<string, string>
  ): string {
    let result = templateContent;

    for (const [placeholder, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(
        placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g"
      );
      result = result.replace(regex, replacement);
    }

    return result;
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Creates a new HTML builder instance.
 */
export function createHtmlBuilder(config: BuilderConfig): HtmlBuilder {
  return new HtmlBuilder(config);
}

/**
 * Creates an HTML builder configured for server-side rendering.
 */
export function createSSRBuilder(
  options?: Omit<BuilderConfig, "isSsr">
): HtmlBuilder {
  return new HtmlBuilder({ ...options, isSsr: true });
}

/**
 * Creates an HTML builder configured for client-side rendering.
 */
export function createClientBuilder(
  options?: Omit<BuilderConfig, "isSsr">
): HtmlBuilder {
  return new HtmlBuilder({ ...options, isSsr: false });
}

// =============================================================================
// Default Export
// =============================================================================

export default HtmlBuilder;
