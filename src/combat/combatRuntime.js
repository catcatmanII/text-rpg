import { DamageResolver } from './damageResolver.js';

export class CombatRuntime {
  constructor({ damageResolver = new DamageResolver(), onEvent } = {}) { this.damageResolver = damageResolver; this.onEvent = onEvent; }
  attack(attacker, defender) {
    if (!attacker || !defender || defender.hp <= 0) return { ok: false, reason: 'INVALID_TARGET' };
    const damage = this.damageResolver.calculate(attacker, defender);
    defender.hp = Math.max(0, defender.hp - damage);
    this.onEvent?.({ type: 'DAMAGE_APPLIED', attackerId: attacker.id, defenderId: defender.id, damage });
    if (defender.hp === 0) this.#die(attacker, defender);
    return { ok: true, damage, defeated: defender.hp === 0 };
  }
  #die(attacker, defender) {
    defender.alive = false;
    const exp = defender.rewards?.exp ?? 0;
    const gold = defender.rewards?.gold ?? 0;
    attacker.exp = (attacker.exp ?? 0) + exp;
    attacker.gold = (attacker.gold ?? 0) + gold;
    this.onEvent?.({ type: 'ENTITY_DIED', entityId: defender.id, killerId: attacker.id, exp, gold });
  }
}
