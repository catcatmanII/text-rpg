export class SettlementRuntime {
  constructor({ emit, levels = [] } = {}) { this.emit = emit; this.prosperity = 0; this.safety = 50; this.food = 0; this.level = 1; this.levels = levels; }
  applyActivityReward(rewards, activityId) {
    this.food += rewards.food ?? 0; this.safety = Math.min(100, this.safety + (rewards.safety ?? 0)); this.prosperity += rewards.prosperity ?? 0;
    this.emit?.({ type: 'SETTLEMENT_REWARD', activityId, rewards, prosperity: this.prosperity });
  }
  tick({ population = 0 } = {}) {
    if (this.food >= population && population > 0) this.food -= population;
    else if (population > 0) { this.safety = Math.max(0, this.safety - 1); this.prosperity = Math.max(0, this.prosperity - 1); this.emit?.({ type: 'SETTLEMENT_SHORTAGE', population, food: this.food }); }
    const next = this.levels.find(entry => entry.level === this.level + 1);
    if (next && this.prosperity >= next.prosperity && population >= next.population && this.food >= next.food) { this.level = next.level; this.emit?.({ type: 'SETTLEMENT_LEVEL_UP', level: this.level }); }
  }
  snapshot() { return { prosperity: this.prosperity, safety: this.safety, food: this.food, level: this.level }; }
}
