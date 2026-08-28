export const ACTIONS = Object.freeze(['WAIT', 'MOVE', 'ATTACK', 'PICKUP', 'BUY', 'SELL', 'REST', 'RETURN_HOME']);

export class Action {
  constructor({ type = 'WAIT', actorId, targetId = null, destination = null, duration = 1, payload = {} } = {}) {
    if (!ACTIONS.includes(type)) throw new Error(`Invalid action: ${type}`);
    if (!actorId) throw new Error('Action actorId is required');
    this.type = type; this.actorId = actorId; this.targetId = targetId;
    this.destination = destination; this.duration = duration; this.payload = payload;
  }
  toJSON() { return { type: this.type, actorId: this.actorId, targetId: this.targetId, destination: this.destination, duration: this.duration, payload: this.payload }; }
}
