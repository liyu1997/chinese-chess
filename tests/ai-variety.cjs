const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const key=m=>JSON.stringify(m);
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const initial=E.initial();
const redMove=E.moves(initial,'r').find(m=>m.x===4&&m.y===6&&m.Y===5);
const board=E.play(initial,redMove),snapshot=JSON.stringify(board);
for(const depth of [2,3]){
 const legal=new Set(E.moves(board,'b').map(key)),answers=new Set();
 for(let seed=1;seed<=24;seed++){
  const answer=E.ai(board,depth,seeded(seed));assert(legal.has(key(answer)),'AI must return a legal reply');answers.add(key(answer));
 }
 assert(answers.size>=2,`level ${depth} must offer varied replies to the same opening`);
 console.log(`Level ${depth}: ${answers.size} different legal replies across 24 seeded runs`);
}
assert.equal(JSON.stringify(board),snapshot,'search must not mutate current game');
const win=Array.from({length:10},()=>Array(9).fill(null));win[0][4]='bk';win[9][4]='rk';win[5][4]='br';
for(let seed=1;seed<=8;seed++){const answer=E.ai(win,2,seeded(seed));assert.equal(E.play(win,answer)[9][4],'br','always take an immediate decisive win');}
const noMoves=Array.from({length:10},()=>Array(9).fill(null));noMoves[9][4]='rk';assert.equal(E.ai(noMoves,2),null);
console.log('Tactical win, legal selection, no-move and board immutability checks passed');
