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

/**
 * Recursively copy the template directory, replacing all {{variable}} placeholders
 */
export async function scaffold(
  templateDir: string,
  destDir: string,
  vars: TemplateVars,
): Promise<void> {
  // 确保目标目录存在
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
      let content = fs.readFileSync(srcPath, 'utf-8');

      // 替换模板变量
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(`{{${key}}}`, value);
      }

      // Special handling for package.json: parse JSON, update name and description
      if (entry.name === 'package.json') {
        try {
          const pkg = JSON.parse(content);
          pkg.name = vars.packageName;
          if (pkg.description) {
            pkg.description = vars.pluginDescription;
          }
          content = JSON.stringify(pkg, null, 2) + '\n';
        } catch {
          // 如果 JSON 解析失败，保持原内容（模板变量替换已做）
        }
      }

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, content, 'utf-8');
    }
  }
}
