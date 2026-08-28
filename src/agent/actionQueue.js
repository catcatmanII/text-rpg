export class ActionQueue {
  constructor() { this.items = []; }
  enqueue(action) { this.items.push(action); return action; }
  dequeue() { return this.items.shift(); }
  get length() { return this.items.length; }
  clear() { this.items.length = 0; }
}
