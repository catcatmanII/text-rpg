import { Action } from '../agent/action.js';

export class PlayerCommandRouter {
  constructor({ world, playerId }) { this.world = world; this.playerId = playerId; }
  dispatch(command) {
    const action = this.#parse(command);
    this.world.agents.actions.enqueue(action);
    this.world.eventLog.append({ worldTime: this.world.clock.minutes, type: 'PLAYER_COMMAND', payload: action.toJSON() });
    return action;
  }
  #parse(command) {
    const [verb, ...args] = String(command).trim().toLowerCase().split(/\s+/);
    if (verb === 'wait') return new Action({ type: 'WAIT', actorId: this.playerId });
    if (verb === 'move' && args.length === 2) return new Action({ type: 'MOVE', actorId: this.playerId, destination: { x: Number(args[0]), y: Number(args[1]) } });
    if (verb === 'attack' && args.length === 1) return new Action({ type: 'ATTACK', actorId: this.playerId, targetId: args[0] });
    throw new Error(`Unknown player command: ${command}`);
  }
}
