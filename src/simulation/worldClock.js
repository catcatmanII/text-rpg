export class WorldClock {
  constructor(minutes = 0) { this.minutes = minutes; }
  advance(delta = 1) {
    if (!Number.isInteger(delta) || delta < 0) throw new Error('Clock delta must be a non-negative integer');
    this.minutes += delta;
    return this.minutes;
  }
  toJSON() { return { minutes: this.minutes }; }
  static fromJSON(data) { return new WorldClock(data.minutes); }
}
