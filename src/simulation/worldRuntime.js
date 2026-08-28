import { WorldClock } from './worldClock.js';
import { WorldState } from './worldState.js';
import { EventLog } from '../events/eventLog.js';
import { EntityRegistry } from '../world/entityRegistry.js';
import { ZoneRuntime } from '../world/zoneRuntime.js';
import { SpatialQuery } from '../world/spatialQuery.js';
import { AgentRuntime } from '../agent/agentRuntime.js';
import { PathService } from '../movement/pathService.js';
import { MovementRuntime } from '../movement/movementRuntime.js';
import { CombatRuntime } from '../combat/combatRuntime.js';
import { DefaultActionPlanner } from '../agent/defaultActionPlanner.js';
import { ActionResolver } from '../action/actionResolver.js';
import { InventoryRuntime } from '../economy/inventoryRuntime.js';
import { SupplyService } from '../economy/supplyService.js';
import { WorldEventScheduler } from '../world/worldEventScheduler.js';
import { worldEventDefinitions } from '../content/eventDefinitions.js';
import { ResourceRuntime } from '../world/resourceRuntime.js';
import { resourceDefinitions } from '../content/resourceDefinitions.js';
import { QuestRuntime } from '../quest/questRuntime.js';
import { questDefinitions } from '../content/questDefinitions.js';
import { SpawnRuntime } from '../world/spawnRuntime.js';
import { spawnDefinitions } from '../content/spawnDefinitions.js';
import { PopulationRuntime } from '../population/populationRuntime.js';
import { InteractionRuntime } from '../interaction/interactionRuntime.js';
import { EconomyRuntime } from '../economy/economyRuntime.js';
import { economyDefinitions } from '../content/economyDefinitions.js';
import { WorldStatsRuntime } from '../world/worldStatsRuntime.js';
import { RequestRuntime } from '../interaction/requestRuntime.js';
import { CausalityRuntime } from '../world/causalityRuntime.js';
import { PlayerEnergyRuntime } from '../player/playerEnergyRuntime.js';
import { ActivityRuntime } from '../activity/activityRuntime.js';
import { activityDefinitions } from '../activity/activityDefinitions.js';
import { SettlementRuntime } from '../settlement/settlementRuntime.js';
import { settlementLevels } from '../content/settlementLevels.js';

export class WorldRuntime {
  constructor({ worldId = 'world_001', startMinutes = 0 } = {}) {
    this.worldId = worldId;
    this.mode = 'STOPPED';
    this.clock = new WorldClock(startMinutes);
    this.state = new WorldState({ clock: this.clock, metadata: { worldId } });
    this.eventLog = new EventLog();
    this.entities = new EntityRegistry(this.state.entities);
    this.zones = new ZoneRuntime(this.state.zones);
    this.spatial = new SpatialQuery(this.entities);
    this.movement = new MovementRuntime({
      pathService: new PathService(),
      onMoved: (entity, location) => this.#emit('ENTITY_MOVED', { entityId: entity.id, location })
    });
    this.combat = new CombatRuntime({ onEvent: event => this.#emit(event.type, event) });
    this.inventory = new InventoryRuntime();
    this.resources = new ResourceRuntime(resourceDefinitions);
    this.quests = new QuestRuntime(questDefinitions);
    this.worldEvents = new WorldEventScheduler(worldEventDefinitions);
    this.spawn = new SpawnRuntime({ registry: this.entities, definitions: spawnDefinitions, createEntity: entity => entity, emit: event => this.#emit(event.type, event) });
    this.population = new PopulationRuntime({ registry: this.entities, emit: event => this.#emit(event.type, event) });
    this.interactions = new InteractionRuntime({ registry: this.entities, emit: event => this.#emit(event.type, event) });
    this.economy = new EconomyRuntime({ registry: this.entities, inventory: this.inventory, emit: event => this.#emit(event.type, event), definitions: economyDefinitions });
    this.stats = new WorldStatsRuntime({ eventLog: this.eventLog, registry: this.entities });
    this.requests = new RequestRuntime({ registry: this.entities, economy: this.economy, emit: event => this.#emit(event.type, event) });
    this.causality = new CausalityRuntime({ registry: this.entities, economy: this.economy, emit: event => this.#emit(event.type, event) });
    this.settlement = new SettlementRuntime({ emit: event => this.#emit(event.type, event), levels: settlementLevels });
    this.energy = new PlayerEnergyRuntime({ registry: this.entities, emit: event => this.#emit(event.type, event) });
    this.activities = new ActivityRuntime({ registry: this.entities, energy: this.energy, definitions: activityDefinitions, settlement: this.settlement, emit: event => this.#emit(event.type, event) });
    this.actionResolver = new ActionResolver({ movement: this.movement, combat: this.combat, inventory: this.inventory, onEvent: event => this.#emit(event.type, event) });
    this.agents = new AgentRuntime({
      onGoalChanged: (actorId, goal) => this.#emit('GOAL_CHANGED', { actorId, goal: goal.toJSON() }),
      onActionCreated: action => this.#emit('ACTION_CREATED', action.toJSON()),
      entityProvider: actorId => this.entities.get(actorId),
      actionPlanner: actorId => new DefaultActionPlanner({ entityProvider: id => this.entities.get(id), nearbyProvider: entity => this.spatial.inZone(entity.zoneId, { type: 'MONSTER' }) }).plan(actorId)
    });
  }

  addEntity(entity) {
    const created = this.entities.add(entity);
    this.state.entities = this.entities.entities;
    return created;
  }

  addZone(zone) {
    const created = this.zones.add(zone);
    this.state.zones = this.zones.zones;
    return created;
  }

  setZoneStatus(zoneId, status) {
    const zone = this.zones.setStatus(zoneId, status);
    this.state.zones = this.zones.zones;
    return zone;
  }

  registerAgent(entity) { this.addEntity(entity); this.agents.register(entity.id); return entity; }
  setGoal(actorId, goal) { return this.agents.setGoal(actorId, goal, this.clock.minutes); }
  talk(actorId, targetId) { return this.interactions.talk(actorId, targetId); }
  inspectResident(targetId) { return this.interactions.inspect(targetId); }
  acceptResidentRequest(actorId, targetId) { return this.interactions.acceptRequest(actorId, targetId); }
  startActivity(activityId, playerId = 'player') { return this.activities.start(playerId, activityId); }
  evaluateRequests() { this.requests.evaluate(this.clock.minutes); }

  start() { this.mode = 'RUNNING'; this.#emit('WORLD_STARTED'); }
  pause() { if (this.mode === 'RUNNING') { this.mode = 'PAUSED'; this.#emit('WORLD_PAUSED'); } }
  resume() { if (this.mode === 'PAUSED') { this.mode = 'RUNNING'; this.#emit('WORLD_RESUMED'); } }
  stop() { this.mode = 'STOPPED'; this.#emit('WORLD_STOPPED'); }

  step(minutes = 1) {
    if (!['RUNNING', 'PAUSED'].includes(this.mode)) throw new Error('World must be running or paused before stepping');
    this.clock.advance(minutes);
    this.state.version += 1;
    this.agents.tick({ worldTime: this.clock.minutes, minutes, world: this });
    this.energy.tick(minutes);
    while (this.agents.actions.length) this.actionResolver.resolve(this.agents.actions.dequeue(), this);
    this.spawn.markDeaths(this.clock.minutes);
    this.spawn.evaluate(this.clock.minutes);
    this.population.tick(this.clock.minutes, minutes);
    this.economy.tick(this.clock.minutes, minutes);
    this.causality.tick(this.clock.minutes);
    this.requests.evaluate(this.clock.minutes);
    this.activities.tick(minutes);
    this.settlement.tick({ population: this.population.stats().alive });
    this.worldEvents.evaluate(this.clock.minutes, event => { this.#emit('WORLD_EVENT', event); if (event.type === 'MARKET_DAY') this.resources.replenish(); });
    return this.#emit('WORLD_TICK', { minutes, version: this.state.version });
  }

  runTicks(count, minutesPerTick = 1) {
    if (!Number.isInteger(count) || count < 0) throw new Error('Tick count must be a non-negative integer');
    for (let index = 0; index < count; index += 1) this.step(minutesPerTick);
    return this.snapshot();
  }

  snapshot() { return structuredClone({ worldId: this.worldId, mode: this.mode, state: this.state.toJSON(), agents: this.agents.snapshot(), events: this.eventLog.toJSON() }); }

  #emit(type, payload = {}) { return this.eventLog.append({ worldTime: this.clock.minutes, type, payload }); }

  static fromSnapshot(snapshot) {
    const runtime = new WorldRuntime({ worldId: snapshot.worldId, startMinutes: snapshot.state.clock.minutes });
    runtime.mode = snapshot.mode;
    runtime.state = new WorldState({ clock: runtime.clock, entities: snapshot.state.entities, zones: snapshot.state.zones, metadata: snapshot.state.metadata });
    runtime.state.version = snapshot.state.version;
    runtime.eventLog = new EventLog(snapshot.events);
    runtime.entities = new EntityRegistry(runtime.state.entities);
    runtime.zones = new ZoneRuntime(runtime.state.zones);
    runtime.spatial = new SpatialQuery(runtime.entities);
    runtime.agents = new AgentRuntime({
      onGoalChanged: (actorId, goal) => runtime.#emit('GOAL_CHANGED', { actorId, goal: goal.toJSON() }),
      onActionCreated: action => runtime.#emit('ACTION_CREATED', action.toJSON()),
      entityProvider: actorId => runtime.entities.get(actorId),
      actionPlanner: actorId => new DefaultActionPlanner({ entityProvider: id => runtime.entities.get(id), nearbyProvider: entity => runtime.spatial.inZone(entity.zoneId, { type: 'MONSTER' }) }).plan(actorId)
    });
    runtime.agents.restore(snapshot.agents);
    runtime.interactions = new InteractionRuntime({ registry: runtime.entities, emit: event => runtime.#emit(event.type, event) });
    for (const entity of runtime.entities.byType('NPC').concat(runtime.entities.byType('PLAYER'))) runtime.agents.register(entity.id);
    return runtime;
  }
}
