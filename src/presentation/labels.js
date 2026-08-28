export const labels = Object.freeze({ RUNNING: '運行中', PAUSED: '已暫停', STOPPED: '已停止', PLAYER: '玩家', NPC: '居民', MONSTER: '怪物', HUNT: '狩獵', SUPPLY: '補給', RETURN: '返回村莊', RECOVER: '休息恢復', IDLE: '待命', MARKET_DAY: '市集日', NIGHTFALL: '夜幕降臨', ENTITY_DIED: '角色死亡', ENTITY_RESPAWNED: '怪物重新出現', NPC_BORN: '居民出生', NPC_DIED_OF_AGE: '居民老死' });
export const labelOf = value => labels[value] ?? value;
