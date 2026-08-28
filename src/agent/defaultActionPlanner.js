import { Action } from './action.js';
import { TargetSelector } from '../combat/targetSelector.js';

export class DefaultActionPlanner {
  constructor({ entityProvider, nearbyProvider, targetSelector = new TargetSelector() } = {}) { this.entityProvider = entityProvider; this.nearbyProvider = nearbyProvider; this.targetSelector = targetSelector; }
  plan(actorId) {
    const actor = this.entityProvider(actorId);
    const goal = actor.currentGoal ?? 'IDLE';
    if (goal === 'RECOVER') return new Action({ type: 'REST', actorId, payload: { goal } });
    if (goal === 'RETURN') return new Action({ type: 'MOVE', actorId, destination: actor.homeLocation ?? actor.location, payload: { goal } });
    if (goal === 'SUPPLY') return new Action({ type: 'BUY', actorId, payload: { goal, itemId: 'potion', quantity: 1 } });
    if (goal === 'WORK') return new Action({ type: 'MOVE', actorId, destination: actor.workLocation ?? actor.location, payload: { goal } });
    if (goal === 'HUNT') {
      const target = this.targetSelector.nearest(actor, this.nearbyProvider(actor), { maxDistance: 1.5 });
      if (target) return new Action({ type: 'ATTACK', actorId, targetId: target.id, payload: { goal } });
      return new Action({ type: 'MOVE', actorId, destination: actor.huntLocation ?? actor.location, payload: { goal } });
    }
    return new Action({ type: 'WAIT', actorId });
  }
}
