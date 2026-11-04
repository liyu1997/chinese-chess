/* Product events are optional and must never affect play or authentication. */
(function () {
 'use strict';
 const config=window.MQAnalyticsConfig||{},enabled=config.enabled===true&&/^phc_[A-Za-z0-9_-]+$/.test(config.token||'');
 const queue=[],seen=new Set();let sdk=null,currentUser=null,ready=false,lastPage=null;
 const now=()=>Date.now();
 const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch{return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
 let stamps=store.get('mq-analytics-once-v1');if(!Array.isArray(stamps))stamps=[];
 stamps=stamps.filter(x=>Array.isArray(x)&&now()-x[1]<30*86400000).slice(-1000);
 function run(method,args){try{if(!enabled)return;if(ready)sdk[method](...args);else{if(queue.length>=100)queue.shift();queue.push([method,args])}}catch{}}
 function clean(properties){const result={};for(const [key,value]of Object.entries(properties||{})){if(/password|email|username|token|url|room_code/i.test(key))continue;if(typeof value==='string')result[key]=value.slice(0,100);else if(typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value))result[key]=value}return result}
 function track(event,properties={}){if(!enabled)return;run('capture',[event,{product:'xiangqi',app_version:config.version||'unknown',device_type:matchMedia('(max-width: 767px)').matches?'mobile':'desktop',browser_context:/MicroMessenger/i.test(navigator.userAgent)?'wechat':'browser',...clean(properties)}])}
 function once(key,event,properties,persist=false){if(seen.has(key)||persist&&stamps.some(x=>x[0]===key))return;seen.add(key);if(enabled&&persist){stamps.push([key,now()]);stamps=stamps.slice(-1000);store.set('mq-analytics-once-v1',stamps)}track(event,properties)}
 function game(properties){once('start:'+properties.game_id,'game_started',properties,true)}
 function firstMove(properties){once('first:'+properties.game_id,'first_move_made',properties,true)}
 function end(properties){once('end:'+properties.game_id,'game_ended',properties,true)}
 function page(view,skin,renderMs){if(lastPage===view)return;lastPage=view;track('page_viewed',{page:view});if(view==='home')track('home_viewed');if(view==='home'||view==='game')once('board:'+view,'board_ready',{page:view,skin,render_ms:Math.round(renderMs||0),since_navigation_ms:Math.round(performance.now())})}
 async function onlineState(room){try{
  // These are per-player observations of authoritative room state, not match totals.
  if(!enabled)return;
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(room.code+':'+(room.createdAt||'')));
  const id='online:'+Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join(''),props={game_id:id,mode:'online',side:room.side,time_minutes:room.timeMinutes||15,measurement_source:'client_observed_server_state'};
  if(room.status==='playing')once('online-start:'+id+':'+room.side,(room.moves||[]).length?'online_game_resumed':'online_game_started',props,true);
  if(room.status==='ended')once('online-end:'+id+':'+room.side,'online_game_ended',{...props,outcome:room.winner==='draw'?'draw':room.winner===room.side?'win':'loss',reason:room.endReason||'unknown',plies:(room.moves||[]).length},true);
 }catch{}}
 // Every public entry point catches telemetry failures, including storage/browser restrictions.
 window.MQAnalytics={};for(const [name,fn]of Object.entries({track,once,game,firstMove,end,page,onlineState}))window.MQAnalytics[name]=(...args)=>{try{return fn(...args)}catch{}};
 window.addEventListener('mq-auth',event=>{try{const id=event.detail?.user?.id||null;if(id===currentUser)return;if(currentUser)run('reset',[]);currentUser=id;if(id)run('identify',['mq:'+id])}catch{}});
 if(!enabled)return;
 let host;try{host=new URL(config.host);if(host.protocol!=='https:'||!['us.i.posthog.com','eu.i.posthog.com'].includes(host.hostname))return}catch{return}
 const source=host.origin.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js';
 // Keep analytics off the critical script/loading path. No replay or automatic click capture.
 setTimeout(()=>{try{const script=document.createElement('script');script.async=true;script.src=source;script.onerror=()=>{queue.length=0};script.onload=()=>{try{sdk=window.posthog;sdk.init(config.token,{
  api_host:host.origin,person_profiles:'identified_only',autocapture:false,capture_pageview:false,capture_pageleave:false,
  disable_session_recording:true,disable_surveys:true,capture_exceptions:false,capture_performance:false,enable_heatmaps:false,advanced_disable_feature_flags:true,respect_dnt:true,
  save_referrer:false,save_campaign_params:false,property_denylist:['$current_url','$referrer','$initial_current_url','$initial_referrer'],
  before_send:event=>{if(event?.properties){for(const key of ['$current_url','$referrer','$initial_current_url','$initial_referrer','$pathname','$search'])delete event.properties[key]}return event},
  loaded:instance=>{sdk=instance;ready=true;for(const [method,args]of queue.splice(0)){try{sdk[method](...args)}catch{}}}
 })}catch{queue.length=0}};document.head.append(script)}catch{queue.length=0}},0);
})();
