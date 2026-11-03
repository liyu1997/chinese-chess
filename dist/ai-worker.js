importScripts('./engine.js?v=quick-master-20261103');
self.onmessage=({data})=>{
 const level=Number(data.level),config=XQ.levels[level];
 if(level>=4&&config){const result=XQ.deepAI(data.board,config,Math.random,data.context);const {move,...stats}=result;self.postMessage({move,stats});}
 else self.postMessage({move:XQ.ai(data.board,level,Math.random,data.context)});
};
