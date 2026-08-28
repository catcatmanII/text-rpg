export class CausalityRuntime {
  constructor({ registry, economy, settlement, buildings, emit } = {}) { this.registry = registry; this.economy = economy; this.settlement = settlement; this.buildings = buildings; this.emit = emit; }
  tick(worldTime) {
    const monsters = this.registry.all().filter(entity => entity.type === 'MONSTER' && entity.alive !== false).length;
    const guards = this.registry.all().filter(entity => entity.profession === 'GUARD' && entity.alive !== false).length;
    const effects = this.buildings?.effects() ?? {};
    const safety = Math.max(0, Math.min(100, 100 - monsters * 12 + guards * 5 + (effects.safety ?? 0)));
    for (const resident of this.registry.all().filter(entity => entity.type === 'NPC' && entity.alive !== false)) {
      resident.needs ??= {}; const previous = resident.needs.safety ?? 100; resident.needs.safety = safety;
      if (Math.abs(previous - safety) >= 10) this.emit?.({ type: 'SAFETY_CHANGED', entityId: resident.id, from: previous, to: safety, worldTime });
    }
    this.emit?.({ type: 'VILLAGE_STATE', safety, food: this.settlement?.food ?? this.economy.stock.food ?? 0, morale: this.settlement?.morale ?? 50, livingMonsters: monsters });
  }
}
