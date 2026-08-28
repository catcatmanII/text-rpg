export class EntityRegistry {
  constructor(entities = {}) { this.entities = { ...entities }; }

  add(entity) {
    if (!entity?.id) throw new Error('Entity id is required');
    if (this.entities[entity.id]) throw new Error(`Entity already exists: ${entity.id}`);
    this.entities[entity.id] = structuredClone(entity);
    return this.entities[entity.id];
  }

  upsert(entity) {
    if (!entity?.id) throw new Error('Entity id is required');
    this.entities[entity.id] = structuredClone(entity);
    return this.entities[entity.id];
  }

  get(id) { return this.entities[id]; }
  remove(id) { return delete this.entities[id]; }
  all() { return Object.values(this.entities); }
  byType(type) { return this.all().filter(entity => entity.type === type); }
  toJSON() { return structuredClone(this.entities); }
}
