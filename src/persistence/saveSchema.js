export const SAVE_SCHEMA_VERSION = 1;

export function createSave(runtime) {
  return { schemaVersion: SAVE_SCHEMA_VERSION, savedAtWorldTime: runtime.clock.minutes, snapshot: runtime.snapshot() };
}

export function parseSave(data) {
  if (!data || data.schemaVersion !== SAVE_SCHEMA_VERSION || !data.snapshot) throw new Error('Unsupported or invalid save');
  return data;
}
