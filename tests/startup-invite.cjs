const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/../dist/index.html','utf8');
const initial=html.match(/<g data-initial-board="true"[\s\S]*?<\/svg>/)[0];
assert.equal((initial.match(/class="initial-piece"/g)||[]).length,32,'first HTML response must include all pieces without JS');
assert(initial.includes('<path'),'first response contains grid lines');
const src=fs.readFileSync(__dirname+'/../dist/online.js','utf8');
class El{constructor(){this.open=true;this.map={};this.events={};}querySelector(s){return this.map[s]??=new El()}setAttribute(k,v){this[k]=v}removeAttribute(k){delete this[k]}addEventListener(k,v){this.events[k]=v}close(){this.open=false}}
(async()=>{
 let requests=[],installed=[],current;
 const ctx=vm.createContext({AbortController,URL,Error,TypeError,location:{href:'https://xiangqi.jujuli.com.cn/?room=ABCDEF12#game'},window:{history:{replaceState(){}}},localStorage:{removeItem(){}},KEY:'room',pendingInvite:'ABCDEF12',user:{id:'test'},dialog:null,mode:'ai',draftMode:'ai',navigate(){},suspend(){},open(){},renderUser(){},login(){},modal(){if(current)current.open=false;current=new El();ctx.dialog=current;return current},api:(path,data,signal)=>new Promise((resolve,reject)=>requests.push({path,data,signal,resolve,reject})),installRoom:r=>installed.push(r)});
 vm.runInContext(src.slice(src.indexOf('let inviteAttempt='),src.indexOf('\nfunction open(){')),ctx);
 const first=ctx.joinInvite('ABCDEF12');assert.equal(current.querySelector('.reason').textContent,undefined);assert(current.querySelector('.sub').onclick,'exit works while pending');
 ctx.leaveInvite();assert(requests[0].signal.aborted,'leaving aborts the request');requests[0].resolve({code:'ABCDEF12'});await first;assert.equal(installed.length,0,'late success cannot pull visitor back into a room');
 const second=ctx.joinInvite('ABCDEF12');requests[1].reject(Object.assign(Error('gone'),{status:404}));await second;assert.equal(current.querySelector('.main').hidden,true,'expired invitation does not offer endless retry');assert.equal(current.querySelector('h2').textContent,'这个房间已失效');
 const third=ctx.joinInvite('ABCDEF12');requests[2].reject(Object.assign(Error('timeout'),{name:'AbortError'}));await third;assert.equal(current.querySelector('.main').disabled,false);assert.equal(current.querySelector('.main').textContent,'重新尝试');assert(current.querySelector('.reason').textContent.includes('连接超时'));
 const fourth=current.querySelector('.main').onclick();assert.equal(requests.length,4,'retry immediately issues another request');requests[3].resolve({code:'ABCDEF12'});await fourth;assert.equal(installed.length,1);
 console.log('Static first paint, cancellable invite, stale response suppression, expired room and retry checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
