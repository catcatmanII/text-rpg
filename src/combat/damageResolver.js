export class DamageResolver {
  calculate(attacker, defender) {
    const attack = Math.max(0, attacker.stats?.attack ?? attacker.attack ?? 1);
    const defense = Math.max(0, defender.stats?.defense ?? defender.defense ?? 0);
    return Math.max(1, attack - defense);
  }
}
