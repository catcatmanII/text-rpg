export class SpawnRuntime {
  constructor({ registry, definitions = [], createEntity, emit } = {}) {
    this.registry = registry; this.definitions = definitions; this.createEntity = createEntity; this.emit = emit; this.pending = [];
  }
  evaluate(worldTime) {
    for (const definition of this.definitions) {
      const alive = this.registry.all().filter(entity => entity.spawnId === definition.id && entity.alive !== false).length;
      if (alive >= definition.maxAlive) continue;
      const ready = this.pending.filter(item => item.spawnId === definition.id && worldTime - item.deadAt >= definition.respawnMinutes);
      for (let index = alive; index < definition.maxAlive && ready.length; index += 1) {
        const corpse = ready.shift();
        this.pending.splice(this.pending.indexOf(corpse), 1);
        const entity = this.createEntity({ ...corpse.template, id: `${definition.monsterType}-${worldTime}-${index}`, hp: corpse.template.maxHp, alive: true });
        this.registry.upsert(entity);
        this.emit?.({ type: 'ENTITY_RESPAWNED', entityId: entity.id, spawnId: definition.id });
      }
    }
  }
  markDeaths(worldTime) {
    for (const entity of this.registry.all()) if (entity.alive === false && !this.pending.some(item => item.entityId === entity.id)) {
      this.pending.push({ entityId: entity.id, spawnId: entity.spawnId, deadAt: worldTime, template: structuredClone(entity) });
      this.registry.remove(entity.id);
      this.emit?.({ type: 'ENTITY_REMOVED', entityId: entity.id, reason: 'DEAD' });
    }
  }
}
