export class ThreatRuntime {
  constructor({ registry, settlement, emit, interval = 1440 } = {}) { this.registry = registry; this.settlement = settlement; this.emit = emit; this.interval = interval; this.lastCycle = -1; }
  tick(worldTime) {
    const cycle = Math.floor(worldTime / this.interval);
    if (cycle <= this.lastCycle) return;
    this.lastCycle = cycle;
    const level = this.settlement?.level ?? 1;
    const intensity = Math.max(0, cycle) + Math.max(0, level - 1);
    for (const monster of this.registry.all().filter(entity => entity.type === 'MONSTER' && entity.alive !== false)) {
      monster.threatLevel = intensity + 1;
      monster.baseMaxHp ??= monster.maxHp ?? monster.hp ?? 1;
      monster.baseAttack ??= monster.attack ?? 1;
      monster.maxHp = monster.baseMaxHp + intensity * 2;
      monster.hp = Math.min(monster.maxHp, monster.hp ?? monster.maxHp);
      monster.attack = monster.baseAttack + Math.floor(intensity / 2);
    }
    this.emit?.({ type: 'THREAT_ESCALATED', cycle, intensity, settlementLevel: level });
  }
  snapshot() { return { lastCycle: this.lastCycle }; }
  restore(snapshot = {}) { this.lastCycle = snapshot.lastCycle ?? -1; }
}
