export class EconomyRuntime {
  constructor({ registry, inventory, emit, definitions = [] } = {}) {
    this.registry = registry; this.inventory = inventory; this.emit = emit;
    this.definitions = Object.fromEntries(definitions.map(definition => [definition.profession, definition]));
    this.stock = {};
  }
  tick(worldTime, minutes = 1) {
    for (const entity of this.registry.all()) {
      if (entity.type !== 'NPC' || entity.alive === false) continue;
      const definition = this.definitions[entity.profession];
      if (definition && entity.activity !== 'SLEEP' && entity.zoneId === definition.workZoneId) {
        for (const [itemId, amount] of Object.entries(definition.production ?? {})) this.stock[itemId] = (this.stock[itemId] ?? 0) + amount * minutes;
        this.emit?.({ type: 'RESOURCE_PRODUCED', entityId: entity.id, profession: entity.profession, production: definition.production });
      }
      // 食物由 SettlementRuntime 按日配給；居民需求只做低頻提示，避免每分鐘重複扣糧。
      if ((entity.consumption?.food ?? 0) > 0) { entity.needs ??= {}; entity.needs.hunger = Math.max(0, (entity.needs.hunger ?? 0) - 0.01 * minutes); }
    }
    this.emit?.({ type: 'ECONOMY_TICK', worldTime, stock: { ...this.stock } });
  }
  snapshot() { return { stock: { ...this.stock } }; }
  restore(snapshot = {}) { this.stock = { ...(snapshot.stock ?? {}) }; }
}
