const assert=require('node:assert/strict'),E=require('../dist/engine.js'),A=require('../dist/lessons.js');
assert.equal(new Set(A.lessons.map(l=>l.id)).size,A.lessons.length);
for(const stage of A.stages)assert(A.lessons.filter(l=>l.stage===stage.id).length>=3);
for(const l of A.lessons){let b=A.position(l,E);assert(!E.check(b,'r'),`${l.id}: red starts safely`);assert(!E.check(b,'b'),`${l.id}: black starts safely`);let lastSide=null;
 for(const [index,m] of l.steps.entries()){
  const side=b[m.y][m.x]?.[0];assert(side,`${l.id}: step ${index+1} has a piece`);if(lastSide)assert.notEqual(side,lastSide,`${l.id}: turns alternate`);
  assert(E.moves(b,side).some(a=>['x','y','X','Y'].every(k=>m[k]===a[k])),`${l.id}: step ${index+1} legal`);b=E.play(b,m);lastSide=side;
 }
 if(l.mate){assert(E.check(b,'b'),`${l.id}: check`);assert.equal(E.moves(b,'b').length,0,`${l.id}: checkmate`);}
 console.log(`${l.id}: ${l.steps.length} legal teaching steps${l.mate?', verified checkmate':''}`);
}
console.log(`All ${A.lessons.length} lessons validated across ${A.stages.length} stages`);
