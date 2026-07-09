import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { scaffold } from '../src/scaffold/copy.js';

const testDir = path.join(os.tmpdir(), 'claw-test-scaffold-' + Date.now());

const vars = {
  packageName: 'test-package',
  pluginId: 'test-package',
  pluginName: 'Test Package',
  pluginDescription: 'A test plugin',
  toolName: 'test_package',
  toolDescription: 'A test plugin',
  openclawVersion: '2026.6.11',
  pluginSdkVersion: '2026.6.11',
};

const templateDir = path.join(testDir, 'template');
const outputDir = path.join(testDir, 'output');

beforeEach(() => {
  // Create template structure
  fs.mkdirSync(path.join(templateDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(templateDir, 'package.json'), JSON.stringify({
    name: '{{packageName}}',
    description: '{{pluginDescription}}',
    dependencies: { typebox: '1.1.39' },
    devDependencies: { openclaw: '>={{openclawVersion}}' },
  }, null, 2) + '\n');
  fs.writeFileSync(path.join(templateDir, 'src/index.ts'), `// {{pluginName}} - {{pluginDescription}}
const name = "{{pluginName}}";
const id = "{{pluginId}}";
`);
  fs.writeFileSync(path.join(templateDir, '_gitignore'), 'node_modules\ndist\n');
  fs.writeFileSync(path.join(templateDir, 'README.md'), '# {{pluginName}}\n\n{{pluginDescription}}\n');
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('scaffold', () => {
  it('creates all files from template', async () => {
    await scaffold(templateDir, outputDir, vars);

    expect(fs.existsSync(path.join(outputDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'src/index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'README.md'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, '.gitignore'))).toBe(true);
  });

  it('renames _gitignore to .gitignore', async () => {
    await scaffold(templateDir, outputDir, vars);

    expect(fs.existsSync(path.join(outputDir, '.gitignore'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, '_gitignore'))).toBe(false);
  });

  it('substitutes template variables in regular files', async () => {
    await scaffold(templateDir, outputDir, vars);

    const content = fs.readFileSync(path.join(outputDir, 'README.md'), 'utf-8');
    expect(content).toContain('# Test Package');
    expect(content).toContain('A test plugin');
    expect(content).not.toContain('{{pluginName}}');
    expect(content).not.toContain('{{pluginDescription}}');
  });

  it('substitutes variables in source files', async () => {
    await scaffold(templateDir, outputDir, vars);

    const content = fs.readFileSync(path.join(outputDir, 'src/index.ts'), 'utf-8');
    expect(content).toContain('Test Package - A test plugin');
    expect(content).toContain('"Test Package"');
    expect(content).toContain('"test-package"');
    expect(content).not.toContain('{{');
  });

  it('preserves package.json JSON structure and sets name field', async () => {
    await scaffold(templateDir, outputDir, vars);

    const pkg = JSON.parse(fs.readFileSync(path.join(outputDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('test-package');
    // description should come from variable substitution
    expect(pkg.description).toBe('A test plugin');
    // JSON structure should be valid
    expect(pkg.dependencies?.typebox).toBe('1.1.39');
    // Version variable should be substituted in JSON values
    expect(pkg.devDependencies?.openclaw).toBe('>=2026.6.11');
  });

  it('handles empty template directory', async () => {
    const emptyDir = path.join(testDir, 'empty');
    fs.mkdirSync(emptyDir, { recursive: true });

    await scaffold(emptyDir, path.join(testDir, 'empty-output'), vars);

    expect(fs.existsSync(path.join(testDir, 'empty-output'))).toBe(true);
  });

  it('preserves nested directory structure', async () => {
    // Create a deeper nested structure
    fs.mkdirSync(path.join(templateDir, 'nested/deep/path'), { recursive: true });
    fs.writeFileSync(path.join(templateDir, 'nested/deep/path/data.txt'), '{{packageName}}');

    await scaffold(templateDir, outputDir, vars);

    expect(fs.existsSync(path.join(outputDir, 'nested/deep/path/data.txt'))).toBe(true);
    const content = fs.readFileSync(path.join(outputDir, 'nested/deep/path/data.txt'), 'utf-8');
    expect(content).toBe('test-package');
  });
});
