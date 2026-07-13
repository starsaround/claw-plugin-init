import path from 'node:path';
import fs from 'node:fs';

export type TemplateVars = {
  packageName: string;
  pluginId: string;
  pluginName: string;
  pluginDescription: string;
  toolName: string;
  toolDescription: string;
  openclawVersion: string;
  pluginSdkVersion: string;
};

// Files to rename (underscore prefix → dot prefix)
const RENAME_FILES: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  _npmrc: '.npmrc',
  _env: '.env',
  _env_example: '.env.example',
};

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function replaceVariables(
  content: string,
  vars: TemplateVars,
  transform: (value: string) => string = (value) => value,
): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, transform(value));
  }
  return result;
}

function replaceJsonValue(value: unknown, vars: TemplateVars): unknown {
  if (typeof value === 'string') {
    return replaceVariables(value, vars);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceJsonValue(item, vars));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceJsonValue(item, vars)]),
    );
  }

  return value;
}

function escapeDoubleQuotedString(value: string): string {
  return JSON.stringify(value).slice(1, -1);
}

function escapeSingleQuotedString(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n')
    .replaceAll('\t', '\\t');
}

function escapeTemplateLiteral(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${')
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n');
}

function replaceCodeVariables(content: string, vars: TemplateVars): string {
  let result = content.replace(/"(?:\\.|[^"\\])*"/g, (literal) =>
    replaceVariables(literal, vars, escapeDoubleQuotedString),
  );
  result = result.replace(/'(?:\\.|[^'\\])*'/g, (literal) =>
    replaceVariables(literal, vars, escapeSingleQuotedString),
  );
  result = result.replace(/`(?:\\.|[^`\\])*`/g, (literal) =>
    replaceVariables(literal, vars, escapeTemplateLiteral),
  );

  // Support placeholders used as identifiers or in comments. Current bundled templates
  // place user-provided text inside string literals, where the escaping above applies.
  return replaceVariables(result, vars);
}

function renderJsonTemplate(content: string, srcPath: string, vars: TemplateVars): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    const details = error instanceof Error ? `: ${error.message}` : '';
    throw new Error(`Invalid JSON template ${srcPath}${details}`);
  }

  const rendered = replaceJsonValue(parsed, vars);
  if (path.basename(srcPath) === 'package.json' && rendered && typeof rendered === 'object') {
    const pkg = rendered as Record<string, unknown>;
    pkg.name = vars.packageName;
    if (typeof pkg.description === 'string') {
      pkg.description = vars.pluginDescription;
    }
  }

  return JSON.stringify(rendered, null, 2) + '\n';
}

/**
 * Recursively copy the template directory, replacing all {{variable}} placeholders
 */
export async function scaffold(
  templateDir: string,
  destDir: string,
  vars: TemplateVars,
): Promise<void> {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);
    const destName = RENAME_FILES[entry.name] ?? entry.name;
    const destPath = path.join(destDir, destName);

    if (entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      await scaffold(srcPath, destPath, vars);
    } else {
      const template = fs.readFileSync(srcPath, 'utf-8');
      const extension = path.extname(entry.name);
      const content =
        extension === '.json'
          ? renderJsonTemplate(template, srcPath, vars)
          : CODE_EXTENSIONS.has(extension)
            ? replaceCodeVariables(template, vars)
            : replaceVariables(template, vars);

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, content, 'utf-8');
    }
  }
}
