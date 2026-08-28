import { WorldRuntime } from '../simulation/worldRuntime.js';
import { ShopRuntime } from '../economy/shopRuntime.js';
import { SupplyService } from '../economy/supplyService.js';
import { minimalWorldData } from './minimalWorldData.js';

export function createMinimalWorld() {
  const world = new WorldRuntime({ worldId: 'minimal-world', startMinutes: 360 });
  for (const zone of minimalWorldData.zones) world.addZone(zone);
  world.setZoneStatus('village', 'ACTIVE'); world.setZoneStatus('hunt', 'ACTIVE');
  const entities = minimalWorldData.entities.map(entity => structuredClone(entity));
  const player = entities.find(entity => entity.type === 'PLAYER');
  world.addEntity(player);
  for (const entity of entities.filter(entity => entity.type !== 'PLAYER')) if (entity.type === 'NPC') world.registerAgent(entity); else world.addEntity(entity);
  const shop = new ShopRuntime(minimalWorldData.shop);
  world.actionResolver.supply = new SupplyService({ inventoryRuntime: world.inventory, shopRuntime: shop, quantity: 1 });
  world.quests.accept(world.entities.get('player'), 'goblin_hunter');
  world.start(); world.setGoal('hunter', { type: 'HUNT', priority: 50, reason: 'routine' });
  return world;
}
