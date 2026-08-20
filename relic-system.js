(function(){
  const RELICS={crown:{name:'破損的王冠',cost:30,desc:'每局初始金幣 +10',apply:r=>r.gold+=10},feather:{name:'樹上騎士羽毛',cost:45,desc:'樹上騎士特性初始 Lv.1',apply:r=>r.knight=1},badge:{name:'狼工會徽章',cost:50,desc:'受到傷害降低 15%',apply:r=>r.guard*=.85},bottle:{name:'過期藥瓶',cost:40,desc:'每 10 秒恢復 2 HP',apply:r=>r.regen+=2},stamp:{name:'哥布林無證印章',cost:35,desc:'金幣收益 +25%',apply:r=>r.goldRate+=.25}};
  window.RELICS=RELICS;player.relics=Array.isArray(player.relics)?player.relics.slice(0,3):[];
  // 武器不再提供戰鬥能力；保留舊存檔欄位只為相容，不再顯示或計算。
  if(typeof ITEMS!=='undefined'&&ITEMS.rustySword)ITEMS.rustySword.attack=0;
  window.applyRelics=function(run){for(const id of player.relics){const r=RELICS[id];if(r)r.apply(run)}};
  window.observe=function(){if(player.location.includes('野外'))return msg('野外已經沒有獨立打怪流程。請從村莊開始「五分鐘遠征」。');return msg('村莊目前只提供遺物商店與遠征準備。')};
  window.status=function(){open('👤 角色與遺物',`<p>Lv.${player.level}　EXP ${player.exp}/${next()||'MAX'}<br>HP ${player.hp}/${player.maxHp}<br>基礎攻擊 ${player.baseAttack}<br>金幣 ${player.gold}</p><p><b>特殊遺物 ${player.relics.length}/3</b><br>${player.relics.map(id=>'◆ '+RELICS[id].name+'：'+RELICS[id].desc).join('<br>')||'尚未持有遺物'}</p>`) };
  window.inventory=function(){open('🎒 遺物',`<p>特殊遺物 ${player.relics.length}/3</p>${player.relics.map(id=>`<div class="row"><span>◆ ${RELICS[id].name}<br><small class="muted">${RELICS[id].desc}</small></span></div>`).join('')||'<p>目前沒有遺物。</p>'}`)};
  window.village=function(){if(!player.location.includes('村莊'))return msg('請先回到村莊。');const rows=Object.entries(RELICS).map(([id,r])=>{const owned=player.relics.includes(id);return `<div class="row"><span>◆ ${r.name}<br><small class="muted">${r.desc} · ${r.cost} G</small></span><button onclick="buyRelic('${id}')">${owned?'已持有':'購買'}</button></div>`}).join('');open('🏪 特殊遺物商店',`<p>遺物欄位：${player.relics.length}/3。遺物會套用到下一局遠征。</p>${rows}`)};
  window.buyRelic=function(id){const r=RELICS[id];if(player.relics.includes(id))return msg('你已經持有這件遺物。');if(player.relics.length>=3)return msg('遺物欄位已滿，最多只能攜帶 3 個。');if(player.gold<r.cost)return msg('金幣不足。');player.gold-=r.cost;player.relics.push(id);closeModal();msg(`你購買了遺物：${r.name}。下一局遠征生效。`,'good');save();render()};
})();
