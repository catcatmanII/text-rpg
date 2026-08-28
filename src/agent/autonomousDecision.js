import { Goal } from './goal.js';

export class AutonomousDecision {
  decide(entity, { worldTime = 0 } = {}) {
    const needs = entity.needs ?? {};
    if ((needs.safety ?? 100) < 30 || (entity.hp != null && entity.maxHp != null && entity.hp < entity.maxHp * 0.3)) return new Goal({ type: 'RECOVER', priority: 100, reason: 'safety' });
    if ((needs.hunger ?? 0) >= 80 || (entity.supplies != null && entity.supplies <= 0)) return new Goal({ type: 'SUPPLY', priority: 80, reason: 'needs' });
    const scheduleGoal = entity.scheduleGoal;
    if (scheduleGoal) return new Goal({ type: scheduleGoal, priority: 50, reason: 'schedule' });
    return new Goal({ type: 'IDLE', priority: 0, reason: 'no active need' });
  }
}
