const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),XQ=require('../dist/engine.js');
const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
assert.match(html,/<script defer src="online\.js\?/,'first load must include online script directly');
const click=app.slice(app.indexOf('function click(x,y){'),app.indexOf('\nfunction audio()'));
let submitted=[],localMoves=0,allowed=false;
const c=vm.createContext({window:{MQOnline:{canMove:()=>allowed,move:m=>submitted.push(m)}},board:XQ.initial(),turn:'r',legal:XQ.moves(XQ.initial(),'r'),selected:null,pageView:'game',mode:'online',busy:false,ended:false,draw(){},move(){localMoves++},computer(){},toast(){}});
vm.runInContext(click,c);c.click(0,6);assert.equal(c.selected,null,'waiting/opponent turn cannot select a piece');allowed=true;c.click(0,6);c.click(0,5);assert.equal(submitted.length,1);assert.equal(localMoves,0,'online move must go to server before changing local board');assert.equal(c.board[6][0],'rp');
const source=fs.readFileSync(require.resolve('../dist/online.js'),'utf8');
const apply=source.slice(source.indexOf('function applyRoom(){'),source.indexOf('\nfunction render(){'));
let replay=XQ.initial();const moves=[{x:0,y:6,X:0,Y:5,piece:'rp',captured:null},{x:0,y:3,X:0,Y:4,piece:'bp',captured:null}];for(const m of moves)replay=XQ.play(replay,m);
Object.assign(c,{XQ,room:{board:replay,turn:'r',last:moves[1],moves,status:'playing',winner:null},active:true,history:[],drawAgreed:false,resignedSide:null});vm.runInContext(apply,c);c.applyRoom();assert.equal(c.history.length,2);assert.equal(c.history[0].board[6][0],'rp');assert.equal(c.history[1].board[5][0],'rp');assert.doesNotThrow(()=>XQ.checkStreak(c.history,c.board,'r'),'synced history supports long-check detection');assert.equal(c.board[4][0],'bp');
console.log('Online entry, turn guard, server submission, board synchronization and replay history checks passed.');
let readyCallback;const bootstrap=vm.createContext({window:{},document:{readyState:'loading',addEventListener(name,fn){assert.equal(name,'DOMContentLoaded');readyCallback=fn}}});vm.runInContext(source,bootstrap);assert.equal(typeof readyCallback,'function');assert.equal(bootstrap.window.MQOnline,undefined,'legacy service worker injection must wait for app initialization');
(async()=>{
 const invite=vm.createContext({URL,location:{origin:'https://xiangqi.jujuli.com.cn'},room:{code:'AABBCCDD'}});vm.runInContext(source.slice(source.indexOf('function inviteLink(){'),source.indexOf('\nasync function copyLink')),invite);assert.equal(invite.inviteLink(),'https://xiangqi.jujuli.com.cn/?room=AABBCCDD#game');
 let request,installed;const elements={};const dialog={querySelector(key){if(key==='.resume')return null;return elements[key]||(elements[key]={disabled:false,value:'',textContent:''})},querySelectorAll(){return []},close(){}};
 const lobby=vm.createContext({user:{id:'a'},pendingInvite:null,room:null,randomCode:()=> '1234ABCD',modal:()=>dialog,api:async(path,data)=>{request={path,data};return {code:data.code}},installRoom:r=>{installed=r}});vm.runInContext(source.slice(source.indexOf('function open(){'),source.indexOf('\nfunction inviteLink')),lobby);lobby.open();assert.equal(elements['.mq-code-preview'].textContent,'1234ABCD');assert.equal(request,undefined,'previewing a room must not create it');await elements['.create'].onclick();assert.equal(request.data.code,'1234ABCD');assert.equal(installed.code,'1234ABCD');
 // Local display responds immediately, but the authoritative room is untouched until confirmed.
 let rejectMove;Object.assign(c,{active:true,connected:true,sending:false,generation:1,timer:0,socket:null,audio(){},render(){},clearTimeout(){},schedule(){},api:()=>new Promise((resolve,reject)=>{rejectMove=reject})});
 c.room={code:'AABBCCDD',board:XQ.initial(),turn:'r',last:null,moves:[],status:'playing',winner:null,revision:2};c.board=XQ.initial();c.turn='r';
 vm.runInContext(source.slice(source.indexOf('async function action(type'),source.indexOf('\nfunction confirmation')),c);
 const operation=c.action('move',{x:0,y:6,X:0,Y:5});assert.equal(c.board[5][0],'rp');assert.equal(c.room.board[6][0],'rp');assert.equal(c.sending,true);
 rejectMove(Object.assign(Error('stale'),{status:409}));await operation;assert.equal(c.board[6][0],'rp','failed optimistic moves restore the authoritative board');assert.equal(c.sending,false);
 // Actual browser-password-manager calls are mocked; regular storage contains account names only.
 class Element{constructor(){this.children=new Map();this.checked=false;this.value='';this.tagName='DIV'}querySelector(k){if(!this.children.has(k)){const e=new Element();if(k==='.remember-account')e.checked=true;this.children.set(k,e)}return this.children.get(k)}append(){}remove(){}insertAdjacentElement(){}focus(){this.focused=true}}
 const values=new Map(),stores=[];let submits=0;
 class Credential{constructor(v){Object.assign(this,v)}}
 const credentials={store:async v=>stores.push(v),get:async()=>({id:'remember@example.com',password:'qa-test-password'})};
 const memoryContext=vm.createContext({window:{PasswordCredential:Credential},PasswordCredential:Credential,navigator:{credentials},localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},document:{createElement:()=>new Element(),head:{append(){}}}});
 vm.runInContext(fs.readFileSync(require.resolve('../dist/auth-memory.js'),'utf8'),memoryContext);
 const form=new Element();form.requestSubmit=()=>submits++;const username=new Element(),password=new Element();password.value='qa-test-password';
 const memory=memoryContext.window.GameAccounts.mount(form,username,password);memory.box.querySelector('.remember-password').checked=true;memory.remember({username:'remember@example.com'});
 assert.equal(stores.length,1);assert.equal(stores[0].password,'qa-test-password');assert.equal([...values.values()].some(v=>v.includes('qa-test-password')),false,'passwords must never be persisted in ordinary local storage');
 await memory.box.querySelector('.saved-login').onclick();assert.equal(username.value,'remember@example.com');assert.equal(password.type,'password');assert.equal(submits,1);
 memory.box.querySelector('select').value='other@example.com';memory.box.querySelector('select').onchange();assert.equal(password.value,'','switching accounts clears the previous password');
 console.log('Invite link, confirm-only room creation, optimistic rollback, account selection and native password storage checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
