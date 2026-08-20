(function(){
  const panel=document.querySelector('.explore');
  if(!panel)return;
  function refresh(){
    const village=player.location.includes('村莊');
    panel.innerHTML=`<div class="grid">${village
      ? '<button class="btn" onclick="village()">⚔️<br>村莊服務</button><button class="btn" onclick="inventory(false)">🎒<br>背包</button><button class="btn" onclick="status()">👤<br>角色</button><button class="btn" onclick="move(\'說話之島野外\')">🗺️<br>出村</button><button class="btn" onclick="inn()">🏨<br>旅館</button>'
      : '<button class="btn" onclick="observe()">👁️<br>探索</button><button class="btn" onclick="inventory(false)">🎒<br>背包</button><button class="btn" onclick="status()">👤<br>角色</button><button class="btn" onclick="move(\'說話之島村莊\')">🏘️<br>回村</button>'
    }</div>`;
  }
  const originalRender=window.render;
  window.render=function(){originalRender();refresh()};
  refresh();
})();
