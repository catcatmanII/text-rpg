export class WorldEventScheduler {
  constructor(definitions = []) { this.definitions = definitions; this.fired = new Set(); }
  evaluate(worldTime, emit) {
    for (const definition of this.definitions) {
      const cycle = Math.floor(worldTime / definition.interval);
      const key = `${definition.id}:${cycle}`;
      if (cycle > 0 && !this.fired.has(key)) { this.fired.add(key); emit({ ...definition, cycle }); }
    }
  }
}
