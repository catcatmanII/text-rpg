export class ActionResolver {
  constructor({ movement, combat, inventory, supply, onEvent } = {}) { this.movement = movement; this.combat = combat; this.inventory = inventory; this.supply = supply; this.onEvent = onEvent; }
  resolve(action, world) {
    const actor = world.entities.get(action.actorId);
    if (!actor || actor.alive === false) return { ok: false, reason: 'INVALID_ACTOR' };
    let result;
    if (action.type === 'MOVE') result = { ok: this.movement.moveToward(actor, action.destination) };
    else if (action.type === 'ATTACK') result = this.combat.attack(actor, world.entities.get(action.targetId));
    else if (action.type === 'REST') { actor.activity = 'SLEEP'; result = { ok: true }; }
    else if (action.type === 'BUY') result = this.supply?.execute(actor) ?? { ok: false, reason: 'SUPPLY_UNAVAILABLE' };
    else result = { ok: true };
    this.onEvent?.({ type: 'ACTION_RESOLVED', action: action.toJSON ? action.toJSON() : action, result });
    return result;
  }
}
