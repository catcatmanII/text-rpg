export class PlayerEnergyRuntime {
  constructor({ registry, maxEnergy = 100, recoveryPerTick = 1, emit } = {}) { this.registry = registry; this.maxEnergy = maxEnergy; this.recoveryPerTick = recoveryPerTick; this.emit = emit; }
  tick(minutes = 1) {
    const player = this.registry.byType('PLAYER')[0];
    if (!player) return;
    player.energy = Math.min(player.maxEnergy ?? this.maxEnergy, (player.energy ?? this.maxEnergy) + this.recoveryPerTick * minutes);
  }
  consume(player, amount) {
    player.energy ??= player.maxEnergy ?? this.maxEnergy;
    if (player.energy < amount) return false;
    player.energy -= amount; this.emit?.({ type: 'PLAYER_ENERGY_SPENT', playerId: player.id, amount, remaining: player.energy }); return true;
  }
}
