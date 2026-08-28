export const developmentPathDefinitions = Object.freeze([
  { id: 'AGRICULTURAL', name: '農業村', description: '以穩定糧食與人口成長為優先。', effects: { foodMultiplier: 0.2, foodCapacity: 50 } },
  { id: 'MILITARY', name: '軍事據點', description: '以安全與降低怪物壓力為優先。', effects: { safety: 8, threatReduction: 2 } },
  { id: 'COMMERCIAL', name: '商業城鎮', description: '以市場階級與交易收益為優先。', effects: { marketTier: 2, goldMultiplier: 0.2 } },
  { id: 'EXPLORATION', name: '探索基地', description: '以野外收益與探索風險為優先。', effects: { meatMultiplier: 0.35, threatIncrease: 2 } }
]);
