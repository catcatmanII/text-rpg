export class ThreatRuntime {
  constructor({ registry, settlement, buildings, emit, interval = 1440 } = {}) { this.registry = registry; this.settlement = settlement; this.buildings = buildings; this.emit = emit; this.interval = interval; this.lastCycle = -1; this.pressure = 0; this.zoneThreat = { hunt: 0 }; }
  tick(worldTime) {
    const cycle = Math.floor(worldTime / this.interval);
    if (cycle <= this.lastCycle) return;
    this.lastCycle = cycle;
    const level = this.settlement?.level ?? 1;
    const intensity = Math.max(0, cycle) + Math.max(0, level - 1);
    const reduction = this.buildings?.effects().threatReduction ?? 0;
    this.pressure = Math.max(0, Math.min(100, this.pressure + 8 + level * 2 - reduction * 4));
    this.zoneThreat.hunt = this.pressure;
    for (const monster of this.registry.all().filter(entity => entity.type === 'MONSTER' && entity.alive !== false)) {
      monster.threatLevel = intensity + 1;
      monster.baseMaxHp ??= monster.maxHp ?? monster.hp ?? 1;
      monster.baseAttack ??= monster.attack ?? 1;
      monster.maxHp = monster.baseMaxHp + intensity * 2;
      monster.hp = Math.min(monster.maxHp, monster.hp ?? monster.maxHp);
      monster.attack = monster.baseAttack + Math.floor(intensity / 2);
    }
    if (this.pressure >= 25) { this.settlement.spendResource('food', Math.max(1, Math.floor((this.settlement.food ?? 0) * 0.15))); this.settlement.safety = Math.max(0, this.settlement.safety - 5); this.settlement.morale = Math.max(0, this.settlement.morale - 5); this.settlement.prosperity = Math.max(0, this.settlement.prosperity - 2); this.pressure = Math.max(0, this.pressure - 20); this.zoneThreat.hunt = this.pressure; this.emit?.({ type: 'MONSTER_INCIDENT', zoneId: 'hunt', damage: { safety: 5, morale: 5, prosperity: 2 } }); }
    this.emit?.({ type: 'THREAT_ESCALATED', cycle, intensity, settlementLevel: level });
  }
  reduce(amount = 10, zoneId = 'hunt') { this.pressure = Math.max(0, this.pressure - amount); this.zoneThreat[zoneId] = this.pressure; this.emit?.({ type: 'THREAT_REDUCED', zoneId, amount, pressure: this.pressure }); return this.pressure; }
  snapshot() { return { lastCycle: this.lastCycle, pressure: this.pressure, zoneThreat: { ...this.zoneThreat } }; }
  restore(snapshot = {}) { this.lastCycle = snapshot.lastCycle ?? -1; this.pressure = snapshot.pressure ?? 0; this.zoneThreat = { ...this.zoneThreat, ...(snapshot.zoneThreat ?? {}) }; }
}
