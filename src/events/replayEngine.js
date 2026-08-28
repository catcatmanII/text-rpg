export class ReplayEngine {
  constructor({ initialSnapshot, events = [] } = {}) { this.initialSnapshot = structuredClone(initialSnapshot); this.events = structuredClone(events); }
  count(type) { return this.events.filter(event => !type || event.type === type).length; }
  timeline() { return this.events.map(event => ({ worldTime: event.worldTime, type: event.type })); }
  verifyMonotonicTime() { return this.events.every((event, index) => index === 0 || event.worldTime >= this.events[index - 1].worldTime); }
}
