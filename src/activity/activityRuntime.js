export class ActivityRuntime {
  constructor({ registry, energy, definitions, settlement, emit } = {}) { this.registry = registry; this.energy = energy; this.definitions = definitions; this.settlement = settlement; this.emit = emit; this.active = null; }
  start(playerId, activityId) {
    if (this.active) return { ok: false, reason: 'ACTIVITY_IN_PROGRESS' };
    const definition = this.definitions[activityId]; const player = this.registry.get(playerId);
    if (!definition || !player || !this.energy.consume(player, definition.energy)) return { ok: false, reason: 'INSUFFICIENT_ENERGY' };
    this.active = { playerId, activityId, elapsed: 0, duration: definition.duration };
    this.emit?.({ type: 'ACTIVITY_STARTED', playerId, activityId, duration: definition.duration });
    return { ok: true, progress: 0, duration: definition.duration };
  }
  tick(minutes = 1) {
    if (!this.active) return null;
    this.active.elapsed = Math.min(this.active.duration, this.active.elapsed + minutes);
    const progress = this.active.elapsed / this.active.duration;
    if (progress >= 1) return this.#complete();
    return { status: 'IN_PROGRESS', progress };
  }
  #complete() {
    const completed = this.active; const definition = this.definitions[completed.activityId];
    this.settlement.applyActivityReward(definition.rewards, completed.activityId);
    this.emit?.({ type: 'ACTIVITY_COMPLETED', playerId: completed.playerId, activityId: completed.activityId, rewards: definition.rewards });
    this.active = null;
    return { status: 'COMPLETED', rewards: definition.rewards };
  }
  progress() { return this.active ? { ...this.active, ratio: this.active.elapsed / this.active.duration } : null; }
}
