export const decisionEventDefinitions = Object.freeze([
  { id: 'dry_field', title: '農田缺水', description: '連日無雨，農田的幼苗開始捲葉。', interval: 1440, options: [
    { id: 'irrigate', label: '修渠引水', cost: { wood: 10 }, effects: { food: 12, prosperity: 5, morale: 2 }, relationship: { targetId: 'farmer-a', amount: 2 }, text: '你與農夫一起修好引水渠，幼苗撐過了旱期。' },
    { id: 'ration', label: '分配儲糧', cost: { food: 10 }, effects: { prosperity: -2, morale: -1 }, text: '大家暫時吃得少一點，農田保住了，但士氣受到影響。' },
    { id: 'ignore', label: '暫時放棄', effects: { food: -15, prosperity: -8, morale: -6 }, text: '農田枯萎了一部分，接下來的食物壓力變大。' }
  ] },
  { id: 'border_alarm', title: '邊境騷動', description: '瞭望台傳來警報，狩獵區出現了不尋常的腳印。', interval: 1440, options: [
    { id: 'patrol', label: '組織巡邏', costEnergy: 12, effects: { safety: 8, prosperity: 3, morale: 1 }, relationship: { targetId: 'guard-a', amount: 2 }, text: '巡邏隊守住了村口，怪物沒有靠近。' },
    { id: 'fortify', label: '加固村門', cost: { wood: 12, stone: 6 }, effects: { safety: 12, prosperity: 2 }, text: '村門加固完成，但你消耗了原本準備建設的材料。' },
    { id: 'wait', label: '保持觀望', effects: { safety: -8, morale: -3 }, text: '這次沒有立刻出事，但居民開始擔心下一次警報。' }
  ] },
  { id: 'travellers', title: '流民求助', description: '三名疲憊的旅人來到村口，希望在這裡安身。', interval: 1440, options: [
    { id: 'welcome', label: '接納他們', cost: { food: 12 }, effects: { prosperity: 6, morale: 3 }, population: 3, text: '旅人留下來，村子多了勞動力，也多了三張需要餵飽的嘴。' },
    { id: 'hire', label: '以工換食', cost: { food: 6 }, effects: { wood: 8, prosperity: 3 }, population: 1, text: '其中一人留下工作，其他人繼續上路。' },
    { id: 'refuse', label: '婉拒請求', effects: { morale: -2 }, text: '你婉拒了他們，村內資源暫時沒有增加負擔。' }
  ] }
]);
