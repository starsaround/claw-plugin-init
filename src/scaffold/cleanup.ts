import { spawn, spawnSync } from 'node:child_process';

/**
 * Install dependencies in the target directory.
 * Throws when the package manager cannot be started or exits unsuccessfully.
 */
export async function installDeps(targetDir: string): Promise<void> {
  const pkgManager = detectPackageManager();

  await new Promise<void>((resolve, reject) => {
    const child = spawn(pkgManager, ['install'], {
      cwd: targetDir,
      stdio: 'pipe',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Failed to install dependencies. Run manually: ${pkgManager} install`));
    });

    child.on('error', () => {
      reject(new Error(`Failed to install dependencies. Run manually: ${pkgManager} install`));
    });
  });
}

/**
 * Initialize a Git repository.
 * Throws when git cannot be started or exits unsuccessfully.
 */
export async function initGit(targetDir: string): Promise<void> {
  const result = spawnSync('git', ['init'], {
    cwd: targetDir,
    stdio: 'pipe',
  });

  if (result.error || result.status !== 0) {
    throw new Error('Git init failed. Run manually: git init');
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
