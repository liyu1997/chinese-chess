const assert=require('node:assert/strict');
const vm=require('node:vm');const fs=require('node:fs');const E=require('../dist/engine.js');
const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
function game(board=E.initial()){
 const elements={};const $=id=>elements[id]||(elements[id]={textContent:'',open:false,focus(){},showModal(){this.open=true;this.shown=(this.shown||0)+1},close(){this.open=false},addEventListener(){}});
 const c=vm.createContext({XQ:E,$,board,turn:'r',history:[],last:null,selected:null,legal:E.moves(board,'r'),ended:false,drawAgreed:false,drawOffer:null,mode:'local',busy:false,pageView:'game',epoch:0,audio(){},save(){},draw(){},toast(t){c.toastText=t},showResult(){c.results=(c.results||0)+1},computer(){}});
 vm.runInContext(app.slice(app.indexOf('function move(m){'),app.indexOf('\nfunction computer()')),c);return {c,$,move(m){assert(E.moves(c.board,c.turn).some(a=>JSON.stringify(a)===JSON.stringify(m)),'test move must be legal');c.move(m)}};
}
let g=game();g.c.offerDraw();assert(!g.c.ended);g.c.acceptDraw();assert.equal(g.c.drawOffer.phase,'respond');assert(!g.c.ended,'sending a proposal is not agreement');g.c.declineDraw();assert(!g.c.ended,'declining keeps game active');g.c.offerDraw();g.c.acceptDraw();g.c.acceptDraw();assert(g.c.ended&&g.c.drawAgreed);assert.equal(g.c.results,1);
g=game();g.c.mode='ai';g.c.offerDraw();g.c.acceptDraw();assert(!g.c.ended,'AI can refuse an early offer');assert.match(g.c.toastText,/未同意/);
assert.equal(E.acceptsDraw(E.initial(),0),false);assert.equal(E.acceptsDraw(E.initial(),20),true);
const blank=()=>Array.from({length:10},()=>Array(9).fill(null));let b=blank();b[0][4]='bk';b[9][4]='rk';b[5][4]='rp';b[2][3]='rr';
g=game(b);const cycle=[{x:3,y:2,X:4,Y:2},{x:4,y:0,X:3,Y:0},{x:4,y:2,X:3,Y:2},{x:3,y:0,X:4,Y:0}];
for(let i=0;i<8;i++)g.move(cycle[i%4]);assert.equal(E.checkStreak(g.c.history,g.c.board,'r'),4);assert(!g.$('longCheckDialog').open,'no warning at four checks');assert(!g.c.ended,'three repeated positions must not auto-draw');
g.move(cycle[0]);assert.equal(E.checkStreak(g.c.history,g.c.board,'r'),5);assert(g.$('longCheckDialog').open);assert.match(g.$('longCheckMessage').textContent,/连续 5 回合/);assert(!g.c.ended,'long check warns without ending game');
let undo=g.c.history.pop();g.c.board=undo.board;g.c.turn=undo.turn;assert.equal(E.checkStreak(g.c.history,g.c.board,'r'),4,'undo restores streak');
// A quiet move on that side resets its consecutive-check count.
g.move({x:3,y:2,X:2,Y:2});assert.equal(E.checkStreak(g.c.history,g.c.board,'r'),0);
g=game();g.c.history=Array.from({length:120},(_,i)=>({board:E.initial(),turn:i%2?'b':'r',captured:false}));g.move({x:0,y:6,X:0,Y:5});assert(!g.c.ended,'120 non-capturing plies must not auto-draw');
console.log('Agreement, refusal, AI response, repetition, 120 plies, five-check boundary, quiet move and undo checks passed.');
