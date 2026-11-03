/* Lightweight, deterministic short-search analysis, isolated from the game UI. */
if(typeof importScripts==='function')importScripts('./engine.js?v=variety31');
const Rules=typeof module!=='undefined'?require('./engine.js'):XQ;
const value={k:100000,r:900,c:450,h:400,e:200,a:200,p:100};
const other=s=>s==='r'?'b':'r';
function material(board,side){let score=0;for(let y=0;y<10;y++)for(let x=0;x<9;x++){const p=board[y][x];if(p){const advancement=p[0]==='r'?9-y:y;score+=(p[0]===side?1:-1)*(value[p[1]]+(p[1]==='p'?advancement*10:0));}}return score;}
function rankPosition(board,side,options={}){
 const start=Date.now(),budget=options.milliseconds??95,maxNodes=options.nodes??9000,stop={};let nodes=0;
 const legal=Rules.moves(board,side);
 const ordered=(b,ms)=>ms.sort((a,z)=>(value[b[z.Y][z.X]?.[1]]||0)-(value[b[a.Y][a.X]?.[1]]||0));
 function search(b,s,depth,alpha,beta,ply){
  if(++nodes>maxNodes||Date.now()-start>budget)throw stop;
  const moves=Rules.moves(b,s);if(!moves.length)return -100000+ply;
  if(depth===0)return material(b,s);
  let best=-Infinity;
  for(const m of ordered(b,moves)){const v=-search(Rules.play(b,m),other(s),depth-1,-beta,-alpha,ply+1);best=Math.max(best,v);alpha=Math.max(alpha,v);if(alpha>=beta)break;}
  return best;
 }
 let completed=legal.map(move=>{const next=Rules.play(board,move);return {move,score:Rules.moves(next,other(side)).length?-material(next,other(side)):99999}}),depth=0;
 for(let d=1;d<=2;d++){
  try{const ranked=ordered(board,legal.slice()).map(move=>({move,score:-search(Rules.play(board,move),other(side),d-1,-Infinity,Infinity,1)}));completed=ranked;depth=d;}
  catch(e){if(e!==stop)throw e;break;}
 }
 return {ranked:completed.sort((a,b)=>b.score-a.score),depth,nodes};
}
function analysePly(board,move,side,options){
 const result=rankPosition(board,side,options),same=m=>['x','y','X','Y'].every(k=>m[k]===move[k]),actual=result.ranked.find(r=>same(r.move));
 if(!actual)throw Error('棋谱包含不合法走法，无法继续分析。');
 const best=result.ranked[0],next=Rules.play(board,move),check=Rules.check(next,other(side)),terminal=Rules.moves(next,other(side)).length===0;
 const loss=Math.max(0,best.score-actual.score);
 return {move,side,captured:board[move.Y][move.X],piece:board[move.y][move.x],check,mate:terminal&&check,stalemate:terminal&&!check,loss:Math.round(loss),depth:result.depth,best:best.move,label:terminal?(check?'将死':'困毙'):loss>=90000?'漏看杀棋':loss>=450?'明显失误':loss>=180?'值得改进':check?'将军':board[move.Y][move.X]?'吃子':'平稳',score:Math.round(actual.score)};
}
if(typeof module!=='undefined')module.exports={rankPosition,analysePly,material};
else self.onmessage=event=>{const {id,start,moves}=event.data;try{let b=start;const rows=[];for(let i=0;i<moves.length;i++){const m=moves[i],side=b[m.y]?.[m.x]?.[0];if(!side)throw Error('棋谱缺少棋子，无法继续分析。');const row=analysePly(b,m,side);rows.push(row);b=Rules.play(b,m);self.postMessage({id,type:'progress',done:i+1,total:moves.length,row});}self.postMessage({id,type:'complete',rows});}catch(error){self.postMessage({id,type:'error',message:error.message});}};
