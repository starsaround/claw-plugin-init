import picocolors from 'picocolors';

export const log = console.log;

export function info(msg: string): void {
  console.log(picocolors.cyan(msg));
}

export function success(msg: string): void {
  console.log(picocolors.green(`✔ ${msg}`));
}

export function warning(msg: string): void {
  console.log(picocolors.yellow(`⚠ ${msg}`));
}

export function error(msg: string): void {
  console.log(picocolors.red(`✖ ${msg}`));
}
