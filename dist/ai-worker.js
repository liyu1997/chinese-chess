importScripts('./engine.js?v=variety31');
self.onmessage=({data})=>{const move=XQ.ai(data.board,data.level,Math.random,data.context);self.postMessage({move});};
