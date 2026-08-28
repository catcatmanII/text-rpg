import { labelOf } from './labels.js';
export class TextObserver {
  describe(world) {
    const entities = world.entities.all().map(entity => ({ id: entity.id, type: entity.type, zoneId: entity.zoneId, location: entity.location, hp: entity.hp, goal: world.agents.goals.current(entity.id).type }));
    return { worldId: world.worldId, mode: world.mode, worldMinutes: world.clock.minutes, version: world.state.version, entities, population: world.population?.stats(), recentEvents: world.eventLog.events.slice(-10) };
  }
  render(world) {
    const view = this.describe(world);
    return [`World ${view.worldId} | ${view.mode} | ${view.worldMinutes}m | v${view.version}`,
      ...view.entities.map(entity => `${entity.id} [${labelOf(entity.type)}] 區域=${entity.zoneId ?? '-'} 生命=${entity.hp ?? '-'} 目標=${labelOf(entity.goal)}`),
      `人口：${view.population?.alive ?? 0}（幼年 ${view.population?.children ?? 0}）`,
      ...view.recentEvents.map(event => `@${event.worldTime} ${labelOf(event.type)}`)].join('\n');
  }
}
