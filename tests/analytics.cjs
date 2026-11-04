const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../dist/analytics.js','utf8');
function boot(enabled=true,storage=new Map()){
 const events=[],identities=[],listeners={},scripts=[];let options,resets=0;
 const sdk={capture:(...a)=>events.push(a),identify:id=>identities.push(id),reset:()=>resets++,init(token,o){options=o;o.loaded(sdk)}};
 const window={MQAnalyticsConfig:{enabled,token:'phc_test',host:'https://us.i.posthog.com'},posthog:sdk,addEventListener:(name,fn)=>listeners[name]=fn};
 const context={window,URL,TextEncoder,crypto:require('node:crypto').webcrypto,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:true}),navigator:{userAgent:'MicroMessenger'},performance:{now:()=>250},document:{createElement:()=>({}),head:{append:s=>scripts.push(s)}},setTimeout:fn=>fn()};
 vm.runInNewContext(source,context);
 return {api:window.MQAnalytics,events,identities,listeners,scripts,load(){scripts[0].onload()},get options(){return options},get resets(){return resets}};
}
(async()=>{
 const storage=new Map(),a=boot(true,storage);
 a.api.game({game_id:'g1',mode:'ai',email:'secret@example.com',password:'secret',token:'secret'});
 a.api.game({game_id:'g1'});a.load();
 assert.equal(a.events.length,1,'one start per match even before SDK loads');
 assert.equal(a.events[0][1].email,undefined);assert.equal(a.events[0][1].password,undefined);assert.equal(a.events[0][1].token,undefined);
 a.api.end({game_id:'g1',outcome:'win'});a.api.end({game_id:'g1',outcome:'win'});
 assert.equal(a.events.filter(e=>e[0]==='game_ended').length,1,'reopening results cannot double count');
 a.listeners['mq-auth']({detail:{user:{id:'123',username:'private@example.com'}}});
 a.listeners['mq-auth']({detail:{user:{id:'123'}}});assert.deepEqual(a.identities,['mq:123']);
 a.listeners['mq-auth']({detail:{user:null}});assert.equal(a.resets,1,'logout rotates SDK identity');
 const event={properties:{$current_url:'https://example/?room=secret',$referrer:'https://example/?token=secret',mode:'ai'}};
 a.options.before_send(event);assert.equal(event.properties.$current_url,undefined);assert.equal(event.properties.$referrer,undefined);
 assert.equal(a.options.autocapture,false);assert.equal(a.options.disable_session_recording,true);
 const room={code:'ABCDEF12',side:'r',createdAt:123,status:'ended',winner:'r',moves:[]};
 await a.api.onlineState(room);await a.api.onlineState(room);
 const online=a.events.filter(e=>e[0]==='online_game_ended');assert.equal(online.length,1);assert(!JSON.stringify(online).includes(room.code),'invitation codes never leave the browser');
 const b=boot(true,storage);b.load();b.api.end({game_id:'g1'});assert.equal(b.events.length,0,'refreshing retains result deduplication');
 const disabled=boot(false);disabled.api.track('anything');assert.equal(disabled.scripts.length,0);assert.equal(disabled.events.length,0,'unconfigured installations send nothing');
 const failed=boot();failed.scripts[0].onerror();assert.doesNotThrow(()=>failed.api.track('play'));
 console.log('Analytics deduplication, identity reset, sensitive-data filtering, disabled configuration and SDK failure isolation passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
