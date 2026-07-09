# claw-plugin-init 开发方案

> 本文件是项目的核心开发计划，所有开发工作按此推进。
> 每个阶段完成后，将对应条目标记为 `[x]`。
>
> **如何更新**：完成一个任务后，将 `[ ]` 改为 `[x]`。如果需求变更，在对应条目后添加 `(修正: ...)` 说明。

---

## 阶段总览

```
Phase 0: 环境就绪 ─── 第 1 天
   │
Phase 1: MVP 核心 ─── 第 2-4 天
   │   ├── 用户能跑通 Tool Plugin 模板
   │   └── 可发布到 npm
   │
Phase 2: 体验完善 ─── 第 5-8 天
   │   ├── 更多模板 + 参数支持
   │   └── 从 create-vite/astro 学到的改进
   │
Phase 3: 生态接入 ─── 第 9-12 天
   │   ├── 版本检测 + clawhub 集成
   │   └── 社区反馈闭环
   │
Phase 4: 质量打磨 ─── 第 13-16 天
       ├── 测试覆盖 + 文档
       └── 发布 1.0.0
```

---

## Phase 0：环境就绪

> **目标**：开发环境可运行，能构建出最小产物。

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 0.1 | Node.js 22+ / pnpm 已安装 | `[x]` | v22.22.0 / v10.28.2 |
| 0.2 | `pnpm install` 依赖安装通过 | `[x]` | 98 个包 |
| 0.3 | `pnpm build` 构建成功，产出 `dist/index.js` | `[x]` | 66.86 KB 单文件 |
| 0.4 | `node dist/index.js --help` 能正常显示帮助 | `[x]` | |
| 0.5 | 用 `node dist/index.js test-output --no-install` 跑通一次完整流程 | `[x]` | 生成 6 个文件，变量替换正确 |

**验收标准**：一条命令能创建一个完整的 Tool Plugin 项目（含 package.json + manifest + TS 入口）。

**验收标准：✅ 已通过**

---

## Phase 1：MVP 核心

> **目标**：`claw-plugin-init` 核心功能可用，已发布到 npm v0.1.1。

### 1.1 CLI 入口和参数解析

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.1.1 | mri 解析 `-t/--type`、`-f/--force`、`--no-install`、`-h/--help` | `[x]` | `src/index.ts` |
| 1.1.2 | `--help` 输出友好的帮助信息 | `[x]` | |
| 1.1.3 | 非法参数的处理（报告错误而非静默忽略） | `[x]` | 非 TTY 时自动降级默认值 |

### 1.2 交互式提示

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.2.1 | 插件类型选择（@clack/prompts select） | `[x]` | `src/prompts/type.ts` |
| 1.2.2 | 项目名/包名输入 + 合法性校验 | `[x]` | `src/prompts/name.ts` |
| 1.2.3 | 显示名称、描述输入 | `[x]` | `src/commands/init.ts` |
| 1.2.4 | 目录已存在时确认是否覆盖 | `[x]` | |
| 1.2.5 | 处理用户取消（p.isCancel） | `[x]` | 每个提示后都有 |
| 1.2.6 | 所有 prompt 有合理默认值，按 Enter 可跳过 | `[x]` | |

### 1.3 模板复制

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.3.1 | Tool Plugin 模板文件齐全 | `[x]` | 6 个文件 |
| 1.3.2 | `{{变量名}}` 替换能正确工作 | `[x]` | `src/scaffold/copy.ts` |
| 1.3.3 | `_gitignore` → `.gitignore` 重命名 | `[x]` | `RENAME_FILES` 映射 |
| 1.3.4 | `package.json` 的 JSON 解析替换 | `[x]` | |
| 1.3.5 | 递归复制子目录 | `[x]` | |
| 1.3.6 | 目标目录已存在时 + `--force` 能覆盖 | `[x]` | 清空旧目录再重建 |
| 1.3.7 | 生成的项目 `openclaw.plugin.json` 格式正确 | `[x]` | 已人工验证 |

### 1.4 后处理

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.4.1 | 自动检测包管理器（pnpm/yarn/npm） | `[x]` | `src/scaffold/cleanup.ts` |
| 1.4.2 | 安装依赖（安装中显示 spinner） | `[x]` | |
| 1.4.3 | 安装失败时的降级提示 | `[x]` | |
| 1.4.4 | Git init（可选） | `[x]` | `initGit` 函数 |
| 1.4.5 | 输出"下一步"指引 | `[x]` | |

### 1.5 版本检测

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.5.1 | 运行时自动获取 npm 最新 OpenClaw 版本 | `[x]` | `src/utils/package.ts` |
| 1.5.2 | 网络失败时降级到硬编码版本 | `[x]` | `2>/dev/null` 静默降级 |
| 1.5.3 | 模板中版本号使用 `{{openclawVersion}}` | `[x]` | |

### 1.6 发布

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 1.6.1 | npm 账号已注册 | `[x]` | 用户自有账号，已启用 2FA |
| 1.6.2 | `npm publish` 发布 `claw-plugin-init` | `[x]` | v0.1.1，2026-07-09 |
| 1.6.3 | `npx claw-plugin-init test-xxx` 验证安装 | `[x]` | 通过 |
| 1.6.4 | 在 OpenClaw Discord/社区发帖介绍 | `[ ]` | 待做 |

**Phase 1 验收标准**：
- [x] 新手执行 `npx claw-plugin-init my-plugin` → 回答 4 个问题 → 得到能 `npm run build` 通过的项目
- [x] 该项目能被 `openclaw plugins install` 加载
- [x] 已发布到 npm（`claw-plugin-init@0.1.1`）

---

## Phase 2：体验完善

> **目标**：学习 create-vite 和 create-astro 的优秀做法，提升脚手架质量。

### 2.1 参考 create-vite 的改进

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2.1.1 | 研究 create-vite 的 `FRAMEWORKS` 配置模式，看能否借鉴到插件类型管理 | `[ ]` | 参考 `reference-projects/create-vite/dist/index.js` |
| 2.1.2 | 研究 create-vite 的 `write()` 函数和文件处理细节 | `[ ]` | |
| 2.1.3 | 研究 create-vite 的 `formatTargetDir()` 路径处理 | `[ ]` | |
| 2.1.4 | 研究 create-vite 的打包方案（如何将模板打包进 dist） | `[ ]` | |

### 2.2 参考 create-astro 的改进

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2.2.1 | 研究 create-astro 的 `p.group()` 用法，看看能否让交互流程更流畅 | `[ ]` | 参考 `reference-projects/create-astro/dist/index.js` |
| 2.2.2 | 研究 create-astro 的 messages/shell 设计 | `[ ]` | |
| 2.2.3 | 改进 intro/outro 的视觉风格 | `[ ]` | |

### 2.3 新增模板

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
	| 2.3.1 | Channel Plugin 模板 | `[ ]` | 需要研究 `defineChannelPluginEntry` |
| 2.3.2 | MCP Server 模板 | `[x]` | v0.1.4, 2026-07-09 |
| 2.3.3 | Provider Plugin 模板 | `[ ]` | 需要研究 provider 实现接口 |

### 2.4 参数完善

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2.4.1 | 支持 `npx create-claw-app my-plugin --type tool-plugin` 非交互式创建 | `[ ]` | |
| 2.4.2 | 支持 `npx create-claw-app . --force` 在当前目录创建 | `[ ]` | |
| 2.4.3 | 支持 `--template-version` 指定模板版本 | `[ ]` | 可选 |

### 2.5 错误处理强化

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2.5.1 | 目标目录不可写时的友好错误 | `[ ]` | |
| 2.5.2 | 网络超时/无网络时的降级 | `[x]` | `package.ts` 已有 |
| 2.5.3 | 模板目录缺失时的清晰提示 | `[x]` | `init.ts` 已有 |
| 2.5.4 | Ctrl+C 中断时的优雅退出 | `[ ]` | |

**Phase 2 验收标准**：
- [ ] 至少 2 个模板可用（tool-plugin + 另一个）
- [ ] 非交互式参数完整
- [ ] 从 create-vite/astro 至少采纳 3 个改进

---

## Phase 3：生态接入

> **目标**：与 OpenClaw 生态深度集成，形成开发者使用闭环。

### 3.1 版本管理

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 3.1.1 | 运行时检查本地 openclaw 版本，提示版本不兼容 | `[ ]` | |
| 3.1.2 | 自动更新模板中的 `openclaw.plugin.json` 版本兼容范围 | `[ ]` | |
| 3.1.3 | 缓存已获取的版本信息（减少网络请求） | `[ ]` | |

### 3.2 ClawHub 集成

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 3.2.1 | `create-claw-app` 生成项目后提示 `clawhub login` | `[ ]` | |
| 3.2.2 | 可选: 生成项目时自动在 `package.json` 填充 clawhub 发布配置 | `[ ]` | |
| 3.2.3 | 输出中提供完整的发布命令（含 clawhub publish） | `[x]` | 已有 |

### 3.3 社区反馈闭环

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 3.3.1 | 在 OpenClaw Discord 发布帖子收集反馈 | `[ ]` | |
| 3.3.2 | 在 GitHub 创建 Issues 模板（Bug Report / Feature Request） | `[ ]` | |
| 3.3.3 | 根据社区反馈确定 Phase 4 优先级 | `[ ]` | |
| 3.3.4 | 追踪 clawhub CLI 下载量变化（衡量工具影响） | `[ ]` | |

**Phase 3 验收标准**：
- [ ] 生成的项目可以直接 `clawhub package publish`
- [ ] 有社区反馈渠道
- [ ] Phase 4 优先级已根据反馈确定

---

## Phase 4：质量打磨

> **目标**：达到 1.0.0 发布标准。

### 4.1 测试覆盖

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 4.1.1 | 单元测试: `validation.ts` 的包名校验 | `[x]` | 13 个测试 |
| 4.1.2 | 单元测试: `scaffold/copy.ts` 的模板变量替换 | `[x]` | 7 个测试 |
| 4.1.3 | 单元测试: `scaffold/cleanup.ts` 的依赖安装 | `[ ]` | |
| 4.1.4 | 集成测试: 完整跑通一次脚手架创建流程 | `[x]` | 8 个测试 |
| 4.1.5 | 测试: 生成的项目能通过 `tsc --noEmit` | `[ ]` | |
| 4.1.6 | 测试: 生成的项目能通过 `openclaw plugins inspect` | `[ ]` | |

### 4.2 文档

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 4.2.1 | `README.md`: 安装、使用、模板列表、API | `[ ]` | |
| 4.2.2 | `CONTRIBUTING.md`: 如何贡献代码 | `[ ]` | |
| 4.2.3 | `CHANGELOG.md`: 版本历史 | `[ ]` | |
| 4.2.4 | 更新 `AGENTS.md` 反映最终项目状态 | `[ ]` | |

### 4.3 CI/CD

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 4.3.1 | GitHub Actions: 自动运行测试 | `[x]` | `.github/workflows/test.yml` |
| 4.3.2 | GitHub Actions: 自动发布到 npm（tag 触发） | `[x]` | `.github/workflows/publish.yml`，需在仓库设置 `NPM_TOKEN` secret |
| 4.3.3 | GitHub Actions: 自动生成 CHANGELOG | `[ ]` | |

### 4.4 发布 1.0.0

| 编号 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 4.4.1 | 代码审查（自己或他人） | `[ ]` | |
| 4.4.2 | 修复所有已知 Bug | `[ ]` | |
| 4.4.3 | `npm publish` 发布 1.0.0 | `[ ]` | |
| 4.4.4 | 在 OpenClaw 社区正式 announce | `[ ]` | |

**Phase 4 验收标准**：
- [ ] 测试覆盖率 > 80%
- [ ] 所有核心路径有集成测试
- [ ] 文档齐全
- [ ] CI/CD 自动化
- [ ] 1.0.0 已发布

---

## 里程碑速查表

| 里程碑 | 预计完成 | 核心交付物 |
|--------|---------|-----------|
| M0: 环境就绪 | 第 1 天 | `pnpm build` 通过 |
| M1: MVP 可用 | 第 4 天 | npm 已发布，可创建 Tool Plugin |
| M2: 体验完善 | 第 8 天 | 2+ 模板，非交互式参数 |
| M3: 生态集成 | 第 12 天 | clawhub 集成，社区反馈 |
| M4: 1.0.0 发布 | 第 16 天 | 测试、文档、CI/CD 全齐 |

---

## 发布与 NPM 信息

> 以下信息供后续开发和发布使用。

### 包信息

| 项 | 值 |
|------|------|
| **npm 包名** | `claw-plugin-init` |
| **当前版本** | `0.1.5`（2026-07-09） |
| **CLI 命令** | `npx claw-plugin-init` |
| **npm 账号** | 用户自有账号，已启用 2FA |
| **发布方式** | 需要 `--otp` 或 bypass-2fa token |

### npm Token（7 天有效，即将过期）

**生成时间**：2026-07-09  
**过期时间**：2026-07-16 ⚠️ **需要轮换**  
**Token 值**：`YOUR_NPM_TOKEN`（即将过期）  
**类型**：Granular Access Token，bypass 2FA  

**操作方法**：
1. 访问 https://www.npmjs.com/settings/{用户名}/tokens
2. 生成新的 Granular Access Token（权限：read + write for claw-plugin-init）
3. 更新下方 Token 值
4. 同时将新 Token 添加到 GitHub 仓库 Secrets（Settings → Secrets → Actions → `NPM_TOKEN`）
```

> ⚠️ Token 过期后需要重新生成。去 https://www.npmjs.com/settings/xxx/tokens 创建新 token。

### 发布新版本的流程

```bash
# 1. 更新版本号
npm version patch   # 或 minor / major

# 2. 构建
pnpm build

# 3. 发布（使用 token）
echo "//registry.npmjs.org/:_authToken=新TOKEN" > /tmp/.npmrc-publish
npm publish --userconfig /tmp/.npmrc-publish

# 4. 验证
npx claw-plugin-init@latest test-verify --no-install
```

---

## 进度记录

> 每个阶段完成后，在此记录完成日期和关键决策。

| 日期 | 里程碑 | 关键决策/说明 |
|------|--------|--------------|
| 2026-07-07 | M0: 环境就绪 | 6 项修正（版本检测静默、--force 清空、.gitignore、README）|
| 2026-07-09 | M1: MVP 核心 ✅ | 命名 claw-plugin-init，发布 v0.1.1，端到端链路跑通 |
| 2026-07-09 | M2: 体验完善 🔶 | MCP Server 模板完成（v0.1.4），CLI 全英文化，依赖结构调整

---

## 如何引用本计划

本文件位于项目根目录 `PLAN.md`。

- **日常开发**：在 `AGENTS.md` 中引用了本计划（"See PLAN.md for development plan"）
- **进度更新**：完成任务后将 `[ ]` 改为 `[x]`
- **方案修正**：在需要调整的条目后标注 `(修正: YYYY-MM-DD, 原因...)`，保留历史记录
- **阶段完成**：在"进度记录"表中添加一行
