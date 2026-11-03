(function initOnline(){
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initOnline,{once:true});return}
if(window.MQOnline)return;
const API='https://tablegame.jujuli.com.cn/api',KEY='mq-online-room-v3';
let user=null,room=null,timer=0,sending=false,fetching=false,connected=false,active=false,dialog=null,generation=0,endedRevision=-1;
let socket=null,reconnectTimer=0,retry=0,lastMessage=0,sequence=0;
const pending=new Map();
const monotonic=()=>typeof performance!=='undefined'?performance.now():Date.now();
let clockSample={server:Date.now(),local:monotonic()};
function sampleClock(next){clockSample={server:Number.isFinite(next.serverNow)?next.serverNow:Date.now(),local:monotonic()}}
function remainingTime(value,side,now){const base=value.remaining?.[side]??(value.timeMinutes||15)*60000;return Math.max(0,base-(value.status==='playing'&&value.turn===side&&Number.isFinite(value.turnStartedAt)?Math.max(0,now-value.turnStartedAt):0))}
function clockText(ms){const total=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0')}
function currentClock(){return clockSample.server+Math.max(0,monotonic()-clockSample.local)}
function renderClocks(){if(!room||mode!=='online')return;for(const side of ['r','b']){const el=document.getElementById('mqClock'+side.toUpperCase());if(!el)continue;const left=remainingTime(room,side,currentClock());el.querySelector('strong').textContent=clockText(left);el.classList.toggle('active',room.status==='playing'&&room.turn===side);el.classList.toggle('low',left<=60000)}}
window.MQClockRules={remainingTime,clockText};
const clockStyle=document.createElement('style');clockStyle.textContent='.mq-time-label{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-basis:100%;font-size:12px;color:#8a7d68}.mq-time-label select,.create-minutes{padding:8px 10px;border:1px solid #dcd5c7;background:#fffaf0;color:#302f2a;border-radius:10px;font:inherit}.mq-time-label select:disabled{opacity:.7}.mq-time-setup{display:flex;align-items:center;justify-content:space-between;margin:12px 0 18px}.mq-clocks{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex-basis:100%;width:100%}.mq-clock{padding:10px;border:1px solid #ded7c9;background:#fffaf077;border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px}.mq-clock strong{font:600 20px ui-monospace,monospace;letter-spacing:-1px;font-variant-numeric:tabular-nums}.mq-clock.active{border-color:#cf9259;background:#fff2df}.mq-clock.low strong{color:#ad4436}@media(min-width:1100px) and (min-aspect-ratio:6/5){.mq-clock{flex-direction:column;gap:4px;padding:9px 6px}}@media(max-width:1099px),(max-aspect-ratio:6/5){body[data-online="true"]:not(.immersive) .game-stage{width:min(100%,calc((100dvh - 300px)*.8125))}.mq-clocks{gap:6px}.mq-clock{padding:7px 10px}.mq-clock strong{font-size:19px}}';clockStyle.textContent+='body[data-online="true"].immersive .mq-room-bar{display:flex!important;position:fixed;z-index:30;top:12px;left:50%;transform:translateX(-50%);width:min(360px,calc(100vw - 30px));margin:0;padding:0}body[data-online="true"].immersive .mq-room-bar>:not(.mq-clocks){display:none!important}body[data-page="game"][data-online="true"].immersive #gameStage{width:min(calc((100dvh - 100px)*.8125),calc(100vw - 20px))}body[data-online="true"].immersive main.game-page{padding-top:72px}';document.head.append(clockStyle);
const invitation=new URL(location.href).searchParams.get('room');
let pendingInvite=/^[A-Fa-f0-9]{8}$/.test(invitation||'')?invitation.toUpperCase():null;
const style=document.createElement('style');style.textContent=`#onlineMode{opacity:1!important;cursor:pointer!important}.mq-auth{box-sizing:border-box;width:min(430px,calc(100vw - 32px));max-height:calc(100dvh - 36px);overflow:auto;border:0;border-radius:24px;padding:26px;background:#fffaf0;color:#302f2a;box-shadow:0 24px 80px #0003;font:14px Microsoft YaHei,system-ui}.mq-auth::backdrop{background:#0006}.mq-auth h2{margin:0 0 10px}.mq-auth p{color:#756d61;line-height:1.7;overflow-wrap:anywhere}.mq-auth input:not([type=checkbox]){box-sizing:border-box;width:100%;padding:14px;margin:6px 0;border:1px solid #ddd3c3;border-radius:12px;font:inherit}.mq-auth button{width:100%;padding:13px;margin-top:9px;border:0;border-radius:12px;font:inherit;font-weight:700;cursor:pointer}.mq-auth button:disabled{opacity:.5;cursor:wait}.mq-auth .main{background:#302f2a;color:white}.mq-auth .sub{background:#f1eadf}.mq-auth .err{color:#a33;min-height:20px}.mq-user{border:0;background:transparent;font:inherit;padding:10px;cursor:pointer;max-width:180px;overflow:hidden;text-overflow:ellipsis}.mq-room-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;font:13px Microsoft YaHei,system-ui;margin:0 0 14px}.mq-room-bar[hidden],.mq-room-bar button[hidden]{display:none}.mq-room-bar button{border:0;border-radius:10px;background:#eee8dd;padding:10px 14px;color:inherit;cursor:pointer;font:inherit}.mq-room-bar .ready{background:#302f2a;color:#fff}.mq-room-bar .seats{flex-basis:100%;line-height:1.8;color:#8a7d68}.mq-code-preview{font-size:28px;font-weight:700;letter-spacing:5px;text-align:center;padding:20px;background:#f1eadf;border-radius:14px;margin:15px 0}.mq-auth details{margin-top:15px}.mq-auth summary{cursor:pointer;color:#8a7d68}.mq-auth .invite-link{font-size:12px;letter-spacing:0;word-break:break-all}.mq-room-bar{width:min(100%,680px);flex-shrink:0}.mq-room-bar .room-title{overflow-wrap:anywhere}.mq-room-bar .seats{overflow-wrap:anywhere}body.immersive .mq-room-bar{display:none}@media(min-width:1100px) and (min-aspect-ratio:6/5){.mq-room-bar{grid-column:1;grid-row:1;align-self:start;justify-self:end;width:min(100%,220px);margin:250px 0 0;padding:0 6px;justify-content:flex-start;gap:10px}.mq-room-bar .room-title{flex-basis:100%}.mq-room-bar .seats{font-size:12px}}@media(max-width:1099px),(max-aspect-ratio:6/5){body[data-online="true"]:not(.immersive) .game-stage{width:min(100%,calc((100dvh - 235px)*.8125))}.mq-room-bar{padding:0 6px;margin-bottom:8px;font-size:12px}.mq-room-bar button{padding:8px 12px}.mq-room-bar .seats{font-size:11px}}`;document.head.append(style);
async function api(path,data,signal){const controller=new AbortController(),cancel=()=>controller.abort(),timeout=setTimeout(cancel,12000);if(signal){if(signal.aborted)cancel();else signal.addEventListener('abort',cancel,{once:true})}try{const r=await fetch(API+path,{credentials:'include',cache:'no-store',signal:controller.signal,...(data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});let result;try{result=await r.json()}catch{throw Error('服务连接失败，请稍后重试')}if(!r.ok){const e=Error(result.error||'网络请求失败');e.status=r.status;throw e}return result}finally{clearTimeout(timeout);signal?.removeEventListener('abort',cancel)}}
function modal(title,html){dialog?.close();dialog?.remove();const d=document.createElement('dialog');d.className='mq-auth';d.innerHTML='<h2></h2>'+html;d.querySelector('h2').textContent=title;document.body.append(d);dialog=d;d.addEventListener('close',()=>{if(dialog===d)dialog=null;d.remove()});d.showModal();return d}
function error(d,e){const el=d.querySelector('.err');if(el)el.textContent=e.name==='AbortError'?'连接超时，请重试':e.message}
function renderUser(){
 window.dispatchEvent(new CustomEvent('mq-auth',{detail:{user}}));
 const letter=document.getElementById('avatarLetter');if(letter)letter.textContent=user?(user.username||'棋').trim().slice(0,1).toUpperCase():'铭';
 const name=document.getElementById('profileName'),hint=document.getElementById('profileHint'),loginButton=document.getElementById('profileLogin'),logoutButton=document.getElementById('profileLogout');
 if(name)name.textContent=user?user.username:'尚未登录';
 if(hint)hint.textContent=user?'聚聚里桌游统一账号 · 已登录':'登录后可在妙棋手与桌游大厅使用同一账号';
 if(loginButton)loginButton.hidden=!!user;
 if(logoutButton)logoutButton.hidden=!user;
}
function login(after){
 const d=modal('登录妙棋手','<p>与桌游大厅共用一个账号。'+(pendingInvite?'登录后直接进入好友的房间。':'')+'</p><form><input name="username" autocomplete="username" placeholder="用户名或邮箱" required maxlength="254"><input name="password" autocomplete="current-password" type="password" placeholder="密码（至少10位）" minlength="10" required><div class="err" role="alert"></div><button class="main" type="submit">登录</button><button class="sub register" type="button">注册新账号</button><button class="sub cancel" type="button">取消</button></form>');
 const form=d.querySelector('form'),memory=window.GameAccounts?.mount(form,form.elements.username,form.elements.password);let submitting=false;
 async function submit(kind){if(submitting||!form.reportValidity())return;submitting=true;d.querySelectorAll('button').forEach(b=>b.disabled=true);try{user=(await api('/'+kind,{username:form.elements.username.value,password:form.elements.password.value})).user;memory?.remember(user);d.close();renderUser();after?.()}catch(e){error(d,e)}finally{submitting=false;d.querySelectorAll('button').forEach(b=>b.disabled=false)}}
 form.onsubmit=e=>{e.preventDefault();submit('login')};d.querySelector('.register').onclick=()=>submit('register');d.querySelector('.cancel').onclick=()=>{if(pendingInvite)leaveInvite();else d.close()};
}
async function logout(){
 try{await api('/logout',{});suspend();room=null;user=null;localStorage.removeItem(KEY);navigator.credentials?.preventSilentAccess?.().catch(()=>{});if(mode==='online'){mode=draftMode='ai';reset();navigate('home')}renderUser()}
 catch(e){toast(e.message)}
}
function remember(){try{localStorage.setItem(KEY,JSON.stringify({code:room.code,user:user.id}))}catch{}const url=new URL(location.href);url.searchParams.set('room',room.code);window.history.replaceState(null,'',url)}
function randomCode(){return Array.from(crypto.getRandomValues(new Uint8Array(4)),x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
function installRoom(next){suspend();room=next;connected=true;active=true;pendingInvite=null;sampleClock(room);remember();dialog?.close();enterGame();connectSocket();schedule()}
let inviteAttempt=0,inviteController=null;
function clearInvite(){
 inviteAttempt++;inviteController?.abort();inviteController=null;pendingInvite=null;
 const url=new URL(location.href);url.searchParams.delete('room');window.history.replaceState(null,'',url);
 try{localStorage.removeItem(KEY)}catch{}
}
function leaveInvite(lobby=false){clearInvite();dialog?.close();if(mode==='online'){suspend();mode=draftMode='ai'}navigate('home');if(lobby)open()}
async function joinInvite(code){
 if(!user)return login(()=>joinInvite(code));
 const attempt=++inviteAttempt;inviteController?.abort();const controller=new AbortController();inviteController=controller;
 const d=modal('正在进入好友房间','<p class="reason" role="status">正在连接房间，请稍候…</p><button class="main" disabled>连接中…</button><button class="sub">返回联机大厅</button><button class="home sub">先玩单机</button>');
 d.setAttribute('aria-busy','true');
 d.querySelector('.sub').onclick=()=>leaveInvite(true);d.querySelector('.home').onclick=()=>leaveInvite();
 d.addEventListener('cancel',e=>{e.preventDefault();leaveInvite()});
 try{
  const next=await api('/chess/rooms/'+code,{type:'join'},controller.signal);
  if(attempt!==inviteAttempt||!d.open)return;
  installRoom(next);
 }catch(e){
  if(attempt!==inviteAttempt||!d.open)return;
  d.removeAttribute('aria-busy');
  const terminal=[404,410].includes(e.status),needsLogin=e.status===401;
  d.querySelector('h2').textContent=terminal?'这个房间已失效':needsLogin?'请重新登录':'暂时无法进入房间';
  d.querySelector('.reason').textContent=terminal?'房间已关闭或不存在，请让好友重新发送邀请，或创建一个新房间。':needsLogin?'登录状态已过期，重新登录后即可再次进入。':e.name==='AbortError'?'连接超时，请检查网络后重试，也可以先玩单机。':e instanceof TypeError?'网络连接失败，请检查网络后重试。':e.message;
  const retry=d.querySelector('.main');retry.disabled=false;retry.hidden=terminal;retry.textContent=needsLogin?'重新登录':'重新尝试';
  retry.onclick=()=>{if(needsLogin){user=null;renderUser();return login(()=>joinInvite(code))}return joinInvite(code)};
 }finally{if(inviteController===controller)inviteController=null}
}
function open(){
 if(pendingInvite)return joinInvite(pendingInvite);
 if(!user)return login(open);
 let code=randomCode();
 const d=modal('创建好友房间',`<p>房间号已自动生成。创建后分享给好友，双方准备后开局。</p><div class="mq-code-preview"></div><label class="mq-time-setup">每方用时<select class="create-minutes" aria-label="创建房间每方用时"><option value="10">10分钟</option><option value="15" selected>15分钟</option><option value="20">20分钟</option><option value="30">30分钟</option></select></label><button class="main create">确认创建</button>${room?'<button class="sub resume">返回当前房间</button>':''}<details><summary>已有房间号？</summary><input class="code" maxlength="8" placeholder="输入房间码" aria-label="房间码"><button class="sub join">加入房间</button></details><div class="err" role="alert"></div><button class="sub cancel">取消</button>`);
 d.querySelector('.mq-code-preview').textContent=code;d.querySelector('.create-minutes').value='15';let submitting=false;
 async function enter(path,data){if(submitting)return;submitting=true;d.querySelectorAll('button').forEach(b=>b.disabled=true);try{installRoom(await api(path,data))}catch(e){error(d,e);if(e.status===409&&path==='/chess/rooms'){code=randomCode();d.querySelector('.mq-code-preview').textContent=code;d.querySelector('.err').textContent='刚才的房间号已被使用，已重新生成，请再次确认创建。'}}finally{submitting=false;d.querySelectorAll('button').forEach(b=>b.disabled=false)}}
 d.querySelector('.create').onclick=()=>enter('/chess/rooms',{code,minutes:Number(d.querySelector('.create-minutes').value)});
 d.querySelector('.join').onclick=()=>{const value=d.querySelector('.code').value.trim().toUpperCase();if(!/^[A-F0-9]{8}$/.test(value)){error(d,Error('请输入正确的 8 位房间码'));return}enter('/chess/rooms/'+value,{type:'join'})};
 d.querySelector('.resume')?.addEventListener('click',()=>{d.close();active=true;connected=false;enterGame();connectSocket();sync()});d.querySelector('.cancel').onclick=()=>d.close();
}
function inviteLink(){const url=new URL('/',location.origin);url.searchParams.set('room',room.code);url.hash='game';return url.href}
async function copyLink(d){try{await navigator.clipboard.writeText(inviteLink());if(d)d.querySelector('.err').textContent='邀请链接已复制，发给好友即可。';else toast('邀请链接已复制');return true}catch{if(d)d.querySelector('.err').textContent='请长按上方链接复制，发送给好友。';else toast('请打开分享房间查看邀请链接');return false}}
function shareRoom(){if(!room)return;const d=modal('邀请好友入座','<p>好友点击链接即可进入房间；未登录时先登录，然后点击准备。</p><input class="invite-link" aria-label="房间邀请链接" readonly><button class="main wechat">分享到微信</button><button class="sub copy">复制邀请链接</button><p class="share-tip"></p><div class="err" role="status"></div><button class="sub cancel">返回棋局</button>');d.querySelector('input').value=inviteLink();d.querySelector('.share-tip').textContent=/MicroMessenger/i.test(navigator.userAgent)?'在微信中可点击右上角“…”转发给朋友或群聊。':'点击分享到微信，在系统分享面板中选择微信；如未显示微信，可复制链接后发送。';d.querySelector('.wechat').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'妙棋手 · 邀请你来一局',text:'点击入座，双方准备后开始对弈。',url:inviteLink()});return}catch(e){if(e.name==='AbortError')return}}const copied=await copyLink(d);d.querySelector('.share-tip').textContent=copied?'请粘贴到微信发送；好友点击链接即可入座。':'请长按邀请链接复制，再发送到微信。'};d.querySelector('.copy').onclick=()=>copyLink(d);d.querySelector('.cancel').onclick=()=>d.close()}
function suspend(){closePreparation();preparationDismissed=null;document.getElementById('mqRoomBar')?.setAttribute('hidden','');const top=document.querySelector('.board-heading small'),bottom=document.querySelector('.board-footer small');if(top)top.textContent='山隐 · 棋友';if(bottom)bottom.textContent='你执红 · 先手';active=false;generation++;try{localStorage.removeItem(KEY)}catch{}clearTimeout(timer);clearTimeout(reconnectTimer);const old=socket;socket=null;old?.close();for(const p of pending.values()){clearTimeout(p.timeout);p.reject(Error('已离开房间'))}pending.clear();connected=false;selected=null;const url=new URL(location.href);url.searchParams.delete('room');window.history.replaceState(null,'',url)}
function enterGame(){preparationDismissed=null;if($('resultDialog').open)$('resultDialog').close();remember();epoch++;cancelComputer();busy=false;mode=draftMode='online';flipped=room.side==='b';drawAgreed=room.winner==='draw';resignedSide=room.winner&&room.winner!=='draw'?(room.winner==='r'?'b':'r'):null;selected=null;ended=false;endedRevision=-1;applyRoom();navigate('game');render();toast('房间 '+room.code+' · 你执'+(room.side==='r'?'红':'黑'))}
function applyRoom(){if(!room||!active||mode!=='online')return;board=room.board.map(row=>row.slice());turn=room.turn;last=room.last;let replay=XQ.initial();history=(room.moves||[]).map((m,i)=>{const snapshot=replay;replay=XQ.play(replay,m);return {board:snapshot,turn:i%2?'b':'r',label:`${i%2?'墨':'朱'} · ${XQ.names[m.piece[0]][m.piece[1]]} ${m.x+1},${m.y+1} → ${m.X+1},${m.Y+1}${m.captured?' · 吃子':''}`}});legal=XQ.moves(board,turn);ended=room.status==='ended';drawAgreed=room.winner==='draw';resignedSide=ended&&!drawAgreed?(room.winner==='r'?'b':'r'):null;selected=null;draw();if(ended)window.MQRecords?.onlineFinished(room);if(ended&&endedRevision!==room.revision){endedRevision=room.revision;dialog?.close();if(pageView==='game')showResult()}}
// One persistent preparation dialog, updated in place as room state arrives.
let preparation=null,preparationDismissed=null,preparationError='';
function closePreparation(){if(preparation?.open)preparation.close();}
function dismissPreparation(){preparationDismissed=room?.code;closePreparation();}
function ensurePreparation(){
 if(preparation)return preparation;
 const d=document.createElement('dialog');d.className='mq-preparation';d.setAttribute('aria-labelledby','mqPrepTitle');
 d.innerHTML=`<div class="prep-heading"><div><p class="prep-eyebrow">好友对战</p><h2 id="mqPrepTitle">对局准备</h2></div><button class="prep-close" type="button" aria-label="收起对局准备">×</button></div>
 <div class="prep-room"><span class="prep-code"></span><span class="prep-connection" role="status"></span></div>
 <div class="prep-players"><div class="prep-player" data-side="r"><span class="prep-piece" aria-hidden="true">帅</span><strong class="prep-name"></strong><span class="prep-state"></span></div><div class="prep-player" data-side="b"><span class="prep-piece" aria-hidden="true">将</span><strong class="prep-name"></strong><span class="prep-state"></span></div></div>
 <label class="prep-time"><span>每方用时<small class="prep-time-note"></small></span><select class="prep-minutes" aria-label="房间每方用时"><option value="10">10分钟</option><option value="15">15分钟</option><option value="20">20分钟</option><option value="30">30分钟</option></select></label>
 <p class="prep-help" aria-live="polite"></p><p class="prep-error" role="alert" hidden></p><div class="prep-actions"><button class="prep-share" type="button">邀请好友</button><button class="prep-ready" type="button">准备好了</button></div><button class="prep-peek" type="button">先看看棋盘</button>`;
 document.body.append(d);preparation=d;
 d.querySelector('.prep-close').onclick=d.querySelector('.prep-peek').onclick=dismissPreparation;
 d.addEventListener('cancel',event=>{event.preventDefault();dismissPreparation()});
 d.querySelector('.prep-share').onclick=shareRoom;
 d.querySelector('.prep-minutes').onchange=()=>{if(room?.status==='waiting')action('setTime',{minutes:Number(d.querySelector('.prep-minutes').value)})};
 d.querySelector('.prep-ready').onclick=()=>{if(room?.status==='waiting')action('ready',{ready:!room.players.find(p=>p.id===user?.id)?.ready})};
 return d;
}
function renderPreparation(){
 if(!active||mode!=='online'||!room||pageView!=='game'){closePreparation();return}
 const d=ensurePreparation(),waiting=room.status==='waiting';
 if(d.dataset.room!==room.code){closePreparation();d.dataset.room=room.code;preparationDismissed=null;preparationError='';}
 if(d.dataset.phase==='waiting'&&!waiting)closePreparation();
 d.dataset.phase=room.status;d.querySelector('#mqPrepTitle').textContent=waiting?'对局准备':'房间信息';d.querySelector('.prep-error').textContent=preparationError;d.querySelector('.prep-error').hidden=!preparationError;
 d.querySelector('.prep-code').textContent='房间 '+room.code;
 d.querySelector('.prep-connection').textContent=connected?'已连接':'正在重连…';
 d.querySelector('.prep-connection').classList.toggle('offline',!connected);
 for(const side of ['r','b']){
  const player=room.players.find(p=>p.side===side),card=d.querySelector('[data-side="'+side+'"]');
  card.querySelector('.prep-name').textContent=player?(player.id===user?.id?'你 · '+player.username:player.username):'等待好友入座';
  card.querySelector('.prep-state').textContent=!player?'分享链接邀请好友':!waiting?(room.status==='ended'?'对局结束':'对局中'):player.ready?'已准备':'未准备';
  card.classList.toggle('is-ready',!!player?.ready&&waiting);card.classList.toggle('is-empty',!player);
 }
 const select=d.querySelector('.prep-minutes'),self=room.players.find(p=>p.id===user?.id),opponent=room.players.find(p=>p.side!==room.side);
 select.value=String(room.timeMinutes||15);select.disabled=!waiting||sending||!connected||room.owner!==user?.id;
 d.querySelector('.prep-time-note').textContent=!waiting?'本局时间已锁定':room.owner===user?.id?'调整用时后，双方需重新准备':'由房主设置';
 const ready=d.querySelector('.prep-ready');ready.hidden=!waiting;ready.disabled=sending||!connected;
 ready.textContent=sending?'正在同步…':self?.ready?'取消准备':'准备好了';
 d.querySelector('.prep-share').textContent=waiting?'邀请好友':'分享房间';
 d.querySelector('.prep-peek').textContent=waiting?'先看看棋盘':'返回棋局';
 d.querySelector('.prep-help').textContent=!connected?'连接恢复后自动同步，请稍候。':!waiting?(room.status==='ended'?'本局已结束。':'对局已开始，祝你落子从容。'):!opponent?'好友点击邀请链接入座，双方准备后自动开局。':self?.ready?'你已准备好，等待好友准备。':'双方都准备好后，对局自动开始。';
 if(waiting&&!d.open&&preparationDismissed!==room.code&&!dialog?.open)d.showModal();
}
function showPreparation(){
 if(!active||!room||mode!=='online'||pageView!=='game')return;
 $('gameMore').open=false;renderPreparation();const d=ensurePreparation();if(!d.open)d.showModal();
}
const preparationStyle=document.createElement('style');preparationStyle.textContent=`
.mq-preparation{box-sizing:border-box;width:min(460px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;margin:auto;padding:28px;border:1px solid #ddd3c2;border-radius:24px;background:#fffaf1;color:#302f2a;box-shadow:0 24px 80px #30271626;font:14px/1.5 "Microsoft YaHei","PingFang SC",system-ui,sans-serif;letter-spacing:0}
.mq-preparation::backdrop{background:#302b2359;backdrop-filter:blur(5px)}
.mq-preparation button,.mq-preparation select{font:inherit;letter-spacing:0}
.prep-heading{display:flex;justify-content:space-between;align-items:center;gap:16px}.prep-eyebrow{margin:0 0 4px;color:#a57548;font-size:11px}.mq-preparation h2{margin:0;font-size:24px;font-weight:600}.prep-close{width:36px;height:36px;border:0;border-radius:50%;background:#f1eadf;color:#8a7b68;font-size:23px!important;flex-shrink:0;line-height:1}
.prep-room{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:20px 0;color:#8b7f6c;font-size:12px}.prep-code{font-variant-numeric:tabular-nums;letter-spacing:1px}.prep-connection{display:flex;align-items:center;gap:5px;font-size:11px}.prep-connection::before{content:'';width:5px;height:5px;border-radius:50%;background:#718469}.prep-connection.offline::before{background:#c28948}
.prep-players{display:grid;grid-template-columns:1fr 1fr;gap:12px}.prep-player{display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0;gap:10px;padding:22px 10px 17px;border:1px solid #e4dccc;border-radius:17px;background:#f6f0e6}.prep-player.is-empty{border-style:dashed;background:transparent}.prep-piece{display:grid;place-items:center;width:48px;height:48px;border:1.5px solid #a95a39;border-radius:50%;background:#ffedd6;box-shadow:0 3px 0 #e7d3b6;color:#a95a39;font-size:27px;font-weight:600}.prep-player[data-side=b] .prep-piece{border-color:#545d58;color:#545d58;background:#efeee5}.prep-name{max-width:100%;min-height:21px;font-size:13px;font-weight:500;overflow-wrap:anywhere}.prep-state{font-size:11px;color:#9a8c77}.is-ready .prep-state{color:#66805c}.is-empty .prep-piece{opacity:.35}
.prep-time{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:24px 0 0;padding:0 0 20px;border-bottom:1px solid #e9e0d1}.prep-time-note{display:block;font-size:10px;color:#a29581;margin-top:5px}.prep-minutes{padding:9px 11px;border:1px solid #dcd2c1;border-radius:10px;background:#fffdf7;color:#453f35;max-width:120px}.prep-minutes:disabled{color:#887e6d;opacity:.8;cursor:default}.prep-help{margin:18px 0;color:#8b7c67;font-size:12px;line-height:1.8}.prep-error{color:#a14d3d;font-size:12px;margin:0 0 12px}.prep-actions{display:flex;gap:10px}.prep-actions button{flex:1;min-height:45px;padding:10px;border:0;border-radius:12px;font-weight:600}.prep-share{background:#f0e8da;color:#6f624e}.prep-ready{background:#e9984c;color:#302f2a}.prep-ready:disabled{opacity:.5;cursor:wait}.prep-peek{display:block;margin:12px auto 0;padding:6px 12px;color:#9a8b75;font-size:11px!important}.mq-preparation [hidden]{display:none!important}
.mq-room-bar .room-title{flex:1;font-size:12px;color:#8a7d68}.mq-room-bar .room-prepare{padding:8px 10px;background:#f3eadc;font-size:11px}.mq-room-bar .mq-clocks[hidden]{display:none}
body[data-online=true][data-room-state=waiting] .game-mode{visibility:hidden}
@media(max-width:1099px),(max-aspect-ratio:6/5){body[data-online=true]:not(.immersive) .game-stage{width:min(100%,calc((100dvh - 220px)*.8125))}body[data-online=true][data-room-state=waiting]:not(.immersive) .game-stage{width:min(100%,calc((100dvh - 175px)*.8125))}.mq-room-bar{margin-bottom:8px;gap:6px}}
@media(max-width:480px){.mq-preparation{padding:22px}.prep-player{padding:18px 8px 14px}.mq-preparation h2{font-size:22px}}
`;document.head.append(preparationStyle);

function render(){
 let bar=document.getElementById('mqRoomBar');
 if(!bar){
  bar=document.createElement('div');bar.id='mqRoomBar';bar.className='mq-room-bar';
  bar.innerHTML='<span class="room-title"></span><button class="room-prepare" type="button">对局准备</button><div class="mq-clocks"><div class="mq-clock" id="mqClockR" aria-label="红方剩余用时"><span>红方</span><strong>15:00</strong></div><div class="mq-clock" id="mqClockB" aria-label="黑方剩余用时"><span>黑方</span><strong>15:00</strong></div></div>';
  document.querySelector('.game-nav')?.insertAdjacentElement('afterend',bar);bar.querySelector('.room-prepare').onclick=showPreparation;
 }
 const online=active&&mode==='online'&&!!room;
 bar.hidden=!online;document.body.dataset.online=String(online);document.body.dataset.roomState=online?room.status:'';
 let info=document.getElementById('mqRoomInfo');
 if(!info){info=document.createElement('button');info.id='mqRoomInfo';info.type='button';info.textContent='房间信息';info.onclick=showPreparation;document.querySelector('#gameMore .more-panel')?.prepend(info)}
 info.hidden=!online;
 if(!online){closePreparation();return}
 const opponent=room.players.find(p=>p.side!==room.side),self=room.players.find(p=>p.side===room.side),waiting=room.status==='waiting';
 bar.querySelector('.room-title').hidden=!waiting;bar.querySelector('.room-title').textContent='好友对战';
 bar.querySelector('.room-prepare').hidden=!waiting;bar.querySelector('.mq-clocks').hidden=waiting;renderClocks();
 $('opponent').textContent=opponent?opponent.username:'等待好友加入';$('undo').disabled=true;$('offerDraw').disabled=ended||sending||!connected||room.status!=='playing'||!!room.drawOffer;$('resign').disabled=ended||sending||!connected||waiting;
 $('status').textContent=ended?(room.winner==='draw'?'和棋 · 双方同意':room.winner===room.side?'你赢得了本局':'对手赢得了本局'):!connected?'连接中，正在恢复…':waiting?(!opponent?'等待好友入座':self?.ready?'已准备，等待好友':'点击准备，开始对弈'):sending?'落子确认中…':turn===room.side?'轮到你落子':'等待对手落子';
 $('hint').textContent=ended?(room.endReason==='timeout'?(room.winner==='r'?'黑方':'红方')+'用时耗尽，超时判负':'本局结束，可以创建新房间'):!connected?'网络恢复后自动同步棋局':waiting?'双方都点击准备后，自动开始对局':room.drawOffer?(room.drawOffer===room.side?'已向对手发出求和请求':'对手请求和棋，请确认'):XQ.check(board,turn)?'将军！请先解将':selected?'选择亮起的位置落子':turn===room.side?'轻触棋子，查看可行之处':'对手正在思考';
 const top=document.querySelector('.board-heading small'),bottom=document.querySelector('.board-footer small');if(top)top.textContent=room.players.find(p=>p.side==='b')?.username||'等待加入';if(bottom)bottom.textContent=(room.players.find(p=>p.side==='r')?.username||'')+' · 红方先手';$('continueGame').hidden=ended;
 renderPreparation();
}
function checkDraw(){if(!active||pageView!=='game'||!room||ended)return;if(room.drawOffer&&room.drawOffer!==room.side){if(dialog?.dataset.drawRevision===String(room.revision))return;const d=modal('对手提议和棋','<p>同意后本局以和棋结束；拒绝则继续对弈。</p><button class="main">同意和棋</button><button class="sub">继续对弈</button>');d.dataset.drawRevision=room.revision;d.querySelector('.main').onclick=()=>{d.close();action('acceptDraw')};d.querySelector('.sub').onclick=()=>{d.close();action('declineDraw')};d.addEventListener('cancel',e=>{e.preventDefault();d.close();action('declineDraw')})}else if(dialog?.dataset.drawRevision)dialog.close()}
function acceptState(next,force=false){if(!active||!room||next.code!==room.code||next.revision<room.revision)return;const changed=next.revision!==room.revision;room=next;sampleClock(next);connected=true;if(changed||force)applyRoom();else render();if(room.status==='ended')window.MQRecords?.onlineFinished(room);checkDraw()}
function schedule(delay=socket?.readyState===1?20000:1400){clearTimeout(timer);if(active)timer=setTimeout(sync,delay)}
function connectSocket(){
 clearTimeout(reconnectTimer);if(!active||!room||socket?.readyState===0||socket?.readyState===1)return;
 const g=generation,code=room.code;let ws;try{ws=new WebSocket(API.replace(/^https:/,'wss:')+'/chess/rooms/'+code+'/socket')}catch{schedule();return}socket=ws;
 ws.onmessage=event=>{if(socket!==ws||g!==generation)return;lastMessage=Date.now();let data;try{data=JSON.parse(event.data)}catch{return}const p=pending.get(data.requestId);if(p){pending.delete(data.requestId);clearTimeout(p.timeout)}if(data.type==='state'){retry=0;acceptState(data.room,!!p);p?.resolve(data.room)}else if(data.type==='error'){const e=Object.assign(Error(data.error),{status:data.status});p?.reject(e);if(data.status===401){connected=false;user=null;renderUser();toast('登录已过期，请重新登录');suspend();render()}}schedule()};
 ws.onopen=()=>{lastMessage=Date.now();schedule()};
 ws.onclose=()=>{if(socket!==ws||g!==generation)return;socket=null;connected=false;for(const p of pending.values()){clearTimeout(p.timeout);p.reject(Error('连接已中断，正在同步棋局'))}pending.clear();if(active){render();schedule(50);reconnectTimer=setTimeout(connectSocket,Math.min(16000,1000*2**retry++))}};
 ws.onerror=()=>{try{ws.close()}catch{}};
}
function socketAction(value){return new Promise((resolve,reject)=>{const id=generation+'-'+(++sequence);const timeout=setTimeout(()=>{pending.delete(id);reject(Error('同步超时，正在核对棋局'));socket?.close()},8000);pending.set(id,{resolve,reject,timeout});try{socket.send(JSON.stringify({type:'action',requestId:id,action:value}))}catch(e){clearTimeout(timeout);pending.delete(id);reject(e)}})}
async function sync(){
 if(!active||!room)return;
 if(socket?.readyState===1){if(Date.now()-lastMessage>45000){socket.close();return}try{socket.send(JSON.stringify({type:'sync'}))}catch{socket.close()}schedule();return}
 if(sending||fetching){schedule();return}
 const g=generation,code=room.code;fetching=true;try{const next=await api('/chess/rooms/'+code);if(g!==generation||!active||sending)return;acceptState(next);if(!socket)connectSocket()}catch(e){if(g!==generation)return;connected=false;selected=null;render();if([401,404,410].includes(e.status)){suspend();toast(e.message);if(e.status===401){user=null;renderUser()}try{localStorage.removeItem(KEY)}catch{}}}finally{fetching=false;if(g===generation)schedule(connected?1400:5000)}
}
async function action(type,extra={}){
 if(!active||!room||sending||!connected)return;
 if(type==='ready'||type==='setTime')preparationError='';
 const g=generation,value={type,revision:room.revision,...extra};clearTimeout(timer);sending=true;
 if(type==='move'){board=XQ.play(room.board,extra);turn=room.turn==='r'?'b':'r';last=extra;selected=null;legal=[];audio();draw()}else render();
 try{const next=socket?.readyState===1?await socketAction(value):await api('/chess/rooms/'+room.code,value);if(g!==generation)return;acceptState(next,true)}catch(e){if(g!==generation)return;if(type==='ready'||type==='setTime')preparationError=e.name==='AbortError'?'提交超时，请稍后重试':e.message;applyRoom();toast(e.name==='AbortError'?'提交超时，正在核对棋局':e.message);if(e.status===401){user=null;renderUser();suspend()}else if(socket?.readyState===1)socket.send(JSON.stringify({type:'sync'}));else connected=false}finally{sending=false;render();if(g===generation)schedule(socket?.readyState===1?20000:10)}
}
function confirmation(title,type){if(!active||ended)return;const d=modal(title,'<p>操作将同步给对手。</p><button class="main">确认</button><button class="sub">取消</button>');d.querySelector('.main').onclick=()=>{d.close();action(type)};d.querySelector('.sub').onclick=()=>d.close()}
document.getElementById('profileLogin')?.addEventListener('click',()=>login(pendingInvite?()=>joinInvite(pendingInvite):undefined));
document.getElementById('profileLogout')?.addEventListener('click',logout);
window.MQOnline={getUser:()=>user,open,suspend,render,shareRoom,canMove:()=>active&&connected&&!sending&&room?.status==='playing'&&room.side===room.turn&&remainingTime(room,room.side,currentClock())>0,move:m=>action('move',m),offerDraw:()=>confirmation('向对手提议和棋？','offerDraw'),resign:()=>confirmation('确认认输？','resign')};
setInterval(renderClocks,200);
const button=$('onlineMode');if(button){button.disabled=false;button.removeAttribute('title');button.setAttribute('aria-label','联机对战');button.querySelector('small').textContent='好友对战';button.onclick=()=>{draftMode='online';draw();open()}}
window.addEventListener('online',()=>{if(active){connectSocket();sync()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active){connectSocket();sync()}});
window.addEventListener('hashchange',()=>{if(mode==='online'&&active){render();checkDraw()}});
(async()=>{try{
 user=(await api('/me')).user;renderUser();
 if(pendingInvite){if(dialog?.open)return;if(user)await joinInvite(pendingInvite);else login(()=>joinInvite(pendingInvite));return}
 if(!user)return;let saved;try{saved=JSON.parse(localStorage.getItem(KEY))}catch{}if(saved?.user!==user.id||!saved?.code)return;
 // A remembered room is an explicit resume action, never a fresh-entry redirect.
 const b=$('continueGame');b.hidden=false;b.textContent='返回联机房间 →';
 b.onclick=async()=>{
  if(b.disabled)return;b.disabled=true;
  try{installRoom(await api('/chess/rooms/'+saved.code))}
  catch(e){toast(e.name==='AbortError'?'连接超时，请重试':e.message);if([404,410].includes(e.status)){try{localStorage.removeItem(KEY)}catch{}b.hidden=true}}
  finally{b.disabled=false}
 };
}catch{renderUser();if(pendingInvite&&!dialog?.open){const d=modal('邀请房间连接中断','<p>请检查网络后重试，邀请信息已保留。</p><button class="main">重试进入房间</button><button class="sub">先玩单机</button>');d.querySelector('.sub').onclick=()=>leaveInvite();d.querySelector('.main').onclick=()=>{if(user)joinInvite(pendingInvite);else login(()=>joinInvite(pendingInvite))}}}})();
})();


