export class SettlementRuntime {
  // 一份食物代表一名居民一小時的配給；連續三次配給不足才影響繁榮度。
  constructor({ emit, levels = [], rationInterval = 60, capacities = {} } = {}) { this.emit = emit; this.prosperity = 0; this.safety = 50; this.food = 0; this.level = 1; this.levels = levels; this.levels = levels; this.shortageMinutes = 0; this.rationInterval = rationInterval; this.minutesSinceRation = 0; this.housing = 4; this.marketTier = 1; this.morale = 50; this.resources = { food: 0, wood: 0, stone: 0, gold: 0, medicine: 0 }; this.capacities = { food: 100, wood: 100, stone: 100, gold: 999, medicine: 50, ...capacities }; }
  addResource(resource, amount) { if (!(resource in this.resources)) return false; this.resources[resource] = Math.max(0, Math.min(this.capacities[resource] ?? Infinity, this.resources[resource] + amount)); this.#syncLegacyFood(); return true; }
  spendResource(resource, amount) { if (!(resource in this.resources) || this.resources[resource] < amount) return false; this.resources[resource] -= amount; this.#syncLegacyFood(); return true; }
  applyActivityReward(rewards, activityId) {
    for (const [resource, amount] of Object.entries(rewards)) if (resource in this.resources) this.addResource(resource, amount);
    this.safety = Math.min(100, this.safety + (rewards.safety ?? 0)); this.morale = Math.max(0, Math.min(100, this.morale + (rewards.morale ?? 0))); this.prosperity += rewards.prosperity ?? 0;
    this.emit?.({ type: 'SETTLEMENT_REWARD', activityId, rewards, prosperity: this.prosperity });
  }
  tick({ population = 0, minutes = 1 } = {}) {
    this.minutesSinceRation += minutes;
    if (this.minutesSinceRation >= this.rationInterval) {
      const rations = Math.floor(this.minutesSinceRation / this.rationInterval);
      this.minutesSinceRation %= this.rationInterval;
      if (this.food >= population * rations && population > 0) { this.spendResource('food', population * rations); this.shortageMinutes = 0; this.morale = Math.min(100, this.morale + 1); }
      else if (population > 0) { this.shortageMinutes += this.rationInterval * rations; this.morale = Math.max(0, this.morale - 2); this.emit?.({ type: 'SETTLEMENT_SHORTAGE', population, food: this.food, shortageMinutes: this.shortageMinutes }); if (this.shortageMinutes >= 3 * this.rationInterval) { this.safety = Math.max(0, this.safety - 1); this.prosperity = Math.max(0, this.prosperity - 1); this.shortageMinutes = 0; this.emit?.({ type: 'PROSPERITY_DECAY', reason: 'SUSTAINED_FOOD_SHORTAGE', prosperity: this.prosperity }); } }
    }
    const next = this.levels.find(entry => entry.level === this.level + 1);
    if (next && this.prosperity >= next.prosperity && population >= next.population && this.food >= next.food) { this.level = next.level; this.housing = next.housing ?? this.housing + 4; this.marketTier = next.marketTier ?? this.level; this.emit?.({ type: 'SETTLEMENT_LEVEL_UP', level: this.level, housing: this.housing, marketTier: this.marketTier }); }
  }
  snapshot() { return { prosperity: this.prosperity, safety: this.safety, food: this.food, level: this.level, shortageMinutes: this.shortageMinutes, minutesSinceRation: this.minutesSinceRation, housing: this.housing, marketTier: this.marketTier, morale: this.morale, resources: { ...this.resources }, capacities: { ...this.capacities } }; }
  restore(snapshot = {}) { Object.assign(this, { prosperity: snapshot.prosperity ?? this.prosperity, safety: snapshot.safety ?? this.safety, food: snapshot.food ?? this.food, level: snapshot.level ?? this.level, shortageMinutes: snapshot.shortageMinutes ?? 0, minutesSinceRation: snapshot.minutesSinceRation ?? 0, housing: snapshot.housing ?? this.housing, marketTier: snapshot.marketTier ?? this.marketTier, morale: snapshot.morale ?? this.morale, resources: { ...this.resources, ...(snapshot.resources ?? {}) }, capacities: { ...this.capacities, ...(snapshot.capacities ?? {}) } }); this.#syncLegacyFood(); }
  #syncLegacyFood() { this.food = this.resources.food; }
}
