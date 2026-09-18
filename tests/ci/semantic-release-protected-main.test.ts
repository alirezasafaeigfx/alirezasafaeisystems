import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(__dirname, '../..');

describe('semantic release on protected main', () => {
  it('does not use prepare plugins that push generated files back to main', () => {
    const config = JSON.parse(
      fs.readFileSync(path.join(repoRoot, '.releaserc.json'), 'utf8'),
    ) as { plugins?: unknown[] };
    const plugins = config.plugins ?? [];
    const pluginNames = plugins.map((plugin) =>
      Array.isArray(plugin) ? String(plugin[0]) : String(plugin),
    );

    expect(pluginNames).not.toContain('@semantic-release/changelog');
    expect(pluginNames).not.toContain('@semantic-release/git');

    const workflow = fs.readFileSync(
      path.join(repoRoot, '.github/workflows/release.yml'),
      'utf8',
    );
    expect(workflow).not.toMatch(/^-?\s*-p @semantic-release\/changelog(?:@|\s|$)/m);
    expect(workflow).not.toMatch(/^-?\s*-p @semantic-release\/git(?:@|\s|$)/m);
  });
});
