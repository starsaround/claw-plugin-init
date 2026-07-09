# 竞品分析报告

> 调研时间：2026-07-06
> 调研范围：npm 注册表、GitHub 全站

## 一、OpenClaw 生态内现有工具

### 1.1 npm 包

| 包名 | 版本 | 说明 | 活跃度 | 问题 |
|------|------|------|--------|------|
| **create-claw** | 0.0.1 | Create a new claw project | ❌ 无人维护 | 空壳，1.6KB，无实际功能 |
| **create-openclaw** | 0.0.0 | 占位符包 | ❌ | 286 字节，无任何实现 |
| **create-openclaw-bot** | 5.10.1 | Bot 安装器 | ✅ 活跃 | 只做 Bot 安装，不是通用脚手架 |
| **create-openclaw-octo** | 1.0.2 | Octo 频道插件 CLI | ⚠️ 低 | 只做单一功能 |
| **create-claw-plugin** | 0.1.2 | 插件脚手架（clawic 组织） | ⚠️ 低 | 第三方，非官方，功能有限 |
| **create-claw-server** | 0.1.2 | 服务端脚手架（clawic 组织） | ⚠️ 低 | 同上 |

### 1.2 GitHub 模板仓库

| 仓库 | Stars | 说明 | 问题 |
|------|-------|------|------|
| openclaw-skill-template | 2 | Skill 模板 | 只是模板仓库，不是 CLI 工具 |
| openclaw-starter-kit | 156 | Python 垂直方案 | 不是通用脚手架 |
| xiaomo-starter-kit | 365 | 中文个人助手模板 | 不是 Skill/Plugin 脚手架 |
| boilerplate-openclaw | 0 | 只有 .claude 配置文件 | 不是真正的项目模板 |

### 1.3 结论

**OpenClaw 生态没有好用的 Plugin 脚手架工具。**

现有的要么是空壳、要么太专、要么是模板仓库（不是 CLI）。`create-claw-app` 这个具体的概念，目前还是一个等待被定义的空白。

## 二、其他 Agent 框架的脚手架对比

| 框架 | 脚手架 | 语言 | 体验 | 说明 |
|------|--------|------|------|------|
| **CrewAI** | `crewai create crew` | Python | ⭐⭐⭐⭐ | 生成完整项目目录 + 配置文件 |
| **LangGraph** | `create-langgraph` | TS | ⭐⭐⭐⭐ | 官方包，一行命令生成项目 |
| **OpenAI Agents SDK** | `create-openai-agent` | Python | ⭐⭐⭐ | 刚发布 2 个月，功能基础 |
| **AutoGPT** | `./run agent create` | Python | ⭐⭐⭐ | 只做自己的框架 |
| **AutoGen** | ❌ 无 | — | — | 纯 SDK，无脚手架 |
| **LangChain** | ❌ 无 | — | — | 纯 SDK，无脚手架 |
| **OpenClaw** | ❌ 无 | — | — | **蓝海机会** |

### 2.1 趋势判断

所有主流 Agent 平台都在从 "Prompt 驱动" 向 "代码驱动" 转型。脚手架工具是生态发展的基础设施——"没有脚手架，新手进不来；没有新手，生态起不来。"

## 三、核心差异分析

| 维度 | create-claw-app（目标） | 现有竞品 |
|------|------------------------|---------|
| 交互式模板选择 | ✅ | ❌ |
| 多项目类型 | ✅（Tool/Channel/Provider/MCP） | ❌（单一场景） |
| 语言选择 | ✅（TS 为主，未来可扩展） | ❌ |
| 自动安装依赖 | ✅ | ❌ |
| Git 初始化 | ✅ | ❌ |
| ESLint/Prettier 配置 | ✅ | ❌ |
| 测试框架集成 | ✅ | ❌ |
| CI/CD 模板 | ✅（可选） | ❌ |
| 社区维护活跃 | ⭐（目标） | ❌ |

## 四、机会窗口判断

- **需求存在**：OpenClaw 382k Stars，ClawHub CLI 月下载 28.8 万次
- **供给不足**：Plugin 仅 1,669 个（对比 Skill 12,600+）
- **时间合适**：`create-openai-agent` 2 个月前刚发布，说明各大平台都在补这个缺口
- **竞品不强**：现有工具要么空壳、要么偏门

**结论：窗口期仍在，是切入的最佳时机。**
