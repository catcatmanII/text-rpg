export class BuildingRuntime {
  constructor({ settlement, definitions = [], emit } = {}) { this.settlement = settlement; this.definitions = Object.fromEntries(definitions.map(definition => [definition.id, definition])); this.emit = emit; this.built = {}; }
  build(buildingId, actorId = 'player') {
    if (this.built[buildingId]) return { ok: false, reason: 'ALREADY_BUILT' };
    const definition = this.definitions[buildingId];
    if (!definition) return { ok: false, reason: 'UNKNOWN_BUILDING' };
    if ((this.settlement.level ?? 1) < definition.level) return { ok: false, reason: 'SETTLEMENT_LEVEL_REQUIRED' };
    for (const [resource, amount] of Object.entries(definition.cost ?? {})) if ((this.settlement.resources[resource] ?? 0) < amount) return { ok: false, reason: 'INSUFFICIENT_RESOURCES', resource };
    for (const [resource, amount] of Object.entries(definition.cost ?? {})) this.settlement.spendResource(resource, amount);
    this.built[buildingId] = { buildingId, builtAt: this.settlement.level, actorId };
    this.settlement.housing += definition.effects?.housing ?? 0;
    this.settlement.marketTier += definition.effects?.marketTier ?? 0;
    this.emit?.({ type: 'BUILDING_BUILT', buildingId, actorId, cost: definition.cost, effects: definition.effects });
    return { ok: true, building: definition };
  }
  has(buildingId) { return Boolean(this.built[buildingId]); }
  effects() { return Object.values(this.built).reduce((total, entry) => { for (const [key, value] of Object.entries(this.definitions[entry.buildingId]?.effects ?? {})) total[key] = (total[key] ?? 0) + value; return total; }, {}); }
  all() { return Object.keys(this.built); }
  snapshot() { return { built: structuredClone(this.built) }; }
  restore(snapshot = {}) { this.built = structuredClone(snapshot.built ?? {}); }
}
