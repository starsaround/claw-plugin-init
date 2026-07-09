# 市场调研报告

> 调研时间：2026-07-06
> 数据来源：ClawHub API、GitHub、npm、OpenClaw 官方文档

## 一、OpenClaw 生态核心数据

| 指标 | 数据 | 说明 |
|------|------|------|
| OpenClaw GitHub Stars | **381,878** | 全球顶级的 AI 助手开源项目 |
| GitHub 提及 OpenClaw 的仓库 | **69,399 个** | 生态覆盖极广 |
| OpenClaw 组织关注者 | **22,635** | 社区影响力大 |
| ClawHub 注册表 Stars | 9,104 | 独立仓库 |
| clawhub CLI 月下载量 | **288,521 次** | npm 数据 |
| ClawHub 上线时间 | 2026 年 1 月 | 仅 6 个月 |

## 二、Skills vs Plugins 对比

### 2.1 数量对比

| 维度 | Skills | Plugins |
|------|--------|---------|
| 总提交量 | ~12,600+ | 1,669 |
| 审核后保留 | ~5,400+ | — |
| 头部下载 | 465,800 | 148,546（官方 WhatsApp） |
| Top 100 累计下载 | ~702 万 | — |
| 第三方占比 | 极高 | 极低（头部基本为官方插件） |

### 2.2 核心差距

```
提交量对比：
Skills   ████████████████████████████████████ 12,600+
Plugins  ████                                  1,669

头部创作者：
Skills   @ivangdavila 发布 968 个
Plugins  官方主导，第三方很少

下载转化：
clawhub CLI 月下载 28.8 万次
  → 但只有 1,669 个 Plugin 被创建
  → 说明大量用户想开发但被门槛劝退
```

### 2.3 根本原因

| | Skills | Plugins |
|--|--------|---------|
| **创建门槛** | 一个 SKILL.md 文件 | package.json + manifest + TS + 构建 + 测试 |
| **需要学习的内容** | Markdown 语法 | ESM 模块、SDK 子路径、Manifest 契约、TypeBox |
| **开发工具** | 不需要 | ❌ 缺失——脚手架工具 |
| **生态繁荣度** | 🔥🔥🔥🔥🔥 | 🔥🔥 蓝海 |

## 三、Plugin 的核心优势

OpenClaw 官方文档的三层架构：

```
Plugin（能力容器）
  ├─ 注册 Tool（可调用的函数）        ← Plugin 独有
  ├─ 内置 Skill（指令集）
  ├─ 接入 Channel（消息通道）         ← Plugin 独有
  ├─ 接入 Provider（模型提供商）      ← Plugin 独有
  └─ 挂载 Hook（生命周期钩子）        ← Plugin 独有

Skill（指令集）
  └─ 告诉 Agent "在什么情况下用什么 Tool"

Tool（原子动作）
  └─ 具体的可调用函数
```

### 能力边界对比

| 能力 | Skill | Skill+脚本 | Plugin |
|------|-------|-----------|--------|
| 注册新 Tool | ❌ | ❌ | ✅ |
| 执行代码 | ❌ | ⚠️ 通过 exec 间接 | ✅ 直接 |
| 类型安全的参数 | ❌ | ❌ | ✅ JSON Schema |
| 确定性执行 | ❌ 依赖 LLM 理解 | ❌ 依赖 LLM 理解 | ✅ 代码确定 |
| 生命周期钩子 | ❌ | ❌ | ✅ |
| 状态管理 | ❌ | ❌ | ✅ |
| Channel 接入 | ❌ | ❌ | ✅ |
| Provider 接入 | ❌ | ❌ | ✅ |
| 安全可审计 | ❌ | ❌ | ✅ Manifest 契约 |

## 四、行业趋势

所有主流 Agent 平台都在从 "Prompt 驱动" 向 "代码驱动" 转型：

| 平台 | 早期 | 当前 | 趋势 |
|------|------|------|------|
| OpenAI | GPT Actions（API 规范） | Agents SDK + Code Interpreter | 代码优先 |
| Anthropic | 提示词工程 | MCP Protocol + Tool Use | 标准化工具 |
| CrewAI | 纯 Python | `crewai create crew` | 工程化 |
| LangChain | LCEL 声明式 | LangGraph 可编程图 | 代码驱动 |
| OpenClaw | Skill（Markdown） | Plugin（TypeScript） | **正在转型** |

## 五、市场机会判断

### 5.1 需求端
- OpenClaw 有 381k Stars 的用户基础
- clawhub CLI 月下载 28.8 万次
- Skills 生态已证明社区有强烈的 "开发" 意愿

### 5.2 供给端
- Plugin 仅 1,669 个，供给严重不足
- 脚手架工具完全缺失
- 现有竞品要么空壳、要么偏门

### 5.3 时间窗口
- ClawHub 仅上线 6 个月
- Plugin 生态仍在早期
- `create-openai-agent` 刚发布 2 个月，说明行业在赶这个风口

### 5.4 机会量化

如果 Skill 和 Plugin 达到 1:3 的合理比例（Skills 的 1/3 有能力开发 Plugin）：
- 潜在 Plugin 需求：12,600 / 3 ≈ 4,200 个
- 当前供给：1,669 个
- 缺口：~2,500 个
- 每个新 Plugin 开发者都是脚手架工具的潜在用户

**结论：市场需要、供给不足、时机合适。**
