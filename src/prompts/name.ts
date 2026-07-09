import path from 'node:path';
import * as p from '@clack/prompts';
import { isValidPackageName, toValidPackageName } from '../utils/validation.js';

export async function promptProjectName(): Promise<string> {
  const cwd = process.cwd();
  const defaultName = path.basename(cwd);

  const result = await p.text({
    message: 'Project name:',
    placeholder: 'my-plugin',
    defaultValue: defaultName,
    validate: (v) => {
      if (!v?.trim()) return undefined;
      if (!isValidPackageName(v.trim())) return 'Invalid npm package name (lowercase letters, digits, hyphens only)';
      return undefined;
    },
  });

  if (p.isCancel(result)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  return path.resolve(cwd, result.trim());
}

/**
 * Prompt for npm package name. Returns the raw result (including cancel symbol).
 * Cancel handling is done by the caller (p.group onCancel).
 */
export async function promptPackageName(fallback: string): Promise<string | symbol> {
  const validFallback = toValidPackageName(fallback);

  return p.text({
    message: 'npm package name:',
    placeholder: validFallback,
    defaultValue: validFallback,
    validate: (v) => {
      if (!v?.trim()) return undefined;
      if (!isValidPackageName(v.trim())) return 'Package name must use lowercase letters, digits, and hyphens only';
      return undefined;
    },
  });
}
