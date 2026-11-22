const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=name=>fs.readFileSync(__dirname+'/../dist/'+name,'utf8');
function fixture(saved='en'){
 const storage=new Map([['miaoqi-language',saved]]),events=new Map(),scripts=[],notices=[],timers=new Map();let timerId=0;
 const select={value:saved,attributes:{},setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},addEventListener(){}};
 const body={nodeType:1,dataset:{},closest:()=>null,hasAttribute:()=>false,querySelectorAll:()=>[]};
 const document={title:'妙棋手 · 来一局轻松的中国象棋',readyState:'loading',documentElement:{},body,baseURI:'https://example.test/',getElementById:()=>select,createTreeWalker:()=>({nextNode:()=>null}),addEventListener(k,v){events.set(k,v)},createElement(tag){assert.equal(tag,'script');return {remove(){this.removed=true}}},head:{append(s){scripts.push(s)}}};
 const window={addEventListener(k,v){events.set(k,v)},dispatchEvent(e){events.get(e.type)?.(e)},toast:t=>notices.push(t)};
 const ctx=vm.createContext({window,document,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},MutationObserver:class{observe(){}disconnect(){}},NodeFilter:{SHOW_TEXT:4},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},setTimeout(fn){const id=++timerId;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id)});
 vm.runInContext(read('i18n-es.js'),ctx);vm.runInContext(read('i18n.js'),ctx);
 function load(locale,script=scripts.find(s=>s.src.includes('i18n-'+locale+'.js')&&!s.removed)){
  vm.runInContext(read('i18n-'+locale+'.js'),ctx);script.onload();
 }
 return {api:window.MQI18n,window,document,select,storage,scripts,notices,timers,load,emit:e=>window.dispatchEvent(e),init:()=>events.get('DOMContentLoaded')()};
}
(async()=>{
 const a=fixture();a.init();assert.equal(a.scripts.length,0); // existing locales make no extra requests
 const first=a.api.setLanguage('fr');assert.equal(a.scripts.length,1);assert.equal(a.select.attributes['aria-busy'],'true');
 assert.equal(a.api.language,'en');assert.equal(a.storage.get('miaoqi-language'),'en');
 a.emit({type:'mq-auth',detail:{user:{id:'user'}}});assert.equal(a.scripts.length,1); // login cannot cancel a manual choice
 a.load('fr');assert.equal(await first,true);assert.equal(a.api.language,'fr');assert.equal(a.document.documentElement.dir,'ltr');assert.equal(a.storage.get('miaoqi-language'),'fr');
 a.api.setLanguage('en');assert.equal(a.api.setLanguage('fr'),true);assert.equal(a.scripts.length,1); // already loaded
 const de=a.api.setLanguage('de'),ar=a.api.setLanguage('ar');a.load('de');assert.equal(await de,false);assert.equal(a.api.language,'fr');
 a.load('ar');assert.equal(await ar,true);assert.equal(a.api.language,'ar');assert.equal(a.document.documentElement.dir,'rtl');
 assert.equal(a.select.attributes['aria-busy'],undefined);
 const failed=a.api.setLanguage('it'),broken=a.scripts.at(-1);broken.onerror();assert.equal(await failed,false);assert.equal(a.api.language,'ar');assert.equal(a.select.value,'ar');assert.equal(a.storage.get('miaoqi-language'),'ar');assert.ok(broken.removed);assert.ok(a.notices.at(-1).includes('تعذر'));
 const retry=a.api.setLanguage('it');assert.notEqual(a.scripts.at(-1),broken);a.load('it');assert.equal(await retry,true);assert.equal(a.api.language,'it');assert.equal(a.document.documentElement.dir,'ltr');
 const b=fixture();b.init();const b1=b.api.setLanguage('fr'),b2=b.api.setLanguage('fr');assert.equal(b.scripts.length,1);b.load('fr');assert.equal(await b1,false);assert.equal(await b2,true);
 const c=fixture();c.init();const old=c.api.setLanguage('ar');c.api.setLanguage('zh-CN');c.load('ar');assert.equal(await old,false);assert.equal(c.api.language,'zh-CN');assert.equal(c.document.documentElement.dir,'ltr');
 const d=fixture();d.init();const timed=d.api.setLanguage('de');[...d.timers.values()][0]();assert.equal(await timed,false);assert.equal(d.api.language,'en');assert.equal(d.timers.size,0);
 const e=fixture();e.init();const incomplete=e.api.setLanguage('de');e.scripts[0].onload();assert.equal(await incomplete,false);assert.equal(e.api.language,'en');
 const startup=fixture('ar');startup.init();assert.equal(startup.scripts.length,1);startup.load('ar');await new Promise(setImmediate);assert.equal(startup.api.language,'ar');assert.equal(startup.document.documentElement.dir,'rtl');assert.equal(startup.select.value,'ar');
 assert.equal(startup.api.setLanguage('unknown'),false);assert.equal(startup.scripts.length,1);
 console.log('Lazy locale loading, saved startup locale, no eager downloads, login race, last-choice wins, cache reuse, timeout, failure and retry passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
