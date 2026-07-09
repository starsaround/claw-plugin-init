import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
  openclawVersion: '2026.6.11',
  pluginSdkVersion: '2026.6.11',
};

describe('tool-plugin template integration', () => {
  const toolOutputDir = path.join(testDir, 'tool-output');

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('scaffolds tool-plugin with all expected files', async () => {
    const toolTemplate = path.join(templatesDir, 'tool-plugin');
    await scaffold(toolTemplate, toolOutputDir, vars);

    const expectedFiles = [
      'package.json',
      'openclaw.plugin.json',
      'tsconfig.json',
      'README.md',
      '.gitignore',
      'src/index.ts',
    ];

    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(toolOutputDir, file)), `Missing: ${file}`).toBe(true);
    }
  });

  it('produces valid package.json with correct name', async () => {
    const toolTemplate = path.join(templatesDir, 'tool-plugin');
    await scaffold(toolTemplate, toolOutputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(toolOutputDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('my-integration-test');
    expect(pkg.description).toBe('Created by integration test');
    expect(pkg.dependencies?.typebox).toBeDefined();
  });

  it('substitutes all variables in openclaw.plugin.json', async () => {
    const toolTemplate = path.join(templatesDir, 'tool-plugin');
    await scaffold(toolTemplate, toolOutputDir, vars);

    const manifest = JSON.parse(fs.readFileSync(path.join(toolOutputDir, 'openclaw.plugin.json'), 'utf-8'));
    expect(manifest.id).toBe('my-integration-test');
    expect(manifest.name).toBe('My Integration Test');
    expect(manifest.description).toBe('Created by integration test');
  });

  it('substitutes all variables in src/index.ts', async () => {
    const toolTemplate = path.join(templatesDir, 'tool-plugin');
    await scaffold(toolTemplate, toolOutputDir, vars);

    const content = fs.readFileSync(path.join(toolOutputDir, 'src/index.ts'), 'utf-8');
    expect(content).toContain('my_integration_test');
    expect(content).toContain('My Integration Test');
    expect(content).toContain('Created by integration test');
    expect(content).not.toContain('{{');
  });

  it('has no unsubstituted template variables in any file', async () => {
    const toolTemplate = path.join(templatesDir, 'tool-plugin');
    await scaffold(toolTemplate, toolOutputDir, vars);

    const files = getAllFiles(toolOutputDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content, `Unsubstituted vars in ${file}`).not.toMatch(/\{\{/);
    }
  });
});

describe('mcp-server template integration', () => {
  const mcpOutputDir = path.join(testDir, 'mcp-output');

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('scaffolds mcp-server with all expected files', async () => {
    const mcpTemplate = path.join(templatesDir, 'mcp-server');
    await scaffold(mcpTemplate, mcpOutputDir, vars);

    const expectedFiles = [
      'package.json',
      'openclaw.plugin.json',
      'tsconfig.json',
      'README.md',
      '.gitignore',
      'src/index.ts',
    ];

    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(mcpOutputDir, file)), `Missing: ${file}`).toBe(true);
    }
  });

  it('has MCP-specific dependencies in package.json', async () => {
    const mcpTemplate = path.join(templatesDir, 'mcp-server');
    await scaffold(mcpTemplate, mcpOutputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(mcpOutputDir, 'package.json'), 'utf-8'));
    expect(pkg.dependencies?.['@modelcontextprotocol/sdk']).toBeDefined();
    expect(pkg.dependencies?.typebox).toBeUndefined();
  });

  it('has no unsubstituted template variables in any file', async () => {
    const mcpTemplate = path.join(templatesDir, 'mcp-server');
    await scaffold(mcpTemplate, mcpOutputDir, vars);

    const files = getAllFiles(mcpOutputDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content, `Unsubstituted vars in ${file}`).not.toMatch(/\{\{/);
    }
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
