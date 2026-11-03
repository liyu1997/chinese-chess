const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const blank=()=>Array.from({length:10},()=>Array(9).fill(null));
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
assert.equal(E.levels[5].time,2800*3);assert.equal(E.levels[6].time,7000);
assert.equal(E.levels[5].depth,8);assert.equal(E.levels[6].depth,12);
assert.deepEqual([2,3,4].map(l=>[E.levels[l].depth,E.levels[l].time]),[[2,0],[3,0],[4,1200]]);
const trap=blank();trap[0][4]='bk';trap[9][4]='rk';trap[5][4]='rp';trap[4][0]='br';trap[5][0]='rp';trap[6][0]='rr';
const win=blank();win[0][4]='bk';win[9][4]='rk';win[5][4]='br';
const pinned=blank();pinned[0][4]='bk';pinned[9][4]='rk';pinned[5][4]='rp';pinned[0][0]='rr';pinned[1][3]='br';
assert(E.check(pinned,'b'),'fixture starts with black in check');
const snapshot=JSON.stringify([trap,win,pinned]);
for(const level of [5,6]){
 const config={...E.levels[level],time:1500,maxNodes:20000};
 const answer=E.deepAI(trap,config,seeded(7));
 assert(E.moves(trap,'b').some(m=>same(m,answer.move)));
 assert(!same(answer.move,{x:0,y:4,X:0,Y:5}),'do not lose a rook for a defended pawn');
 assert(answer.depth>=2);assert(answer.elapsed<2000);
 const mate=E.deepAI(win,config,seeded(7));
 assert.equal(E.play(win,mate.move)[9][4],'br','always take the decisive king capture');
 assert.equal(mate.stopReason,'mate');
 const escape=E.deepAI(pinned,config,seeded(13));
 assert(E.moves(pinned,'b').some(m=>same(m,escape.move)),'escape check without exposing king');
 assert(!E.check(E.play(pinned,escape.move),'b'),'selected reply actually resolves check');
 console.log(JSON.stringify({level,trapDepth:answer.depth,trapNodes:answer.nodes,mate:mate.stopReason,checkEscape:escape.move}));
}
assert.equal(JSON.stringify([trap,win,pinned]),snapshot,'search never mutates a caller-owned board');
// Deliberate interruption must return a legal completed-iteration fallback.
const b=E.initial(),cancelled=E.deepAI(b,{...E.levels[6],maxNodes:128,time:1000},seeded(17));
assert(E.moves(b,'b').some(m=>same(m,cancelled.move)));assert(cancelled.nodes<=129);assert.equal(cancelled.stopReason,'nodes');
const exhausted=E.deepAI(blank(),{...E.levels[6],time:100},seeded(11));assert.equal(exhausted.move,null);assert(Number.isFinite(exhausted.value));
// Colour/board reversal must not favour one side in the positional evaluator.
let board=E.play(E.initial(),{x:4,y:6,X:4,Y:5});
const mirrored=board.slice().reverse().map(row=>row.slice().reverse().map(p=>p?(p[0]==='r'?'b':'r')+p[1]:null));
assert.equal(E.evaluateAdvanced(board),-E.evaluateAdvanced(mirrored));
console.log('High-level budgets, tactical choices, legal replies, cancellation, no-move terminal, board immutability and evaluation symmetry passed');
