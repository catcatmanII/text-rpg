import { WorldRuntime } from '../simulation/worldRuntime.js';
import { createSave, parseSave } from './saveSchema.js';

export function saveWorld(runtime) { return JSON.stringify(createSave(runtime), null, 2); }
export function loadWorld(serialized) { return WorldRuntime.fromSnapshot(parseSave(JSON.parse(serialized)).snapshot); }
