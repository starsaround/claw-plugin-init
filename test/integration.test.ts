import { describe, it, expect, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { scaffold } from '../src/scaffold/copy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const templatesDir = path.resolve(projectRoot, 'templates');
const testDir = path.join(os.tmpdir(), 'claw-test-int-' + Date.now());

const vars = {
  packageName: 'my-integration-test',
  pluginId: 'my-integration-test',
  pluginName: 'My Integration Test',
  pluginDescription: 'Created by integration test',
  toolName: 'my_integration_test',
  toolDescription: 'Created by integration test',
  providerEnvVar: 'MY_INTEGRATION_TEST_API_KEY',
  openclawVersion: '2026.6.11',
  pluginSdkVersion: '2026.6.11',
};

const templateNames = [
  'tool-plugin',
  'channel-plugin',
  'provider-plugin',
  'mcp-server',
] as const;

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe.each(templateNames)('%s template integration', (templateName) => {
  const outputDir = path.join(testDir, templateName);

  it('scaffolds all expected files with no unresolved variables', async () => {
    await scaffold(path.join(templatesDir, templateName), outputDir, vars);

    const expectedFiles = [
      'package.json',
      'openclaw.plugin.json',
      'tsconfig.json',
      'README.md',
      '.gitignore',
      'src/index.ts',
    ];

    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(outputDir, file)), `Missing: ${file}`).toBe(true);
    }

    for (const file of getAllFiles(outputDir)) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content, `Unsubstituted vars in ${file}`).not.toMatch(/\{\{/);
    }
  });

  it('produces valid package and manifest JSON', async () => {
    await scaffold(path.join(templatesDir, templateName), outputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf-8'));
    const manifest = JSON.parse(
      fs.readFileSync(path.join(outputDir, 'openclaw.plugin.json'), 'utf-8'),
    );

    expect(pkg.name).toBe(vars.packageName);
    expect(pkg.description).toBe(vars.pluginDescription);
    expect(manifest.id).toBe(vars.pluginId);
    expect(manifest.name).toBe(vars.pluginName);
    expect(manifest.description).toBe(vars.pluginDescription);
  });
});

describe('template-specific contracts', () => {
  it('tool plugin includes its tool dependency and registration', async () => {
    const outputDir = path.join(testDir, 'tool-contract');
    await scaffold(path.join(templatesDir, 'tool-plugin'), outputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf-8'));
    const source = fs.readFileSync(path.join(outputDir, 'src/index.ts'), 'utf-8');

    expect(pkg.dependencies?.typebox).toBeDefined();
    expect(source).toContain(vars.toolName);
  });

  it('channel plugin keeps manifest and source channel IDs aligned', async () => {
    const outputDir = path.join(testDir, 'channel-contract');
    await scaffold(path.join(templatesDir, 'channel-plugin'), outputDir, vars);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(outputDir, 'openclaw.plugin.json'), 'utf-8'),
    );
    const source = fs.readFileSync(path.join(outputDir, 'src/index.ts'), 'utf-8');

    expect(manifest.channels).toEqual([vars.pluginId]);
    expect(source).toContain(`id: "${vars.pluginId}"`);
  });

  it('provider plugin uses one portable API-key environment variable everywhere', async () => {
    const outputDir = path.join(testDir, 'provider-contract');
    await scaffold(path.join(templatesDir, 'provider-plugin'), outputDir, vars);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(outputDir, 'openclaw.plugin.json'), 'utf-8'),
    );
    const source = fs.readFileSync(path.join(outputDir, 'src/index.ts'), 'utf-8');
    const readme = fs.readFileSync(path.join(outputDir, 'README.md'), 'utf-8');

    expect(manifest.setup.providers[0].envVars).toEqual([vars.providerEnvVar]);
    expect(source).toContain(vars.providerEnvVar);
    expect(readme).toContain(`export ${vars.providerEnvVar}=your-api-key`);
  });

  it('MCP server includes the MCP SDK and excludes tool-plugin-only dependencies', async () => {
    const outputDir = path.join(testDir, 'mcp-contract');
    await scaffold(path.join(templatesDir, 'mcp-server'), outputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf-8'));
    expect(pkg.dependencies?.['@modelcontextprotocol/sdk']).toBeDefined();
    expect(pkg.dependencies?.typebox).toBeUndefined();
  });
});

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}
