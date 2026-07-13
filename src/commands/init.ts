import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import type { CliOptions } from '../index.js';
import type { PluginType } from '../prompts/type.js';
import { promptProjectName, promptPackageName } from '../prompts/name.js';
import { scaffold } from '../scaffold/copy.js';
import { installDeps, initGit } from '../scaffold/cleanup.js';
import { log, success, warning } from '../utils/logger.js';
import { getPackageInfo, getLocalOpenclawVersion, compareVersions } from '../utils/package.js';
import picocolors from 'picocolors';
import { isInteractive } from '../utils/tty.js';
import { getValidPluginTypes } from '../plugins.js';
import { toValidPackageName } from '../utils/validation.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(currentDir, '../templates');

type Task = {
  title: string;
  doneMessage: string;
  execute: () => Promise<void>;
};

async function runTasks(tasks: Task[], dryRun: boolean): Promise<void> {
  for (const task of tasks) {
    if (dryRun) {
      log(picocolors.dim(`  · ${task.doneMessage} (skipped, --dry-run)`));
      continue;
    }
    const s = p.spinner();
    s.start(task.title);
    try {
      await task.execute();
      s.stop(task.doneMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      s.stop(picocolors.red(message));
      throw error;
    }
  }
}

export async function init(projectName?: string, options?: CliOptions): Promise<void> {
  const interactive = isInteractive() && !options?.yes;
  const doGit = options?.git ?? (interactive ? undefined : true);
  const dryRun = options?.dryRun ?? false;
  const validPluginTypes = getValidPluginTypes();

  // Global SIGINT handler: ensure graceful exit during non-prompt phases
  // (@clack handles Ctrl+C internally during prompts via raw-mode keypress capture)
  const onSigint = () => process.exit(0);
  process.on('SIGINT', onSigint);

  p.intro(picocolors.cyan(picocolors.bold(' claw-plugin-init')));

  // --- Step 1: Resolve project name ---
  const targetDir = projectName
    ? path.resolve(process.cwd(), projectName)
    : interactive
      ? await promptProjectName()
      : path.resolve(process.cwd(), 'my-plugin');

  // --- Step 2: Check target directory ---
  let shouldReplaceTarget = false;
  if (fs.existsSync(targetDir)) {
    if (options?.force) {
      shouldReplaceTarget = true;
    } else if (interactive) {
      const overwrite = await p.confirm({
        message: `Directory ${path.basename(targetDir)} already exists. Overwrite?`,
        initialValue: false,
      });
      if (p.isCancel(overwrite) || !overwrite) {
        p.cancel('Cancelled');
        process.exit(0);
      }
      shouldReplaceTarget = true;
    } else {
      console.error(`Directory already exists: ${targetDir}. Use --force to overwrite.`);
      process.exit(1);
    }
  }

  // --- Step 3: Collect plugin metadata ---
  let pluginType: PluginType;
  let packageName: string;
  let pluginName: string;
  let pluginDescription: string;

  const requestedType = options?.type;
  if (requestedType && !validPluginTypes.some((type) => type.value === requestedType)) {
    console.error(
      `Invalid or unavailable plugin type "${requestedType}". Valid types: ${validPluginTypes.map((type) => type.value).join(', ')}`,
    );
    process.exit(1);
  }

  if (interactive) {
    const values = await p.group(
      {
        pluginType: () =>
          requestedType
            ? Promise.resolve(requestedType as PluginType)
            : p.select({
                message: 'Select plugin type:',
                options: validPluginTypes.map((type) => ({
                  value: type.value,
                  label: type.label,
                  hint: type.hint,
                })),
              }),
        packageName: () => promptPackageName(path.basename(targetDir)),
        pluginName: () =>
          p.text({
            message: 'Plugin display name:',
            defaultValue: path.basename(targetDir),
            validate: (value) => (value ? undefined : 'Display name is required'),
          }),
        pluginDescription: () =>
          p.text({
            message: 'Plugin description:',
            defaultValue: 'An OpenClaw plugin',
          }),
      },
      {
        onCancel: () => {
          p.cancel('Cancelled');
          process.exit(0);
        },
      },
    );

    pluginType = values.pluginType as PluginType;
    packageName = values.packageName as string;
    pluginName = values.pluginName as string;
    pluginDescription = values.pluginDescription as string;
  } else {
    pluginType = (requestedType as PluginType) ?? 'tool-plugin';
    packageName = toValidPackageName(path.basename(targetDir));
    pluginName = packageName;
    pluginDescription = 'An OpenClaw plugin';
  }

  const templateDir = path.join(templatesDir, pluginType);
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory not found: ${templateDir}`);
    process.exit(1);
  }

  // --- Step 4: Prepare tasks ---
  const tasks: Task[] = [];
  const pkgInfo = dryRun
    ? {
        openclawVersion: 'latest',
        pluginSdkVersion: 'latest',
      }
    : await getPackageInfo();

  if (shouldReplaceTarget) {
    tasks.push({
      title: 'Preparing target directory...',
      doneMessage: 'Target directory prepared',
      execute: async () => {
        fs.rmSync(targetDir, { recursive: true, force: true });
        fs.mkdirSync(targetDir, { recursive: true });
      },
    });
  }

  tasks.push({
    title: 'Scaffolding project...',
    doneMessage: 'Scaffolding project done',
    execute: () =>
      scaffold(templateDir, targetDir, {
        packageName,
        pluginId: packageName,
        pluginName,
        pluginDescription,
        toolName: packageName.replace(/-/g, '_'),
        toolDescription: pluginDescription,
        openclawVersion: pkgInfo.openclawVersion,
        pluginSdkVersion: pkgInfo.pluginSdkVersion,
      }),
  });

  if (options?.install !== false) {
    tasks.push({
      title: 'Installing dependencies...',
      doneMessage: 'Installing dependencies done',
      execute: () => installDeps(targetDir),
    });
  }

  if (doGit !== false) {
    tasks.push({
      title: 'Initializing Git repository...',
      doneMessage: 'Git repository initialized',
      execute: () => initGit(targetDir),
    });
  }

  // --- Step 5: Execute tasks ---
  await runTasks(tasks, dryRun);

  // --- Step 6: Success message ---
  const relativePath = path.relative(process.cwd(), targetDir) || '.';
  if (dryRun) {
    success(`Would create project at ./${relativePath}`);
  } else {
    success(`Project created at ./${relativePath}`);
  }
  log('');

  // Check local OpenClaw version compatibility
  if (!dryRun) {
    const localVersion = getLocalOpenclawVersion();
    if (localVersion) {
      const requiredVersion = pkgInfo.openclawVersion;
      if (compareVersions(localVersion, requiredVersion) < 0) {
        warning(`Local OpenClaw (${localVersion}) is older than the version this project targets (${requiredVersion}).`);
        warning('Consider upgrading: npm install -g openclaw@latest');
        log('');
      }
    }
  }

  if (!dryRun) {
    let nextSteps: string[];
    if (pluginType === 'mcp-server') {
      nextSteps = [
        `cd ${relativePath}`,
        'npm run dev    # Start dev mode',
        'npm run build  # Build the server',
        'npm start      # Start the MCP server on stdio',
      ];
    } else if (pluginType === 'channel-plugin') {
      nextSteps = [
        `cd ${relativePath}`,
        'npm run dev    # Start dev mode',
        'npm run build  # Build the plugin',
        'openclaw plugins install ./dist  # Register the channel',
      ];
    } else if (pluginType === 'provider-plugin') {
      nextSteps = [
        `cd ${relativePath}`,
        'npm run dev    # Start dev mode',
        'npm run build  # Build the plugin',
        `export ${packageName.toUpperCase().replace(/-/g, '_')}_API_KEY=your-key  # Set your API key`,
        'openclaw plugins install ./dist  # Register the provider',
      ];
    } else {
      nextSteps = [
        `cd ${relativePath}`,
        'npm run dev    # Start dev mode',
        'npm run build  # Build the plugin',
        'clawhub package publish  # Publish to ClawHub',
      ];
    }

    p.note(nextSteps.join('\n'), 'Next steps');
  }

  // Clean up SIGINT handler
  process.off('SIGINT', onSigint);

  p.outro(picocolors.green('Happy coding! ') + picocolors.cyan('🦀'));
}
