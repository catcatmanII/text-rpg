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
      const food = entity.consumption?.food ?? 0;
      if (food > 0 && (this.stock.food ?? 0) >= food * minutes) { this.stock.food -= food * minutes; entity.needs ??= {}; entity.needs.hunger = Math.max(0, (entity.needs.hunger ?? 0) - 5); }
      else if (food > 0) { entity.needs ??= {}; entity.needs.hunger = Math.min(100, (entity.needs.hunger ?? 0) + 2); this.emit?.({ type: 'FOOD_SHORTAGE', entityId: entity.id }); }
    }
    this.emit?.({ type: 'ECONOMY_TICK', worldTime, stock: { ...this.stock } });
  }
  snapshot() { return { stock: { ...this.stock } }; }
  restore(snapshot = {}) { this.stock = { ...(snapshot.stock ?? {}) }; }
}
