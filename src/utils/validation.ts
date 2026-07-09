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
