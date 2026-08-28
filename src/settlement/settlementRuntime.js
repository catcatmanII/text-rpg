export class SettlementRuntime {
  // 一份食物代表一名居民一小時的配給；連續三次配給不足才影響繁榮度。
  constructor({ emit, levels = [], rationInterval = 60 } = {}) { this.emit = emit; this.prosperity = 0; this.safety = 50; this.food = 0; this.level = 1; this.levels = levels; this.shortageMinutes = 0; this.rationInterval = rationInterval; this.minutesSinceRation = 0; this.housing = 4; this.marketTier = 1; }
  applyActivityReward(rewards, activityId) {
    this.food += rewards.food ?? 0; this.safety = Math.min(100, this.safety + (rewards.safety ?? 0)); this.prosperity += rewards.prosperity ?? 0;
    this.emit?.({ type: 'SETTLEMENT_REWARD', activityId, rewards, prosperity: this.prosperity });
  }
  tick({ population = 0, minutes = 1 } = {}) {
    this.minutesSinceRation += minutes;
    if (this.minutesSinceRation >= this.rationInterval) {
      const rations = Math.floor(this.minutesSinceRation / this.rationInterval);
      this.minutesSinceRation %= this.rationInterval;
      if (this.food >= population * rations && population > 0) { this.food -= population * rations; this.shortageMinutes = 0; }
      else if (population > 0) { this.shortageMinutes += this.rationInterval * rations; this.emit?.({ type: 'SETTLEMENT_SHORTAGE', population, food: this.food, shortageMinutes: this.shortageMinutes }); if (this.shortageMinutes >= 3 * this.rationInterval) { this.safety = Math.max(0, this.safety - 1); this.prosperity = Math.max(0, this.prosperity - 1); this.shortageMinutes = 0; this.emit?.({ type: 'PROSPERITY_DECAY', reason: 'SUSTAINED_FOOD_SHORTAGE', prosperity: this.prosperity }); } }
    }
    const next = this.levels.find(entry => entry.level === this.level + 1);
    if (next && this.prosperity >= next.prosperity && population >= next.population && this.food >= next.food) { this.level = next.level; this.housing = next.housing ?? this.housing + 4; this.marketTier = next.marketTier ?? this.level; this.emit?.({ type: 'SETTLEMENT_LEVEL_UP', level: this.level, housing: this.housing, marketTier: this.marketTier }); }
  }
  snapshot() { return { prosperity: this.prosperity, safety: this.safety, food: this.food, level: this.level, shortageMinutes: this.shortageMinutes, minutesSinceRation: this.minutesSinceRation, housing: this.housing, marketTier: this.marketTier }; }
  restore(snapshot = {}) { Object.assign(this, { prosperity: snapshot.prosperity ?? this.prosperity, safety: snapshot.safety ?? this.safety, food: snapshot.food ?? this.food, level: snapshot.level ?? this.level, shortageMinutes: snapshot.shortageMinutes ?? 0, minutesSinceRation: snapshot.minutesSinceRation ?? 0, housing: snapshot.housing ?? this.housing, marketTier: snapshot.marketTier ?? this.marketTier }); }
}
