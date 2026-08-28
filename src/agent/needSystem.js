export class NeedSystem {
  update(entity, minutes = 1) {
    const needs = entity.needs ??= { fatigue: 0, hunger: 0, safety: 100 };
    if (entity.activity === 'SLEEP') needs.fatigue = Math.max(0, needs.fatigue - minutes * 2);
    else needs.fatigue = Math.min(100, needs.fatigue + minutes * 0.2);
    needs.hunger = Math.min(100, needs.hunger + minutes * 0.1);
    return needs;
  }
}
