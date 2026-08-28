export class MovementRuntime {
  constructor({ pathService, onMoved } = {}) { this.pathService = pathService; this.onMoved = onMoved; }
  moveToward(entity, destination) {
    if (!entity.location || !destination) return false;
    if (entity.location.x === destination.x && entity.location.y === destination.y) return true;
    const next = this.pathService.nextStep(entity.location, destination);
    if (!next) return false;
    entity.location = next;
    this.onMoved?.(entity, next);
    return true;
  }
}
