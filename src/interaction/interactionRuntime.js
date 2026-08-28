export class InteractionRuntime {
  constructor({ registry, emit } = {}) { this.registry = registry; this.emit = emit; }
  talk(actorId, targetId) {
    const actor = this.registry.get(actorId); const target = this.registry.get(targetId);
    if (!actor || !target || target.type !== 'NPC') return { ok: false, reason: 'INVALID_RESIDENT' };
    actor.relationships ??= {}; actor.relationships[targetId] = (actor.relationships[targetId] ?? 0) + 1;
    target.relationships ??= {}; target.relationships[actorId] = (target.relationships[actorId] ?? 0) + 1;
    const reply = target.dialogue ?? `${target.name ?? target.id} 向你點了點頭。`;
    this.emit?.({ type: 'TALKED', actorId, targetId, reply });
    return { ok: true, reply, relationship: actor.relationships[targetId] };
  }
}
