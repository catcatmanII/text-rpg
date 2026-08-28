export class ShopRuntime {
  constructor({ inventory = {}, prices = {} } = {}) { this.inventory = { ...inventory }; this.prices = { ...prices }; }
  buy(customer, itemId, quantity = 1, inventoryRuntime) {
    const price = this.prices[itemId];
    if (price == null || (this.inventory[itemId] ?? 0) < quantity) return { ok: false, reason: 'UNAVAILABLE' };
    const total = price * quantity;
    if ((customer.gold ?? 0) < total) return { ok: false, reason: 'INSUFFICIENT_GOLD' };
    customer.gold -= total; this.inventory[itemId] -= quantity;
    inventoryRuntime.add(customer, itemId, quantity);
    return { ok: true, total };
  }
}
