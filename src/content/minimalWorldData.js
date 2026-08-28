export const minimalWorldData = Object.freeze({
  zones: [
    { id: 'village', name: 'Village' },
    { id: 'hunt', name: 'Hunting Area' }
  ],
  entities: [
    { id: 'player', type: 'PLAYER', zoneId: 'village', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, hp: 30, maxHp: 30, attack: 5, exp: 0, gold: 10, inventory: {} },
    { id: 'hunter', name: '獵人阿拓', profession: 'HUNTER', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'hunt', location: { x: 0, y: 0 }, homeLocation: { x: 0, y: 0 }, huntLocation: { x: 2, y: 0 }, hp: 20, maxHp: 20, attack: 4, exp: 0, gold: 5, supplies: 1, inventory: {}, familyId: 'family-hunter', ageDays: 28, dialogue: '最近狩獵區的哥布林變多了，你要小心。' },
    { id: 'farmer-a', name: '農夫小林', profession: 'FARMER', personality: '務實、愛操心', background: '從祖父手上接下村外的田地。', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 2, y: 1 }, workLocation: { x: 2, y: 1 }, homeLocation: { x: 2, y: 1 }, hp: 18, maxHp: 18, attack: 2, gold: 8, inventory: {}, familyId: 'family-farm', ageDays: 30, dialogue: '今年的田地需要更多人手。', dialogues: ['今年的田地需要更多人手。', '謝謝你願意聽我說，農作物總算有希望了。'], request: { id: 'farm_help', text: '請留意村莊的食物存量，別讓居民挨餓。' } },
    { id: 'merchant-a', name: '商人米雅', profession: 'MERCHANT', personality: '精明、觀察力強', background: '沿著東部商路旅行多年，最近決定留在村裡。', type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 3, y: 1 }, workLocation: { x: 3, y: 1 }, homeLocation: { x: 3, y: 1 }, hp: 16, maxHp: 16, attack: 2, gold: 30, inventory: {}, familyId: 'family-merchant', ageDays: 26, dialogue: '如果你找到草藥，我可以用合理的價格收購。', dialogues: ['如果你找到草藥，我可以用合理的價格收購。', '你的眼光不錯，這批貨讓村莊度過了難關。'], request: { id: 'merchant_herb', text: '請在狩獵區尋找草藥，帶回來可以改善商店庫存。' } },
    { id: 'guard-a', name: '守衛石川', profession: 'GUARD', personality: '寡言、警覺', background: '曾在北方邊境服役，退役後回到故鄉守護村子。', type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 1, y: 2 }, workLocation: { x: 1, y: 2 }, homeLocation: { x: 1, y: 2 }, hp: 25, maxHp: 25, attack: 5, gold: 12, inventory: {}, familyId: 'family-guard', ageDays: 34, dialogue: '村口目前安全，但我不會放鬆警戒。', dialogues: ['村口目前安全，但我不會放鬆警戒。', '你的支援讓我能放心巡邏，謝謝。'], request: { id: 'guard_watch', text: '請觀察狩獵區的怪物數量，若有異常就回來告訴我。' } },
    { id: 'resident-a', name: '居民小月', profession: 'FARMER', personality: '溫和、好奇', background: '負責照顧家中的幼童，也會在農忙時幫忙下田。', consumption: { food: 1 }, type: 'NPC', autonomous: true, zoneId: 'village', location: { x: 2, y: 2 }, workLocation: { x: 2, y: 2 }, homeLocation: { x: 2, y: 2 }, hp: 12, maxHp: 12, attack: 1, gold: 4, inventory: {}, familyId: 'family-farm', ageDays: 25, dialogue: '村裡最近比以前熱鬧了。', dialogues: ['村裡最近比以前熱鬧了。', '和你聊過之後，我覺得自己也能為村子做點事。'], request: { id: 'resident_visit', text: '有空時再來找我聊天，居民需要知道有人關心我們。' } },
    { id: 'goblin-1', type: 'MONSTER', spawnId: 'goblin_hunt', zoneId: 'hunt', location: { x: 1, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true },
    { id: 'goblin-2', type: 'MONSTER', spawnId: 'goblin_hunt', zoneId: 'hunt', location: { x: 3, y: 0 }, hp: 6, maxHp: 6, attack: 1, rewards: { exp: 10, gold: 2 }, alive: true }
  ],
  shop: { inventory: { potion: 10 }, prices: { potion: 1 } }
});
