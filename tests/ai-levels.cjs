const assert=require('node:assert/strict');const E=require('../dist/engine.js');
const key=m=>JSON.stringify(m),sort=ms=>ms.map(key).sort();
function reference(b,s){const out=[];for(let y=0;y<10;y++)for(let x=0;x<9;x++)if(b[y][x]?.[0]===s)for(let Y=0;Y<10;Y++)for(let X=0;X<9;X++)if(E.pseudo(b,x,y,X,Y)){const m={x,y,X,Y};if(!E.check(E.play(b,m),s))out.push(m);}return out;}
let seed=42;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
let b=E.initial();
for(let ply=0;ply<80;ply++){
 const side=ply%2?'b':'r',snapshot=JSON.stringify(b),options=E.moves(b,side);
 assert.deepEqual(sort(options),sort(reference(b,side)),'optimized generator preserves every legal move');
 assert.equal(JSON.stringify(b),snapshot);if(!options.length)break;b=E.play(b,options[Math.floor(random()*options.length)]);
}
const blank=()=>Array.from({length:10},()=>Array(9).fill(null));
const trap=blank();trap[0][4]='bk';trap[9][4]='rk';trap[5][4]='rp';trap[4][0]='br';trap[5][0]='rp';trap[6][0]='rr';
const win=blank();win[0][4]='bk';win[9][4]='rk';win[5][4]='br';
for(const level of [4,5,6]){
 const snapshot=JSON.stringify(trap),answer=E.ai(trap,level,random);
 assert(E.moves(trap,'b').some(m=>key(m)===key(answer)));
 assert.notDeepEqual(answer,{x:0,y:4,X:0,Y:5},'avoid exchanging a rook for a defended pawn');
 assert.equal(JSON.stringify(trap),snapshot);
 const winning=E.ai(win,level,random);assert.equal(E.play(win,winning)[9][4],'br','find immediate decisive win');
 const config=E.levels[level],result=E.deepAI(E.initial(),config,random);
 assert(result.depth>=2);assert(result.elapsed<config.time+1000,'bounded thinking time');
 console.log(`Level ${level}: completed depth ${result.depth}, ${result.nodes} nodes in ${result.elapsed}ms; tactics passed`);
}
assert.equal(E.ai(blank(),6),null);
console.log('Move-generation equivalence across 80 plies, tactics, legal replies, input immutability and time bounds passed');
