const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const b=E.initial();b[6][4]=null;b[5][4]='rp';
const legal=new Set(E.moves(b,'b').map(JSON.stringify)),snapshot=JSON.stringify(b);
const results=new Set();
for(let seed=1;seed<=12;seed++){
 const result=E.deepAI(b,{depth:2,time:2000,variety:10},seeded(seed),{style:['solid','active','flank'][seed%3],recent:[]});
 assert.equal(result.depth,2);assert(legal.has(JSON.stringify(result.move)));results.add(JSON.stringify(result.move));
}
assert(results.size>=2,'deep search must select multiple fully evaluated near-best moves');
assert.equal(JSON.stringify(b),snapshot);
const win=Array.from({length:10},()=>Array(9).fill(null));win[0][4]='bk';win[9][4]='rk';win[5][4]='br';
for(let seed=1;seed<=4;seed++){
 const result=E.deepAI(win,{depth:3,time:500},seeded(seed),{style:'solid',recent:['4549']});
 assert.equal(E.play(win,result.move)[9][4],'br','novelty must never suppress the decisive win');
}
console.log(`Deep AI: ${results.size} distinct legal replies; complete-depth scores, winning moves and input immutability passed`);
