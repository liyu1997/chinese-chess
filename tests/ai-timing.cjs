const assert=require('node:assert/strict');const E=require('../dist/engine.js');
const key=m=>JSON.stringify(m);const config=E.levels[6];
const initial=E.play(E.initial(),{x:4,y:6,X:4,Y:5});
assert.equal(E.thinkingBudget(initial,config,{plies:1}).time,2000);
assert.equal(E.thinkingBudget(initial,config,{plies:25}).time,5000,'restored/long games do not reuse opening timing');
assert.equal(E.thinkingBudget(initial,{...config,time:100},{plies:1}).time,100,'caller time cap always wins');
const sparse=Array.from({length:10},()=>Array(9).fill(null));sparse[0][4]='bk';sparse[9][4]='rk';sparse[5][4]='rp';sparse[1][1]='br';
assert.equal(E.thinkingBudget(sparse,config,{plies:35}).time,7000);
assert.equal(E.thinkingBudget(initial,E.levels[5]).time,8400,'expert timing unchanged');
let seed=42;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
// Compare the new attack detector and its legal moves against the original implementation.
for(let game=0;game<12;game++){
 let b=E.initial();
 for(let ply=0;ply<100;ply++){
  for(const s of ['r','b']){
   assert.equal(E.fastCheck(b,s),E.check(b,s),`attack equivalence game ${game} ply ${ply} ${s}`);
   assert.deepEqual(E.moves(b,s,E.fastCheck).map(key).sort(),E.moves(b,s).map(key).sort());
  }
  const options=E.moves(b,ply%2?'b':'r');if(!options.length)break;
  b=E.play(b,options[Math.floor(random()*options.length)]);
 }
}
const result=E.deepAI(initial,config,()=>0.5,{plies:1});
assert(result.elapsed<2500,'opening response bounded on this test machine');
assert.equal(result.budgetMs,2000);assert.equal(result.phase,'opening');assert(result.depth>=3);
assert(E.moves(initial,'b').some(m=>key(m)===key(result.move)));
console.log(JSON.stringify({test:'grandmaster-opening',...result}));
console.log('Phase budgets, time override, up to 1200-ply attack/move equivalence and legal fast opening passed');
