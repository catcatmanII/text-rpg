export class TextObserver {
  describe(world) {
    const entities = world.entities.all().map(entity => ({ id: entity.id, type: entity.type, zoneId: entity.zoneId, location: entity.location, hp: entity.hp, goal: world.agents.goals.current(entity.id).type }));
    return { worldId: world.worldId, mode: world.mode, worldMinutes: world.clock.minutes, version: world.state.version, entities, recentEvents: world.eventLog.events.slice(-10) };
  }
  render(world) {
    const view = this.describe(world);
    return [`World ${view.worldId} | ${view.mode} | ${view.worldMinutes}m | v${view.version}`,
      ...view.entities.map(entity => `${entity.id} [${entity.type}] zone=${entity.zoneId ?? '-'} hp=${entity.hp ?? '-'} goal=${entity.goal}`),
      ...view.recentEvents.map(event => `@${event.worldTime} ${event.type}`)].join('\n');
  }
}
