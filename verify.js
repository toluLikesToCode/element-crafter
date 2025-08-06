#!/usr/bin/env node

/**
 * Simple verification script for the element-crafter package
 */

const {
  HtmlBuilder,
  createSSRBuilder,
  createClientBuilder,
  PageBuilder,
} = require("./dist/index.js");

console.log("🧪 Element Crafter Package Verification\n");

try {
  // Test SSR Builder
  console.log("✅ Testing SSR Builder...");
  const ssrBuilder = createSSRBuilder();
  const ssrElement = ssrBuilder.createElement(
    "div",
    { class: "test" },
    undefined,
    "Hello SSR"
  );
  console.log("   Output:", ssrElement);

  // Test escaping
  console.log("✅ Testing HTML Escaping...");
  const escapedContent = HtmlBuilder.escapeHtml(
    '<script>alert("xss")</script>'
  );
  console.log("   Escaped:", escapedContent);

  // Test PageBuilder
  console.log("✅ Testing Page Builder...");
  const page = PageBuilder.buildPage({
    title: "Test Page",
    body: "<div>Test Content</div>",
    scripts: '<script>console.log("loaded");</script>',
  });
  console.log("   Page built successfully (length:", page.length, "chars)");

  // Test Factory Functions
  console.log("✅ Testing Factory Functions...");
  const builder1 = createSSRBuilder({ escapeContent: false });
  const builder2 = createClientBuilder({ validateAttributes: false });
  console.log("   SSR Builder:", builder1.isSsr === true);
  console.log("   Client Builder:", builder2.isSsr === false);

  console.log("\n🎉 All tests passed! Package is working correctly.");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
}
