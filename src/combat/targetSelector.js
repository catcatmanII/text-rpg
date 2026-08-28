export class TargetSelector {
  nearest(source, candidates, { maxDistance = Infinity } = {}) {
    return candidates.filter(candidate => candidate.alive !== false && candidate.location)
      .map(candidate => ({ candidate, distance: Math.hypot(candidate.location.x - source.location.x, candidate.location.y - source.location.y) }))
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance || a.candidate.id.localeCompare(b.candidate.id))[0]?.candidate ?? null;
  }
}
