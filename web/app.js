import { createMinimalWorld } from '../src/content/minimalWorld.js';
import { TextObserver } from '../src/presentation/textObserver.js';
import { labelOf } from '../src/presentation/labels.js';

const observer = new TextObserver();
let world = createMinimalWorld();
let timer = null;
const $ = id => document.getElementById(id);
const setInteractionBox = text => { const box = $('interaction-box'); if (box) box.textContent = text; };

function render() {
  const view = observer.describe(world);
  $('world-status').textContent = `${world.mode} · ${view.worldMinutes} 分鐘`;
  $('summary').innerHTML = `<div class="row"><span>世界</span><strong>${view.worldId}</strong></div><div class="row"><span>時間</span><strong>第 ${Math.floor(view.worldMinutes / 1440) + 1} 天 ${view.worldMinutes % 1440} 分</strong></div><div class="row"><span>版本</span><strong>${view.version}</strong></div><div class="row"><span>事件數</span><strong>${world.eventLog.events.length}</strong></div>`;
  $('entities').innerHTML = view.entities.map(entity => `<div class="entity"><strong>${entity.id}</strong> <span class="small">${labelOf(entity.type)}</span><br><span class="small">區域=${entity.zoneId === 'village' ? '村莊' : entity.zoneId === 'hunt' ? '狩獵區' : entity.zoneId ?? '-'} · 生命=${entity.hp ?? '-'} · 目標=${labelOf(entity.goal)}</span></div>`).join('');
  $('interactions').innerHTML = view.entities.filter(entity => entity.type === 'NPC' && entity.zoneId === 'village').map(entity => `<div class="row"><span>${entity.id}</span><span><button data-inspect="${entity.id}">查看</button><button data-talk="${entity.id}">交談</button><button data-request="${entity.id}">接受請求</button></span></div>`).join('') || '<span class="muted">目前沒有可交談的居民</span>';
  $('events').innerHTML = view.recentEvents.map(event => `<div class="event"><time>@${event.worldTime}</time>${labelOf(event.type)}</div>`).join('') || '<span class="muted">尚無事件</span>';
  $('toggle').textContent = world.mode === 'RUNNING' ? '暫停' : '啟動';
}

function tick() { if (world.mode === 'RUNNING') { world.step(); render(); } }
function restartTimer() { clearInterval(timer); timer = setInterval(tick, 500); }

$('toggle').addEventListener('click', () => { if (world.mode === 'RUNNING') world.pause(); else if (world.mode === 'PAUSED') world.resume(); else world.start(); render(); });
$('step').addEventListener('click', () => { if (world.mode === 'STOPPED') world.start(); world.pause(); world.step(); render(); });
$('reset').addEventListener('click', () => { world = createMinimalWorld(); render(); });
$('interactions').addEventListener('click', event => { const targetId = event.target.dataset.talk || event.target.dataset.inspect || event.target.dataset.request; if (!targetId) return; if (event.target.dataset.talk) setInteractionBox(world.talk('player', targetId).reply); else if (event.target.dataset.inspect) { const result = world.inspectResident(targetId); setInteractionBox(result.ok ? `${result.resident.name}｜職業：${result.resident.profession}｜個性：${result.resident.personality}｜背景：${result.resident.background}｜請求：${result.resident.request?.text ?? '目前沒有請求'}` : '無法查看這名居民。'); } else { const result = world.acceptResidentRequest('player', targetId); setInteractionBox(result.ok ? `已接受請求：${result.text}` : `無法接受：${result.reason}`); } render(); });
restartTimer(); render();
