export class ResidentEventRuntime {
  constructor({ registry, settlement, emit, definitions = [] } = {}) { this.registry = registry; this.settlement = settlement; this.emit = emit; this.definitions = definitions; this.active = null; this.completed = {}; this.lastCycle = -1; }
  evaluate(worldTime) {
    const cycle = Math.floor(worldTime / 1440);
    if (cycle <= this.lastCycle || this.active) return null;
    this.lastCycle = cycle;
    const definition = this.definitions.find(item => !this.completed[item.id] && (this.registry.get(item.targetId)?.relationships?.player ?? 0) >= item.relationship);
    if (!definition) return null;
    this.active = { id: definition.id, targetId: definition.targetId, title: definition.title, description: definition.description, options: structuredClone(definition.options), offeredAt: worldTime };
    this.emit?.({ type: 'RESIDENT_EVENT_OFFERED', eventId: definition.id, targetId: definition.targetId });
    return this.active;
  }
  current() { return this.active ? structuredClone(this.active) : null; }
  resolve(optionId, playerId = 'player', worldTime = 0) {
    if (!this.active) return { ok: false, reason: 'NO_ACTIVE_RESIDENT_EVENT' };
    const option = this.active.options.find(item => item.id === optionId); const player = this.registry.get(playerId);
    if (!option || !player) return { ok: false, reason: 'INVALID_OPTION' };
    for (const [resource, amount] of Object.entries(option.cost ?? {})) if ((this.settlement.resources[resource] ?? 0) < amount) return { ok: false, reason: 'INSUFFICIENT_RESOURCES', resource };
    if ((player.energy ?? player.maxEnergy ?? 100) < (option.costEnergy ?? 0)) return { ok: false, reason: 'INSUFFICIENT_ENERGY' };
    for (const [resource, amount] of Object.entries(option.cost ?? {})) this.settlement.spendResource(resource, amount);
    if (option.costEnergy) player.energy = (player.energy ?? player.maxEnergy ?? 100) - option.costEnergy;
    for (const [key, amount] of Object.entries(option.effects ?? {})) { if (key in this.settlement.resources) this.settlement.addResource(key, amount); else if (key === 'safety') this.settlement.safety = Math.max(0, Math.min(100, this.settlement.safety + amount)); else if (key === 'morale') this.settlement.morale = Math.max(0, Math.min(100, this.settlement.morale + amount)); else if (key === 'prosperity') this.settlement.prosperity = Math.max(0, this.settlement.prosperity + amount); }
    const target = this.registry.get(this.active.targetId); if (target) { target.relationships ??= {}; target.relationships[playerId] = (target.relationships[playerId] ?? 0) + 2; }
    const result = { eventId: this.active.id, optionId, text: option.text };
    this.completed[this.active.id] = { ...result, completedAt: worldTime }; this.emit?.({ type: 'RESIDENT_EVENT_RESOLVED', ...result, playerId }); this.active = null;
    return { ok: true, ...result };
  }
  snapshot() { return { active: this.active, completed: this.completed, lastCycle: this.lastCycle }; }
  restore(snapshot = {}) { this.active = snapshot.active ?? null; this.completed = structuredClone(snapshot.completed ?? {}); this.lastCycle = snapshot.lastCycle ?? -1; }
}
