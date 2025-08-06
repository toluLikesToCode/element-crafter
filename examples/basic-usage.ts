import {
  HtmlBuilder,
  createSSRBuilder,
  createClientBuilder,
  PageBuilder,
} from "../src/index";

// =============================================================================
// Basic Usage Examples
// =============================================================================

console.log("HTML Builder Examples\n");

// Server-Side Rendering Example
console.log("1. Server-Side Rendering (SSR):");
const ssrBuilder = createSSRBuilder();

const ssrDiv = ssrBuilder.createElement(
  "div",
  { class: "container", id: "main" },
  undefined,
  "Hello, ",
  ssrBuilder.createElement("strong", {}, undefined, "World!")
);
console.log(ssrDiv);
console.log("");

// List Example
console.log("2. Creating a List:");
const items = ["Apple", "Banana", "Cherry"];
const list = ssrBuilder.createElement(
  "ul",
  { class: "fruit-list" },
  undefined,
  ...items.map((item) => ssrBuilder.createElement("li", {}, undefined, item))
);
console.log(list);
console.log("");

// Form Example
console.log("3. Creating a Form:");
const form = ssrBuilder.createElement(
  "form",
  { method: "post", action: "/submit" },
  undefined,
  ssrBuilder.createElement(
    "div",
    { class: "form-group" },
    undefined,
    ssrBuilder.createElement("label", { for: "email" }, undefined, "Email:"),
    ssrBuilder.createElement("input", {
      type: "email",
      id: "email",
      name: "email",
      required: true,
    })
  ),
  ssrBuilder.createElement(
    "div",
    { class: "form-group" },
    undefined,
    ssrBuilder.createElement(
      "label",
      { for: "message" },
      undefined,
      "Message:"
    ),
    ssrBuilder.createElement("textarea", {
      id: "message",
      name: "message",
      rows: 4,
    })
  ),
  ssrBuilder.createElement("button", { type: "submit" }, undefined, "Send")
);
console.log(form);
console.log("");

// Card Component Example
console.log("4. Reusable Card Component:");
function createCard(title: string, content: string, imageUrl?: string) {
  return ssrBuilder.createElement(
    "div",
    { class: "card" },
    undefined,
    imageUrl
      ? ssrBuilder.createElement("img", {
          src: imageUrl,
          alt: title,
          class: "card-image",
        })
      : null,
    ssrBuilder.createElement(
      "div",
      { class: "card-content" },
      undefined,
      ssrBuilder.createElement("h3", { class: "card-title" }, undefined, title),
      ssrBuilder.createElement("p", { class: "card-text" }, undefined, content)
    )
  );
}

const card = createCard(
  "Sample Card",
  "This is a sample card component created with the HTML Builder.",
  "/images/sample.jpg"
);
console.log(card);
console.log("");

// Fragment Example
console.log("5. Using Fragments:");
const fragment = ssrBuilder.createFragment(
  ssrBuilder.createElement("h2", {}, undefined, "Section Title"),
  ssrBuilder.createElement("p", {}, undefined, "This is a paragraph."),
  ssrBuilder.createElement("p", {}, undefined, "This is another paragraph.")
);
console.log(fragment);
console.log("");

// Page Builder Example
console.log("6. Complete HTML Page:");
const pageContent = ssrBuilder.createElement(
  "div",
  { class: "app" },
  undefined,
  ssrBuilder.createElement(
    "header",
    {},
    undefined,
    ssrBuilder.createElement("h1", {}, undefined, "My Application")
  ),
  ssrBuilder.createElement(
    "main",
    {},
    undefined,
    ssrBuilder.createElement("p", {}, undefined, "Welcome to my application!")
  ),
  ssrBuilder.createElement(
    "footer",
    {},
    undefined,
    ssrBuilder.createElement("p", {}, undefined, "© 2025 My Company")
  )
);

const fullPage = PageBuilder.buildPage({
  title: "My Application",
  head: "<style>body { font-family: Arial, sans-serif; }</style>",
  body: pageContent as string,
  scripts: '<script>console.log("Page loaded!");</script>',
});

console.log(fullPage);
console.log("");

// Template Example
console.log("7. Template Replacement:");
const template = `
<!DOCTYPE html>
<html>
<head><title>{{TITLE}}</title></head>
<body>
  <h1>{{HEADING}}</h1>
  <div>{{CONTENT}}</div>
</body>
</html>
`;

const processedTemplate = PageBuilder.buildFromTemplate(template, {
  "{{TITLE}}": "Dynamic Title",
  "{{HEADING}}": "Welcome!",
  "{{CONTENT}}": "<p>This content was inserted via template replacement.</p>",
});

console.log(processedTemplate);
