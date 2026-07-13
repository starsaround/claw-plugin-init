/**
 * Detect whether the CLI is running in an interactive terminal.
 * @clack/prompts requires a TTY; non-interactive mode skips prompts and uses defaults.
 */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY) && Boolean(process.stdout.isTTY);
}
