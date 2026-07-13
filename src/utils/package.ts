import { execSync } from 'node:child_process';

type PackageInfo = {
  openclawVersion: string;
  pluginSdkVersion: string;
};

const FALLBACK_VERSION = '2026.3.24-beta.2';

// Simple in-memory cache to avoid repeated npm network calls
let cachedInfo: PackageInfo | null = null;

/**
 * Get the latest OpenClaw and SDK versions from npm.
 * Results are cached in memory for the lifetime of the process.
 * Falls back to a known stable version on network failure.
 */
export async function getPackageInfo(): Promise<PackageInfo> {
  if (cachedInfo) return cachedInfo;

  try {
    const openclawVersion = execSync('npm view openclaw version 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    const pluginSdkVersion = execSync('npm view @openclaw/plugin-sdk version 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    cachedInfo = { openclawVersion, pluginSdkVersion };
    return cachedInfo;
  } catch {
    cachedInfo = {
      openclawVersion: FALLBACK_VERSION,
      pluginSdkVersion: FALLBACK_VERSION,
    };
    return cachedInfo;
  }
}

/**
 * Check if OpenClaw is installed locally and return its version.
 * Returns null if OpenClaw is not found or the check fails.
 */
export function getLocalOpenclawVersion(): string | null {
  try {
    const version = execSync('openclaw --version 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 3000,
    }).trim();
    return version || null;
  } catch {
    return null;
  }
}

/**
 * Simple semver comparison. Returns:
 *  - negative if a < b
 *  0 if a === b
 *  positive if a > b
 *
 * Handles pre-release tags: "2026.6.11-beta.1" vs "2026.6.11"
 * A plain release is considered newer than its pre-release.
 */
export function compareVersions(a: string, b: string): number {
  const aParts = parseVersion(a);
  const bParts = parseVersion(b);

  for (let i = 0; i < 3; i++) {
    const diff = aParts[i] - bParts[i];
    if (diff !== 0) return diff;
  }

  // Same major.minor.patch: pre-release is older than plain release
  if (aParts[3] !== bParts[3]) return aParts[3] ? -1 : 1;

  return 0;
}

type ParsedVersion = [number, number, number, number]; // major, minor, patch, isPreRelease

function parseVersion(version: string): ParsedVersion {
  const clean = version.replace(/^v/, '');
  const preReleaseIndex = clean.search(/[-\s]/);
  const core = preReleaseIndex >= 0 ? clean.slice(0, preReleaseIndex) : clean;
  const parts = core.split('.').map(Number);
  return [
    parts[0] || 0,
    parts[1] || 0,
    parts[2] || 0,
    preReleaseIndex >= 0 ? 1 : 0, // 1 = pre-release, 0 = stable
  ];
}
