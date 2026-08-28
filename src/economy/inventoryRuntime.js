export class InventoryRuntime {
  add(entity, itemId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Quantity must be a positive integer');
    entity.inventory ??= {};
    entity.inventory[itemId] = (entity.inventory[itemId] ?? 0) + quantity;
  }
  remove(entity, itemId, quantity = 1) {
    if ((entity.inventory?.[itemId] ?? 0) < quantity) return false;
    entity.inventory[itemId] -= quantity;
    if (entity.inventory[itemId] === 0) delete entity.inventory[itemId];
    return true;
  }
  count(entity, itemId) { return entity.inventory?.[itemId] ?? 0; }
}
