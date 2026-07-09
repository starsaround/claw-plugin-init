import * as p from '@clack/prompts';
import { PLUGIN_TYPES, type PluginType } from '../plugins.js';

export type { PluginType } from '../plugins.js';

export async function promptPluginType(): Promise<PluginType> {
  const type = await p.select({
    message: 'Select plugin type:',
    options: PLUGIN_TYPES.map((t) => ({
      value: t.value,
      label: t.label,
      hint: t.hint,
    })),
  });

  if (p.isCancel(type)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  return type as PluginType;
}
