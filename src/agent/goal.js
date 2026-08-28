export const GOALS = Object.freeze(['IDLE', 'HUNT', 'SUPPLY', 'RETURN', 'RECOVER', 'WORK']);

export class Goal {
  constructor({ type = 'IDLE', priority = 0, reason = 'default', startedAt = 0 } = {}) {
    if (!GOALS.includes(type)) throw new Error(`Invalid goal: ${type}`);
    this.type = type; this.priority = priority; this.reason = reason; this.startedAt = startedAt;
  }
  toJSON() { return { type: this.type, priority: this.priority, reason: this.reason, startedAt: this.startedAt }; }
}
