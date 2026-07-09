/**
 * 检测当前是否运行在交互式终端中
 * @clack/prompts 需要 TTY，非交互时跳过提示使用默认值
 */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY) && Boolean(process.stdout.isTTY);
}
