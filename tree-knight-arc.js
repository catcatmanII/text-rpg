(function(){
  if(typeof player==='undefined'||typeof observe!=='function'||typeof open!=='function')return;
  player.treeKnightArc=player.treeKnightArc||{stage:0,choice:null,finished:false};
  const arc=player.treeKnightArc;
  function saveStage(stage,choice){arc.stage=stage;if(choice)arc.choice=choice;save()}
  function finish(text){closeModal();msg(text,'good');render()}
  function select(id){
    if(id==='accept'){saveStage(2,'accepted');player.exp+=5;finish('你接受了樹上騎士公會的臨時職務。\n\n職稱：樹上騎士地面聯絡員。\n工作內容：在騎士從樹上掉下來時，負責假裝這是計畫的一部分。\n\nEXP +5。');}
    if(id==='witness'){saveStage(2,'witness');finish('你拒絕加入公會，但答應作為目擊證人。\n\n公會提醒你：證詞必須證明騎士確實從樹上掉下來，不能證明樹確實存在。');}
    if(id==='climb'){saveStage(2,'climbed');player.gold+=5;finish('你再次爬上樹。\n\n樹頂的騎士公會辦公室發給你五枚「樹高補助金」。\n\n公會會計提醒：這筆錢不是公款，因為公會沒有地面上的地址。');}
    if(id==='rescue'){saveStage(3,'rescued');player.exp+=7;finish('你在樹下接住騎士。\n\n騎士非常感動，宣布你通過「不讓騎士摔到地上的高級考核」。\n\nEXP +7。');}
    if(id==='audit'){saveStage(3,'audited');finish('你檢查樹頂辦公室，發現每張辦公桌都寫著你的名字。\n\n騎士解釋：「這代表我們早就知道你會來。」\n\n你問誰安排的。\n騎士說：「樹。」');}
    if(id==='fall'){saveStage(3,'imitated');player.gold+=3;finish('你和騎士一起從樹上掉下來。\n\n兩人同時落地，姿勢完全一致。\n\n公會立刻認定你為正式騎士，因為只有正式騎士才知道怎麼摔得像有制度。\n\n獲得 3 金幣。');}
    if(id==='expose'){saveStage(4,'exposed');finish('你在審判中揭露樹頂辦公室。\n\n全村沉默。\n\n雞村長宣布：樹上辦公室合法，因為沒有人能證明它不合法。');}
    if(id==='defend'){saveStage(4,'defended');player.exp+=10;finish('你替樹上騎士辯護。\n\n你提出關鍵論點：如果騎士每次都從樹上掉下來，那這就是一種穩定的職業技能。\n\n全村鼓掌。EXP +10。');}
    if(id==='appoint'){saveStage(4,'appointed');finish('你提議讓樹上騎士擔任村莊高空安全顧問。\n\n雞村長批准了。\n\n狼工會要求他先完成地面安全講習，於是騎士立刻爬回樹上逃課。');}
    if(id==='close'){arc.finished=true;save();finish('樹上騎士支線已完成。\n\n你獲得稱號：樹下唯一清醒的人。\n\n從此以後，村民看到樹都會先問：「今天有騎士嗎？」');}
  }
  window.treeKnightChoice=select;
  function box(title,text,rows){open(title,`<p>${text}</p>${rows.map(r=>`<div class="row"><span>${r[0]}</span><button onclick="treeKnightChoice('${r[1]}')">${r[2]}</button></div>`).join('')}`)}
  function event(){
    if(arc.finished)return false;
    if(!player.eventHistory?.treeKnightSeen)return false;
    if(arc.stage===0){saveStage(1);return false}
    if(arc.stage===1){
      box('🌳 樹上騎士公會通知','你收到一封從樹上飄下來的信。\n\n「恭喜你曾經目擊樹上騎士。依照公會規章，你現在必須對此負責。」',[['接受臨時職務','accept','接受'],['只當目擊證人','witness','作證'],['直接爬上公會辦公室','climb','爬樹']]);return true
    }
    if(arc.stage===2&&!player.location.includes('村莊')){
      box('🌲 樹上騎士考核','騎士又從樹上掉下來，但這次他手上拿著考卷。\n\n第一題：騎士掉下來時，地面是否應該負責？',[['在落地前接住他','rescue','接住'],['稽核樹頂辦公室','audit','稽核'],['一起從樹上掉下來','fall','模仿']]);return true
    }
    if(arc.stage===3&&player.location.includes('村莊')){
      box('⚖️ 樹上騎士公會審判','村莊臨時委員會召開審判。\n\n罪名是：從樹上掉下來太過頻繁，造成村民對樹產生不必要的期待。',[['揭露樹頂辦公室','expose','揭露真相'],['替騎士辯護','defend','辯護'],['任命高空安全顧問','appoint','任命']]);return true
    }
    if(arc.stage===4&&player.location.includes('村莊')){
      box('🎬 樹上騎士大結局','審判結束後，騎士站到村口最高的樹枝上。\n\n他宣布：自己其實不是從樹上掉下來，而是一直在測試村民是否會抬頭。\n\n測試結果：只有你通過。',[['接受荒謬結局','close','完成支線']]);return true
    }
    return false
  }
  const oldObserve=window.observe,oldMove=window.move;
  window.observe=function(){if(enemy)return;if(event())return;oldObserve();if(player.eventHistory?.treeKnightSeen&&arc.stage===0){saveStage(1)}};
  window.move=function(to){oldMove(to);if(!enemy)event()};
})();
