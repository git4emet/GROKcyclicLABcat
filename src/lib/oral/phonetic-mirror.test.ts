import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PASTE_NAMES, PUBLIC_STEPS, mirrorMarkdown } from "./phonetic-mirror.ts";

describe("phonetic mirror", () => {
  it("packages the public method without clearing the alias", () => {
    const text = mirrorMarkdown([
      { id: "1", meant: "み く い", heard: "mikui.site", platform: "Phone dictation" },
    ]);
    assert.match(text, /inspection queue stays open/);
    assert.match(text, /Not a registration/);
    assert.match(text, /み く い/);
    assert.equal(/CYAN|registered as the inverse|−3|-3/.test(text), false);
    assert.equal(PUBLIC_STEPS.length, 5);
    assert.equal(PASTE_NAMES.length, 4);
    assert.match(text, /open alias/);
  });
});
