# 用户调研报告

> 调研时间：2026-07-06
> 方法：竞品分析推断 + OpenClaw 社区观察 + 文档分析

## 一、用户画像

### 用户 A：小王，前端开发者
- **背景**：3 年前端经验，React/Vue 开发者
- **需求**：想给公司的 OA 系统做个 OpenClaw 插件
- **痛点**：
  > "我昨天花了一整个下午才把第一个 OpenClaw 插件跑通。文档写得其实挺好的，但信息太散了——我要在三个页面之间来回跳，才能凑齐一个能跑的项目。如果有个 create-claw-app，我中午休息时间就能搞定。"
- **核心诉求**：不用读文档就能开始写业务逻辑

### 用户 B：老李，独立开发者
- **背景**：全栈开发者，已写了 5 个 OpenClaw 插件
- **需求**：提升插件开发效率
- **痛点**：
  > "每次都是从上一个项目复制粘贴，然后手动改名字、改 id、改描述。我其实自己写了个 shell 脚本在做这件事。但我懒得维护它。"
- **核心诉求**：自动化重复劳动，标准化项目结构

### 用户 C：小陈，观望者
- **背景**：听说过 OpenClaw，有兴趣但还没开始
- **需求**：想试试 Plugin 开发
- **痛点**：
  > "我听说 OpenClaw 能写插件，去看了文档，看到 package.json 里那一堆 openclaw 开头的字段，我就关掉了。我就是想试试，不想先读三篇文档。"
- **核心诉求**：低摩擦的第一次体验

## 二、用户旅程对比

### 当前旅程（无脚手架）

```
1. 打开浏览器 → Google "OpenClaw plugin development"
2. 找到 docs.openclaw.ai → 翻到 /plugins/building-plugins
3. 读文档 → 发现需要 3 个文件
4. 手动创建 package.json
   → 纠结: type: "module" 要不要？
   → 纠结: peerDependencies 写什么版本？
   → 纠结: openclaw.extensions 字段填什么？
5. 手动创建 openclaw.plugin.json
   → 纠结: contracts.tools 是什么？
   → 纠结: activation.onStartup 要设为 true 吗？
   → 纠结: configSchema 怎么写？
6. 手动创建 src/index.ts
   → 纠结: import 用哪个子路径？
   → 纠结: definePluginEntry 还是 defineChannelPluginEntry？
7. 手动创建 tsconfig.json
   → 纠结: target 用 esnext 还是 es2022？
8. npm install 依赖
   → 纠结: typebox 要不要加？
9. 尝试构建 → 报错 → 查文档 → 修复 → 终于跑通

总耗时：新手 2-4 小时，老手 20-30 分钟
```

### 理想旅程（有脚手架）

```
1. npx create-claw-app my-plugin
2. 回答 4 个问题（类型/名称/显示名/描述）
3. ✔ 项目已创建在 ./my-plugin
4. cd my-plugin → 开始写业务逻辑

总耗时：2 分钟
```

## 三、核心洞察

### "5 分钟法则"

一个任务的启动成本如果超过 5 分钟，很多人就不会开始了。

- **Skill 开发**：启动成本 ≈ 30 秒（创建 SKILL.md）→ 生态 12,600+
- **Plugin 开发**：启动成本 ≈ 2 小时（搭环境）→ 生态 1,669

脚手架的作用不是"让困难的事变简单"，而是**把启动成本从 2 小时降到 2 分钟**，让更多人愿意开始。

### 用户真正需要的是

1. **不用看文档就能开始** — 工具替你决策，你只需要回答几个问题
2. **第一次就能跑通** — 生成的项目是经过验证的，不会遇到"缺这个包、少那个字段"
3. **正向反馈循环** — 2 分钟内看到 "✔ 项目已创建"，而不是 2 小时后还在折腾 tsconfig

### 竞品验证

`create-react-app` 当年解决的问题——不是 React 写不了，而是让"想试试 React"的人能在 1 分钟内看到 Hello World。这个"1 分钟看到成果"的体验，决定了有多少人愿意开始。

## 四、功能优先级

### P0（MVP 必须）
- [ ] 创建 Tool Plugin 项目
- [x] 交互式提问（类型、名称、显示名、描述）
- [x] 生成完整的 package.json + manifest + 入口文件
- [x] 自动安装依赖

### P1（第二版）
- [ ] Channel Plugin 模板
- [ ] MCP Server 模板
- [ ] `--type` / `--force` / `--no-install` 参数
- [ ] 版本检测（提示最新 OpenClaw 版本）

### P2（未来扩展）
- [ ] Provider Plugin 模板
- [ ] CI/CD 模板生成
- [ ] Docker 配置生成
- [ ] clawhub 发布集成
