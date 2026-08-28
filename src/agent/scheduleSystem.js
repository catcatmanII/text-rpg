export class ScheduleSystem {
  constructor(entries = []) { this.entries = [...entries].sort((a, b) => a.from - b.from); }
  current(minutes) {
    if (!this.entries.length) return null;
    const dayMinutes = minutes % 1440;
    return this.entries.find(entry => dayMinutes >= entry.from && dayMinutes < entry.to) ?? this.entries.at(-1);
  }
}
