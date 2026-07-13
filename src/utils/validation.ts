/**
 * npm package name validation regex
 * Based on: https://github.com/npm/validate-npm-package-name
 */
const PACKAGE_NAME_REGEX = /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/;

/**
 * Check if a string is a valid npm package name
 */
export function isValidPackageName(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name);
}

/**
 * Convert any string to a valid npm package name
 */
export function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'my-plugin';
}

/**
 * Convert a package or plugin name into a portable API-key environment variable.
 * Examples: my-provider -> MY_PROVIDER_API_KEY, @scope/provider -> SCOPE_PROVIDER_API_KEY.
 */
export function toApiKeyEnvVar(name: string): string {
  const prefix = name
    .trim()
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

  return `${prefix || 'PLUGIN'}_API_KEY`;
}
