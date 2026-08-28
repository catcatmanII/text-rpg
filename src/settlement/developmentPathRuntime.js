export class DevelopmentPathRuntime {
  constructor({ settlement, emit, definitions = [] } = {}) { this.settlement = settlement; this.emit = emit; this.definitions = Object.fromEntries(definitions.map(definition => [definition.id, definition])); this.selected = null; }
  choose(pathId, actorId = 'player') {
    if (this.selected) return { ok: false, reason: 'PATH_ALREADY_SELECTED' };
    const definition = this.definitions[pathId]; if (!definition) return { ok: false, reason: 'UNKNOWN_PATH' };
    this.selected = pathId; this.settlement.developmentPath = pathId;
    if (definition.effects.foodCapacity) this.settlement.capacities.food += definition.effects.foodCapacity;
    if (definition.effects.marketTier) this.settlement.marketTier += definition.effects.marketTier;
    this.emit?.({ type: 'DEVELOPMENT_PATH_SELECTED', pathId, actorId }); return { ok: true, path: definition };
  }
  definition() { return this.selected ? this.definitions[this.selected] : null; }
  effects() { return this.definition()?.effects ?? {}; }
  snapshot() { return { selected: this.selected }; }
  restore(snapshot = {}) { this.selected = snapshot.selected ?? null; this.settlement.developmentPath = this.selected; }
}
