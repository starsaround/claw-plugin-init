import { spawn, spawnSync } from 'node:child_process';
import * as p from '@clack/prompts';

/**
 * Install dependencies in the target directory
 */
export async function installDeps(targetDir: string): Promise<void> {
  const s = p.spinner();
  s.start('Installing dependencies...');

  const pkgManager = detectPackageManager();

  return new Promise<void>((resolve) => {
    const child = spawn(pkgManager, ['install'], {
      cwd: targetDir,
      stdio: 'pipe',
    });

    child.on('close', (code) => {
      if (code === 0) {
        s.stop('Dependencies installed');
      } else {
        s.stop('Failed to install dependencies. Run manually: ' + pkgManager + ' install');
      }
      resolve();
    });

    child.on('error', () => {
      s.stop('Failed to install dependencies. Run manually: ' + pkgManager + ' install');
      resolve();
    });
  });
}

/**
 * Initialize a Git repository
 */
export async function initGit(targetDir: string): Promise<void> {
  const s = p.spinner();
  s.start('Initializing Git repository...');

  try {
    const result = spawnSync('git', ['init'], {
      cwd: targetDir,
      stdio: 'pipe',
    });

    if (result.status === 0) {
      s.stop('Git repository initialized');
    } else {
      s.stop('Git init failed. Run manually: git init');
    }
  } catch {
    s.stop('Git init failed. Run manually: git init');
  }
}

/**
 * Detect the user's package manager from the npm config user agent
 */
function detectPackageManager(): string {
  const userAgent = process.env.npm_config_user_agent ?? '';
  if (userAgent.includes('pnpm')) return 'pnpm';
  if (userAgent.includes('yarn')) return 'yarn';
  return 'npm';
}
