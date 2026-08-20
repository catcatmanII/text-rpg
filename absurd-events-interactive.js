(function(){
  if(typeof player==='undefined'||typeof observe!=='function'||typeof open!=='function')return;
  player.absurdArc=player.absurdArc||{seen:[],flags:{},resolved:false};
  const arc=player.absurdArc;
  function mark(id,flag){if(!arc.seen.includes(id))arc.seen.push(id);if(flag)arc.flags[flag]=true;save()}
  function finish(text){closeModal();msg(text,'good');render()}
  function choice(id,flag,text,effect){mark(id,flag);if(effect)effect();finish(text)}
  window.absurdInteractiveChoice=function(id){
    const choices={
      chicken_pay:()=>choice('chicken_pay','paidChickenTax','你繳交了三枚金幣。雞村長收下金幣，卻頒給你一張「永久免雞毛追捕證」。\n\n你發現證件背面寫著：此證件對狼工會同樣有效。',()=>player.gold=Math.max(0,player.gold-3)),
      chicken_revolt:()=>choice('chicken_revolt','opposedChickenTax','你拒絕繳稅。雞村長立刻召集三隻小雞召開緊急投票。\n\n投票結果：你被判定為「暫時可以信任的人類」。',null),
      chicken_ask:()=>choice('chicken_ask','learnedChickenSecret','你問雞村長為什麼會徵稅。牠沉默片刻，說：\n「因為地下室的門只對納稅人開。」\n\n你得到一條重要線索：地下室真的存在。',null),
      license_accept:()=>choice('license_accept','goblinLicense','你接受三級無證冒險執照。哥布林在你的額頭蓋章，章印三天不會消失。\n\n狼工會看見後，認定你是官方仲裁人。',null),
      license_bribe:()=>choice('license_bribe','bribedGoblin',`你給哥布林 ${Math.min(2,player.gold)} 枚金幣，牠把執照升級成「四級無證但有誠意」。`,()=>player.gold=Math.max(0,player.gold-2)),
      license_refuse:()=>choice('license_refuse','refusedGoblinLicense','你拒絕接受執照。哥布林敬佩地點頭：\n「真正的無證冒險者，從不承認自己無證。」\n\n牠把一張地下室門票塞給你。',()=>add('redPotion',1)),
      bread_eat:()=>choice('bread_eat','ateProphecyBread','你吃下麵包。你看見短暫幻覺：雞在開會、狼在填表、地下室在打噴嚏。\n\n麵包騎士宣布你已通過預言。',null),
      bread_shield:()=>choice('bread_shield','keptProphecyBread','你把麵包當盾牌。麵包騎士感動落淚，表示這正是他夢想中的軍事用途。\n\n你獲得一個荒謬但堅硬的麵包盾。',()=>add('redPotion',1)),
      bread_question:()=>choice('bread_question','questionedBreadKnight','你問麵包騎士地下室的事。\n他說：「地下室不是在地下，而是在大家不願意承認的地方。」\n\n這句話讓你想起那扇飄在野外的門。',null),
      wolf_sign:()=>choice('wolf_sign','signedWolfTreaty','你替狼工會在請願書上簽名。狼群宣布你為人類代表，並承諾戰鬥前先給你三秒鐘整理心情。',null),
      wolf_mediator:()=>choice('wolf_mediator','mediatedWolfTreaty','你答應把狼工會的請願書帶回村莊。狼群給你一枚刻著雞腳印的徽章，說這是通行證。',null),
      wolf_refuse:()=>choice('wolf_refuse','refusedWolfTreaty','你拒絕介入狼的勞資糾紛。狼群表示理解，然後集體躺下罷工。\n\n野外暫時變得異常安靜。',null)
      ,final_close:()=>finish('荒謬事件主線已收束。接下來只會偶爾出現獨立彩蛋。')
    };if(choices[id])choices[id]()
  };
  function eventBox(title,text,rows){open(title,`<p>${text}</p>${rows.map(r=>`<div class="row"><span>${r[0]}</span><button onclick="absurdInteractiveChoice('${r[1]}')">${r[2]}</button></div>`).join('')}`)}
  function nextEvent(){
    if(!player.location.includes('村莊')&&arc.flags.chickenTax&&arc.flags.goblinLicense&&!arc.flags.wolfTreaty&&Math.random()<.55){
      eventBox('🐺 狼工會談判','野狼攔住你。牠們看過你身上的雞村長證件和哥布林印章，認定你是唯一合法的談判代表。', [['簽署狼工會請願書','wolf_sign','簽名'],['把請願書帶回村莊','wolf_mediator','當調解人'],['拒絕介入','wolf_refuse','拒絕']]);return true}
    if(player.location.includes('村莊')&&!arc.flags.chickenTax&&Math.random()<.6){
      eventBox('🐔 雞村長徵稅','戴帽子的雞跳上木箱。\n「人類，繳交三枚金幣的咕咕稅，否則你不能進入不存在的地下室。」',[['乖乖繳稅','chicken_pay','繳稅'],['拒絕荒謬稅制','chicken_revolt','拒絕'],['追問地下室','chicken_ask','追問']]);return true}
    if(!player.location.includes('村莊')&&!arc.flags.goblinLicense&&Math.random()<.6){
      eventBox('📜 哥布林執照檢查','哥布林攔住你。\n「沒有執照不能打怪，有執照也不一定能打怪。」牠拿出三種完全相同的表格。',[['接受三級無證執照','license_accept','接受'],['付費升級執照','license_bribe','付費'],['拒絕辦證','license_refuse','拒絕']]);return true}
    if(player.location.includes('村莊')&&arc.flags.goblinLicense&&!arc.flags.breadKnight&&Math.random()<.55){
      eventBox('🥖 麵包騎士的預言','麵包店老闆穿上半套盔甲，把一顆硬麵包交給你。\n「這顆麵包會證明你是否適合進入地下室。」',[['直接吃掉','bread_eat','吃麵包'],['拿來當盾牌','bread_shield','當盾牌'],['追問預言內容','bread_question','追問']]);return true}
    return false;
  }
  const oldObserve=window.observe;
  window.observe=function(){if(enemy)return;if(arc.resolved)return oldObserve();if(nextEvent())return;oldObserve()};
  const oldMove=window.move;
  window.move=function(to){oldMove(to);if(!enemy&&!arc.resolved&&arc.flags.wolfTreaty&&to.includes('村莊')&&Object.keys(arc.flags).length>=3){arc.resolved=true;save();open('📜 荒謬事件總結','<p>你把狼工會的請願書帶回村莊。</p><p>雞村長、哥布林執照官、麵包騎士與狼代表同時抵達村口。</p><p><b>荒謬委員會最終決議：</b><br>本島所有事件都互有關聯，但沒有人知道誰先開始。為避免事情繼續變得合理，委員會決定正式結束調查。</p><p>你獲得稱號：<b>第一位正常的可疑人物</b></p>',[['關閉','final_close','關閉']]);}}
  window.absurdInteractiveChoice=window.absurdInteractiveChoice||function(){};
})();
