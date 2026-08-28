export class EventLog {
  constructor(events = []) { this.events = [...events]; }

  append(event) {
    const record = Object.freeze({
      eventId: event.eventId ?? `${event.worldTime}:${this.events.length + 1}`,
      worldTime: event.worldTime,
      type: event.type,
      payload: event.payload ?? {}
    });
    this.events.push(record);
    return record;
  }

  toJSON() { return this.events.map(event => ({ ...event })); }
}
