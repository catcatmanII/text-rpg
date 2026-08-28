export class QuestRuntime {
  constructor(definitions = []) { this.definitions = Object.fromEntries(definitions.map(definition => [definition.id, definition])); }
  accept(entity, questId) {
    const definition = this.definitions[questId];
    if (!definition) return { ok: false, reason: 'UNKNOWN_QUEST' };
    entity.quests ??= {};
    if (entity.quests[questId]) return { ok: false, reason: 'ALREADY_ACCEPTED' };
    entity.quests[questId] = { progress: 0, completed: false };
    return { ok: true, questId };
  }
  progress(entity, event) {
    for (const [questId, state] of Object.entries(entity.quests ?? {})) {
      const definition = this.definitions[questId];
      if (state.completed || event.type !== definition.goalEvent || event.targetType !== definition.targetType) continue;
      state.progress += event.amount ?? 1;
      if (state.progress >= definition.required) { state.progress = definition.required; state.completed = true; }
    }
  }
}
