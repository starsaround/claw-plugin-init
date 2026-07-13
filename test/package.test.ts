import { describe, expect, it } from 'vitest';
import { compareVersions } from '../src/utils/package.js';

describe('compareVersions', () => {
  it('compares stable versions', () => {
    expect(compareVersions('2026.6.10', '2026.6.11')).toBeLessThan(0);
    expect(compareVersions('v2026.7.0', '2026.6.11')).toBeGreaterThan(0);
    expect(compareVersions('2026.6.11', '2026.6.11')).toBe(0);
  });

  it('follows SemVer prerelease precedence', () => {
    expect(compareVersions('2026.6.11-beta.1', '2026.6.11-beta.2')).toBeLessThan(0);
    expect(compareVersions('2026.6.11-beta.2', '2026.6.11-beta.10')).toBeLessThan(0);
    expect(compareVersions('2026.6.11-beta', '2026.6.11-beta.1')).toBeLessThan(0);
    expect(compareVersions('2026.6.11-1', '2026.6.11-beta')).toBeLessThan(0);
    expect(compareVersions('2026.6.11', '2026.6.11-rc.1')).toBeGreaterThan(0);
  });

  it('extracts versions from CLI output and ignores build metadata', () => {
    expect(compareVersions('OpenClaw v2026.6.11', '2026.6.11')).toBe(0);
    expect(compareVersions('2026.6.11+build.2', '2026.6.11+build.1')).toBe(0);
  });

  it('returns null for invalid inputs', () => {
    expect(compareVersions('unknown', '2026.6.11')).toBeNull();
    expect(compareVersions('2026.6', '2026.6.11')).toBeNull();
  });
});
