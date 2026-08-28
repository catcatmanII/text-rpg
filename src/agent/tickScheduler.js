export class TickScheduler {
  constructor({ onAgentTick } = {}) { this.onAgentTick = onAgentTick; this.agents = new Set(); }
  register(actorId) { this.agents.add(actorId); }
  unregister(actorId) { this.agents.delete(actorId); }
  tick(context) {
    if (!this.onAgentTick) return [];
    return [...this.agents].sort().map(actorId => this.onAgentTick(actorId, context)).filter(Boolean);
  }
}
