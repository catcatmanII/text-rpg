import { WorldRuntime } from '../simulation/worldRuntime.js';
import { ShopRuntime } from '../economy/shopRuntime.js';
import { SupplyService } from '../economy/supplyService.js';
import { minimalWorldData } from './minimalWorldData.js';

export function createMinimalWorld() {
  const world = new WorldRuntime({ worldId: 'minimal-world', startMinutes: 360 });
  for (const zone of minimalWorldData.zones) world.addZone(zone);
  world.setZoneStatus('village', 'ACTIVE'); world.setZoneStatus('hunt', 'ACTIVE');
  const [player, hunter, ...monsters] = minimalWorldData.entities.map(entity => structuredClone(entity));
  world.addEntity(player); world.registerAgent(hunter);
  for (const monster of monsters) world.addEntity(monster);
  const shop = new ShopRuntime(minimalWorldData.shop);
  world.actionResolver.supply = new SupplyService({ inventoryRuntime: world.inventory, shopRuntime: shop, quantity: 1 });
  world.start(); world.setGoal('hunter', { type: 'HUNT', priority: 50, reason: 'routine' });
  return world;
}
