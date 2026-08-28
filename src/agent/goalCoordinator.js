import { Goal } from './goal.js';

export class GoalCoordinator {
  constructor() { this.goals = new Map(); }
  current(actorId) { return this.goals.get(actorId) ?? new Goal(); }
  set(actorId, goal, worldTime = 0) {
    const next = goal instanceof Goal ? goal : new Goal(goal);
    next.startedAt = worldTime;
    this.goals.set(actorId, next);
    return next;
  }
  clear(actorId) { this.goals.delete(actorId); }
  toJSON() { return Object.fromEntries([...this.goals].map(([id, goal]) => [id, goal.toJSON()])); }
  static fromJSON(data = {}) { const result = new GoalCoordinator(); for (const [id, goal] of Object.entries(data)) result.goals.set(id, new Goal(goal)); return result; }
}
