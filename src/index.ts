import mri from 'mri';
import { init } from './commands/init.js';
import { PLUGIN_TYPES } from './plugins.js';

function showHelp(): void {
  const templateList = PLUGIN_TYPES.map(
    (t) => `                          ${t.available ? '✅' : '🚧'} ${t.value.padEnd(20)} ${t.hint}`,
  ).join('\n');

  console.log(`
claw-plugin-init — Create an OpenClaw Plugin project

Usage:
  npx claw-plugin-init [project-name] [options]

Options:
  -t, --type <type>     Plugin type${templateList}
  -f, --force           Overwrite existing directory
  -y, --yes             Skip all prompts, accept defaults
  --no-install          Skip installing dependencies
  --git                 Initialize a Git repository
  --no-git              Skip Git repository initialization
  --dry-run             Preview actions without executing
  -h, --help            Show this help message

Examples:
  npx claw-plugin-init my-plugin
  npx claw-plugin-init my-plugin --type mcp-server
  npx claw-plugin-init . --force --no-install
  npx claw-plugin-init my-plugin --yes
`);
}

export type CliOptions = {
  type?: string;
  force: boolean;
  yes: boolean;
  install: boolean;
  git?: boolean;
  dryRun: boolean;
  help: boolean;
};

async function main(): Promise<void> {
  const argv = mri(process.argv.slice(2), {
    alias: {
      help: ['h'],
      type: ['t'],
      force: ['f'],
      yes: ['y'],
      dryRun: ['dry-run'],
    },
    boolean: ['help', 'force', 'yes', 'git', 'install', 'dryRun'],
    string: ['type'],
    default: {
      install: true,
    },
  });

  const options: CliOptions = {
    type: argv.type,
    force: argv.force ?? false,
    yes: argv.yes ?? false,
    install: argv.install ?? true,
    git: argv.git,
    dryRun: argv.dryRun ?? false,
    help: argv.help ?? false,
  };

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const projectName = argv._[0];

  await init(projectName, options);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});