export const minimalWorldData = Object.freeze({
  zones: [
    { id: 'village', name: 'Village' },
    { id: 'hunt', name: 'Hunting Area' }
  ],
  entities: [
    { id: 'player', type: 'PLAYER', zoneId: 'village', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, hp: 30, maxHp: 30, attack: 5, exp: 0, gold: 10, inventory: {} },
    { id: 'hunter', name: '獵人阿拓', profession: 'HUNTER', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'hunt', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, huntLocation: { x: 2, y: 0 }, hp: 20, maxHp: 20, attack: 4, exp: 0, gold: 5, supplies: 1, inventory: {}, familyId: 'family-hunter', ageDays: 28, dialogue: '最近狩獵區的哥布林變多了，你要小心。' },
    { id: 'farmer-a', name: '農夫小林', profession: 'FARMER', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 2, y: 1 }, workLocation: { x: 2, y: 1 }, homeLocation: { x: 2, y: 1 }, hp: 18, maxHp: 18, attack: 2, gold: 8, inventory: {}, familyId: 'family-farm', ageDays: 30, dialogue: '今年的田地需要更多人手。' },
    { id: 'merchant-a', name: '商人米雅', profession: 'MERCHANT', type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 3, y: 1 }, workLocation: { x: 3, y: 1 }, homeLocation: { x: 3, y: 1 }, hp: 16, maxHp: 16, attack: 2, gold: 30, inventory: {}, familyId: 'family-merchant', ageDays: 26, dialogue: '如果你找到草藥，我可以用合理的價格收購。' },
    { id: 'guard-a', name: '守衛石川', profession: 'GUARD', type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 1, y: 2 }, workLocation: { x: 1, y: 2 }, homeLocation: { x: 1, y: 2 }, hp: 25, maxHp: 25, attack: 5, gold: 12, inventory: {}, familyId: 'family-guard', ageDays: 34, dialogue: '村口目前安全，但我不會放鬆警戒。' },
    { id: 'resident-a', name: '居民小月', profession: 'FARMER', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 2, y: 2 }, workLocation: { x: 2, y: 2 }, homeLocation: { x: 2, y: 2 }, hp: 12, maxHp: 12, attack: 1, gold: 4, inventory: {}, familyId: 'family-farm', ageDays: 25, dialogue: '村裡最近比以前熱鬧了。' },
    { id: 'goblin-1', type: 'MONSTER', spawnId: 'goblin_hunt', zoneId: 'hunt', location: { x: 1, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true },
    { id: 'goblin-2', type: 'MONSTER', spawnId: 'goblin_hunt', zoneId: 'hunt', location: { x: 3, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true }
  ],
  shop: { inventory: { potion: 10 }, prices: { potion: 1 } }
});
