# 技术架构调研报告

> 调研时间：2026-07-06
> 方法：源码分析 + npm 包分析 + 官方文档

## 一、CLI 库选型对比

### 1.1 参数解析

| 特性 | mri | cac | commander |
|------|-----|-----|-----------|
| 依赖数 | 0 | 0 | 0 |
| 大小 | 极小 | 极小 | ~80KB |
| 复杂度 | 极简 | 简单 | 完整 |
| 子命令支持 | ❌ 需手动 | ✅ | ✅ |
| **谁在用** | **create-vite** | — | 很多传统 CLI |

**结论：选 mri。** create-vite 验证过的极简方案，我们不需要复杂的子命令系统。

### 1.2 交互提示

| 特性 | @clack/prompts | @inquirer/prompts |
|------|---------------|-------------------|
| 视觉效果 | 现代、彩色、极简 | 传统 |
| API 风格 | `p.group()` 优雅组织 | 每个 prompt 独立 |
| 内置 spinner | ✅ | ❌ |
| **谁在用** | **create-vite, create-astro** | 传统 Yeoman CLI |

**结论：选 @clack/prompts。** 现代 CLI 交互标杆，create-vite v9 已迁移到它。

### 1.3 颜色输出

| 特性 | picocolors | chalk | kleur |
|------|-----------|-------|-------|
| 大小 | 2.6KB | 92KB | 2.7KB |
| 依赖 | 0 | 0 | 0 |
| **谁在用** | **create-vite** | 传统项目 | 较少 |

**结论：选 picocolors。** 比 chalk 小 35 倍，API 一致。

## 二、create-vite 架构分析（主要参考对象）

### 2.1 整体架构

```
create-vite/
├── index.js                    # 入口
├── dist/index.js               # 打包后
├── template-vanilla/           # 模板目录
├── template-vanilla-ts/
├── template-vue/
└── ...                         # 16 个模板目录
```

### 2.2 核心流程

```
init() {
  1. mri(argv)           → 解析参数
  2. p.group()           → 交互式提问（类型、名称）
  3. copyDir()           → 复制模板目录
  4. updatePkgName()     → 替换 package.json 的 name
  5. (可选) installDeps() → 安装依赖
  6. printSuccess()      → 输出成功信息
}
```

### 2.3 模板变量机制

create-vite 的模板是**纯文件目录**，没有使用 EJS/Handlebars 等模板引擎。唯一需要替换的变量是 `package.json` 中的 `name` 字段，通过 `JSON.parse` → 修改 → `JSON.stringify` 实现。

### 2.4 特殊文件处理

```typescript
const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  _oxlintrc.json: '.oxlintrc.json',
};
```

以下划线开头的文件在复制时自动重命名为点文件。

### 2.5 打包方案

create-vite 使用自己的打包方案将所有依赖（mri、@clack）内联到 `dist/index.js` 中，实现**零依赖启动**。我们使用 tsup 实现相同的效果。

## 三、create-openai-agent 分析（Agent 生态参考）

### 3.1 模板结构

```
template/
  base/                    # 共享基础
    _dot_env.example       # → .env.example
    _dot_gitignore         # → .gitignore
    Makefile
    pyproject.toml
    README.md
    tools/
  single/                  # 类型特定覆写
    agents/base.py
    main.py
    tests/
    tools/
  multi/
  voice/
```

### 3.2 模板变量

使用 `{{VARIABLE}}` 语法，通过简单的字符串 `replaceAll` 实现变量替换：

```typescript
function copyDir(src, dst, vars) {
  for (const [k, v] of Object.entries(vars)) {
    content = content.replaceAll(`{{${k}}}`, v);
  }
}
```

### 3.3 和我们一致的选择

- 使用 `{{VAR}}` 语法（与 create-vite 的 JSON-only 方案不同，我们沿用这里）
- 使用 `_dot_` 前缀重命名（create-vite 和这里都用）
- **零外部依赖**（create-vite 也只依赖开发依赖，运行时依赖已打包）

## 四、最终技术栈决策

| 层 | 选型 | 版本 | 理由 |
|---|------|------|------|
| 运行时 | Node.js 22+ | — | LTS，内置 `fs.cpSync`/`util.styleText` |
| 语言 | TypeScript 5.x | 最新 | 类型安全 |
| 参数解析 | mri | 最新 | 极简，0 依赖 |
| 交互提示 | @clack/prompts | 最新 | 现代 UX，内置 spinner |
| 颜色 | picocolors | 最新 | 比 chalk 小 35 倍 |
| 子进程 | cross-spawn | 最新 | 跨平台 spawn |
| 测试 | Vitest | 最新 | 与 Vite 生态一致 |
| 构建 | tsup | 最新 | 打包为单 JS 文件 |
| 包名验证 | 内联正则 | — | 不引入新依赖 |
| 模板引擎 | 不需要 | — | 纯文件复制 + `{{VAR}}` 替换 |

## 五、模板目录结构

### Tool Plugin（主要模板）

```
tool-plugin/
├── _gitignore                  # → .gitignore
├── package.json                # { "name": "{{packageName}}", ... }
├── tsconfig.json               # 预设 TypeScript
├── openclaw.plugin.json        # Manifest
├── README.md                   # 项目说明
└── src/
    └── index.ts                # Plugin 入口 + 示例
```

### Channel Plugin

```
channel-plugin/
├── _gitignore
├── package.json
├── tsconfig.json
├── openclaw.plugin.json        # channel 类型配置
├── README.md
└── src/
    └── index.ts                # defineChannelPluginEntry 入口
```

### Provider Plugin

```
provider-plugin/
├── _gitignore
├── package.json
├── tsconfig.json
├── openclaw.plugin.json        # provider 配置
├── README.md
└── src/
    └── index.ts                # provider 实现骨架
```

### MCP Server

```
mcp-server/
├── _gitignore
├── package.json
├── tsconfig.json
├── Dockerfile                  # 容器化部署
├── README.md
└── src/
    └── index.ts                # MCP Server 入口
```

## 六、文件复制与变量替换核心

```typescript
// 核心逻辑（参考 create-vite + create-openai-agent）

type TemplateVars = {
  packageName: string;         // npm 包名
  pluginId: string;            // 插件 ID
  pluginName: string;          // 显示名称
  pluginDescription: string;   // 描述
  toolName: string;            // 工具名（snake_case）
  toolDescription: string;     // 工具描述
  openclawVersion: string;     // OpenClaw 版本
  pluginSdkVersion: string;    // SDK 版本
};

function scaffold(templateDir: string, destDir: string, vars: TemplateVars) {
  // 1. 递归遍历模板目录
  // 2. 下划线文件重命名（_gitignore → .gitignore）
  // 3. 替换所有文件中的 {{VAR}} 占位符
  // 4. 特殊处理 package.json（JSON 解析后只改 name 字段）
  // 5. 写入目标目录
}
```
