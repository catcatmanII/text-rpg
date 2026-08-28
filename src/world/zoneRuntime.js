export class ZoneRuntime {
  constructor(zones = {}) { this.zones = { ...zones }; }

  add(zone) {
    if (!zone?.id) throw new Error('Zone id is required');
    if (this.zones[zone.id]) throw new Error(`Zone already exists: ${zone.id}`);
    this.zones[zone.id] = { status: 'UNLOADED', entities: [], ...structuredClone(zone) };
    return this.zones[zone.id];
  }

  setStatus(id, status) {
    const zone = this.require(id);
    if (!['UNLOADED', 'LOADING', 'ACTIVE', 'SUSPENDED'].includes(status)) throw new Error(`Invalid zone status: ${status}`);
    zone.status = status;
    return zone;
  }

  require(id) {
    if (!this.zones[id]) throw new Error(`Unknown zone: ${id}`);
    return this.zones[id];
  }

  active() { return Object.values(this.zones).filter(zone => zone.status === 'ACTIVE'); }
  toJSON() { return structuredClone(this.zones); }
}
