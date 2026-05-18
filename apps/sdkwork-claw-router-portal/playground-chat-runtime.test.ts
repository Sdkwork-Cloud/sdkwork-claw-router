import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("chat playground does not render a duplicate header inside the conversation area", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatPage.tsx");

  assert.doesNotMatch(source, /playground\.chat\.title/);
  assert.doesNotMatch(source, /playground\.chat\.subtitle/);
  assert.doesNotMatch(source, /absolute\s+inset-x-0\s+top-0\s+z-10/);
});

test("chat message list starts below the page chrome without reserving space for an inner header", () => {
  const source = readPortalFile("./packages/sdkwork-claw-router-playground/src/components/chat/ChatMessageList.tsx");

  assert.doesNotMatch(source, /pt-24/);
  assert.match(source, /px-4 pt-6 md:px-8/);
});
