import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("network smoke browser engines", () => {
  it("loads the Chromium and Firefox launchers from the installed Playwright runtime", async () => {
    const { stdout } = await execFileAsync(process.execPath, [
      "--input-type=module",
      "--eval",
      'import { networkSmokeBrowserEngines } from "./scripts/lib/network-smoke-browser-engines.mjs"; console.log(typeof networkSmokeBrowserEngines.chromium.launch, typeof networkSmokeBrowserEngines.firefox.launch);',
    ]);

    expect(stdout.trim()).toBe("function function");
  });
});
