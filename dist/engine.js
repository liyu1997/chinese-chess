(function(root){
const names={r:{k:'帥',a:'仕',e:'相',h:'馬',r:'車',c:'炮',p:'兵'},b:{k:'將',a:'士',e:'象',h:'馬',r:'車',c:'砲',p:'卒'}};
function initial(){let b=Array.from({length:10},()=>Array(9).fill(null));for(let s of ['b','r']){let y=s==='b'?0:9;['r','h','e','a','k','a','e','h','r'].forEach((t,x)=>b[y][x]=s+t);for(let x of [1,7])b[s==='b'?2:7][x]=s+'c';for(let x of [0,2,4,6,8])b[s==='b'?3:6][x]=s+'p';}return b;}
function inside(x,y){return x>=0&&x<9&&y>=0&&y<10;}
function pseudo(b,x,y,X,Y){if(!inside(X,Y)||(x===X&&y===Y))return false;let p=b[y][x],q=b[Y][X];if(!p||q&&q[0]===p[0])return false;let dx=X-x,dy=Y-y,ax=Math.abs(dx),ay=Math.abs(dy),s=p[0],t=p[1];let palace=X>=3&&X<=5&&(s==='r'?Y>=7:Y<=2);let count=0;if(dx===0||dy===0){let sx=Math.sign(dx),sy=Math.sign(dy);for(let i=x+sx,j=y+sy;i!==X||j!==Y;i+=sx,j+=sy)if(b[j][i])count++;}
switch(t){case 'r':return (dx===0||dy===0)&&count===0;case 'c':return (dx===0||dy===0)&&count===(q?1:0);case 'h':return ax===2&&ay===1&&!b[y][x+Math.sign(dx)]||ax===1&&ay===2&&!b[y+Math.sign(dy)][x];case 'e':return ax===2&&ay===2&&(s==='r'?Y>=5:Y<=4)&&!b[y+dy/2][x+dx/2];case 'a':return palace&&ax===1&&ay===1;case 'k':return q&&q[1]==='k'&&dx===0&&count===0||palace&&ax+ay===1;case 'p':return dx===0&&dy===(s==='r'?-1:1)||ay===0&&ax===1&&(s==='r'?y<=4:y>=5); }return false;}
function check(b,s){let k;for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]===s+'k')k=[x,y];if(!k)return true;for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]&&b[y][x][0]!==s&&pseudo(b,x,y,...k))return true;return false;}
function play(b,m){let n=b.map(r=>r.slice());n[m.Y][m.X]=n[m.y][m.x];n[m.y][m.x]=null;return n;}
function moves(b,s,isCheck=check){
 const result=[];
 for(let y=0;y<10;y++)for(let x=0;x<9;x++){
  const piece=b[y][x];if(!piece||piece[0]!==s)continue;
  const t=piece[1],targets=[];
  if(t==='r'||t==='c'||t==='k'){
   if(t!=='k'){
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
     let screen=false;
     for(let X=x+dx,Y=y+dy;inside(X,Y);X+=dx,Y+=dy){
      const q=b[Y][X];
      if(t==='r'){if(!q||q[0]!==s)targets.push([X,Y]);if(q)break;}
      else if(!screen){if(q)screen=true;else targets.push([X,Y]);}
      else if(q){if(q[0]!==s)targets.push([X,Y]);break;}
     }
    }
   }else{
    targets.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    for(let Y=0;Y<10;Y++)if(b[Y][x]=== (s==='r'?'bk':'rk'))targets.push([x,Y]);
   }
  }else{
   const offsets=t==='h'?[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]:t==='e'?[[2,2],[2,-2],[-2,2],[-2,-2]]:t==='a'?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[0,s==='r'?-1:1],[1,0],[-1,0]];
   for(const [dx,dy] of offsets)targets.push([x+dx,y+dy]);
  }
  for(const [X,Y] of targets)if(pseudo(b,x,y,X,Y)){
   // Restore the board immediately; caller-owned positions never change.
   const captured=b[Y][X];b[Y][X]=piece;b[y][x]=null;
   const safe=!isCheck(b,s);b[y][x]=piece;b[Y][X]=captured;
   if(safe)result.push({x,y,X,Y});
  }
 }
 return result;
}

const values={k:100000,r:900,c:450,h:400,e:200,a:200,p:100};
function score(b){let v=0;for(let y=0;y<10;y++)for(let x=0;x<9;x++){let p=b[y][x];if(p){let adv=p[0]==='r'?9-y:y;let n=values[p[1]]+(p[1]==='p'?adv*12:0)+(p[1]==='h'||p[1]==='c'?4-Math.abs(x-4):0);v+=p[0]==='b'?n:-n;}}return v;}
// Select only fully evaluated, near-best moves; novelty never overrides a forced win.
function variedMove(b,ranked,tolerance,random,context={}){
 const best=Math.max(...ranked.map(item=>item.value));
 const margin=Math.abs(best)>90000?0:tolerance;
 const candidates=ranked.filter(item=>best-item.value<=margin);
 const weights=candidates.map(({move,value})=>{
  const id=`${move.x}${move.y}${move.X}${move.Y}`;
  const recent=context.recent||[];
  const novelty=recent.includes(id)?0.12:1;
  // One preference per game gives equal-quality choices a coherent character.
  const type=b[move.y][move.x][1],style=context.style;
  const preference=style==='active'&&['r','h','c'].includes(type)?1.6:
   style==='solid'&&['e','a','p'].includes(type)?1.6:
   style==='flank'&&Math.abs(move.X-4)>=2?1.6:1;
  return Math.exp(-(best-value)/Math.max(2,tolerance/2))*novelty*preference;
 });
 let draw=random()*weights.reduce((sum,w)=>sum+w,0);
 for(let i=0;i<candidates.length;i++){draw-=weights[i];if(draw<=0)return candidates[i].move;}
 return candidates[candidates.length-1].move;
}
// Evaluate complete search iterations, then vary only similarly strong moves.
function basicAI(b,depth=2,random=Math.random,context={}){
 depth=Math.max(1,Math.min(3,Math.floor(Number(depth))||2));
 const shuffle=list=>{for(let i=list.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;};
 const captureValue=m=>values[b[m.Y][m.X]?.[1]]||0;
 const all=shuffle(moves(b,'b')).sort((a,z)=>captureValue(z)-captureValue(a));
 if(!all.length)return null;
 let nodes=0;const exhausted={};
 function search(position,side,d,alpha,beta){
  if(++nodes>60000)throw exhausted;
  if(d===0)return score(position);
  const options=moves(position,side);
  if(!options.length)return side==='b'?-1e7-d:1e7+d;
  options.sort((a,z)=>(values[position[z.Y][z.X]?.[1]]||0)-(values[position[a.Y][a.X]?.[1]]||0));
  let value=side==='b'?-Infinity:Infinity;
  for(const move of options){
   const next=search(play(position,move),side==='b'?'r':'b',d-1,alpha,beta);
   if(side==='b'){value=Math.max(value,next);alpha=Math.max(alpha,value);}
   else{value=Math.min(value,next);beta=Math.min(beta,value);}
   if(beta<=alpha)break;
  }
  return value;
 }
 let ranked=all.map(move=>({move,value:score(play(b,move))}));
 for(let d=1;d<=depth;d++){
  try{const complete=all.map(move=>({move,value:search(play(b,move),'r',d-1,-Infinity,Infinity)}));ranked=complete;}
  catch(error){if(error!==exhausted)throw error;break;}
 }
 return variedMove(b,ranked,depth>=3?10:20,random,context);
}
// Higher levels use iterative deepening, transposition bounds and tactical extensions.
const levels={
 2:{name:'闲庭 · 入门',depth:2,time:0},
 3:{name:'凝思 · 进阶',depth:3,time:0},
 4:{name:'试锋 · 挑战',depth:4,time:1200},
 5:{name:'纵横 · 高手',depth:8,time:8400,baselineTime:2800,budgetMultiplier:3,qDepth:6,tableSize:120000,enhanced:true},
 6:{name:'入微 · 宗师',depth:12,time:7000,openingTime:2000,middleTime:5000,softRatio:0.6,qDepth:8,tableSize:180000,enhanced:true}
};
function ai(b,level=2,random=Math.random,context={}){
 level=Number(level);if(!levels[level])level=2;
 if(level<=3)return basicAI(b,level,random,context);
 return deepAI(b,levels[level],random,context).move;
}
function legacyDeepAI(b,config,random=Math.random,context={}){
 const start=Date.now(),deadline=start+config.time,stop={},table=new Map();
 let nodes=0,completedDepth=0;
 const other=s=>s==='b'?'r':'b';
 const id=m=>m?`${m.x}${m.y}${m.X}${m.Y}`:'';
 const key=(p,s)=>s+p.map(row=>row.map(v=>v||'..').join('')).join('');
 const material=(p,s)=>score(p)*(s==='b'?1:-1);
 function tick(){if((++nodes&127)===0&&Date.now()>=deadline)throw stop;}
 function ordered(p,options,best){return options.sort((a,z)=>{
  const priority=m=>(id(m)===best?1e7:0)+(p[m.Y][m.X]?10*values[p[m.Y][m.X][1]]-values[p[m.y][m.x][1]]:0);
  return priority(z)-priority(a);
 });}
 function terminal(p,s,ply){
  if(!p.some(row=>row.includes(s+'k')))return -1e7+ply;
  if(!p.some(row=>row.includes(other(s)+'k')))return 1e7-ply;
  return null;
 }
 function quiet(p,s,alpha,beta,left,ply){
  tick();const end=terminal(p,s,ply);if(end!==null)return end;
  const checked=check(p,s),options=moves(p,s);
  if(!options.length)return -1e7+ply;
  const stand=material(p,s);
  if(left===0)return stand;
  if(!checked){if(stand>=beta)return stand;alpha=Math.max(alpha,stand);}
  for(const m of ordered(p,checked?options:options.filter(m=>p[m.Y][m.X]),'')){
   const value=-quiet(play(p,m),other(s),-beta,-alpha,left-1,ply+1);
   if(value>=beta)return value;alpha=Math.max(alpha,value);
  }
  return alpha;
 }
 function search(p,s,d,alpha,beta,ply){
  tick();const end=terminal(p,s,ply);if(end!==null)return end;
  if(d<=0)return quiet(p,s,alpha,beta,4,ply);
  const hash=key(p,s),entry=table.get(hash),originalAlpha=alpha,originalBeta=beta;
  if(entry&&entry.depth>=d){
   if(entry.flag==='exact')return entry.value;
   if(entry.flag==='lower')alpha=Math.max(alpha,entry.value);else beta=Math.min(beta,entry.value);
   if(alpha>=beta)return entry.value;
  }
  const options=ordered(p,moves(p,s),entry?.best);
  if(!options.length)return -1e7+ply;
  let value=-Infinity,best='';
  let index=0;const inCheck=check(p,s);
  for(const m of options){
   const child=play(p,m);
   const reduce=d>=3&&index++>=4&&!inCheck&&!p[m.Y][m.X]&&!check(child,other(s));
   let next=reduce?-search(child,other(s),d-2,-alpha-1,-alpha,ply+1):-search(child,other(s),d-1,-beta,-alpha,ply+1);
   if(reduce&&next>alpha)next=-search(child,other(s),d-1,-beta,-alpha,ply+1);
   if(next>value){value=next;best=id(m);}alpha=Math.max(alpha,value);
   if(alpha>=beta)break;
  }
  // Mate distances depend on the path length, so do not cache their scores.
  if(Math.abs(value)<9e6){
   if(table.size>60000)table.clear();
   table.set(hash,{depth:d,value,best,flag:value<=originalAlpha?'upper':value>=originalBeta?'lower':'exact'});
  }
  return value;
 }
 let options=moves(b,'b');
 // Random tie ordering keeps equal-strength openings varied.
 for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
 let best=options[0]||null,value=-Infinity,completed=[];
 for(let depth=1;depth<=config.depth&&options.length;depth++){
  let iterationBest=null,iterationValue=-Infinity,alpha=-Infinity;const ranked=[];
  try{
   for(const m of ordered(b,options,id(best))){
    if(Date.now()>=deadline)throw stop;
    // Full root windows are required: a cutoff bound is not an exact candidate score.
    const v=-search(play(b,m),'r',depth-1,-Infinity,Infinity,1);
    ranked.push({move:m,value:v});
    if(v>iterationValue){iterationValue=v;iterationBest=m;}alpha=Math.max(alpha,v);
   }
  }catch(error){if(error!==stop)throw error;break;}
  best=iterationBest;value=iterationValue;completedDepth=depth;completed=ranked;
  options=ranked.sort((a,z)=>z.value-a.value).map(item=>item.move);
  if(value>9e6)break;
 }
 if(completed.length)best=variedMove(b,completed,config.variety??(config.depth>=8?4:config.depth>=6?6:10),random,context);
 return {move:best,depth:completedDepth,nodes,elapsed:Date.now()-start,value};
}
// High-strength evaluation is deliberately separate: levels 1–3 keep their behaviour.
function evaluateAdvanced(b){
 let total=0;
 for(let y=0;y<10;y++)for(let x=0;x<9;x++){
  const p=b[y][x];if(!p)continue;
  const side=p[0],t=p[1],advance=side==='b'?y:9-y,centre=4-Math.abs(x-4);
  let v=values[t];
  if(t==='p')v+=advance*9+(advance>=5?70+centre*10:centre*2);
  if(t==='h'){
   v+=centre*9+Math.min(advance,6)*5;
   for(const [dx,dy]of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){
    const X=x+dx,Y=y+dy,lx=x+(Math.abs(dx)===2?Math.sign(dx):0),ly=y+(Math.abs(dy)===2?Math.sign(dy):0);
    if(inside(X,Y)&&!b[ly][lx]&&b[Y][X]?.[0]!==side)v+=4;
   }
  }
  if(t==='r'||t==='c'){
   v+=centre*(t==='r'?3:5);
   for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){
    let screened=false;
    for(let X=x+dx,Y=y+dy;inside(X,Y);X+=dx,Y+=dy){
     const q=b[Y][X];
     if(!q){if(!screened)v+=t==='r'?2:1;continue;}
     if(t==='r')break;
     if(screened){if(q[0]!==side&&q[1]==='k')v+=32;break;}screened=true;
    }
   }
  }
  if(t==='a'||t==='e')v+=advance<=4?12:0;
  if(t==='k'){
   v+=x===4?12:0;
   for(let Y=side==='b'?0:7;Y<=(side==='b'?2:9);Y++)for(let X=3;X<=5;X++)if(b[Y][X]===side+'a')v+=16;
  }
  total+=(side==='b'?v:-v);
 }
 return total;
}
// Probe attacks from the king instead of scanning every opposing piece per move.
function fastCheck(b,s){
 let x=-1,y=-1;
 for(let Y=0;Y<10;Y++)for(let X=0;X<9;X++)if(b[Y][X]===s+'k'){x=X;y=Y;}
 if(x<0)return true;
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
  let screen=false;
  for(let X=x+dx,Y=y+dy;inside(X,Y);X+=dx,Y+=dy){
   const p=b[Y][X];if(!p)continue;
   if(!screen){
    if(p[0]!==s&&(p[1]==='r'||(p[1]==='k'||p[1]==='p')&&pseudo(b,X,Y,x,y)))return true;
    screen=true;
   }else{if(p[0]!==s&&p[1]==='c')return true;break;}
  }
 }
 for(const [dx,dy,t] of [[2,1,'h'],[2,-1,'h'],[-2,1,'h'],[-2,-1,'h'],[1,2,'h'],[1,-2,'h'],[-1,2,'h'],[-1,-2,'h'],[2,2,'e'],[2,-2,'e'],[-2,2,'e'],[-2,-2,'e'],[1,1,'a'],[1,-1,'a'],[-1,1,'a'],[-1,-1,'a']]){
  const X=x+dx,Y=y+dy;if(inside(X,Y)&&b[Y][X]=== (s==='b'?'r':'b')+t&&pseudo(b,X,Y,x,y))return true;
 }
 return false;
}
// Context plies survives undo/resume through the existing board history.
// Without history, only positions still close to the initial array qualify as opening.
function thinkingBudget(b,config,context={}){
 if(!config.openingTime)return {phase:'standard',time:config.time,softTime:config.time};
 let count=0,deviations=0;const start=initial();
 for(let y=0;y<10;y++)for(let x=0;x<9;x++){if(b[y][x])count++;if(b[y][x]!==start[y][x])deviations++;}
 const opening=count>=28&&(Number.isFinite(context.plies)?context.plies<20:deviations<=14);
 const phase=opening?'opening':count<=14?'endgame':'middlegame';
 const phaseTime=opening?config.openingTime:phase==='endgame'?config.time:config.middleTime;
 // A check merits the full tactical budget outside opening.
 const tactical=!opening&&(fastCheck(b,'b')||fastCheck(b,'r'));
 const time=Math.max(1,Math.min(config.time,tactical?config.time:phaseTime));
 return {phase,time,softTime:time*(config.softRatio??1)};
}
function advancedAI(b,config,random=Math.random,context={}){
 const start=Date.now(),budget=thinkingBudget(b,config,context),deadline=start+Math.max(1,budget.time),stop={},MATE=1e7;
 const table=new Map(),killers=[],history=new Map(),tableLimit=config.tableSize||120000;
 const nodeLimit=config.maxNodes??Infinity,quiescenceDepth=config.qDepth||6;
 let nodes=0,qnodes=0,cutoffs=0,ttHits=0,completedDepth=0,stopReason='depth',completed=[];
 const other=s=>s==='b'?'r':'b';
 const id=m=>`${m.x}${m.y}${m.X}${m.Y}`;
 const key=(p,s)=>s+p.map(row=>row.map(v=>v||'..').join('')).join('');
 const material=(p,s)=>evaluateAdvanced(p)*(s==='b'?1:-1);
 function tick(quiet=false){
  nodes++;if(quiet)qnodes++;
  if(nodes>nodeLimit){stopReason='nodes';throw stop;}
  if((nodes&31)===0&&Date.now()>=deadline){stopReason='time';throw stop;}
 }
 function ordered(p,options,best,ply,side){
  const ks=killers[ply]||[];
  return options.map(m=>{const code=id(m),victim=p[m.Y][m.X];return{m,priority:code===best?1e9:victim?1e6+10*values[victim[1]]-values[p[m.y][m.x][1]]:ks.includes(code)?900000:(history.get(side+code)||0)}}).sort((a,z)=>z.priority-a.priority).map(v=>v.m);
 }
 function terminal(p,s,ply){
  if(!p.some(row=>row.includes(s+'k')))return -MATE+ply;
  if(!p.some(row=>row.includes(other(s)+'k')))return MATE-ply;
  return null;
 }
 function quiet(p,s,alpha,beta,left,ply){
  tick(true);const end=terminal(p,s,ply);if(end!==null)return end;
  const checked=fastCheck(p,s),options=moves(p,s,fastCheck);
  if(!options.length)return -MATE+ply;
  const stand=material(p,s);
  // Never stand pat in check: search the legal evasions even at the capture horizon.
  if(ply>=64||left<=0&&!checked)return stand;
  if(!checked){if(stand>=beta)return stand;alpha=Math.max(alpha,stand);}
  for(const m of ordered(p,checked?options:options.filter(m=>p[m.Y][m.X]),'',ply,s)){
   const value=-quiet(play(p,m),other(s),-beta,-alpha,left-1,ply+1);
   if(value>=beta){cutoffs++;return value;}alpha=Math.max(alpha,value);
  }
  return alpha;
 }
 function search(p,s,d,alpha,beta,ply){
  tick();const end=terminal(p,s,ply);if(end!==null)return end;
  if(d<=0)return quiet(p,s,alpha,beta,quiescenceDepth,ply);
  const hash=key(p,s),entry=table.get(hash),originalAlpha=alpha,originalBeta=beta;
  if(entry&&entry.depth>=d){
   ttHits++;if(entry.flag==='exact')return entry.value;
   if(entry.flag==='lower')alpha=Math.max(alpha,entry.value);else beta=Math.min(beta,entry.value);
   if(alpha>=beta)return entry.value;
  }
  const options=ordered(p,moves(p,s,fastCheck),entry?.best,ply,s);
  if(!options.length)return -MATE+ply;
  const inCheck=fastCheck(p,s);let value=-Infinity,best='',index=0;
  for(const m of options){
   const child=play(p,m),capture=!!p[m.Y][m.X];
   const reduced=d>=4&&index>=6&&!inCheck&&!capture&&!fastCheck(child,other(s));
   let next;
   if(index===0)next=-search(child,other(s),d-1,-beta,-alpha,ply+1);
   else{
    // Principal-variation search rejects inferior moves with a narrow window.
    next=-search(child,other(s),d-(reduced?2:1),-alpha-1,-alpha,ply+1);
    if(reduced&&next>alpha)next=-search(child,other(s),d-1,-alpha-1,-alpha,ply+1);
    if(next>alpha&&next<beta)next=-search(child,other(s),d-1,-beta,-alpha,ply+1);
   }
   index++;if(next>value){value=next;best=id(m);}alpha=Math.max(alpha,value);
   if(alpha>=beta){
    cutoffs++;
    if(!capture){const code=id(m);killers[ply]=[code,...(killers[ply]||[]).filter(k=>k!==code)].slice(0,2);history.set(s+code,Math.min(800000,(history.get(s+code)||0)+d*d));}
    break;
   }
  }
  // Avoid path-dependent mate scores and wholesale cache clears mid-iteration.
  if(Math.abs(value)<9e6&&(table.size<tableLimit||table.has(hash)))table.set(hash,{depth:d,value,best,flag:value<=originalAlpha?'upper':value>=originalBeta?'lower':'exact'});
  return value;
 }
 let options=moves(b,'b',fastCheck);
 for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
 let best=options[0]||null,value=best?material(b,'b'):0,stable=0;
 for(let depth=1;depth<=config.depth&&options.length;depth++){
  let iterationBest=null,iterationValue=-Infinity,alpha=-Infinity;const ranked=[];
  try{
   for(const m of ordered(b,options,best?id(best):'',0,'b')){
    if(Date.now()>=deadline){stopReason='time';throw stop;}
    const child=play(b,m);let exact=ranked.length===0;
    let v=exact?-search(child,'r',depth-1,-Infinity,Infinity,1):-search(child,'r',depth-1,-alpha-1,-alpha,1);
    if(!exact&&v>alpha){v=-search(child,'r',depth-1,-Infinity,Infinity,1);exact=true;}
    ranked.push({move:m,value:v,exact});
    if(exact&&v>iterationValue){iterationValue=v;iterationBest=m;}alpha=Math.max(alpha,v);
   }
  }catch(error){if(error!==stop)throw error;break;}
  stable=best&&iterationBest&&id(best)===id(iterationBest)&&Math.abs(value-iterationValue)<=25?stable+1:0;
  best=iterationBest;value=iterationValue;completedDepth=depth;completed=ranked;
  options=ranked.sort((a,z)=>z.value-a.value).map(item=>item.move);
  if(value>9e6){stopReason='mate';break;}
  if(config.softRatio&&depth>=4&&stable>=2&&Date.now()-start>=budget.softTime){stopReason='stable';break;}
 }
 // A cutoff bound is never used to justify a random weaker root move.
 const equal=completed.filter(item=>item.exact&&item.value===value);
 if(equal.length>1)best=variedMove(b,equal,0,random,context);
 return{move:best,depth:completedDepth,nodes,qnodes,elapsed:Date.now()-start,value,cutoffs,ttHits,stopReason,phase:budget.phase,budgetMs:budget.time};
}
function deepAI(b,config,random=Math.random,context={}){
 return config.enhanced?advancedAI(b,config,random,context):legacyDeepAI(b,config,random,context);
}

// One round means one move by the checking side plus the opponent's reply.
// Use board snapshots so undo and resumed games give the same streak.
function checkStreak(history,current,side){
 let count=0;const opponent=side==='r'?'b':'r';
 for(let i=history.length-1;i>=0;i--){
  if(history[i].turn!==side)continue;
  const after=i+1<history.length?history[i+1].board:current;
  if(!check(after,opponent))break;
  count++;
 }
 return count;
}
function acceptsDraw(b,plies){return plies>=20&&score(b)<=120;}
// Masters rounds expand the unchanged Grandmaster's search budget by 2, 4, 8, 16.
function masterConfig(round=0){round=Math.max(0,Math.min(3,Math.floor(Number(round)||0)));const multiplier=2**(round+1),base=levels[6];return {...base,name:'象力大师赛',depth:base.depth+2*(round+1),time:base.time*multiplier,openingTime:base.openingTime*multiplier,middleTime:base.middleTime*multiplier,softRatio:0.85,qDepth:base.qDepth,tableSize:Math.min(400000,base.tableSize*multiplier),masterRound:round,multiplier};}
const api={masterConfig,initial,names,pseudo,check,play,moves,ai,levels,deepAI,evaluateAdvanced,thinkingBudget,fastCheck,checkStreak,acceptsDraw};if(typeof module!=='undefined')module.exports=api;else root.XQ=api;
})(globalThis);


