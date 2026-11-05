(function(root){
'use strict';
const names=['李大福','岳青山','陆行舟','沈知远','顾长风','林望川','何松年','孟星河','江照野','周观棋','许东来','唐见山','陈少游','方听澜','魏向北'];
const titles=['稳守反击','中路争先','双马争锋','步步为营','车炮联攻'];
function shuffle(a,rng=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function create(owner,name,rng=Math.random){const players=[{id:'you',name:name||'你',human:true,rating:2150},...names.map((name,i)=>({id:'bot-'+i,name,rating:1920+i*25,title:titles[i%5],style:['solid','active','flank'][i%3],level:6,art:['bk','bh','br','bc'][i%4]}))];const seeds=shuffle(players.map(p=>p.id),rng);return {version:1,id:'masters-'+Date.now()+'-'+Math.floor(rng()*1e8),owner,createdAt:Date.now(),players,rounds:[Array.from({length:8},(_,i)=>({id:'r0-m'+i,a:seeds[i*2],b:seeds[i*2+1],winner:null,draws:0}))],status:'playing',champion:null,game:null,attempt:null,wins:0}}
function player(t,id){return t.players.find(p=>p.id===id)}
function nextMatch(t){if(t.status!=='playing')return null;return t.rounds.at(-1).find(m=>(m.a==='you'||m.b==='you')&&!m.winner)||null}
function simulate(t,m,rng){const a=player(t,m.a),b=player(t,m.b);m.winner=rng()<1/(1+10**((b.rating-a.rating)/400))?m.a:m.b;m.simulated=true}
function advance(t){const round=t.rounds.at(-1);if(!round.every(m=>m.winner))return;if(round.length===1){t.champion=round[0].winner;t.status=t.champion==='you'?'champion':'eliminated';t.completedAt=Date.now();return}const winners=round.map(m=>m.winner),r=t.rounds.length;t.rounds.push(Array.from({length:winners.length/2},(_,i)=>({id:'r'+r+'-m'+i,a:winners[i*2],b:winners[i*2+1],winner:null,draws:0})))}
function begin(t,gameId){const m=nextMatch(t);if(!m)throw Error('没有可进行的比赛');t.attempt={matchId:m.id,gameId,settled:false};return m}
function settle(t,gameId,outcome,rng=Math.random){const a=t.attempt,m=nextMatch(t);if(!a||a.gameId!==gameId||a.settled||!m||m.id!==a.matchId)return false;if(!['win','loss','draw'].includes(outcome))throw Error('无效赛果');a.settled=true;if(outcome==='draw'){m.draws++;t.game=null;return true}m.winner=outcome==='win'?'you':m.a==='you'?m.b:m.a;m.gameId=gameId;m.simulated=false;if(outcome==='win')t.wins++;
 for(const rival of t.rounds.at(-1))if(!rival.winner)simulate(t,rival,rng);advance(t);
 if(outcome==='loss'){while(t.status==='playing'){for(const rival of t.rounds.at(-1))if(!rival.winner)simulate(t,rival,rng);advance(t)}}
 t.game=null;return true}
function eligible(rows,owner){return rows.some(r=>r.owner_id===owner&&r.mode==='ai'&&r.outcome==='win'&&Number(r.level)===6&&r.eligible!==false)}
const api={create,player,nextMatch,begin,settle,eligible,shuffle};if(typeof module!=='undefined')module.exports=api;else root.MQMastersCore=api;
})(globalThis);
