export const activityDefinitions = Object.freeze({
  FARM: { id: 'FARM', name: '協助農務', duration: 10, energy: 12, rewards: { food: 8, prosperity: 8 }, description: '幫忙耕作與收成，增加村莊食物。' },
  GUARD: { id: 'GUARD', name: '協助守衛', duration: 8, energy: 10, rewards: { safety: 10, prosperity: 7 }, description: '協助守衛巡邏，提升村莊安全。' },
  CLEAR: { id: 'CLEAR', name: '清剿怪物', duration: 12, energy: 18, rewards: { safety: 15, prosperity: 12 }, description: '前往狩獵區清除威脅。' },
  BUILD: { id: 'BUILD', name: '建設村落', duration: 15, energy: 20, rewards: { prosperity: 18 }, description: '投入時間與體力改善村莊設施。' }
});
