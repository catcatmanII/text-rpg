(function(){
  if(typeof player==='undefined'||typeof observe!=='function')return;
  player.worldFlags=player.worldFlags||{};
  player.eventHistory=player.eventHistory||{};
  const originalObserve=window.observe;

  function record(key,value=true){player.worldFlags[key]=value;player.eventHistory[key]=(player.eventHistory[key]||0)+1;save();}
  function closeAnd(text,cls='good'){closeModal();msg(text,cls);render();}

  window.absurdChoice=function(choice){
    if(choice==='ask'){
      record('askedTreeKnight');
      add('redPotion',1);
      closeAnd('你：「為什麼你會從樹上掉下來？」\n\n騎士沉默了很久。\n「因為我在執行任務。」\n\n「什麼任務？」\n\n「不能告訴你。」\n\n他從口袋拿出一瓶紅色藥水塞給你，然後重新爬回樹上。\n\n獲得：紅色藥水 ×1\n世界紀錄：你問了不該問的問題。');
    }else if(choice==='respect'){
      record('respectedTreeKnight');
      player.exp+=3;
      closeAnd('你點點頭。\n「我不問。」\n\n騎士明顯鬆了一口氣。\n「謝謝。這年頭懂得尊重別人樹上隱私的人不多了。」\n\n他重新爬回樹上。\n\nEXP +3\n世界紀錄：你尊重樹上騎士的隱私。');
    }else if(choice==='climb'){
      record('climbedKnightTree');
      player.gold+=7;
      closeAnd('你無視騎士，直接爬上那棵樹。\n\n樹頂有一張桌子、兩張椅子，以及一個寫著「騎士公會第二辦公室」的木牌。\n\n桌上放著 7 枚金幣和一份報稅表。\n\n騎士在下面大喊：「那是公款！」\n\n你獲得 7 金幣。\n世界紀錄：你發現騎士公會在樹上設有辦公室。');
    }else if(choice==='imitate'){
      record('becameTreeKnightCandidate');
      player.exp+=5;
      closeAnd('你什麼也沒說，爬到另一棵樹上，然後故意摔下來。\n\n騎士盯著你。\n你也盯著騎士。\n\n過了很久，他鄭重地向你敬禮。\n「原來是同行。」\n\nEXP +5\n取得隱藏身分：樹上騎士候補。');
    }
  };

  function treeKnight(){
    open('🌳 樹上掉下來的騎士',`<p>你走進森林沒多久，一名全副武裝的騎士突然從樹上掉了下來。</p><p>他站起身，拍掉肩膀上的樹葉。</p><p><b>「不要問。」</b></p><div class="row"><span>非常合理地追問原因</span><button onclick="absurdChoice('ask')">問他</button></div><div class="row"><span>尊重陌生人的樹上隱私</span><button onclick="absurdChoice('respect')">不問</button></div><div class="row"><span>問題顯然在樹上</span><button onclick="absurdChoice('climb')">爬上去</button></div><div class="row"><span>用行動表示理解</span><button onclick="absurdChoice('imitate')">也從樹上掉下來</button></div>`);
  }

  window.observe=function(){
    if(enemy)return;
    if(player.location.includes('村莊'))return originalObserve();
    if(!player.eventHistory.treeKnightSeen&&Math.random()<0.45){
      player.eventHistory.treeKnightSeen=1;save();treeKnight();return;
    }
    originalObserve();
  };
})();
