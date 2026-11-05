importScripts('./engine.js?v=masters-20261105');
self.onmessage=({data})=>{
 const level=Number(data.level),config=Number.isInteger(data.context?.masterRound)?XQ.masterConfig(data.context.masterRound):XQ.levels[level];
 if(level>=4&&config){const result=XQ.deepAI(data.board,config,Math.random,data.context);const {move,...stats}=result;self.postMessage({move,stats});}
 else self.postMessage({move:XQ.ai(data.board,level,Math.random,data.context)});
};

