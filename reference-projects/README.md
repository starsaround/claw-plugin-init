# 参考项目

> 本目录存放可对标的知名开源项目源码，供 `create-claw-app` 开发参考。

## 参考项目列表

| 项目 | Stars | 参考价值 | 下载方式 |
|------|-------|---------|---------|
| **create-vite** | 72k+ | **核心参考** — CLI 架构、模板机制、交互体验 | `npm pack create-vite` |
| **create-astro** | 50k+ | 交互体验、@clack/prompts 深度使用 | `npm pack create-astro` |
| **create-openai-agent** | 新 | Agent 生态脚手架的最新实践 | `npm pack create-openai-agent` |
| **openclaw/openclaw** | 382k | Plugin SDK、Manifest 规范 | GitHub 仓库 |

## 学习要点

### 从 create-vite 学习

1. **入口架构**：mri 参数解析 → @clack 交互 → 模板复制 → 后处理
2. **模板目录设计**：template-xxx/ 目录结构，与 CLI 代码分离
3. **文件重命名**：`_gitignore` → `.gitignore` 的处理方式
4. **打包方案**：将所有依赖内联为单个 JS 文件
5. **错误处理**：各种边界情况（目录已存在、取消操作、网络超时）

### 从 create-astro 学习

1. **@clack/prompts 深度用法**：`p.group()` 组织 prompt 流程
2. **现代 CLI 的视觉设计**：intro/outro、spinner、颜色搭配
3. **模板变量的处理方式**

### 从 create-openai-agent 学习

1. **Agent 生态脚手架的模板设计**
2. **{{VAR}} 变量替换系统**
3. **多模板层设计**（base + type-specific）

### 从 openclaw/openclaw 学习

1. **Plugin SDK 的 API 设计**（位于 packages/ 目录）
2. **openclaw.plugin.json manifest 规范**
3. **官方插件的代码风格和结构**

## 目录结构

```
reference-projects/
├── README.md                 # 本文件
├── create-vite/              # create-vite 源码
│   ├── packages/create-vite/ # 核心脚手架代码
│   └── ...
├── create-astro/             # create-astro 源码（待下载）
├── create-openai-agent/      # create-openai-agent 源码（待下载）
└── openclaw/                 # OpenClaw 主仓库（待下载）
```

## 下载方式

```bash
# create-vite
npx tiged vitejs/vite/packages/create-vite ./reference-projects/create-vite

# create-astro
npx tiged withastro/astro/packages/create-astro ./reference-projects/create-astro

# create-openai-agent
npm pack create-openai-agent --pack-destination ./reference-projects/
cd ./reference-projects/ && tar -xzf create-openai-agent-*.tgz && rm *.tgz

# openclaw (只下载关键部分)
npx tiged openclaw/openclaw/extensions ./reference-projects/openclaw/extensions
```
