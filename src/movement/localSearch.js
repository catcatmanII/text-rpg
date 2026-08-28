export const SEARCH_RESULTS = Object.freeze(['TARGET_FOUND', 'AREA_EXHAUSTED', 'AREA_UNREACHABLE', 'INTERRUPTED']);

export class LocalSearch {
  constructor({ candidates = [], isValid = () => true } = {}) { this.candidates = [...candidates]; this.isValid = isValid; this.index = 0; }
  next() {
    while (this.index < this.candidates.length) {
      const candidate = this.candidates[this.index++];
      if (this.isValid(candidate)) return { result: 'TARGET_FOUND', target: candidate };
    }
    return { result: 'AREA_EXHAUSTED', target: null };
  }
}
