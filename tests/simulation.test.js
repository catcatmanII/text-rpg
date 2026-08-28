import test from 'node:test';
import assert from 'node:assert/strict';
import { WorldRuntime, saveWorld, loadWorld } from '../src/index.js';
import { EntityRegistry } from '../src/world/entityRegistry.js';
import { ZoneRuntime } from '../src/world/zoneRuntime.js';
import { SpatialQuery } from '../src/world/spatialQuery.js';
import { PathService } from '../src/movement/pathService.js';
import { MovementRuntime } from '../src/movement/movementRuntime.js';
import { LocalSearch } from '../src/movement/localSearch.js';
import { CombatRuntime } from '../src/combat/combatRuntime.js';
import { TargetSelector } from '../src/combat/targetSelector.js';
import { InventoryRuntime } from '../src/economy/inventoryRuntime.js';
import { ShopRuntime } from '../src/economy/shopRuntime.js';
import { SupplyService } from '../src/economy/supplyService.js';
import { ReplayEngine } from '../src/events/replayEngine.js';
import { PlayerCommandRouter } from '../src/player/playerCommandRouter.js';
import { TextObserver } from '../src/presentation/textObserver.js';
import { createMinimalWorld } from '../src/content/minimalWorld.js';
import { WorldEventScheduler } from '../src/world/worldEventScheduler.js';
import { ResourceRuntime } from '../src/world/resourceRuntime.js';
import { QuestRuntime } from '../src/quest/questRuntime.js';
import { SpawnRuntime } from '../src/world/spawnRuntime.js';
import { PopulationRuntime } from '../src/population/populationRuntime.js';
import { labelOf } from '../src/presentation/labels.js';
import { InteractionRuntime } from '../src/interaction/interactionRuntime.js';
import { ActivityRuntime } from '../src/activity/activityRuntime.js';
import { PlayerEnergyRuntime } from '../src/player/playerEnergyRuntime.js';
import { SettlementRuntime } from '../src/settlement/settlementRuntime.js';
import { ThreatRuntime } from '../src/world/threatRuntime.js';

test('world can start, tick, pause and resume', () => {
  const world = new WorldRuntime({ worldId: 'mvp', startMinutes: 360 });
  world.start();
  world.step();
  world.pause();
  world.step(5);
  world.resume();
  assert.equal(world.clock.minutes, 366);
  assert.equal(world.state.version, 2);
  assert.deepEqual(world.eventLog.events.map(e => e.type).filter(type => type.startsWith('WORLD_')), ['WORLD_STARTED', 'WORLD_TICK', 'WORLD_PAUSED', 'WORLD_TICK', 'WORLD_RESUMED']);
});

test('world snapshot can be saved and loaded', () => {
  const original = new WorldRuntime({ worldId: 'persisted', startMinutes: 60 });
  original.start();
  original.step(10);
  const restored = loadWorld(saveWorld(original));
  assert.deepEqual(restored.snapshot(), original.snapshot());
});

test('world rejects stepping before it starts', () => {
  const world = new WorldRuntime();
  assert.throws(() => world.step(), /running or paused/);
});

test('entities and zones support deterministic spatial queries', () => {
  const registry = new EntityRegistry();
  registry.add({ id: 'player', type: 'PLAYER', zoneId: 'village', location: { x: 0, y: 0 } });
  registry.add({ id: 'npc-1', type: 'NPC', zoneId: 'village', location: { x: 2, y: 0 } });
  registry.add({ id: 'monster-1', type: 'MONSTER', zoneId: 'hunt', location: { x: 1, y: 1 } });
  const zones = new ZoneRuntime();
  zones.add({ id: 'village', name: 'Village' });
  zones.add({ id: 'hunt', name: 'Hunting Area' });
  zones.setStatus('village', 'ACTIVE');
  const query = new SpatialQuery(registry);
  assert.deepEqual(query.within({ x: 0, y: 0 }, 2.1, { zoneId: 'village', excludeId: 'player' }).map(e => e.id), ['npc-1']);
  assert.deepEqual(query.inZone('village').map(e => e.id), ['player', 'npc-1']);
  assert.equal(zones.require('village').status, 'ACTIVE');
});

test('runtime entity and zone changes are included in snapshots', () => {
  const world = new WorldRuntime({ worldId: 'entities' });
  world.addZone({ id: 'village', name: 'Village' });
  world.setZoneStatus('village', 'ACTIVE');
  world.addEntity({ id: 'npc-1', type: 'NPC', zoneId: 'village', location: { x: 1, y: 1 } });
  const restored = loadWorld(saveWorld(world));
  assert.equal(restored.entities.get('npc-1').type, 'NPC');
  assert.equal(restored.zones.require('village').status, 'ACTIVE');
});

test('registered agents receive deterministic actions from goals on each tick', () => {
  const world = new WorldRuntime({ worldId: 'agents' });
  world.start();
  world.registerAgent({ id: 'npc-b', type: 'NPC', location: { x: 0, y: 0 } });
  world.registerAgent({ id: 'npc-a', type: 'NPC', location: { x: 0, y: 0 } });
  world.setGoal('npc-b', { type: 'HUNT', priority: 10, reason: 'routine' });
  world.setGoal('npc-a', { type: 'RETURN', priority: 5, reason: 'safety' });
  world.step();
  assert.deepEqual(world.eventLog.events.filter(event => event.type === 'ACTION_CREATED').map(event => [event.payload.actorId, event.payload.payload.goal]), [['npc-a', 'RETURN'], ['npc-b', 'HUNT']]);
});

test('agents autonomously choose recovery and supply goals from needs', () => {
  const world = new WorldRuntime({ worldId: 'needs' });
  world.start();
  world.registerAgent({ id: 'npc-1', type: 'NPC', autonomous: true, hp: 10, maxHp: 100, supplies: 5, needs: { fatigue: 0, hunger: 0, safety: 100 }, location: { x: 0, y: 0 } });
  world.step();
  assert.equal(world.agents.goals.current('npc-1').type, 'RECOVER');
});

test('movement advances one deterministic walkable step', () => {
  const movement = new MovementRuntime({ pathService: new PathService({ isWalkable: point => point.x !== 1 }) });
  const entity = { id: 'npc', location: { x: 0, y: 0 } };
  assert.equal(movement.moveToward(entity, { x: 2, y: 0 }), false);
  assert.deepEqual(entity.location, { x: 0, y: 0 });
  assert.equal(movement.moveToward(entity, { x: 0, y: 2 }), true);
  assert.deepEqual(entity.location, { x: 0, y: 1 });
});

test('local search has deterministic target and exhaustion results', () => {
  const search = new LocalSearch({ candidates: [{ id: 'dead' }, { id: 'live' }], isValid: item => item.id === 'live' });
  assert.deepEqual(search.next(), { result: 'TARGET_FOUND', target: { id: 'live' } });
  assert.deepEqual(search.next(), { result: 'AREA_EXHAUSTED', target: null });
});

test('combat resolves damage, death and rewards without LLM', () => {
  const events = [];
  const combat = new CombatRuntime({ onEvent: event => events.push(event) });
  const attacker = { id: 'player', attack: 5, hp: 20, exp: 0, gold: 0 };
  const monster = { id: 'goblin', hp: 4, defense: 1, rewards: { exp: 10, gold: 3 } };
  assert.deepEqual(combat.attack(attacker, monster), { ok: true, damage: 4, defeated: true });
  assert.equal(attacker.exp, 10);
  assert.equal(attacker.gold, 3);
  assert.deepEqual(events.map(event => event.type), ['DAMAGE_APPLIED', 'ENTITY_DIED']);
});

test('target selection is nearest then stable by id', () => {
  const selector = new TargetSelector();
  const source = { location: { x: 0, y: 0 } };
  const targets = [{ id: 'b', alive: true, location: { x: 1, y: 0 } }, { id: 'a', alive: true, location: { x: 0, y: 1 } }];
  assert.equal(selector.nearest(source, targets).id, 'a');
});

test('inventory, shop and supply form a deterministic economy loop', () => {
  const inventory = new InventoryRuntime();
  const shop = new ShopRuntime({ inventory: { potion: 5 }, prices: { potion: 2 } });
  const service = new SupplyService({ inventoryRuntime: inventory, shopRuntime: shop, quantity: 2 });
  const actor = { id: 'npc', gold: 10, inventory: {} };
  const result = service.execute(actor);
  assert.deepEqual(result, { ok: true, total: 4 });
  assert.equal(inventory.count(actor, 'potion'), 2);
  assert.equal(actor.gold, 6);
  assert.equal(shop.inventory.potion, 3);
  assert.equal(service.execute(actor).changed, false);
});

test('save schema and replay preserve a traceable world history', () => {
  const world = new WorldRuntime({ worldId: 'replay', startMinutes: 10 });
  world.start(); world.step(2); world.pause();
  const replay = new ReplayEngine({ initialSnapshot: world.snapshot(), events: world.eventLog.events });
  assert.equal(replay.count('WORLD_TICK'), 1);
  assert.equal(replay.verifyMonotonicTime(), true);
  assert.equal(JSON.parse(saveWorld(world)).schemaVersion, 1);
  assert.equal(loadWorld(saveWorld(world)).clock.minutes, 12);
});

test('player commands are validated at the boundary and observer is read-only', () => {
  const world = new WorldRuntime({ worldId: 'player' });
  world.registerAgent({ id: 'player', type: 'PLAYER', location: { x: 0, y: 0 } });
  const router = new PlayerCommandRouter({ world, playerId: 'player' });
  assert.equal(router.dispatch('move 3 4').destination.x, 3);
  assert.throws(() => router.dispatch('teleport 9 9'), /Unknown player command/);
  const view = new TextObserver().describe(world);
  assert.equal(view.entities[0].id, 'player');
  assert.match(new TextObserver().render(world), /World player/);
});

test('minimal world runs autonomously without LLM', () => {
  const world = createMinimalWorld();
  for (let index = 0; index < 10; index += 1) world.step();
  assert.equal(world.clock.minutes, 370);
  assert.ok(world.eventLog.events.some(event => event.type === 'DAMAGE_APPLIED'));
  assert.ok(world.eventLog.events.some(event => event.type === 'ENTITY_DIED'));
  assert.ok(world.entities.get('hunter').exp > 0);
});

test('minimal world survives 1000 ticks and continues after save/load', () => {
  const world = createMinimalWorld();
  world.runTicks(500);
  const restored = loadWorld(saveWorld(world));
  restored.runTicks(500);
  assert.equal(restored.clock.minutes, 1360);
  assert.ok(restored.eventLog.events.length > 100);
  assert.ok(restored.entities.get('hunter').exp > 20);
  assert.ok(restored.eventLog.events.some(event => event.type === 'ENTITY_RESPAWNED'));
});

test('world event scheduler emits each recurring event once per cycle', () => {
  const events = []; const scheduler = new WorldEventScheduler([{ id: 'market', type: 'MARKET_DAY', interval: 10 }]);
  scheduler.evaluate(10, event => events.push(event)); scheduler.evaluate(10, event => events.push(event)); scheduler.evaluate(20, event => events.push(event));
  assert.deepEqual(events.map(event => event.cycle), [1, 2]);
});

test('resource nodes deplete and replenish without external AI', () => {
  const resources = new ResourceRuntime([{ id: 'herb', itemId: 'herb', amount: 1 }]); const entity = { inventory: {} };
  assert.equal(resources.gather(entity, 'herb').ok, true); assert.equal(resources.gather(entity, 'herb').ok, false);
  resources.replenish(); assert.equal(resources.gather(entity, 'herb').ok, true);
});

test('quest runtime tracks deterministic monster kill progress', () => {
  const quests = new QuestRuntime([{ id: 'hunt', goalEvent: 'ENTITY_DIED', targetType: 'MONSTER', required: 2 }]); const entity = {};
  assert.equal(quests.accept(entity, 'hunt').ok, true);
  quests.progress(entity, { type: 'ENTITY_DIED', targetType: 'MONSTER' }); quests.progress(entity, { type: 'ENTITY_DIED', targetType: 'MONSTER' });
  assert.deepEqual(entity.quests.hunt, { progress: 2, completed: true });
});

test('spawn runtime respawns a dead monster after cooldown', () => {
  const registry = new EntityRegistry({ old: { id: 'old', type: 'MONSTER', spawnId: 's', alive: false, deadAt: 10, maxHp: 6 } });
  const spawned = []; const runtime = new SpawnRuntime({ registry, definitions: [{ id: 's', monsterType: 'goblin', maxAlive: 1, respawnMinutes: 30 }], createEntity: entity => entity, emit: event => spawned.push(event) });
  runtime.markDeaths(10); assert.equal(registry.all().length, 0);
  runtime.evaluate(39); assert.equal(registry.all().filter(entity => entity.alive !== false).length, 0);
  runtime.evaluate(40); assert.equal(registry.all().filter(entity => entity.alive !== false).length, 1); assert.equal(spawned.at(-1).type, 'ENTITY_RESPAWNED');
});

test('population runtime creates a child and reports population statistics', () => {
  const registry = new EntityRegistry(); const events = []; const population = new PopulationRuntime({ registry, emit: event => events.push(event) });
  registry.add({ id: 'a', type: 'NPC', familyId: 'f', ageDays: 20, alive: true, location: { x: 0, y: 0 } }); registry.add({ id: 'b', type: 'NPC', familyId: 'f', ageDays: 21, alive: true, location: { x: 0, y: 0 } });
  population.tick(1440); assert.equal(population.stats().alive, 3); assert.equal(events[0].type, 'NPC_BORN');
});

test('presentation exposes Traditional Chinese labels', () => { assert.equal(labelOf('MONSTER'), '怪物'); assert.equal(labelOf('NPC_BORN'), '居民出生'); });

test('dead monsters are removed from world entities and later respawn', () => {
  const registry = new EntityRegistry({ goblin: { id: 'goblin', type: 'MONSTER', spawnId: 's', alive: false, maxHp: 6 } }); const events = [];
  const runtime = new SpawnRuntime({ registry, definitions: [{ id: 's', monsterType: 'goblin', maxAlive: 1, respawnMinutes: 10 }], createEntity: entity => entity, emit: event => events.push(event) });
  runtime.markDeaths(5); assert.equal(registry.get('goblin'), undefined); assert.equal(events[0].type, 'ENTITY_REMOVED');
  runtime.evaluate(14); assert.equal(registry.all().length, 0); runtime.evaluate(15); assert.equal(registry.all().length, 1);
});

test('player can talk to a resident and relationship changes deterministically', () => {
  const registry = new EntityRegistry({ player: { id: 'player', type: 'PLAYER' }, resident: { id: 'resident', type: 'NPC', name: '居民', dialogue: '早安。' } });
  const events = []; const interaction = new InteractionRuntime({ registry, emit: event => events.push(event) });
  assert.deepEqual(interaction.talk('player', 'resident'), { ok: true, reply: '早安。', relationship: 1 });
  assert.equal(registry.get('player').relationships.resident, 1); assert.equal(events[0].type, 'TALKED');
});

test('resident content supports inspection, requests and changing dialogue', () => {
  const world = createMinimalWorld();
  const info = world.inspectResident('farmer-a');
  assert.equal(info.resident.personality, '務實、愛操心');
  assert.equal(world.acceptResidentRequest('player', 'farmer-a').ok, true);
  assert.equal(world.talk('player', 'farmer-a').reply, '今年的田地需要更多人手。');
  assert.equal(world.talk('player', 'farmer-a').reply, '謝謝你願意聽我說，農作物總算有希望了。');
});

test('resident requests can be completed and cause rewards and relationship changes', () => {
  const world = createMinimalWorld();
  world.acceptResidentRequest('player', 'resident-a');
  world.talk('player', 'resident-a'); world.talk('player', 'resident-a'); world.evaluateRequests();
  assert.equal(world.entities.get('player').requests['resident-a'].completed, true);
  assert.equal(world.entities.get('player').exp, 3);
  assert.equal(world.eventLog.events.at(-1).type, 'REQUEST_COMPLETED');
});

test('player activities consume energy, show progress and increase settlement prosperity', () => {
  const registry = new EntityRegistry({ player: { id: 'player', type: 'PLAYER', energy: 100 } }); const events = [];
  const energy = new PlayerEnergyRuntime({ registry }); const settlement = new SettlementRuntime({ emit: event => events.push(event), levels: [{ level: 2, prosperity: 8, population: 1, food: 0 }] });
  const activities = new ActivityRuntime({ registry, energy, settlement, definitions: { FARM: { id: 'FARM', duration: 3, energy: 10, rewards: { food: 5, prosperity: 8 } } }, emit: event => events.push(event) });
  assert.equal(activities.start('player', 'FARM').ok, true); assert.equal(registry.get('player').energy, 90);
  assert.equal(activities.tick(1).status, 'IN_PROGRESS'); assert.equal(activities.progress().ratio, 1 / 3);
  assert.equal(activities.tick(2).status, 'COMPLETED'); assert.equal(settlement.prosperity, 8); settlement.tick({ population: 1 }); assert.equal(settlement.level, 2);
});

test('prosperity does not passively decay, only sustained shortage can reduce it', () => {
  const settlement = new SettlementRuntime({ levels: [] }); settlement.prosperity = 20;
  settlement.tick({ population: 1 }); assert.equal(settlement.prosperity, 20);
  for (let index = 0; index < 178; index += 1) settlement.tick({ population: 1 }); assert.equal(settlement.prosperity, 20);
  settlement.tick({ population: 1 }); assert.equal(settlement.prosperity, 19);
});

test('minimal world exposes player energy and settlement state', () => {
  const world = createMinimalWorld();
  assert.equal(world.entities.get('player').energy, undefined);
  world.startActivity('BUILD');
  assert.equal(world.activities.progress().activityId, 'BUILD');
  world.step(15);
  assert.ok(world.settlement.prosperity > 0);
});

test('threat grows by world cycle and settlement level', () => {
  const registry = new EntityRegistry({ goblin: { id: 'goblin', type: 'MONSTER', alive: true, hp: 6, maxHp: 6, attack: 1 } });
  const settlement = { level: 2 }; const events = [];
  const threat = new ThreatRuntime({ registry, settlement, emit: event => events.push(event) });
  threat.tick(1440); assert.equal(registry.get('goblin').maxHp, 10); assert.equal(registry.get('goblin').attack, 2); assert.equal(events[0].type, 'THREAT_ESCALATED');
  threat.tick(1440); assert.equal(registry.get('goblin').maxHp, 10);
  threat.tick(2880); assert.equal(registry.get('goblin').maxHp, 12);
});
