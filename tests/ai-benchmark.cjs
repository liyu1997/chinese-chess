// Optional old-engine path makes the before/after comparison reproducible.
// Run in isolation: other CPU-heavy jobs alter the number of nodes reached per second.
const path=require('node:path');const E=require('../dist/engine.js');
const engines=process.argv[2]?[['before',require(path.resolve(process.argv[2]))],['after',E]]:[['after',E]];
for(const[label,engine]of engines){
 const b=engine.play(engine.initial(),{x:4,y:6,X:4,Y:5});
 for(const level of[5,6]){
  const result=engine.deepAI(b,engine.levels[level],()=>0.5);
  console.log(JSON.stringify({engine:label,position:'initial-red-central-pawn-forward',level,budgetMs:engine.levels[level].time,maxDepth:engine.levels[level].depth,...result}));
 }
}
