export const buildingDefinitions = Object.freeze([
  { id: 'FARM', name: '農田', level: 1, cost: { wood: 10, stone: 0 }, effects: { foodMultiplier: 0.25 } },
  { id: 'HOUSE', name: '住宅', level: 1, cost: { wood: 20, stone: 10 }, effects: { housing: 4 } },
  { id: 'WATCHTOWER', name: '瞭望台', level: 1, cost: { wood: 15, stone: 10 }, effects: { safety: 10, threatReduction: 1 } },
  { id: 'SAWMILL', name: '木工坊', level: 2, cost: { wood: 25, stone: 10 }, effects: { woodMultiplier: 0.25 } },
  { id: 'CLINIC', name: '醫館', level: 2, cost: { wood: 20, stone: 15 }, effects: { medicineMultiplier: 0.5 } },
  { id: 'MARKET', name: '小市集', level: 2, cost: { wood: 25, stone: 15 }, effects: { marketTier: 1 } },
  { id: 'GUARDHOUSE', name: '衛兵所', level: 3, cost: { wood: 30, stone: 30 }, effects: { safety: 15, threatReduction: 2 } }
]);
