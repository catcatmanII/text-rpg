export class WorldState {
  constructor({ clock, entities = {}, zones = {}, metadata = {} } = {}) {
    this.clock = clock;
    this.entities = { ...entities };
    this.zones = { ...zones };
    this.metadata = { ...metadata };
    this.version = 0;
  }
  toJSON() {
    return { clock: this.clock.toJSON(), entities: this.entities, zones: this.zones, metadata: this.metadata, version: this.version };
  }
}
