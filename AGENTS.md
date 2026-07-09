# claw-plugin-init 开发指南

本项目开发指南，供 AI 编码助手（Claude Code、Cursor 等）和人类协作者使用。

> **开发计划**：参见 `PLAN.md`
> **当前阶段**：Phase 2 完成 ✅ → Phase 3 — 生态接入

## 项目概述

claw-plugin-init 是 OpenClaw 生态的脚手架 CLI 工具，帮助开发者一行命令创建 OpenClaw Plugin 项目。

**核心价值**：将 Plugin 开发的启动成本从 2 小时降到 2 分钟，消除"启动恐惧"。

**技术栈**：
- 语言：TypeScript（Node.js 22+）
- CLI 框架：mri（参数解析）+ @clack/prompts（交互提示）+ picocolors（颜色）
- 构建：tsup（打包为单个 JS 文件）
- 测试：Vitest
- 包管理器：pnpm

## 仓库结构

```
├── package.json           # 项目元数据
├── tsconfig.json          # TypeScript 配置
├── build.config.ts        # tsup 打包配置
├── src/
│   ├── index.ts           # CLI 入口：mri 解析 + 流程编排
│   ├── commands/
│   │   └── init.ts        # init 命令（默认）
│   ├── prompts/
│   │   ├── type.ts        # 插件类型选择
│   │   ├── name.ts        # 项目名/包名输入+校验
│   │   └── options.ts     # 可选功能选择
│   ├── scaffold/
│   │   ├── copy.ts        # 文件复制逻辑
│   │   ├── replace.ts     # 模板变量替换（{{VAR}}）
│   │   └── cleanup.ts     # 后处理（git init, npm install）
│   └── utils/
│       ├── logger.ts      # 日志输出（picocolors）
│       └── validation.ts  # 包名校验正则
├── templates/             # 模板目录（构建时打包进 dist）
│   ├── tool-plugin/       # Tool Plugin 模板
│   ├── channel-plugin/    # Channel Plugin 模板
│   ├── provider-plugin/   # Provider Plugin 模板
│   └── mcp-server/        # MCP Server 模板
├── test/                  # 测试
└── README.md              # 使用说明

references/                # 调研资料
├── competitive-analysis.md   # 竞品分析
├── market-research.md        # 市场调研
├── user-research.md          # 用户调研
├── tech-architecture.md      # 技术架构调研
└── xie-tao-summary.md        # 谢教授演讲总结

reference-projects/        # 对标参考项目
└── create-vite/           # create-vite 源码（主要参考对象）
```

## 技术架构

### CLI 交互流程

```
用户输入:
  npx claw-plugin-init [project-name] [options]

1. mri 解析命令行参数
   ├─ project-name（可选，默认交互式输入）
   ├─ --type / -t（插件类型，可选）
   ├─ --force / -f（覆盖已存在目录）
   └─ --no-install（跳过依赖安装）

2. @clack/prompts 交互式提问
   ├─ 插件类型（未通过 --type 指定时）
   ├─ 项目名称（未通过参数指定时）
   ├─ 插件显示名称
   └─ 插件描述

3. 文件复制 + 模板变量替换
   ├─ 复制对应模板目录到目标路径
   ├─ 替换 {{变量名}} 占位符
   └─ 特殊处理 package.json（保持 JSON 格式）

4. 后处理
   ├─ 可选: git init
   └─ 可选: pnpm install / npm install

5. 输出成功信息
```

### 模板变量系统

支持以下变量替换（`{{变量名}}` 语法）：

| 变量 | 来源 | 示例值 |
|------|------|--------|
| `{{packageName}}` | 项目名 → 合法 npm 包名 | `my-plugin` |
| `{{pluginId}}` | 包名的短横线形式 | `my-plugin` |
| `{{pluginName}}` | 用户输入的显示名称 | `我的插件` |
| `{{pluginDescription}}` | 用户输入的描述 | `一个示例工具插件` |
| `{{toolName}}` | 工具名（snake_case） | `my_tool` |
| `{{toolDescription}}` | 工具描述 | `处理用户提供的输入` |
| `{{openclawVersion}}` | 运行时的最新版本 | `2026.3.24-beta.2` |
| `{{pluginSdkVersion}}` | 运行时的 SDK 版本 | `2026.3.24-beta.2` |

### 特殊文件处理

- `_gitignore` → `.gitignore`（文件名重命名）
- `_npmrc` → `.npmrc`
- `package.json`：JSON 解析后只替换 `name` 字段，保持格式完整

## 开发命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 开发模式（tsup --watch）
pnpm build            # 构建（打包为单个 JS 文件）
pnpm test             # 运行测试
pnpm test -- --watch  # watch 模式
pnpm lint             # 代码检查
pnpm fmt              # 格式化
```

## 发布流程

```bash
pnpm build                      # 构建
node ./dist/index.js --version  # 验证构建产物
pnpm publish                    # 发布到 npm
# 或本地测试:
node ./dist/index.js test-project --type tool-plugin --no-install
```

## 编码规范

### Do（一定要做）
- 使用 TypeScript 严格模式
- 使用 `import type { X }` 导入类型
- 优先使用 `node:fs` 等内置模块，减少外部依赖
- 所有用户输入必须做校验（包名、路径等）
- 错误处理覆盖：文件已存在、权限不足、网络超时
- 使用 `p.isCancel()` 处理用户取消操作
- 代码注释写 why，不写 what
- 单文件不超过 300 行
- 模板文件使用 `{{VAR}}` 语法，保持与 `create-vite` 一致

### Don't（一定不要做）
- 不引入不必要的外部依赖（优先用 Node 内置）
- 不修改 `templates/` 以外的文件来适配新模板类型
- 不硬编码 OpenClaw 版本号——运行时自动获取最新版本
- 不生成大文件或无关文件
- 不把模板中的业务逻辑和 CLI 逻辑混在一起

## 设计原则

### 1. 极简主义
- 核心逻辑只用 3 个外部库（mri + @clack + picocolors）
- 模板即目录——不需要模板引擎
- 单文件打包，零依赖启动

### 2. 开发者体验优先
- 每条提示都要有默认值，按 Enter 就能继续
- 每条提示都要有校验，不让用户走到下一步才发现错了
- 成功时输出下一步指引，让用户知道接下来做什么

### 3. 渐进式复杂度
- 第一个模板（tool-plugin）先做到能用
- 后续模板逐步补充
- 不追求大而全，追求小而精

### 4. 向前辈学习
- 架构参考 create-vite（被数千万次使用验证）
- 交互参考 create-astro（现代 CLI 交互标杆）
- 模板变量参考 create-openai-agent（同类 Agent 生态工具）

## 边界（Boundaries）

### ✅ 自动执行
- 运行测试
- 格式化代码
- 类型检查
- 优化 import/export

### ⚠️ 先问再执行
- 新增外部依赖
- 修改 `templates/` 结构
- 修改 `src/commands/` 流程
- 删除文件
- 大规模重构（>100 行）

### 🚫 绝不
- 提交密钥或敏感信息
- 使用 `any` 类型
- 强行推送共享分支
- 修改 `package.json` 的 `version` 字段（用 changeset 管理）
- 在 `templates/` 中硬编码版本号

## 参考项目

本项目的架构参考以下开源项目：

| 项目 | Stars | 参考什么 |
|------|-------|---------|
| **create-vite** | 72k+ | 核心架构（mri + @clack + 目录复制模板） |
| **create-astro** | 50k+ | 交互体验、@clack 用法 |
| **create-openai-agent** | 新项目 | Agent 生态脚手架做法 |
| **openclaw/openclaw** | 382k | Plugin SDK、Manifest 规范 |

源码已下载到 `reference-projects/` 目录。

## 开发计划

开发按 `PLAN.md` 推进，分为 5 个里程碑：

| 里程碑 | 核心交付 | 预计 |
|--------|---------|------|
| **M0**: 环境就绪 | `pnpm build` 通过 | 第 1 天 |
| **M1**: MVP 核心 | npm 已发布，可创建 Tool Plugin | 第 4 天 |
| **M2**: 体验完善 | 2+ 模板，非交互式参数 | 第 8 天 |
| **M3**: 生态接入 | clawhub 集成，社区反馈 | 第 12 天 |
| **M4**: 1.0.0 发布 | 测试、文档、CI/CD 全齐 | 第 16 天 |

每日使用 `TodoWrite` 工具跟踪当前会话进度。完成任务后在 PLAN.md 中标记 `[x]`。

## 关联文件

- `PLAN.md` — 完整开发计划（当前进度）← **核心**
- `references/` — 完整调研文档（竞品、市场、用户、技术）
- `reference-projects/` — 对标项目的源码
- `./` — 项目代码
- `谢教授PPT` — 战略背景
