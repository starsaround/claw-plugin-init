import * as p from '@clack/prompts';

export type PluginType = 'tool-plugin' | 'channel-plugin' | 'provider-plugin' | 'mcp-server';

export async function promptOptions(): Promise<{ installDeps: boolean; initGit: boolean }> {
  const installDeps = await p.confirm({
    message: 'Install dependencies?',
    initialValue: true,
  });
  if (p.isCancel(installDeps)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  const initGit = await p.confirm({
    message: 'Initialize a Git repository?',
    initialValue: true,
  });
  if (p.isCancel(initGit)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  return { installDeps, initGit };
}
