export class WorldStatsRuntime {
  constructor({ eventLog, registry } = {}) { this.eventLog = eventLog; this.registry = registry; }
  snapshot() {
    const events = this.eventLog.events;
    return {
      population: this.registry.byType('NPC').filter(entity => entity.alive !== false).length,
      livingMonsters: this.registry.byType('MONSTER').filter(entity => entity.alive !== false).length,
      births: events.filter(event => event.type === 'NPC_BORN').length,
      deaths: events.filter(event => ['ENTITY_DIED', 'NPC_DIED_OF_AGE'].includes(event.type)).length,
      respawns: events.filter(event => event.type === 'ENTITY_RESPAWNED').length,
      interactions: events.filter(event => event.type === 'TALKED').length,
      producedTicks: events.filter(event => event.type === 'RESOURCE_PRODUCED').length
    };
  }
}
