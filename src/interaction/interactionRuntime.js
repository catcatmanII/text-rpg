export class InteractionRuntime {
  constructor({ registry, emit } = {}) { this.registry = registry; this.emit = emit; }
  talk(actorId, targetId) {
    const actor = this.registry.get(actorId); const target = this.registry.get(targetId);
    if (!actor || !target || target.type !== 'NPC') return { ok: false, reason: 'INVALID_RESIDENT' };
    actor.relationships ??= {}; actor.relationships[targetId] = (actor.relationships[targetId] ?? 0) + 1;
    target.relationships ??= {}; target.relationships[actorId] = (target.relationships[actorId] ?? 0) + 1;
    const level = actor.relationships[targetId];
    const replies = target.dialogues ?? [target.dialogue ?? `${target.name ?? target.id} 向你點了點頭。`];
    const reply = replies[Math.min(level - 1, replies.length - 1)];
    this.emit?.({ type: 'TALKED', actorId, targetId, reply });
    return { ok: true, reply, relationship: actor.relationships[targetId] };
  }

  inspect(targetId) {
    const target = this.registry.get(targetId);
    if (!target || target.type !== 'NPC') return { ok: false, reason: 'INVALID_RESIDENT' };
    return { ok: true, resident: { id: target.id, name: target.name, profession: target.profession, personality: target.personality, background: target.background, familyId: target.familyId, request: target.request ?? null } };
  }

  acceptRequest(actorId, targetId) {
    const actor = this.registry.get(actorId); const target = this.registry.get(targetId);
    if (!actor || !target?.request) return { ok: false, reason: 'NO_REQUEST' };
    actor.requests ??= {};
    if (actor.requests[targetId]) return { ok: false, reason: 'REQUEST_ACCEPTED' };
    actor.requests[targetId] = { ...target.request, completed: false };
    this.emit?.({ type: 'REQUEST_ACCEPTED', actorId, targetId, requestId: target.request.id });
    return { ok: true, requestId: target.request.id, text: target.request.text };
  }
}
