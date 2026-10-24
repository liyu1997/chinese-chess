(function(root){
const names={r:{k:'帥',a:'仕',e:'相',h:'馬',r:'車',c:'炮',p:'兵'},b:{k:'將',a:'士',e:'象',h:'馬',r:'車',c:'砲',p:'卒'}};
function initial(){let b=Array.from({length:10},()=>Array(9).fill(null));for(let s of ['b','r']){let y=s==='b'?0:9;['r','h','e','a','k','a','e','h','r'].forEach((t,x)=>b[y][x]=s+t);for(let x of [1,7])b[s==='b'?2:7][x]=s+'c';for(let x of [0,2,4,6,8])b[s==='b'?3:6][x]=s+'p';}return b;}
function inside(x,y){return x>=0&&x<9&&y>=0&&y<10;}
function pseudo(b,x,y,X,Y){if(!inside(X,Y)||(x===X&&y===Y))return false;let p=b[y][x],q=b[Y][X];if(!p||q&&q[0]===p[0])return false;let dx=X-x,dy=Y-y,ax=Math.abs(dx),ay=Math.abs(dy),s=p[0],t=p[1];let palace=X>=3&&X<=5&&(s==='r'?Y>=7:Y<=2);let count=0;if(dx===0||dy===0){let sx=Math.sign(dx),sy=Math.sign(dy);for(let i=x+sx,j=y+sy;i!==X||j!==Y;i+=sx,j+=sy)if(b[j][i])count++;}
switch(t){case 'r':return (dx===0||dy===0)&&count===0;case 'c':return (dx===0||dy===0)&&count===(q?1:0);case 'h':return ax===2&&ay===1&&!b[y][x+Math.sign(dx)]||ax===1&&ay===2&&!b[y+Math.sign(dy)][x];case 'e':return ax===2&&ay===2&&(s==='r'?Y>=5:Y<=4)&&!b[y+dy/2][x+dx/2];case 'a':return palace&&ax===1&&ay===1;case 'k':return q&&q[1]==='k'&&dx===0&&count===0||palace&&ax+ay===1;case 'p':return dx===0&&dy===(s==='r'?-1:1)||ay===0&&ax===1&&(s==='r'?y<=4:y>=5); }return false;}
function check(b,s){let k;for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]===s+'k')k=[x,y];if(!k)return true;for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]&&b[y][x][0]!==s&&pseudo(b,x,y,...k))return true;return false;}
function play(b,m){let n=b.map(r=>r.slice());n[m.Y][m.X]=n[m.y][m.x];n[m.y][m.x]=null;return n;}
function moves(b,s){let a=[];for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]?.[0]===s)for(let Y=0;Y<10;Y++)for(let X=0;X<9;X++)if(pseudo(b,x,y,X,Y)){let m={x,y,X,Y};if(!check(play(b,m),s))a.push(m);}return a;}
const values={k:100000,r:900,c:450,h:400,e:200,a:200,p:100};
function score(b){let v=0;for(let y=0;y<10;y++)for(let x=0;x<9;x++){let p=b[y][x];if(p){let adv=p[0]==='r'?9-y:y;let n=values[p[1]]+(p[1]==='p'?adv*12:0)+(p[1]==='h'||p[1]==='c'?4-Math.abs(x-4):0);v+=p[0]==='b'?n:-n;}}return v;}
// Evaluate complete search iterations, then vary only similarly strong moves.
function ai(b,depth=2,random=Math.random){
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
 const best=Math.max(...ranked.map(item=>item.value));
 // Never trade a clear tactical win for variety. Tolerance is less than a pawn.
 const tolerance=Math.abs(best)>90000?0:depth>=3?4:16;
 const candidates=ranked.filter(item=>best-item.value<=tolerance);
 const weights=candidates.map(item=>1/Math.pow(1+(best-item.value)/8,2));
 let draw=random()*weights.reduce((sum,w)=>sum+w,0);
 for(let i=0;i<candidates.length;i++){draw-=weights[i];if(draw<=0)return candidates[i].move;}
 return candidates[candidates.length-1].move;
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
const api={initial,names,pseudo,check,play,moves,ai,checkStreak,acceptsDraw};if(typeof module!=='undefined')module.exports=api;else root.XQ=api;
})(globalThis);
