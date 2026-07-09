/**
 * npm 包名校验正则
 * 参考: https://github.com/npm/validate-npm-package-name
 */
const PACKAGE_NAME_REGEX = /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/;

/**
 * 校验是否为合法的 npm 包名
 */
export function isValidPackageName(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name);
}

/**
 * 将任意字符串转换为合法的 npm 包名
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
