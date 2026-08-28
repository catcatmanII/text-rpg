export class SpawnRuntime {
  constructor({ registry, definitions = [], createEntity, emit } = {}) {
    this.registry = registry; this.definitions = definitions; this.createEntity = createEntity; this.emit = emit;
  }
  evaluate(worldTime) {
    for (const definition of this.definitions) {
      const alive = this.registry.all().filter(entity => entity.spawnId === definition.id && entity.alive !== false).length;
      if (alive >= definition.maxAlive) continue;
      const dead = this.registry.all().filter(entity => entity.spawnId === definition.id && entity.alive === false);
      const ready = dead.filter(entity => worldTime - (entity.deadAt ?? worldTime) >= definition.respawnMinutes);
      for (let index = alive; index < definition.maxAlive && ready.length; index += 1) {
        const corpse = ready.shift();
        const entity = this.createEntity({ ...corpse, id: `${definition.monsterType}-${worldTime}-${index}`, hp: corpse.maxHp, alive: true, deadAt: undefined });
        this.registry.upsert(entity);
        this.emit?.({ type: 'ENTITY_RESPAWNED', entityId: entity.id, spawnId: definition.id });
      }
    }
  }
  markDeaths(worldTime) { for (const entity of this.registry.all()) if (entity.alive === false && entity.deadAt == null) entity.deadAt = worldTime; }
}
