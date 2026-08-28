import { labelOf } from './labels.js';
export class TextObserver {
  describe(world) {
    const entities = world.entities.all().map(entity => ({ id: entity.id, name: entity.name ?? entity.id, type: entity.type, zoneId: entity.zoneId, location: entity.location, hp: entity.hp, profession: entity.profession, goal: world.agents.goals.current(entity.id).type }));
    return { worldId: world.worldId, mode: world.mode, worldMinutes: world.clock.minutes, version: world.state.version, entities, population: world.population?.stats(), statistics: world.stats?.snapshot(), economy: world.economy?.snapshot(), settlement: world.settlement?.snapshot(), threat: world.threat?.lastCycle, recentEvents: world.eventLog.events.slice(-10) };
  }
  render(world) {
    const view = this.describe(world);
    return [`World ${view.worldId} | ${view.mode} | ${view.worldMinutes}m | v${view.version}`,
      ...view.entities.map(entity => `${entity.id} [${labelOf(entity.type)}] 區域=${entity.zoneId ?? '-'} 生命=${entity.hp ?? '-'} 目標=${labelOf(entity.goal)}`),
      `人口：${view.population?.alive ?? 0}（幼年 ${view.population?.children ?? 0}）`,
      `世界統計：出生 ${view.statistics?.births ?? 0}／死亡 ${view.statistics?.deaths ?? 0}／重生 ${view.statistics?.respawns ?? 0}／交談 ${view.statistics?.interactions ?? 0}`,
      `村落評估：繁榮度 ${view.settlement?.prosperity ?? 0}／安全 ${view.settlement?.safety ?? 0}／食物 ${view.settlement?.food ?? 0}`,
      ...view.recentEvents.map(event => `@${event.worldTime} ${labelOf(event.type)}`)].join('\n');
  }
}
