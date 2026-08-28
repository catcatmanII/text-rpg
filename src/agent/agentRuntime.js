import { Action } from './action.js';
import { GoalCoordinator } from './goalCoordinator.js';
import { ActionQueue } from './actionQueue.js';
import { TickScheduler } from './tickScheduler.js';
import { NeedSystem } from './needSystem.js';
import { AutonomousDecision } from './autonomousDecision.js';

export class AgentRuntime {
  constructor({ onGoalChanged, onActionCreated, entityProvider, actionPlanner } = {}) {
    this.goals = new GoalCoordinator();
    this.actions = new ActionQueue();
    this.scheduler = new TickScheduler({ onAgentTick: actorId => this.#createDefaultAction(actorId) });
    this.onGoalChanged = onGoalChanged;
    this.onActionCreated = onActionCreated;
    this.entityProvider = entityProvider;
    this.actionPlanner = actionPlanner;
    this.needs = new NeedSystem();
    this.decision = new AutonomousDecision();
  }
  register(actorId) { this.scheduler.register(actorId); }
  unregister(actorId) { this.scheduler.unregister(actorId); }
  setGoal(actorId, goal, worldTime) {
    const next = this.goals.set(actorId, goal, worldTime);
    const entity = this.entityProvider?.(actorId);
    if (entity) entity.currentGoal = next.type;
    this.onGoalChanged?.(actorId, next);
    return next;
  }
  tick(context) {
    for (const actorId of this.scheduler.agents) {
      const entity = this.entityProvider?.(actorId);
      if (!entity) continue;
      this.needs.update(entity, context.minutes ?? 1);
      if (entity.autonomous) {
        const next = this.decision.decide(entity, context);
        const current = this.goals.current(actorId);
        if (next.type !== 'IDLE' && next.type !== current.type) this.setGoal(actorId, next, context.worldTime);
      }
    }
    return this.scheduler.tick(context);
  }
  snapshot() { return { goals: this.goals.toJSON(), queuedActions: this.actions.items.map(action => action.toJSON()) }; }
  restore(snapshot = {}) {
    this.goals = GoalCoordinator.fromJSON(snapshot.goals);
    for (const [actorId, goal] of this.goals.goals) this.entityProvider?.(actorId) && (this.entityProvider(actorId).currentGoal = goal.type);
    this.actions.clear();
    for (const action of snapshot.queuedActions ?? []) this.actions.enqueue(new Action(action));
  }
  #createDefaultAction(actorId) {
    const goal = this.goals.current(actorId);
    if (goal.type === 'IDLE') return null;
    const action = this.actionPlanner?.(actorId, goal) ?? new Action({ actorId, type: 'WAIT', payload: { goal: goal.type } });
    this.actions.enqueue(action);
    this.onActionCreated?.(action, goal);
    return action;
  }
}
