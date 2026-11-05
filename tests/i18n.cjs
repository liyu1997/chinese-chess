const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/../dist/i18n.js','utf8');
function setup(saved,blocked=false){
 const storage=new Map(saved?[['miaoqi-language',saved]]:[]),nodes=[];
 const body={nodeType:1,dataset:{},closest:()=>null,hasAttribute:()=>false,querySelectorAll:()=>[]};
 const document={title:'妙棋手 · 来一局轻松的中国象棋',readyState:'loading',body,documentElement:{},addEventListener(){},getElementById(){return null},createTreeWalker(){let i=0;return {nextNode:()=>nodes[i++]||null}}};
 const context={document,window:{dispatchEvent(){}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return storage.get(k)},setItem(k,v){if(blocked)throw Error('blocked');storage.set(k,v)}},MutationObserver:class{observe(){}disconnect(){}},CustomEvent:class{},NodeFilter:{SHOW_TEXT:4}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/i18n-es.js','utf8'),context);
 vm.runInNewContext(code,context);return {i18n:context.window.MQI18n,document,storage,nodes,spanish:context.window.MQSpanish};
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
// Switching among all three languages must always recover the canonical source.
a.i18n.setLanguage('es');assert.equal(a.document.documentElement.lang,'es');
assert.equal(a.storage.get('miaoqi-language'),'es');assert.equal(text.nodeValue,'¡Jaque! Protege a tu general');
assert.equal(a.i18n.source({childNodes:[text]}),'将军！请先解将');
assert.equal(a.i18n.t('第 02 回合'),'Turno 02');
assert.equal(a.i18n.t('红方确认认输？'),'¿Rendirse con rojas?');
assert.equal(a.i18n.t('山隐正在凝思（最多约2.5秒）…'),'Shanyin está pensando (hasta unos 2,5 s)…');
assert.equal(a.i18n.t('房间 AB12CD34 · 你执红'),'Sala AB12CD34 · Juegas con rojas');
assert.equal(a.i18n.t('高清棋子加载中 · 2/32'),'Cargando piezas detalladas · 2/32');
assert.equal(a.i18n.t('红兵 1列7行'),'Soldado rojo columna 1, fila 7');
assert.equal(a.i18n.t('落子至 1列6行'),'Mover a columna 1, fila 6');
assert.equal(a.i18n.t('下一步：把红车沿竖线向前移动四格，体会长距离的直线行动。'),'Siguiente: Avanza el carro rojo cuatro intersecciones por la columna.');
assert.equal(a.i18n.t('第 1 课 · 约 2 分钟'),'Lección 1 · Unos 2 min');
assert.equal(a.i18n.t('已完成 3 / 16 课'),'Completadas 3 / 16 lecciones');
assert.equal(a.i18n.t('15分钟'),'15 min');assert.equal(a.i18n.t('张三'),'张三');
for(const [source,expected]of Object.entries(a.spanish)){assert.ok(expected.trim(),source);assert.equal(a.i18n.t(source),expected);assert.ok(!/[\u3400-\u9fff]/.test(expected),source)}
for(const l of lesson.lessons){for(const value of [l.title,l.summary,...l.points,l.mistake,l.takeaway,...l.steps.map(s=>s.text)])assert.equal(a.i18n.t(value),a.spanish[value],l.id+': '+value)}
a.i18n.translate(username);assert.equal(username.nodeValue,'高手');a.i18n.translate(glyph);assert.equal(glyph.nodeValue,'帥');
a.i18n.setLanguage('en');assert.equal(text.nodeValue,'Check! Protect your general');
a.i18n.setLanguage('zh-CN');assert.equal(text.nodeValue,'将军！请先解将');
assert.equal(setup('es').i18n.language,'es');
b.i18n.setLanguage('es');assert.equal(b.i18n.t('悔棋'),'Deshacer');
console.log('Spanish: all 609 messages, all 16 courses, dynamic counters, coordinates, three-way switching and persistence passed.');

