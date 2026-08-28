export class PathService {
  constructor({ isWalkable = () => true } = {}) { this.isWalkable = isWalkable; }
  nextStep(from, to) {
    const candidates = [];
    if (from.x !== to.x) candidates.push({ x: from.x + Math.sign(to.x - from.x), y: from.y });
    if (from.y !== to.y) candidates.push({ x: from.x, y: from.y + Math.sign(to.y - from.y) });
    return candidates.find(point => this.isWalkable(point)) ?? null;
  }
}
