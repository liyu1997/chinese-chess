/* Resolution-independent clay terrain. Grid and pieces are separate interactive layers. */
window.drawPlayfulTerrain=function(svg,variant){
 if(variant!=="vector"){
 const ns="http://www.w3.org/2000/svg";const group=document.createElementNS(ns,"g");group.setAttribute("class","terrain-art");group.setAttribute("pointer-events","none");group.setAttribute("aria-hidden","true");
 for(const [sy,sh,y,h]of [[24,626,-8,292],[650,175,284,56],[825,613,340,292]]){const viewport=document.createElementNS(ns,"svg");for(const[k,v]of Object.entries({x:20,y,width:520,height:h,viewBox:`20 ${sy} 984 ${sh}`,preserveAspectRatio:"none",overflow:"hidden",style:`width:520px;height:${h}px;overflow:hidden`}))viewport.setAttribute(k,v);const img=document.createElementNS(ns,"image");for(const[k,v]of Object.entries({href:"./assets/q-hd/riverside-terrain.png",width:1024,height:1536}))img.setAttribute(k,v);viewport.append(img);group.append(viewport)}svg.append(group);return;
 }
 const NS='http://www.w3.org/2000/svg';
 const layer=document.createElementNS(NS,'g');layer.setAttribute('class','terrain-art');layer.setAttribute('aria-hidden','true');layer.setAttribute('pointer-events','none');
 layer.innerHTML=`<defs>
 <linearGradient id="t-leaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#cbd6ac"/><stop offset=".42" stop-color="#acbf8f"/><stop offset="1" stop-color="#7e956d"/></linearGradient>
 <linearGradient id="t-willow" x1="0" x2="1" y2=".4"><stop stop-color="#c8d5a6"/><stop offset=".45" stop-color="#aabb88"/><stop offset="1" stop-color="#7d9667"/></linearGradient>
 <linearGradient id="t-trunk" x2="1" y2="0"><stop stop-color="#bca37e"/><stop offset=".4" stop-color="#d2bc97"/><stop offset="1" stop-color="#a48d6a"/></linearGradient>
 <linearGradient id="t-hill" x2=".3" y2="1"><stop stop-color="#d4dcc0"/><stop offset="1" stop-color="#a5b292"/></linearGradient>
 <linearGradient id="t-river" x2=".1" y2="1"><stop stop-color="#8ac6cb"/><stop offset=".3" stop-color="#b6e1df"/><stop offset=".75" stop-color="#a0d8d8"/><stop offset="1" stop-color="#87bfc4"/></linearGradient>
 <linearGradient id="t-bank" x2="0" y2="1"><stop stop-color="#fff6e4"/><stop offset="1" stop-color="#e6d7bd"/></linearGradient>
 <linearGradient id="t-stone" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fffcf0"/><stop offset="1" stop-color="#d3ccb8"/></linearGradient>
 <linearGradient id="t-blue" x2="1" y2="1"><stop stop-color="#b4c0c5"/><stop offset="1" stop-color="#748792"/></linearGradient>
 <linearGradient id="t-red" x2="1" y2="1"><stop stop-color="#e5b09a"/><stop offset="1" stop-color="#b97962"/></linearGradient>
 <linearGradient id="t-canvas" x2=".5" y2="1"><stop stop-color="#fff7e6"/><stop offset="1" stop-color="#d8c5a5"/></linearGradient>
 <linearGradient id="t-boat" x2="0" y2="1"><stop stop-color="#d3b58b"/><stop offset="1" stop-color="#9b7951"/></linearGradient>
 <filter id="t-shadow" x="-50%" y="-45%" width="200%" height="210%" color-interpolation-filters="sRGB"><feDropShadow dx=".5" dy="1.2" stdDeviation=".7" flood-color="#80714e" flood-opacity=".20"/></filter>
 <g id="t-tree"><ellipse cx="0" cy="4" rx="7" ry="2" fill="#998765" opacity=".12"/><rect x="-1.3" y="-6" width="2.6" height="10" rx="1.3" fill="url(#t-trunk)"/><path d="M-7-6C-8-15-5-23 0-23S8-14 7-6C6 2 1 1 0-1C-3 2-6 0-7-6Z" fill="url(#t-leaf)" filter="url(#t-shadow)"/><path d="M-4-12C-4-17-2-20 0-20" stroke="#e0e7cc" stroke-width="1" opacity=".32" fill="none" stroke-linecap="round"/></g>
 <g id="t-bush"><ellipse cx="0" cy="0" rx="8" ry="2" fill="#95845e" opacity=".11"/><path d="M-9 0C-12-5-9-10-5-8C-3-17 5-14 5-7C12-10 14-1 9 0Z" fill="url(#t-leaf)" filter="url(#t-shadow)"/></g>
 <g id="t-rock"><path d="M-7 0C-11-3-5-11 0-10C5-10 11-2 7 0C4 2-5 2-7 0Z" fill="url(#t-stone)" filter="url(#t-shadow)"/></g>
 <g id="t-willow-tree"><ellipse cx="0" cy="1" rx="18" ry="4" fill="#8b805c" opacity=".15"/><path d="M0 1V-22" stroke="url(#t-trunk)" stroke-width="5" stroke-linecap="round"/><path d="M-19-7C-25-9-18-35-9-34C-6-43 9-43 13-34C23-32 27-10 20-7C14-5 16-29 10-29C16-6 9 4 5-8C2-18 7-35 0-33C-6-30 1-5-6-5C-13-4-8-30-12-27C-18-23-12-6-19-7Z" fill="url(#t-willow)" filter="url(#t-shadow)"/>
 <path d="M-14-26Q-18-17-17-11M-5-32Q-9-22-7-11M6-32Q11-23 10-11" stroke="#e0e8bf" opacity=".35" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>
 </defs>`;
 svg.append(layer);
 const add=(tag,a,p=layer)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a))el.setAttribute(k,v);p.append(el);return el};
 const use=(id,x,y,s=1)=>add('use',{href:'#t-'+id,transform:`translate(${x} ${y}) scale(${s})`});
 const hill=(x,y,w,h)=>add('path',{d:`M${x-w} ${y}Q${x-w*.64} ${y-h*.05} ${x-w*.3} ${y-h*.75}Q${x} ${y-h*1.24} ${x+w*.3} ${y-h*.72}Q${x+w*.72} ${y-h*.05} ${x+w} ${y}Z`,fill:'url(#t-hill)'});
 // Continuous low ground at the ends, with no second lip or ornamental arch.
 for(const y of [22,620]){
   hill(136,y,28,14);hill(287,y,29,17);hill(420,y,22,11);
   for(const [x,s]of [[40,.55],[62,.85],[91,.5],[174,.6],[208,.48],[247,.52],[326,.75],[357,.5],[392,.45],[486,.6],[512,.42]])use('tree',x,y,s);
   use('willow-tree',194,y,.64);use('willow-tree',459,y,.65);
   for(const x of [49,80,114,160,232,270,310,344,377,405,436,499])use('bush',x,y+2,.43);
   for(const x of [102,221,368,477])use('rock',x,y+2,.45);
 }
 // The meandering paths are shallow relief in the cream surface.
 for(const d of ['M91 89C72 113 117 126 87 154S87 207 119 224S95 259 72 268','M463 87C482 110 441 135 467 158S448 208 447 239S472 256 484 268','M88 365C63 385 109 402 91 429S112 469 99 507S77 523 91 538','M466 364C487 385 449 400 471 431S449 474 462 507S482 524 464 539']){
 add('path',{d,fill:'none',stroke:'#dcc9a3','stroke-width':7,opacity:'.18','stroke-linecap':'round'});
 add('path',{d,fill:'none',stroke:'#fff4dc','stroke-width':5.8,opacity:'.72','stroke-linecap':'round'});
 }
 for(const [x,y,s]of [[83,119,.58],[183,126,.67],[392,121,.62],[474,118,.62],[166,182,.66],[425,177,.74],[186,252,.6],[417,251,.62],[83,403,.6],[181,403,.52],[391,402,.52],[466,404,.65],[168,459,.65],[416,461,.62],[186,515,.65],[473,516,.61]]){use('tree',x,y,s);use('bush',x+8,y+2,s*.6);}
 for(const [x,y,s]of [[150,209,.5],[224,261,.5],[367,258,.55],[443,210,.5],[222,369,.46],[367,367,.43],[145,493,.5],[420,491,.5]])use('bush',x,y,s);
 // Camps occupy cell interiors. All ninety playable intersections stay free.
 function camp(x,y,team,s){const g=add('g',{transform:`translate(${x} ${y}) scale(${s})`,filter:'url(#t-shadow)'});const c='url(#t-'+team+')';
 add('ellipse',{cx:0,cy:4,rx:20,ry:3,fill:'#b2a281',opacity:'.12'},g);
 add('path',{d:'M-19 3L-7-25Q-5-28-3-24L13 2L3 6Z',fill:c},g);
 add('path',{d:'M-7-25L-3 5L20 0L5-26Z',fill:'url(#t-canvas)'},g);
 add('path',{d:'M-7-25L-19 3L-11 5L-3-19Z',fill:'url(#t-canvas)'},g);
 add('path',{d:'M0 5L4-10L10 3Z',fill:c},g);
 add('path',{d:'M-7-25L-3-19L5-26',fill:'none',stroke:'#fff9ec','stroke-width':1,opacity:'.7'},g);
 add('path',{d:'M12-25V-43',stroke:'#af9572','stroke-width':2,'stroke-linecap':'round'},g);
 add('path',{d:'M13-42Q19-46 25-41L24-31Q19-36 13-32Z',fill:c},g);
 }
 camp(111,230,'blue',.72);camp(449,230,'blue',.72);camp(111,490,'red',.72);camp(449,490,'red',.72);
 const river='M25 292Q58 277 92 291T162 293T238 291T313 293T392 290T469 292Q506 281 535 293L535 333Q504 345 470 333T397 333T319 332T241 334T164 333T88 332Q54 345 25 331Z';
 add('path',{d:river,fill:'url(#t-bank)',stroke:'#dfceb0','stroke-width':1,transform:'translate(0 -.8)'});
 add('path',{d:'M26 298Q59 284 92 298T162 299T238 298T313 299T392 296T469 298Q506 287 534 298L534 328Q504 339 470 327T397 327T319 326T241 328T164 327T88 326Q54 338 26 326Z',fill:'url(#t-river)'});
 for(const [x,y,w]of [[174,311,36],[250,302,30],[295,319,36],[354,308,29]]){
  add('path',{d:`M${x} ${y}q${w*.25}-4 ${w*.5} 0t${w*.5} 0`,fill:'none',stroke:'#6ab0b7','stroke-width':2.1,opacity:'.25',transform:'translate(.1 .9)','stroke-linecap':'round'});
  add('path',{d:`M${x} ${y}q${w*.25}-4 ${w*.5} 0t${w*.5} 0`,fill:'none',stroke:'#dbf6ed','stroke-width':1.6,opacity:'.85','stroke-linecap':'round'});
 }
 function boat(x,y,team){const g=add('g',{transform:`translate(${x} ${y}) scale(.74)`});
 add('ellipse',{cx:0,cy:7,rx:29,ry:6,fill:'none',stroke:'#d4f4ed','stroke-width':1.4,opacity:'.7'},g);
 add('path',{d:'M-23 0Q0 12 24-3Q17 16-9 13Q-20 11-23 0Z',fill:'url(#t-boat)',filter:'url(#t-shadow)'},g);
 add('path',{d:'M-23 0Q0 12 24-3',fill:'none',stroke:'#edd9b8','stroke-width':2,'stroke-linecap':'round'},g);
 for(const [xx,yy]of [[-13,-8],[-3,-11],[4,-7]]){add('rect',{x:xx,y:yy,width:8,height:11,rx:1.3,fill:'url(#t-canvas)',stroke:'#c5b28f','stroke-width':'.4'},g);add('path',{d:`M${xx+4} ${yy}v11`,stroke:'#c8b693','stroke-width':'.65'},g);}
 add('path',{d:'M12-1V-28',stroke:'#ac8d63','stroke-width':1.8,'stroke-linecap':'round'},g);
 add('path',{d:'M13-27Q19-31 26-26L25-18Q19-23 13-19Z',fill:'url(#t-'+team+')'},g);
 }
 boat(118,314,'blue');boat(448,314,'red');
 for(const [x,y,s]of [[47,302,.82],[57,340,.61],[509,301,.84],[513,342,.58]])use('willow-tree',x,y,s);
 for(const [x,y,s]of [[76,289,.6],[163,290,.45],[396,288,.56],[484,338,.5],[140,336,.45],[341,337,.4]])use('bush',x,y,s);
 for(const [x,y]of [[76,338],[183,287],[365,287],[477,339]])use('rock',x,y,.6);
};
