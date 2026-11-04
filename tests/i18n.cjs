const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/../dist/i18n.js','utf8');
function setup(saved,blocked=false){
 const storage=new Map(saved?[['miaoqi-language',saved]]:[]),nodes=[];
 const body={nodeType:1,dataset:{},closest:()=>null,hasAttribute:()=>false,querySelectorAll:()=>[]};
 const document={title:'妙棋手 · 来一局轻松的中国象棋',readyState:'loading',body,documentElement:{},addEventListener(){},getElementById(){return null},createTreeWalker(){let i=0;return {nextNode:()=>nodes[i++]||null}}};
 const context={document,window:{dispatchEvent(){}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return storage.get(k)},setItem(k,v){if(blocked)throw Error('blocked');storage.set(k,v)}},MutationObserver:class{observe(){}disconnect(){}},CustomEvent:class{},NodeFilter:{SHOW_TEXT:4}};
 vm.runInNewContext(code,context);return {i18n:context.window.MQI18n,document,storage,nodes};
}
const a=setup();assert.equal(a.i18n.language,'zh-CN');
const parent={closest:()=>null},text={nodeType:3,parentElement:parent,nodeValue:'  开启新局  '};a.nodes.push(text);
a.i18n.setLanguage('en');assert.equal(a.document.documentElement.lang,'en');assert.equal(text.nodeValue,'  New game  ');assert.equal(a.storage.get('miaoqi-language'),'en');
assert.equal(a.i18n.source({childNodes:[text]}),'  开启新局  ');
a.i18n.translate(text);assert.equal(text.nodeValue,'  New game  '); // no repeated translation
text.nodeValue='将军！请先解将';a.i18n.translate(text);assert.equal(text.nodeValue,'Check! Protect your general');
a.i18n.setLanguage('zh-CN');assert.equal(text.nodeValue,'将军！请先解将');
a.i18n.setLanguage('en');assert.equal(a.i18n.t('第 02 回合'),'Turn 02');assert.equal(a.i18n.t('红方确认认输？'),'Resign as Red?');
assert.equal(a.i18n.t('山隐正在凝思（最多约2秒）…'),'Shanyin is thinking (up to about 2 s)…');
assert.equal(a.i18n.t('房间 AB12CD34 · 你执红'),'Room AB12CD34 · You play Red');
assert.equal(a.i18n.t('下一步：把红车沿竖线向前移动四格，体会长距离的直线行动。'),'Next: Move the Red chariot forward four squares along the file.');
assert.equal(a.i18n.t('张三'),'张三');
const glyph={nodeType:3,nodeValue:'帥',parentElement:{closest:s=>s==='svg'?{}:null}};a.i18n.translate(glyph);assert.equal(glyph.nodeValue,'帥');
const username={nodeType:3,nodeValue:'高手',parentElement:{closest:s=>s.includes('[data-no-i18n]')?{}:null}};a.i18n.translate(username);assert.equal(username.nodeValue,'高手');
a.i18n.setLanguage('fr');assert.equal(a.i18n.language,'en');
assert.equal(setup('en').i18n.language,'en');assert.equal(setup('fr').i18n.language,'zh-CN');
const b=setup(null,true);b.i18n.setLanguage('en');assert.equal(b.i18n.t('悔棋'),'Undo');
const lesson=require('../dist/lessons.js');for(const l of lesson.lessons){for(const value of [l.title,l.summary,...l.points,l.mistake,l.takeaway,...l.steps.map(s=>s.text)])assert.ok(!/[\u3400-\u9fff]/.test(a.i18n.t(value)),l.id+': '+value)}
console.log('Language persistence, switching, dynamic text, canonical saves, protected names/glyphs, storage fallback and all 16 lesson translations passed.');
