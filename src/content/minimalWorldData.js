export const minimalWorldData = Object.freeze({
  zones: [
    { id: 'village', name: 'Village' },
    { id: 'hunt', name: 'Hunting Area' }
  ],
  entities: [
    { id: 'player', type: 'PLAYER', zoneId: 'village', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, hp: 30, maxHp: 30, attack: 5, exp: 0, gold: 10, inventory: {} },
    { id: 'hunter', type: 'NPC', autonomous: true, zoneId: 'hunt', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, huntLocation: { x: 2, y: 0 }, hp: 20, maxHp: 20, attack: 4, exp: 0, gold: 5, supplies: 1, inventory: {} },
    { id: 'goblin-1', type: 'MONSTER', zoneId: 'hunt', location: { x: 1, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true },
    { id: 'goblin-2', type: 'MONSTER', zoneId: 'hunt', location: { x: 3, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true }
  ],
  shop: { inventory: { potion: 10 }, prices: { potion: 1 } }
});
