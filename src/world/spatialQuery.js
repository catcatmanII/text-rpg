export class SpatialQuery {
  constructor(registry) { this.registry = registry; }

  within(location, radius, { type, zoneId, excludeId } = {}) {
    if (!location || !Number.isFinite(radius) || radius < 0) throw new Error('Location and non-negative radius are required');
    return this.registry.all().filter(entity => {
      if (entity.id === excludeId || (type && entity.type !== type) || (zoneId && entity.zoneId !== zoneId) || !entity.location) return false;
      const dx = entity.location.x - location.x;
      const dy = entity.location.y - location.y;
      return Math.hypot(dx, dy) <= radius;
    });
  }

  inZone(zoneId, options = {}) { return this.registry.all().filter(entity => entity.zoneId === zoneId && (!options.type || entity.type === options.type)); }
}
