import { execFile } from 'node:child_process';

export type PackageInfo = {
  openclawVersion: string;
  pluginSdkVersion: string;
};

const FALLBACK_VERSION = '2026.3.24-beta.2';

function executableName(name: string): string {
  return process.platform === 'win32' ? `${name}.cmd` : name;
}

function execFileText(command: string, args: string[], timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      {
        encoding: 'utf-8',
        timeout,
        windowsHide: true,
      },
      (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.trim());
      },
    );
  });
}

async function queryPackageVersion(packageName: string): Promise<string | null> {
  try {
    const version = await execFileText(executableName('npm'), ['view', packageName, 'version'], 5000);
    return version || null;
  } catch {
    return null;
  }
}

/**
 * Get the latest OpenClaw and SDK versions from npm.
 * Queries run in parallel and fall back independently when the registry is unavailable.
 */
export async function getPackageInfo(): Promise<PackageInfo> {
  const [openclawVersion, pluginSdkVersion] = await Promise.all([
    queryPackageVersion('openclaw'),
    queryPackageVersion('@openclaw/plugin-sdk'),
  ]);

  return {
    openclawVersion: openclawVersion ?? FALLBACK_VERSION,
    pluginSdkVersion: pluginSdkVersion ?? FALLBACK_VERSION,
  };
}

/**
 * Check if OpenClaw is installed locally and return its version output.
 * Returns null if OpenClaw is not found or the check fails.
 */
export async function getLocalOpenclawVersion(): Promise<string | null> {
  try {
    const version = await execFileText(executableName('openclaw'), ['--version'], 3000);
    return version || null;
  } catch {
    return null;
  }
}

type ParsedVersion = {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
};

function parseVersion(input: string): ParsedVersion | null {
  const match = input.match(
    /(?:^|[^0-9A-Za-z])v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?=$|[^0-9A-Za-z.+-])/,
  );
  if (!match) return null;

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
  };
}

function comparePrereleaseIdentifier(a: string, b: string): number {
  const aNumeric = /^\d+$/.test(a);
  const bNumeric = /^\d+$/.test(b);

  if (aNumeric && bNumeric) return Number(a) - Number(b);
  if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
  return a.localeCompare(b);
}

/**
 * Compare two SemVer-compatible version strings.
 * Returns null when either input does not contain a valid major.minor.patch version.
 */
export function compareVersions(a: string, b: string): number | null {
  const aVersion = parseVersion(a);
  const bVersion = parseVersion(b);
  if (!aVersion || !bVersion) return null;

  for (const key of ['major', 'minor', 'patch'] as const) {
    const diff = aVersion[key] - bVersion[key];
    if (diff !== 0) return diff;
  }

  if (aVersion.prerelease.length === 0 && bVersion.prerelease.length === 0) return 0;
  if (aVersion.prerelease.length === 0) return 1;
  if (bVersion.prerelease.length === 0) return -1;

  const count = Math.max(aVersion.prerelease.length, bVersion.prerelease.length);
  for (let index = 0; index < count; index += 1) {
    const aPart = aVersion.prerelease[index];
    const bPart = bVersion.prerelease[index];
    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;

    const diff = comparePrereleaseIdentifier(aPart, bPart);
    if (diff !== 0) return diff;
  }

  return 0;
}
