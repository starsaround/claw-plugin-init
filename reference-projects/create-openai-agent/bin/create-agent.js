#!/usr/bin/env node
// create-agent — bootstrap an OpenAI Agents SDK project
// Usage: npx create-agent my-project
//        npx create-agent my-project --type multi   (multi-agent handoff)
//        npx create-agent my-project --type voice   (voice pipeline)

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║        create-agent  🤖               ║
  ║  Bootstrap an OpenAI Agents project   ║
  ╚═══════════════════════════════════════╝

  Usage:
    npx create-agent <project-name> [--type single|multi|voice]

  Types:
    single   Single agent with tools (default)
    multi    Multi-agent with handoffs
    voice    Voice pipeline (STT → agent → TTS)

  Examples:
    npx create-agent my-bot
    npx create-agent support-agent --type multi
    npx create-agent voice-assistant --type voice
`);
  process.exit(0);
}

const projectName = args[0];
const typeFlag = args.indexOf("--type");
const agentType = typeFlag !== -1 ? args[typeFlag + 1] : "single";

if (!["single", "multi", "voice"].includes(agentType)) {
  console.error(`❌  Unknown type: ${agentType}. Use: single | multi | voice`);
  process.exit(1);
}

const dest = path.resolve(process.cwd(), projectName);
if (fs.existsSync(dest)) {
  console.error(`❌  Directory already exists: ${dest}`);
  process.exit(1);
}

const templateBase = path.join(__dirname, "..", "template", "base");
const templateType = path.join(__dirname, "..", "template", agentType);

// ── helpers ──────────────────────────────────────────────────────────────────
function copyDir(src, dst, vars = {}) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    // rename _gitignore → .gitignore etc
    const dstName = entry.startsWith("_dot_") ? "." + entry.slice(5) : entry;
    const dstPath = path.join(dst, dstName);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, dstPath, vars);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      for (const [k, v] of Object.entries(vars)) {
        content = content.replaceAll(`{{${k}}}`, v);
      }
      fs.writeFileSync(dstPath, content);
    }
  }
}

const vars = { PROJECT_NAME: projectName, AGENT_TYPE: agentType };

console.log(`\n🤖  Creating ${agentType} agent project: ${projectName}\n`);
copyDir(templateBase, dest, vars);
copyDir(templateType, dest, vars);

// ── done ─────────────────────────────────────────────────────────────────────
console.log(`✅  Done! Your project is ready.\n`);
console.log(`   cd ${projectName}`);
console.log(`   cp .env.example .env   # add your OPENAI_API_KEY`);
console.log(`   uv sync                # install Python deps`);
console.log(`   uv run main.py         # run your agent`);
console.log(``);
console.log(`📖  See README.md for full docs.`);
console.log(``);
