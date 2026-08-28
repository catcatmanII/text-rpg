export class PopulationRuntime {
  constructor({ registry, settlement, emit } = {}) { this.registry = registry; this.settlement = settlement; this.emit = emit; this.nextBirthAt = 1440; this.nextId = 1; }
  setSettlement(settlement) { this.settlement = settlement; }
  addNewcomers(count, worldTime) { for (let index = 0; index < count; index += 1) { const newcomer = { id: `npc-newcomer-${this.nextId++}`, name: '新居民', type: 'NPC', profession: 'LABORER', autonomous: true, alive: true, zoneId: 'village', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, ageDays: 20, maxAgeDays: 80, hp: 10, maxHp: 10, attack: 1, gold: 0, inventory: {}, needs: { fatigue: 0, hunger: 0, safety: 100 } }; this.registry.add(newcomer); this.emit?.({ type: 'NPC_JOINED', entityId: newcomer.id, source: 'DECISION_EVENT', worldTime }); } }
  tick(worldTime, minutes = 1) {
    for (const entity of this.registry.all()) if (entity.type === 'NPC' && entity.alive !== false) {
      entity.ageDays = (entity.ageDays ?? 20) + minutes / 1440;
      if (entity.ageDays >= (entity.maxAgeDays ?? 80)) { entity.alive = false; entity.deadAt = worldTime; this.emit?.({ type: 'NPC_DIED_OF_AGE', entityId: entity.id }); }
    }
    if (worldTime >= this.nextBirthAt) { this.#tryBirth(worldTime); this.nextBirthAt += 1440; }
  }
  #tryBirth(worldTime) {
    if (this.registry.byType('NPC').filter(entity => entity.alive !== false).length >= (this.settlement?.housing ?? Infinity)) { this.emit?.({ type: 'BIRTH_DEFERRED', reason: 'HOUSING_FULL' }); return; }
    const adults = this.registry.all().filter(entity => entity.type === 'NPC' && entity.alive !== false && (entity.ageDays ?? 20) >= 18 && entity.familyId);
    const family = adults.find(entity => adults.some(other => other.id !== entity.id && other.familyId === entity.familyId));
    if (!family) return;
    const child = { id: `npc-child-${this.nextId++}`, type: 'NPC', autonomous: true, alive: true, zoneId: family.zoneId, location: { ...family.location }, familyId: family.familyId, parentIds: adults.filter(other => other.familyId === family.familyId).slice(0, 2).map(other => other.id), ageDays: 0, maxAgeDays: 80, hp: 10, maxHp: 10, attack: 1, gold: 0, inventory: {}, needs: { fatigue: 0, hunger: 0, safety: 100 } };
    this.registry.add(child); this.emit?.({ type: 'NPC_BORN', entityId: child.id, parentIds: child.parentIds });
  }
  stats() {
    const npcs = this.registry.byType('NPC');
    return { alive: npcs.filter(entity => entity.alive !== false).length, dead: npcs.filter(entity => entity.alive === false).length, children: npcs.filter(entity => (entity.ageDays ?? 20) < 18).length };
  }
}
