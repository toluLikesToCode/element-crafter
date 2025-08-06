import { createClientBuilder } from "../src/index";

// =============================================================================
// Client-Side Usage Example
// =============================================================================

// This example demonstrates how to use the HTML builder in a browser environment
// Note: This would typically run in a browser, but we'll show the structure

console.log("Client-Side Element Crafter Example\n");

// Check if we're in a browser environment
if (typeof document !== "undefined") {
  // Create a client-side builder
  const clientBuilder = createClientBuilder();

  // Create elements that return actual DOM nodes
  const container = clientBuilder.createElement("div", {
    class: "dynamic-container",
    id: "app-root",
  });

  const title = clientBuilder.createElement(
    "h1",
    {},
    undefined,
    "Dynamic Content"
  );

  const button = clientBuilder.createElement(
    "button",
    {
      class: "btn btn-primary",
      onclick: (event: Event) => {
        console.log("Button clicked!", event);
        alert("Hello from HTML Builder!");
      },
    },
    undefined,
    "Click Me!"
  );

  const list = clientBuilder.createElement("ul", { class: "dynamic-list" });

  // Add some list items dynamically
  for (let i = 1; i <= 5; i++) {
    const listItem = clientBuilder.createElement(
      "li",
      {
        class: "list-item",
        "data-index": i,
      },
      undefined,
      `Item ${i}`
    );

    (list as HTMLUListElement).appendChild(listItem as HTMLLIElement);
  }

  // Build the complete structure
  (container as HTMLDivElement).appendChild(title as HTMLHeadingElement);
  (container as HTMLDivElement).appendChild(button as HTMLButtonElement);
  (container as HTMLDivElement).appendChild(list as HTMLUListElement);

  // Add to document (if body exists)
  if (document.body) {
    document.body.appendChild(container as HTMLDivElement);
  }

  console.log("Dynamic content added to page!");

  // Create a form with validation
  const form = clientBuilder.createElement("form", {
    onsubmit: (event: Event) => {
      event.preventDefault();
      console.log("Form submitted!");

      const formData = new FormData(event.target as HTMLFormElement);
      console.log("Form submitted with data:", formData);
    },
  });

  const emailInput = clientBuilder.createElement("input", {
    type: "email",
    name: "email",
    placeholder: "Enter your email",
    required: true,
    oninput: (event: Event) => {
      const input = event.target as HTMLInputElement;
      console.log("Email input:", input.value);
    },
  });

  const submitButton = clientBuilder.createElement(
    "button",
    {
      type: "submit",
    },
    undefined,
    "Submit Form"
  );

  (form as HTMLFormElement).appendChild(emailInput as HTMLInputElement);
  (form as HTMLFormElement).appendChild(submitButton as HTMLButtonElement);

  if (document.body) {
    document.body.appendChild(form as HTMLFormElement);
  }
} else {
  console.log("This example is designed to run in a browser environment.");
  console.log(
    "In a browser, it would create actual DOM elements with event listeners."
  );
}
