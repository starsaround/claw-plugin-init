import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import type { CliOptions } from '../index.js';
import type { PluginType } from '../prompts/type.js';
import { promptProjectName, promptPackageName } from '../prompts/name.js';
import { scaffold } from '../scaffold/copy.js';
import { installDeps, initGit } from '../scaffold/cleanup.js';
import { log, success } from '../utils/logger.js';
import { getPackageInfo } from '../utils/package.js';
import picocolors from 'picocolors';
import { isInteractive } from '../utils/tty.js';
import { PLUGIN_TYPES, getValidPluginTypes } from '../plugins.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(currentDir, '../templates');

type Task = {
  title: string;
  execute: () => Promise<void>;
};

async function runTasks(tasks: Task[], dryRun: boolean): Promise<void> {
  for (const task of tasks) {
    if (dryRun) {
      log(picocolors.dim(`  · ${task.title} (skipped, --dry-run)`));
      continue;
    }
    const s = p.spinner();
    s.start(task.title);
    await task.execute();
    s.stop(task.title.replace('...', 'done'));
  }
}

export async function init(projectName?: string, options?: CliOptions): Promise<void> {
  const interactive = isInteractive() && !options?.yes;
  const doGit = options?.git ?? (interactive ? undefined : true);
  const dryRun = options?.dryRun ?? false;

  p.intro(picocolors.cyan(picocolors.bold(' claw-plugin-init')));

  // --- Step 1: Resolve project name ---
  const targetDir = projectName
    ? path.resolve(process.cwd(), projectName)
    : interactive
      ? await promptProjectName()
      : path.resolve(process.cwd(), 'my-plugin');

  // --- Step 2: Check target directory ---
  if (fs.existsSync(targetDir)) {
    if (options?.force) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      fs.mkdirSync(targetDir, { recursive: true });
    } else if (interactive) {
      const overwrite = await p.confirm({
        message: `Directory ${path.basename(targetDir)} already exists. Overwrite?`,
        initialValue: false,
      });
      if (p.isCancel(overwrite) || !overwrite) {
        p.cancel('Cancelled');
        process.exit(0);
      }
      fs.rmSync(targetDir, { recursive: true, force: true });
      fs.mkdirSync(targetDir, { recursive: true });
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

  if (interactive) {
    // Validate --type if provided
    if (options?.type && !PLUGIN_TYPES.some((t) => t.value === options.type)) {
      console.error(`Invalid plugin type "${options.type}". Valid types: ${getValidPluginTypes().map((t) => t.value).join(', ')}`);
      process.exit(1);
    }

    const values = await p.group(
      {
        pluginType: () =>
          options?.type
            ? Promise.resolve(options.type as PluginType)
            : p.select({
                message: 'Select plugin type:',
                options: PLUGIN_TYPES.map((t) => ({
                  value: t.value,
                  label: t.label,
                  hint: t.hint,
                })),
              }),
        packageName: () =>
          promptPackageName(path.basename(targetDir)),
        pluginName: () =>
          p.text({
            message: 'Plugin display name:',
            defaultValue: path.basename(targetDir),
            validate: (v) => (v ? undefined : 'Display name is required'),
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
    if (options?.type && !PLUGIN_TYPES.some((t) => t.value === options.type)) {
      console.error(`Invalid plugin type "${options.type}". Valid types: ${getValidPluginTypes().map((t) => t.value).join(', ')}`);
      process.exit(1);
    }
    pluginType = (options?.type as PluginType) ?? 'tool-plugin';
    packageName = path.basename(targetDir);
    pluginName = packageName;
    pluginDescription = 'An OpenClaw plugin';
  }

  // Validate template exists
  const templateDir = path.join(templatesDir, pluginType);
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory not found: ${templateDir}`);
    process.exit(1);
  }

  // --- Step 4: Prepare tasks ---
  const tasks: Task[] = [];
  const pkgInfo = await getPackageInfo();

  tasks.push({
    title: 'Scaffolding project...',
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
      execute: () => installDeps(targetDir),
    });
  }

  if (doGit !== false) {
    tasks.push({
      title: 'Initializing Git repository...',
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

  // Only show next steps in non-dry-run mode
  if (!dryRun) {
    const nextSteps = pluginType === 'mcp-server'
      ? [
          `cd ${relativePath}`,
          'npm run dev    # Start dev mode',
          'npm run build  # Build the server',
          'npm start      # Start the MCP server on stdio',
        ]
      : [
          `cd ${relativePath}`,
          'npm run dev    # Start dev mode',
          'npm run build  # Build the plugin',
          'clawhub package publish  # Publish to ClawHub',
        ];

    p.note(nextSteps.join('\n'), 'Next steps');
  }

  p.outro(picocolors.green('Happy coding! ') + picocolors.cyan('🦀'));
}