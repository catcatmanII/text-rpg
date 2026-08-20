(function(){
  const state=player.storyArc||{seen:[],clues:[],completed:false};
  player.storyArc=state;
  const villageEvents=[
    {id:'mayor_chicken',text:'一隻戴著小帽子的雞跳上木箱。\n「從今天開始，我就是說話之島的臨時村長。」\n牠頒發給你一張雞毛做的公文，要求你繳交三枚金幣的「咕咕稅」。',clue:'chicken'},
    {id:'bread_knight',text:'麵包店老闆衝出來，身穿半套盔甲。\n「勇者！真正的魔王不是怪物，而是沒有發酵完全的麵團！」\n他把一顆硬得像盾牌的麵包交給你，叫你保管。',clue:'bread'},
    {id:'basement_map',text:'一名老人神秘地塞給你一張地圖。\n地圖上標示著「村莊地下室」，但村莊明明沒有地下室。\n老人低聲說：「地下室沒有我，但我知道它在哪。」',clue:'basement'},
    {id:'committee_notice',text:'村口貼出公告：\n「請所有居民於今晚參加荒謬事件說明會。若無法理解，表示說明會成功。」\n落款是：村莊臨時臨時委員會。',clue:'committee'}
  ];
  const fieldEvents=[
    {id:'goblin_license',text:'一隻哥布林攔住你，要求查看「合法冒險執照」。\n你沒有執照，牠卻蓋章批准了你的沒有執照。\n「很好，你現在是三級無證冒險者。」',clue:'license'},
    {id:'slime_audition',text:'史萊姆在草地上排成一列。\n牠們正在試鏡，要選出下一任「最像水的史萊姆」。\n評審看了你一眼，問你能不能不要踩評分表。',clue:'slime'},
    {id:'wolf_union',text:'野狼沒有攻擊你，反而遞來一份請願書。\n內容是要求降低被冒險者擊敗的頻率，並增加午休時間。\n最後一頁已經被狼咬破。',clue:'wolf'},
    {id:'flying_basement',text:'你在野外看見一扇門飄在半空中。\n門上寫著：「村莊地下室，暫時搬到這裡。」\n你還沒碰門，它就發出敲門聲。',clue:'basement'}
  ];
  const finale={id:'committee_finale',text:'你回到村莊時，所有荒謬線索突然同時發生作用。\n雞村長、麵包騎士、無證哥布林、史萊姆評審與狼工會代表，全都擠在村口。\n\n半空中的地下室門打開了，裡面卻只放著一張桌子。\n桌上有一張決議：\n「經調查，本島目前最大的危機，是大家太認真地解釋事情。」\n\n眾人一致決定：從今天起，荒謬事件暫告一段落。\n雞村長宣布你為『第一位正常的可疑人物』。',clue:'finale'};
  function eligible(list){return list.filter(e=>!state.seen.includes(e.id))}
  function fire(location){
    if(state.completed)return;
    if(state.seen.length>=5&&!location.includes('村莊'))return;
    if(state.seen.length>=5&&location.includes('村莊')){state.seen.push(finale.id);state.clues.push(finale.clue);state.completed=true;msg('📜 荒謬主線收束\n\n'+finale.text,'good');save();return}
    const list=eligible(location.includes('村莊')?villageEvents:fieldEvents);if(!list.length)return;
    const e=list[Math.floor(Math.random()*list.length)];state.seen.push(e.id);state.clues.push(e.clue);msg('🎭 荒謬事件\n\n'+e.text,'good');save();
  }
  function chance(location){if(Math.random()>0.38)return;fire(location)}
  const oldMove=window.move,oldObserve=window.observe;
  window.move=function(to){oldMove(to);if(!enemy&&player.location===to)chance(to)};
  window.observe=function(){oldObserve();if(!enemy&&player.location.includes('野外'))chance(player.location)};
  if(typeof window.render==='function'){const oldRender=window.render;window.render=function(){oldRender();if(player.storyArc!==state)player.storyArc=state}}
})();
