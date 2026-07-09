import { describe, it, expect } from 'vitest';
import { isValidPackageName, toValidPackageName } from '../src/utils/validation.js';

describe('isValidPackageName', () => {
  it('accepts simple valid names', () => {
    expect(isValidPackageName('my-plugin')).toBe(true);
    expect(isValidPackageName('my_plugin')).toBe(true);
    expect(isValidPackageName('myplugin')).toBe(true);
    expect(isValidPackageName('my-plugin-2')).toBe(true);
    expect(isValidPackageName('a')).toBe(true);
    expect(isValidPackageName('123')).toBe(true);
  });

  it('accepts scoped package names', () => {
    expect(isValidPackageName('@scope/my-plugin')).toBe(true);
    expect(isValidPackageName('@openclaw/plugin-sdk')).toBe(true);
    expect(isValidPackageName('@a/b')).toBe(true);
  });

  it('rejects empty or blank names', () => {
    expect(isValidPackageName('')).toBe(false);
    expect(isValidPackageName('  ')).toBe(false);
  });

  it('rejects names with uppercase letters', () => {
    expect(isValidPackageName('MyPlugin')).toBe(false);
    expect(isValidPackageName('my-Plugin')).toBe(false);
  });

  it('rejects names starting with dot or underscore', () => {
    expect(isValidPackageName('.my-plugin')).toBe(false);
    expect(isValidPackageName('_my-plugin')).toBe(false);
  });

  it('rejects names with spaces', () => {
    expect(isValidPackageName('my plugin')).toBe(false);
    expect(isValidPackageName(' my-plugin')).toBe(false);
  });

  it('rejects names with special characters', () => {
    expect(isValidPackageName('my@plugin')).toBe(false);
    expect(isValidPackageName('my(plugin)')).toBe(false);
    expect(isValidPackageName('my/plugin')).toBe(false);
  });
});

describe('toValidPackageName', () => {
  it('passes through valid names unchanged', () => {
    expect(toValidPackageName('my-plugin')).toBe('my-plugin');
    expect(toValidPackageName('test')).toBe('test');
    expect(toValidPackageName('my-plugin-2')).toBe('my-plugin-2');
  });

  it('converts to lowercase', () => {
    expect(toValidPackageName('MyPlugin')).toBe('myplugin');
    expect(toValidPackageName('MY-PLUGIN')).toBe('my-plugin');
  });

  it('replaces spaces with hyphens', () => {
    expect(toValidPackageName('my plugin')).toBe('my-plugin');
    expect(toValidPackageName('hello world test')).toBe('hello-world-test');
  });

  it('removes leading dots and underscores', () => {
    expect(toValidPackageName('.my-plugin')).toBe('my-plugin');
    expect(toValidPackageName('_my-plugin')).toBe('my-plugin');
  });

  it('handles complex cases', () => {
    expect(toValidPackageName('  My Cool Plugin!  ')).toBe('my-cool-plugin');
    expect(toValidPackageName('Hello@World#Test')).toBe('hello-world-test');
    expect(toValidPackageName('---')).toBe('my-plugin');
    expect(toValidPackageName('  ---  ')).toBe('my-plugin');
  });

  it('falls back to my-plugin for empty results', () => {
    expect(toValidPackageName('')).toBe('my-plugin');
    expect(toValidPackageName('   ')).toBe('my-plugin');
  });
});
