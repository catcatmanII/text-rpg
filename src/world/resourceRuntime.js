export class ResourceRuntime {
  constructor(definitions = []) { this.nodes = Object.fromEntries(definitions.map(node => [node.id, { ...node, remaining: node.amount }])); }
  gather(entity, nodeId, amount = 1) {
    const node = this.nodes[nodeId];
    if (!node || node.remaining < amount) return { ok: false, reason: 'RESOURCE_EMPTY' };
    node.remaining -= amount; entity.inventory ??= {}; entity.inventory[node.itemId] = (entity.inventory[node.itemId] ?? 0) + amount;
    return { ok: true, itemId: node.itemId, amount };
  }
  replenish() { for (const node of Object.values(this.nodes)) node.remaining = node.amount; }
}
