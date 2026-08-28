export class RequestRuntime {
  constructor({ registry, economy, emit } = {}) { this.registry = registry; this.economy = economy; this.emit = emit; }
  evaluate(worldTime) {
    for (const actor of this.registry.all()) {
      for (const [targetId, request] of Object.entries(actor.requests ?? {})) {
        if (request.completed || !this.#isComplete(actor, request, targetId)) continue;
        request.completed = true; request.completedAt = worldTime;
        actor.gold = (actor.gold ?? 0) + (request.reward?.gold ?? 0); actor.exp = (actor.exp ?? 0) + (request.reward?.exp ?? 0);
        const resident = this.registry.get(targetId); resident.relationships ??= {}; resident.relationships[actor.id] = (resident.relationships[actor.id] ?? 0) + 2;
        this.emit?.({ type: 'REQUEST_COMPLETED', actorId: actor.id, targetId, requestId: request.id, reward: request.reward ?? {} });
      }
    }
  }
  #isComplete(actor, request, targetId) {
    if (request.type === 'TALK_COUNT') return (actor.relationships?.[targetId] ?? 0) >= request.required;
    if (request.type === 'FOOD_STOCK') return (this.economy.stock.food ?? 0) >= request.required;
    if (request.type === 'ITEM_COUNT') return (actor.inventory?.[request.itemId] ?? 0) >= request.required;
    if (request.type === 'MONSTER_LIMIT') return this.registry.all().filter(entity => entity.type === 'MONSTER' && entity.alive !== false).length <= request.required;
    return false;
  }
}
