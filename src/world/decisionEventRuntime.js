export class DecisionEventRuntime {
  constructor({ settlement, registry, population, emit, definitions = [] } = {}) { this.settlement = settlement; this.registry = registry; this.population = population; this.emit = emit; this.definitions = definitions; this.active = null; this.nextEventAt = 1440; this.sequence = 0; }
  evaluate(worldTime) {
    if (this.active || worldTime < this.nextEventAt) return null;
    const definition = this.definitions[this.sequence % this.definitions.length];
    this.sequence += 1; this.nextEventAt += definition.interval ?? 1440;
    this.active = { id: definition.id, title: definition.title, description: definition.description, options: structuredClone(definition.options), offeredAt: worldTime };
    this.emit?.({ type: 'DECISION_EVENT_OFFERED', eventId: definition.id, title: definition.title });
    return this.active;
  }
  current() { return this.active ? structuredClone(this.active) : null; }
  resolve(optionId, playerId = 'player', worldTime = 0) {
    if (!this.active) return { ok: false, reason: 'NO_ACTIVE_EVENT' };
    const option = this.active.options.find(item => item.id === optionId);
    const player = this.registry.get(playerId);
    if (!option || !player) return { ok: false, reason: 'INVALID_OPTION' };
    for (const [resource, amount] of Object.entries(option.cost ?? {})) if ((this.settlement.resources[resource] ?? 0) < amount) return { ok: false, reason: 'INSUFFICIENT_RESOURCES', resource };
    if ((player.energy ?? player.maxEnergy ?? 100) < (option.costEnergy ?? 0)) return { ok: false, reason: 'INSUFFICIENT_ENERGY' };
    for (const [resource, amount] of Object.entries(option.cost ?? {})) this.settlement.spendResource(resource, amount);
    if (option.costEnergy) player.energy = (player.energy ?? player.maxEnergy ?? 100) - option.costEnergy;
    for (const [key, amount] of Object.entries(option.effects ?? {})) { if (key in this.settlement.resources) this.settlement.addResource(key, amount); else if (key === 'safety') this.settlement.safety = Math.max(0, Math.min(100, this.settlement.safety + amount)); else if (key === 'morale') this.settlement.morale = Math.max(0, Math.min(100, this.settlement.morale + amount)); else if (key === 'prosperity') this.settlement.prosperity = Math.max(0, this.settlement.prosperity + amount); }
    if (option.relationship) { const target = this.registry.get(option.relationship.targetId); if (target) { target.relationships ??= {}; target.relationships[playerId] = (target.relationships[playerId] ?? 0) + option.relationship.amount; } }
    if (option.population) this.population?.addNewcomers(option.population, worldTime);
    const result = { eventId: this.active.id, optionId, text: option.text, population: option.population ?? 0 };
    this.emit?.({ type: 'DECISION_EVENT_RESOLVED', ...result, playerId }); this.active = null;
    return { ok: true, ...result };
  }
  snapshot() { return { active: this.active, nextEventAt: this.nextEventAt, sequence: this.sequence }; }
  restore(snapshot = {}) { this.active = snapshot.active ?? null; this.nextEventAt = snapshot.nextEventAt ?? 1440; this.sequence = snapshot.sequence ?? 0; }
}
