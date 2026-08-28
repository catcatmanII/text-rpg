export class SupplyService {
  constructor({ inventoryRuntime, shopRuntime, supplyItem = 'potion', quantity = 1 } = {}) {
    this.inventory = inventoryRuntime; this.shop = shopRuntime; this.supplyItem = supplyItem; this.quantity = quantity;
  }
  needs(entity) { return this.inventory.count(entity, this.supplyItem) < this.quantity; }
  execute(entity) {
    if (!this.needs(entity)) return { ok: true, changed: false };
    const result = this.shop.buy(entity, this.supplyItem, this.quantity, this.inventory);
    if (result.ok) { entity.supplies = this.inventory.count(entity, this.supplyItem); }
    return result;
  }
}
