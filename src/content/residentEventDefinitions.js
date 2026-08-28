export const residentEventDefinitions = Object.freeze([
  { id: 'farmer_legacy', targetId: 'farmer-a', title: '農夫小林的請託', description: '小林拿出祖父留下的灌溉圖，卻缺少把它實現的材料。', relationship: 1, options: [
    { id: 'fund_project', label: '交出木材協助', cost: { wood: 12 }, effects: { food: 16, prosperity: 8, morale: 2 }, text: '灌溉渠重新運作，小林對你的信任加深了。' },
    { id: 'encourage', label: '陪他重新規劃', costEnergy: 8, effects: { prosperity: 3, morale: 3 }, text: '你沒有立刻解決材料問題，但讓小林找回了信心。' }
  ] },
  { id: 'guard_oath', targetId: 'guard-a', title: '守衛石川的誓言', description: '石川想在村門前立下誓言，卻擔心居民不相信他能守住村子。', relationship: 1, options: [
    { id: 'stand_together', label: '陪他守夜', costEnergy: 10, effects: { safety: 10, morale: 3 }, text: '你們共同守過一夜，村民開始相信這支守衛隊。' },
    { id: 'build_watch', label: '提供石材建哨台', cost: { stone: 10 }, effects: { safety: 12, prosperity: 5 }, text: '新的哨台讓石川看得更遠，也讓村門更有底氣。' }
  ] },
  { id: 'moon_family', targetId: 'resident-a', title: '小月的家庭決定', description: '小月想讓家人搬進村內，但住宅空間已經所剩不多。', relationship: 2, options: [
    { id: 'make_room', label: '承諾整理住宅', effects: { prosperity: 5, morale: 4 }, text: '小月的家人安心留下，村裡多了一個願意互相照顧的家庭。' },
    { id: 'wait', label: '等新住宅完成', effects: { morale: -2 }, text: '小月接受了你的決定，但她希望你不要讓承諾拖太久。' }
  ] }
]);
