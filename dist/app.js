let gameRecordId=crypto.randomUUID?.()||('game-'+Date.now()+'-'+Math.random().toString(36).slice(2)),gameRecordOwner=null,gameStartedAt=Date.now(),gameTrackEligible=false;
let gameRecordLevel=2;
let pageView='home',draftMode='ai';
const $=id=>document.getElementById(id);let board=XQ.initial(),turn='r',selected=null,history=[],mode='ai',flipped=false,muted=true,ended=false,busy=false,epoch=0,legal=[];let drawAgreed=false,drawOffer=null,resignedSide=null,pendingResign=null;let last=null;let terrainMap='riverside';try{terrainMap=localStorage.getItem('jing-terrain-map')==='clean'?'clean':'riverside';if(localStorage.getItem('jing-terrain-map')==='vector')localStorage.setItem('jing-terrain-map','riverside')}catch{};let skin='playful';try{const savedSkin=localStorage.getItem('jing-xiangqi-skin');skin=['regal','jade','street','mascot'].includes(savedSkin)?'benteng':['serif','benteng','mocheng','sans','playful','comic11'].includes(savedSkin)?savedSkin:'playful';if(['regal','jade','street','mascot'].includes(savedSkin))localStorage.setItem('jing-xiangqi-skin','benteng')}catch{};const NS='http://www.w3.org/2000/svg';
function node(tag,attrs={},parent=$('board')){let n=document.createElementNS(NS,tag);for(let k in attrs)n.setAttribute(tag==='image'&&k==='href'&&parent.closest('.piece-artwork')?'data-art-src':k,attrs[k]);parent.append(n);return n;}function text(content,attrs,parent){let n=node('text',attrs,parent);n.textContent=content;return n;}

// A complete, interactive board never depends on any image request.
const pieceImageCache=new Map(),pieceImageQueue=[];
let pieceImagesActive=0;
function loadPieceImage(url){
 const cached=pieceImageCache.get(url);
 if(cached&&!(cached.failed&&Date.now()-cached.failed>30000))return cached.promise;
 const entry={failed:0,ready:false};
 entry.promise=new Promise((resolve,reject)=>pieceImageQueue.push({url,entry,resolve,reject}));
 pieceImageCache.set(url,entry);pumpPieceImages();return entry.promise;
}
function pumpPieceImages(){
 while(pieceImagesActive<3&&pieceImageQueue.length){
  const task=pieceImageQueue.shift();pieceImagesActive++;
  let image,finished=false,timer;
  const finish=error=>{
   if(finished)return;finished=true;clearTimeout(timer);
   if(image){image.onload=image.onerror=null;if(error)image.removeAttribute('src');}
   pieceImagesActive--;if(error){task.entry.ready=false;task.entry.failed=Date.now();task.reject(error);}else{task.entry.ready=true;task.resolve();}
   pumpPieceImages();
  };
  if(typeof Image!=='function'){finish(new Error('Image unavailable'));continue;}
  image=new Image();image.decoding='async';
  image.onload=()=>{const decode=typeof image.decode==='function'?image.decode():Promise.resolve();decode.then(()=>finish(),()=>finish(new Error('Image decode failed')));};
  image.onerror=()=>finish(new Error('Image unavailable'));
  timer=setTimeout(()=>finish(new Error('Image timed out')),12000);
  image.src=task.url;
 }
}
function paintPiece(parent,p,pieceSkin=skin){
 const base=node('g',{'aria-hidden':'true','pointer-events':'none',class:'piece-fallback'},parent);
 node('circle',{cy:1.5,r:25.5,fill:'#7a6546',opacity:'.18'},base);
 node('circle',{r:25.5,fill:'#fff8e6',stroke:'#c9b58e','stroke-width':1.2},base);
 node('circle',{r:21.5,fill:'none',stroke:p[0]==='r'?'#c87c62':'#9a9d88','stroke-width':.7},base);
 text(XQ.names[p[0]][p[1]],{x:0,y:10,'text-anchor':'middle','font-family':'Microsoft YaHei,PingFang SC,system-ui,sans-serif','font-size':30,'font-weight':600,fill:p[0]==='r'?'#a84230':'#29352e'},base);
 const art=node('g',{class:'piece-artwork',opacity:0,'pointer-events':'none','aria-hidden':'true','aria-label':parent.getAttribute('aria-label')||p},parent);
 if(pieceSkin==='comic11')comic11Art(art,p);else if(pieceSkin==='mocheng')mochengArt(art,p);else if(illustratedSkins[pieceSkin])mascotArt(art,p,51,true,pieceSkin);else if(pieceSkin==='playful')playfulArt(art,p);else if(pieceSkin==='serif')artwork(art,p);else sansArtwork(art,p);
 const images=[...art.querySelectorAll('image[data-art-src]')];
 if(!images.length)return;
 const batch=activePieceBatch,record={art,base,images,ready:false};
 if(batch)batch.pieces.push(record);
 const fail=()=>{
  if(batch){batch.failed=true;readyPieceSkins.delete(batch.skin);for(const piece of batch.pieces){piece.art.setAttribute('opacity',0);piece.base.removeAttribute('visibility');}}
  else{art.setAttribute('opacity',0);base.removeAttribute('visibility');}
  if(batch)updatePieceLoading(batch);
 };
 Promise.all(images.map(el=>loadPieceImage(el.getAttribute('data-art-src')))).then(()=>{
  if(!art.isConnected)return;
  let remaining=images.length,failed=false;
  for(const el of images){
   el.addEventListener('error',()=>{failed=true;fail();},{once:true});
   el.addEventListener('load',()=>{
    if(failed||--remaining!==0)return;
    record.ready=true;
    if(batch)flushPieceBatch(batch);else{art.setAttribute('opacity',1);base.setAttribute('visibility','hidden');}
   },{once:true});
   el.setAttribute('href',el.getAttribute('data-art-src'));
  }
 }).catch(fail);
}
window.addEventListener('online',()=>{for(const [url,entry]of pieceImageCache)if(entry.failed)pieceImageCache.delete(url);draw();});

function pos(x,y){return flipped?[504-x*56,564-y*56]:[56+x*56,60+y*56];}

// Original artwork is sampled without repainting the six supplied pieces.
const referenceTiles={rk:[0,0],rr:[1,0],rh:[2,0],bk:[0,1],br:[1,1],bh:[2,1]};
function artwork(parent,p){
 const tile=referenceTiles[p];
 if(tile){
  const [col,row]=tile;const ox=[0,305,610][col],oy=row*324;
  const viewport=node('svg',{x:-27.7,y:-28.7,width:56,height:59.27,viewBox:ox+' '+oy+' 308 326',overflow:'visible','pointer-events':'none',class:'original-piece-art'},parent);
  const id='original-clip-'+p+'-'+parent.getAttribute('aria-label').replace(/[^0-9]/g,'');
  const defs=node('defs',{},viewport);const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
  node('ellipse',{cx:ox+154,cy:oy+163,rx:140,ry:144},clip);
  node('image',{href:'./assets/fast-v1/jade-reference-original.webp',width:934,height:652,'clip-path':'url(#'+id+')'},viewport);
 }else{
  const col={re:0,ra:1,rc:2,rp:3,be:0,ba:1,bc:2,bp:3}[p];
  const row=p[0]==='r'?0:1;
  const viewport=node('svg',{x:-29,y:-29,width:58,height:58,viewBox:(col*512)+' '+(row*512)+' 512 512',style:'overflow:hidden','pointer-events':'none'},parent);
  node('image',{href:'./assets/fast-v1/jade-missing-atlas.webp',width:2048,height:1024},viewport);
 }
}



// H1 疏朗: six unchanged reference pieces and independent high-detail role pairs.
function sansArtwork(parent,p){
 const tile=referenceTiles[p];
 if(tile){
  const [col,row]=tile,cx=[228,626,1024][col],cy=row?842:421;
  const id='sans-art-'+(++sansArtwork.id);
  const v=node('svg',{x:-28,y:-29,width:56,height:59,viewBox:`${cx-190} ${cy-195} 380 400`,style:'width:56px;height:59px;overflow:hidden','pointer-events':'none','aria-hidden':'true'},parent);
  const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},node('defs',{},v));
  node('ellipse',{cx,cy,rx:186,ry:189},clip);
  node('image',{href:'./assets/fast-v1/sans-h1/reference.webp',width:1254,height:1254,'clip-path':`url(#${id})`},v);
 }else{
  const source={a:{r:[471,438,342,344],b:[1295,438,343,344]},e:{r:[482,438,346,349],b:[1282,438,350,350]},c:{r:[463,429,359,368],b:[1305,429,365,369]},p:{r:[480,434,343,352],b:[1293,434,347,352]}}[p[1]][p[0]];
  const [cx,cy,rx,ry]=source,id='sans-art-'+(++sansArtwork.id);
  const v=node('svg',{x:-28,y:-29,width:56,height:59,viewBox:`${cx-rx-3} ${cy-ry-3} ${2*rx+6} ${2*ry+6}`,preserveAspectRatio:'none',style:'width:56px;height:59px;overflow:hidden','pointer-events':'none','aria-hidden':'true'},parent);
  const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},node('defs',{},v));
  node('ellipse',{cx,cy,rx,ry},clip);
  node('image',{href:`./assets/fast-v1/sans-h1/${p[1]}.webp`,width:1774,height:887,'clip-path':`url(#${id})`},v);
 }
}
sansArtwork.id=0;

// Independent high-detail source pairs. Coordinates isolate each entire disk.
const playfulNames={k:'General',a:'Advisor',e:'Elephant',h:'Horse',r:'Chariot',c:'Cannon',p:'Soldier'};
const playfulSources={
 k:{blue:[480,429,338,349],red:[1279,429,338,349]},
 a:{blue:[495,435,350,356],red:[1267,435,347,356]},
 e:{blue:[469,432,348,350],red:[1298,432,350,350]},
 h:{blue:[484,438,348,333],red:[1292,438,348,333]},
 r:{blue:[473,427,350,350],red:[1294,427,350,350]},
 c:{blue:[471,436,343,330],red:[1301,436,343,330]},
 p:{blue:[509,443,341,333],red:[1258,443,339,333]}
};
function playfulArt(parent,p,size=52){
 const type=p[1],[x,y,rx,ry]=playfulSources[type][p[0]==='r'?'red':'blue'];
 const v=node('svg',{x:-size/2,y:-size/2,width:size,height:size,viewBox:`${x-rx} ${y-ry} ${rx*2} ${ry*2}`,preserveAspectRatio:'none',overflow:'hidden','pointer-events':'none',class:'playful-art',style:`width:${size}px;height:${size}px`,'aria-hidden':'true'},parent);
 const id='q-hd-clip-'+(++playfulArt.id);const defs=node('defs',{},v);const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
 node('ellipse',{cx:x,cy:y,rx:rx-1,ry:ry-1},clip);
 node('image',{href:`./assets/fast-v1/q-hd/${type==='k'?'k-unarmed-v3':type}.webp`,width:1774,height:887,'clip-path':`url(#${id})`,'pointer-events':'none'},v);
}
playfulArt.id=0;
// Brand collection: all fourteen illustrated emblems share one high-resolution atlas.
const illustratedSkins={
 mocheng:{name:'墨橙圆章',note:'文字 · 墨橙',river:'妙 棋 手',line:'妙 棋 手 · 棋 逢 趣 手',red:'#ff8a13',black:'#fff5df'},
 benteng:{name:'妙棋手',note:'汉风 · 漫画',river:'妙 棋 手',line:'妙 棋 手 · 棋 逢 趣 手',red:'#fff0da',black:'#e8f3ff'},
};
// Display the selected design's original faces without repainting its lettering.
// The atlas is fetched once; circular SVG clipping keeps every token edge clean.
function mochengArt(parent,p){
 const cols={k:0,a:1,e:2,h:3,r:4,c:5,p:6};
 const cx=[143,350,560,770,979,1186,1393][cols[p[1]]],cy=p[0]==='r'?285:525;
 const id='mocheng-face-'+(++mochengArt.id),defs=node('defs',{},parent);
 const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
 node('circle',{r:25.5},clip);
 node('circle',{cy:1.5,r:25.7,fill:'#171816'},parent);
 const face=node('g',{'clip-path':`url(#${id})`},parent);
 const viewport=node('svg',{x:-25.5,y:-25.5,width:51,height:51,viewBox:`${cx-100} ${cy-98} 200 196`,preserveAspectRatio:'none','pointer-events':'none'},face);
 node('image',{href:'./assets/mocheng/reference.webp?v=1',width:1536,height:1024,'pointer-events':'none'},viewport);
 node('circle',{r:25.5,fill:'none',stroke:'#171816','stroke-width':.7},parent);
}
mochengArt.id=0;
function mascotArt(parent,p,size=51,badge=true,artSkin=skin){
 const id='mascot-clip-'+(++mascotArt.id),refined=artSkin==='benteng',r=size/2;
 const defs=node('defs',{},parent),clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
 if(refined){
  const gradient=node('linearGradient',{id:id+'-rim',x1:'0',y1:'0',x2:'0',y2:'1'},defs);
  node('stop',{offset:'0%','stop-color':'#fffdf6'},gradient);
  node('stop',{offset:'100%','stop-color':'#eadfc9'},gradient);
  // Geometry owns the silhouette; the bitmap's uneven outer border stays hidden.
  node('circle',{cy:1.3,r:r-.35,fill:'#2c241c',opacity:'.15','pointer-events':'none'},parent);
  node('circle',{r:r-.65,fill:`url(#${id}-rim)`,stroke:'#292925','stroke-width':1.15,'pointer-events':'none'},parent);
 }
 node('circle',{cx:0,cy:0,r:refined?r-4:r},clip);
 node('image',{href:`./assets/${artSkin}/${p}.png?v=benteng29`,x:-r,y:-r,width:size,height:size,'clip-path':`url(#${id})`,'pointer-events':'none',class:'mascot-art','aria-hidden':'true'},parent);
 if(refined){
  node('circle',{r:r-3.75,fill:'none',stroke:'#fff9eb','stroke-width':1,'pointer-events':'none'},parent);
  node('circle',{r:r-2.8,fill:'none',stroke:p[0]==='r'?'#bb552b':'#557281','stroke-width':.7,'pointer-events':'none'},parent);
 }
 if(badge){
  const x=refined?12.5:18,y=refined?14:19,br=refined?6.1:8.4;
  node('circle',{cx:x,cy:y,r:br,fill:p[0]==='r'?illustratedSkins[artSkin].red:illustratedSkins[artSkin].black,stroke:refined?'#51443a':'#171714','stroke-width':refined?.7:1.3,'pointer-events':'none'},parent);
  text(XQ.names[p[0]][p[1]],{x,y:y+(refined?3:3.8),'text-anchor':'middle','font-size':refined?8.6:10.5,'font-weight':700,fill:'#171714','font-family':'Microsoft YaHei, sans-serif','pointer-events':'none'},parent);
 }
 node('circle',{r:r+2,fill:'transparent','pointer-events':'all'},parent);
}
mascotArt.id=0;
// Cut from the approved mockup and positioned relative to each grid intersection.
const comic11Frames={
 br:[-25.2,-37.1,57.3,68.6], be:[-27.7,-26.4,54.7,57.9], bk:[-23.9,-37.1,47.2,68.6],
 ba:[-22.7,-23.3,35.9,54.7], bc:[-22.7,-31.5,49.1,57.9], bh:[-15.1,-32.7,44.7,59.1], bp:[-20.8,-30.8,45.9,65.4],
 rr:[-25.2,-28.9,56.6,68.6], re:[-27.7,-25.2,45.3,64.8], rk:[-26.4,-30.8,53.5,72.4],
 ra:[-22,-18.2,37.8,58.5], rc:[-22.7,-32.7,49.7,58.5], rh:[-23.9,-34,49.1,59.8], rp:[-25.2,-39,49.7,69.2]
};
function comic11Art(parent,p){
 const [x,y,width,height]=comic11Frames[p];
 node('image',{href:'./assets/comic-11/'+p+'.webp',x,y,width,height},parent);
}
function layoutComic11(enabled){
 const extra=$('comic11Actions');
 if(enabled===extra.hasChildNodes())return;
 if(enabled)document.querySelectorAll('.comic11-header img[data-src]').forEach(img=>{img.src=img.dataset.src;delete img.dataset.src});
 for(const id of ['flip','immersive','offerDraw','resign']){
  if(enabled)extra.append($(id));
  else $('gameMore').before($(id));
 }
}
function applySkin(){
 const comic=skin==='comic11';
 document.body.dataset.skin=skin;
 layoutComic11(comic);
 document.body.dataset.illustrated=String(!!illustratedSkins[skin]);
 document.body.dataset.terrain=skin==='playful'?terrainMap:'clean';
 document.querySelectorAll('[data-map]').forEach(b=>{const on=b.dataset.map===terrainMap;b.setAttribute('aria-pressed',String(on));b.classList.toggle('active',on)});
 $('board').setAttribute('viewBox',comic?'10 19 540 590':skin==='playful'?(terrainMap!=='clean'?'20 -8 520 640':'20 16 520 592'):'-12 -12 584 648');
 const name=comic?'简洁博弈':illustratedSkins[skin]?illustratedSkins[skin].name+' · 妙棋手系列':skin==='playful'?'玲珑将相':'凝脂白玉 · 山水相望';
 document.querySelectorAll('.light-label,.preview-caption').forEach(el=>el.textContent=name);
 $('captures').textContent=illustratedSkins[skin]?'棋逢趣手，落子有趣。':skin==='playful'?'小小棋子，大大天地。':'落子无悔，亦可重来。';

}


// One board render is one visual transaction: never mix basic and HD pieces.
let activePieceBatch=null,boardPieceBatch=null;
const readyPieceSkins=new Set();
function updatePieceLoading(batch){
 if(batch!==boardPieceBatch||!batch.sealed)return;
 if(batch.failed||batch.shown||!batch.pieces.length){
  window.MQLoading?.hide('pieces');clearTimeout(batch.loadingTimer);
  if(batch.failed&&!batch.notified){batch.notified=true;toast('高清棋子加载失败，已保留基础棋子，可继续使用');}
  return;
 }
 const ready=batch.pieces.filter(piece=>piece.ready).length;
 window.MQLoading?.show('pieces','高清棋子加载中 · '+ready+'/'+batch.pieces.length);
}
function flushPieceBatch(batch){
 if(!batch.sealed||batch!==boardPieceBatch)return;
 if(!batch.failed&&batch.pieces.length){
  const alreadyDecoded=readyPieceSkins.has(batch.skin)&&batch.pieces.every(piece=>piece.images.every(image=>pieceImageCache.get(image.getAttribute('data-art-src'))?.ready));
  if(alreadyDecoded||batch.pieces.every(piece=>piece.ready)){
   for(const piece of batch.pieces){piece.art.setAttribute('opacity',1);piece.base.setAttribute('visibility','hidden');}
   readyPieceSkins.add(batch.skin);batch.shown=true;
  }
 }
 updatePieceLoading(batch);
}
function draw(){
 const previous=activePieceBatch,batch={skin,pieces:[],sealed:false,failed:false,shown:false};
 clearTimeout(boardPieceBatch?.loadingTimer);activePieceBatch=boardPieceBatch=batch;
 try{renderBoard();}finally{
  activePieceBatch=previous;batch.sealed=true;flushPieceBatch(batch);
  if(!batch.shown&&!batch.failed&&batch.pieces.length)batch.loadingTimer=setTimeout(()=>{if(batch!==boardPieceBatch||batch.shown)return;batch.failed=true;readyPieceSkins.delete(batch.skin);updatePieceLoading(batch)},45000);
  document.body.dataset.aiBusy=String(busy&&mode==='ai'&&pageView==='game');window.MQMasters?.decorateGame();
 }
}
function renderBoard(){applySkin();let visualBoard=pageView==='home'?XQ.initial():board;let svg=$('board');svg.innerHTML=`<defs><linearGradient id="red-carving" x1="0" y1="1" x2=".3" y2="0"><stop stop-color="#77271e"/><stop offset=".35" stop-color="#a13f2d"/><stop offset="1" stop-color="#ba5640"/></linearGradient><linearGradient id="black-carving" x1="0" y1="1" x2=".3" y2="0"><stop stop-color="#141c18"/><stop offset=".4" stop-color="#29332c"/><stop offset="1" stop-color="#444b40"/></linearGradient></defs>`;
if(skin==='playful'&&terrainMap!=='clean')drawPlayfulTerrain(svg,terrainMap);
const comic=skin==='comic11', plainGrid=comic||skin==='playful';
let grid=node('g',{'stroke':comic?'#a9abb1':skin==='playful'?'#a39786':'#9f927a','stroke-width':comic?'.9':skin==='playful'?'.6':'.85',fill:'none'});for(let y=0;y<10;y++)node('path',{d:`M56 ${60+y*56}H504`},grid);for(let x=0;x<9;x++){let xx=56+x*56;node('path',{d:x===0||x===8?`M${xx} 60V564`:`M${xx} 60V284 M${xx} 340V564`},grid);}if(!plainGrid)node('rect',{x:51,y:55,width:458,height:514,'stroke-width':1.5},grid);for(let y of [60,452])node('path',{d:`M224 ${y}l112 112 M336 ${y}l-112 112`},grid);if(!plainGrid)for(let y of [2,3,6,7])for(let x of y===2||y===7?[1,7]:[0,2,4,6,8]){let X=56+x*56,Y=60+y*56;for(let side of [-1,1])if(x+side>=0&&x+side<9)for(let v of [-1,1])node('path',{d:`M${X+side*6} ${Y+v*12}v${-v*6}h${side*6}`},grid);}
// High-detail ceramic river reliefs from the approved board reference.
if(skin==='playful'&&terrainMap==='clean'){
 const motifs=node('g',{'aria-hidden':'true','pointer-events':'none',class:'river-relief'});
 node('image',{href:'./assets/q-hd/river-mountain.svg',x:126,y:289,width:100,height:40},motifs);
 node('image',{href:'./assets/q-hd/river-water.svg',x:338,y:290,width:100,height:40},motifs);
}else if(illustratedSkins[skin]){
 text(illustratedSkins[skin].river,{x:280,y:310,'text-anchor':'middle','font-family':'Microsoft YaHei,Arial,sans-serif','font-size':16,'font-weight':800,'letter-spacing':5,fill:'#31312a'});
 text(illustratedSkins[skin].line,{x:280,y:329,'text-anchor':'middle','font-family':'Microsoft YaHei,sans-serif','font-size':8,fill:'#9b6840'});
}else if(!plainGrid){
 const motifs=node('g',{'aria-hidden':'true',fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 const mountain='M143 318 C152 317 157 306 163 308 C168 309 171 316 179 319 M161 312 C170 309 174 296 180 299 C186 301 190 315 195 312 C200 307 204 319 214 320';
 const water='M354 306 C366 299 377 314 390 307 C397 303 401 304 407 302 M354 313 C366 306 377 321 390 314 C397 310 401 311 407 309 M354 320 C366 313 377 328 390 321 C397 317 401 318 407 316';
 for(const d of [mountain,water]){node('path',{d,stroke:'#fffdf3','stroke-width':1.4,transform:'translate(.5 .8)'},motifs);node('path',{d,stroke:'#aa9675','stroke-width':1.15},motifs);}
}

if(last&&pageView==='game')for(let p of [[last.x,last.y],[last.X,last.Y]]){let [x,y]=pos(...p);node('rect',{x:x-26,y:y-26,width:52,height:52,rx:10,fill:'#a3916244',stroke:'#a3916266','stroke-width':.8});}
for(let y=0;y<10;y++)for(let x=0;x<9;x++){let p=visualBoard[y][x];if(!p)continue;let [cx,cy]=pos(x,y),sel=selected&&selected.x===x&&selected.y===y;let g=node('g',{class:'piece jade-piece',transform:`translate(${cx} ${cy})`,role:'button',tabindex:'0','aria-label':(p[0]==='r'?'红':'黑')+XQ.names[p[0]][p[1]]+` ${x+1}列${y+1}行`});if(sel)node('rect',{x:-26,y:-26,width:52,height:52,rx:11,fill:'#b6a78325',stroke:'#9a8b6b','stroke-width':1},g);paintPiece(g,p);node('circle',{r:27,fill:'transparent','pointer-events':'all'},g);g.onclick=e=>{e.stopPropagation();click(x,y)};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();click(x,y)}};}
if(selected)for(let m of legal.filter(m=>m.x===selected.x&&m.y===selected.y)){let [cx,cy]=pos(m.X,m.Y);let target=node('circle',{cx,cy,r:board[m.Y][m.X]?25:7,fill:board[m.Y][m.X]?'none':'#7c8b6a',stroke:board[m.Y][m.X]?'#9a5142':'none','stroke-width':2,'pointer-events':'all',opacity:.8,role:'button',tabindex:'0','aria-label':`落子至 ${m.X+1}列${m.Y+1}行`,style:'cursor:pointer'});target.onclick=e=>{e.stopPropagation();click(m.X,m.Y)};target.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();click(m.X,m.Y)}};}
document.querySelectorAll('[data-skin],[data-game-skin]').forEach(btn=>{let active=(btn.dataset.skin||btn.dataset.gameSkin)===skin;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});$('round').textContent=`第 ${String(Math.floor(history.length/2)+1).padStart(2,'0')} 回合`;$('moveCount').textContent=String(history.length).padStart(2,'0');$('history').innerHTML='';history.forEach((h,i)=>{let li=document.createElement('li');li.textContent=h.label;$('history').append(li)});$('undo').disabled=!history.length||busy;$('offerDraw').disabled=ended||busy||mode==='ai'&&turn!=='r';$('resign').disabled=ended;
const repeatedSide=['r','b'].find(side=>XQ.checkStreak(history,board,side)>=5);
$('longCheckWarning').hidden=pageView!=='game'||ended||!repeatedSide;
$('longCheckWarning').textContent=repeatedSide?`${repeatedSide==='r'?'红方':'黑方'}已连续将军 ${XQ.checkStreak(history,board,repeatedSide)} 回合，请变换走法，勿反复长将。`:'';$('opponent').textContent=mode==='ai'?`山隐 · ${XQ.levels[Number($('level').value)]?.name.split(' · ')[1]||'棋友'}`:'同屏 · 棋友';document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===draftMode));$('level').disabled=draftMode!=='ai';syncLevelPicker();$('statusIcon').style.fontFamily=skin==='serif'?'PieceSerif,serif':'PieceSans,sans-serif';$('statusIcon').textContent=turn==='r'?'帥':'將';$('statusIcon').style.color=turn==='r'?'#933f36':'#414a40';if(skin==='sans'){$('statusIcon').textContent='';const icon=node('svg',{viewBox:'-29 -30 58 61',style:'width:43px;height:43px'},$('statusIcon'));paintPiece(icon,turn+'k');}if(illustratedSkins[skin]){$('statusIcon').textContent='';let icon=node('svg',{viewBox:'-28 -28 56 56',width:38,height:38},$('statusIcon'));paintPiece(icon,turn+'k');}if(skin==='playful'){$('statusIcon').textContent='';let icon=node('svg',{viewBox:'-26 -26 52 52',width:34,height:34},$('statusIcon'));paintPiece(icon,turn+'k');}if(!ended){$('status').textContent=busy?(Number($('level').value)>=5?`山隐正在凝思（最多约${XQ.thinkingBudget(board,XQ.levels[Number($('level').value)],{plies:history.length}).time/1000}秒）…`:'山隐正在凝思…'):(comic&&turn==='r'?'轮到你了！':turn==='r'?'请朱方落子':'请墨方落子');$('hint').textContent=XQ.check(board,turn)?'将军！请先解将':selected?'选择亮起的位置落子':comic?(turn==='r'?'红方走棋':'黑方走棋'):'轻触棋子，查看可行之处';}window.MQOnline?.render();}
document.querySelectorAll('[data-skin]').forEach(btn=>btn.onclick=()=>{window.MQAnalytics?.track('skin_changed',{from_skin:skin,to_skin:btn.dataset.skin});skin=btn.dataset.skin;try{localStorage.setItem('jing-xiangqi-skin',skin)}catch{}draw();toast('已切换为'+({serif:'温玉雅宋',sans:'疏朗 · 黑体',playful:'玲珑将相',benteng:'妙棋手',mocheng:'墨橙圆章',comic11:'简洁博弈'}[skin]));});
$('board').onclick=e=>{let p=$('board').createSVGPoint();p.x=e.clientX;p.y=e.clientY;p=p.matrixTransform($('board').getScreenCTM().inverse());let x=Math.round((p.x-56)/56),y=Math.round((p.y-60)/56);if(flipped){x=8-x;y=9-y}if(x>=0&&x<9&&y>=0&&y<10)click(x,y)};
function click(x,y){if(mode==='online'&&!window.MQOnline?.canMove())return;if(pageView!=='game'||ended||busy||mode==='ai'&&turn==='b')return;if(board[y][x]?.[0]===turn){selected=selected?.x===x&&selected?.y===y?null:{x,y};draw();return}if(selected){let m=legal.find(m=>m.x===selected.x&&m.y===selected.y&&m.X===x&&m.Y===y);if(m){if(mode==='online'){window.MQOnline.move(m);return}move(m);computer()}else toast('此处不可落子')}}
function audio(){if(muted)return;try{let ctx=window.audioCtx||(window.audioCtx=new (window.AudioContext||window.webkitAudioContext)());ctx.resume();let o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(680,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(210,ctx.currentTime+.1);g.gain.setValueAtTime(.12,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.14);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.15)}catch{}}
function analyticsGame(){return {game_id:gameRecordId,mode,level:Number($('level').value),skin}}
function move(m){
 let p=board[m.y][m.x],captured=board[m.Y][m.X],mover=turn;
 history.push({board:board.map(r=>r.slice()),turn,last,label:`${turn==='r'?'朱':'墨'} · ${XQ.names[p[0]][p[1]]} ${m.x+1},${m.y+1} → ${m.X+1},${m.Y+1}${captured?' · 吃'+XQ.names[captured[0]][captured[1]]:''}`,captured:!!captured});
 if(history.length===1){window.MQAnalytics?.game(analyticsGame());window.MQAnalytics?.firstMove({...analyticsGame(),since_start_ms:Math.max(0,Date.now()-gameStartedAt)});}
 board=XQ.play(board,m);turn=turn==='r'?'b':'r';last=m;selected=null;audio();legal=XQ.moves(board,turn);ended=!legal.length;
 if(ended){$('status').textContent=turn==='r'?'墨方获胜':'朱方获胜';$('hint').textContent=XQ.check(board,turn)?'将死 · 此局已定':'困毙 · 无子可行';toast($('status').textContent)}
 save();draw();
 if(ended)showResult();else{
  const streak=XQ.checkStreak(history,board,mover);
  if(!(mode==='ai'&&mover==='b')&&streak>=5&&(streak===5||streak%5===0)){
   $('longCheckMessage').textContent=`${mover==='r'?'红方':'黑方'}已连续 ${streak} 回合将军，不能一直用相同的步骤进行长将，请变换走法。`;
   $('longCheckDialog').showModal();
  }
 }
}
function offerDraw(){
 if(mode==='online'){window.MQOnline?.offerDraw();return}
 if(pageView!=='game'||ended||busy||mode==='ai'&&turn!=='r')return;
 drawOffer={side:turn,phase:'confirm'};$('gameMore').open=false;
 $('drawOfferTitle').textContent='向对方提议和棋？';
 $('drawOfferMessage').textContent='只有对方同意后，本局才会以和棋结束。对方拒绝则继续对弈。';
 $('acceptDraw').textContent='发出和棋提议';$('declineDraw').textContent='继续对弈';$('drawOfferDialog').showModal();
}
function acceptDraw(){
 if(!drawOffer||ended)return;
 if(drawOffer.phase==='confirm'){
  if(mode==='ai'){
   const agreed=XQ.acceptsDraw(board,history.length);
   $('drawOfferDialog').close();drawOffer=null;
   if(agreed)finishAgreedDraw();else toast('山隐未同意和棋，继续对弈');
   return;
  }
  drawOffer.phase='respond';
  const from=drawOffer.side==='r'?'红方':'黑方',to=drawOffer.side==='r'?'黑方':'红方';
  $('drawOfferTitle').textContent=`${to}，是否同意和棋？`;
  $('drawOfferMessage').textContent=`${from}提出和棋，请将操作交给${to}确认。只有${to}同意，本局才结束。`;
  $('acceptDraw').textContent='同意和棋';$('declineDraw').textContent='拒绝，继续对弈';
  $('declineDraw').focus();return;
 }
 $('drawOfferDialog').close();drawOffer=null;finishAgreedDraw();
}
function finishAgreedDraw(){
 epoch++;cancelComputer();busy=false;drawAgreed=true;resignedSide=null;ended=true;selected=null;
 $('status').textContent='和棋 · 双方同意';$('hint').textContent='双方已同意和棋，本局结束';save();draw();showResult();
}
function declineDraw(){
 const offer=drawOffer;drawOffer=null;$('drawOfferDialog').close();
 if(offer?.reason==='long-check'){
  if(offer.alternative){rememberAI(aiPositionKey(),offer.alternative);move(offer.alternative);toast('你未同意和棋，电脑已改走非将军招法');}
  else finishResignation('b','电脑无法停止长将，认输');
 }else if(offer?.phase==='respond')toast('对方未同意和棋，继续对弈');
}
$('offerDraw').onclick=offerDraw;$('acceptDraw').onclick=acceptDraw;$('declineDraw').onclick=declineDraw;
$('drawOfferDialog').addEventListener('cancel',event=>{if(drawOffer?.reason==='long-check'){event.preventDefault();declineDraw();}else drawOffer=null;});
$('closeLongCheck').onclick=()=>{$('longCheckDialog').close();computer()};
$('longCheckDialog').addEventListener('close',()=>computer());

let aiWorker=null;
let aiStyle=['active','solid','flank'][Math.floor(Math.random()*3)];
let aiRecent={};try{aiRecent=JSON.parse(localStorage.getItem('jing-ai-recent-v2'))||{};}catch{}
function aiPositionKey(){return board.map(row=>row.map(p=>p||'..').join('')).join('');}
function rememberAI(position,m){
 if(!m)return;const id=`${m.x}${m.y}${m.X}${m.Y}`;
 const recent=Array.isArray(aiRecent[position])?aiRecent[position]:[];
 delete aiRecent[position];aiRecent[position]=[id,...recent].slice(0,3);
 const keys=Object.keys(aiRecent);for(const key of keys.slice(0,Math.max(0,keys.length-120)))delete aiRecent[key];
 try{localStorage.setItem('jing-ai-recent-v2',JSON.stringify(aiRecent));}catch{}
}
function cancelComputer(){if(aiWorker){aiWorker.terminate();aiWorker=null;}}
function computer(){
 if($('resignDialog').open||$('longCheckDialog').open||$('drawOfferDialog').open||pageView!=='game'||busy||mode!=='ai'||turn!=='b'||ended)return;
 const analyticsThinkStart=performance.now();busy=true;draw();const e=epoch,level=Number($('level').value),position=aiPositionKey();
 const context={...(window.MQMasters?.searchContext()||{}),plies:history.length,style:aiStyle,recent:Array.isArray(aiRecent[position])?aiRecent[position]:[]};
 const finish=m=>{if(e!==epoch)return;window.MQAnalytics?.track('ai_move_completed',{...analyticsGame(),duration_ms:Math.round(performance.now()-analyticsThinkStart),plies:history.length});cancelComputer();busy=false;if(m&&proposeLongCheckDraw(m))return;rememberAI(position,m);if(m)move(m);else draw();};
 const fallback=()=>{window.MQAnalytics?.track('game_error',{category:'ai_worker_failure',level});if(level>=5){cancelComputer();busy=false;draw();$('hint').textContent='电脑暂时无法落子，请刷新后重试，当前棋局已保存。';toast('电脑暂时无法落子，请刷新重试');return;}cancelComputer();setTimeout(()=>{if(e!==epoch)return;finish(XQ.ai(board,Math.min(level,3),Math.random,context));},30);};
 setTimeout(()=>{
  if(e!==epoch)return;
  try{
   aiWorker=new Worker('./ai-worker.js?v=masters-20261105');
   aiWorker.onmessage=event=>{if(e!==epoch)return;finish(event.data.move);};
   aiWorker.onerror=()=>{if(e===epoch)fallback();};
   aiWorker.postMessage({board,level,context});
  }catch{fallback();}
 },180);
}

function proposeLongCheckDraw(candidate){
 if(XQ.checkStreak(history,board,'b')<5||!XQ.check(XQ.play(board,candidate),'r'))return false;
 // Refusing the proposal must never allow a sixth consecutive checking move.
 const quiet=legal.filter(m=>!XQ.check(XQ.play(board,m),'r'));
 const value={k:100000,r:900,c:450,h:400,e:200,a:200,p:100};
 function quietScore(m){
  const after=XQ.play(board,m);let material=0,replyRisk=0;
  for(const row of after)for(const piece of row)if(piece)material+=(piece[0]==='b'?1:-1)*value[piece[1]];
  for(const reply of XQ.moves(after,'r')){const victim=after[reply.Y][reply.X];if(victim?.[0]==='b')replyRisk=Math.max(replyRisk,value[victim[1]]);}
  return material-replyRisk;
 }
 const ranked=quiet.map(m=>({m,score:quietScore(m)})).sort((a,b)=>b.score-a.score);
 drawOffer={side:'b',phase:'respond',reason:'long-check',alternative:ranked[0]?.m||null};
 $('drawOfferTitle').textContent='电脑提出和棋';
 $('drawOfferMessage').textContent=ranked.length?'电脑已连续将军5轮，不能继续长将。是否同意和棋？拒绝后，电脑将改走非将军招法。':'电脑已连续将军5轮，且没有可走的非将军招法。是否同意和棋？拒绝后，电脑将认输。';
 $('acceptDraw').textContent='同意和棋';$('declineDraw').textContent='拒绝和棋';
 draw();$('drawOfferDialog').showModal();return true;
}
function requestResignation(){
 if(mode==='online'){window.MQOnline?.resign();return}
 if(pageView!=='game'||ended)return;
 pendingResign=mode==='ai'?'r':turn;epoch++;cancelComputer();busy=false;draw();
 $('resignTitle').textContent=(pendingResign==='r'?'红方':'黑方')+'确认认输？';
 $('resignDialog').showModal();
}
function cancelResignation(){pendingResign=null;$('resignDialog').close();computer();}
function finishResignation(side,reason){
 epoch++;cancelComputer();busy=false;ended=true;drawAgreed=false;drawOffer=null;resignedSide=side;pendingResign=null;selected=null;
 for(const id of ['resignDialog','drawOfferDialog','longCheckDialog'])if($(id).open)$(id).close();
 $('status').textContent=side==='r'?'黑方获胜':'红方获胜';
 $('hint').textContent=reason||(side==='r'?'红方认输':'黑方认输');save();draw();showResult();
}
$('resign').onclick=requestResignation;
$('confirmResign').onclick=()=>{if(pendingResign)finishResignation(pendingResign)};
$('cancelResign').onclick=cancelResignation;
$('resignDialog').addEventListener('cancel',event=>{event.preventDefault();cancelResignation()});

function save(){if(mode==='online')return;try{const data={gameRecordId,gameRecordOwner,gameStartedAt,gameTrackEligible,board,turn,history,mode,flipped,last,ended,drawAgreed,resignedSide,level:$('level').value,status:globalThis.MQI18n?.source($('status'))??$('status').textContent,hint:globalThis.MQI18n?.source($('hint'))??$('hint').textContent,gameRecordLevel};if(window.MQMasters?.saveGame(data))return;localStorage.setItem('jing-xiangqi-v1',JSON.stringify(data));}catch{$('saveStatus').textContent='当前浏览器无法保存棋局'}}
function reset(){gameRecordLevel=Number($('level').value);gameRecordId=crypto.randomUUID?.()||('game-'+Date.now()+'-'+Math.random().toString(36).slice(2));gameRecordOwner=window.MQRecords?.owner()??null;gameStartedAt=Date.now();gameTrackEligible=mode==='ai';aiStyle=['active','solid','flank'][Math.floor(Math.random()*3)];drawAgreed=false;drawOffer=null;resignedSide=null;pendingResign=null;for(const id of ['drawOfferDialog','longCheckDialog','resignDialog'])if($(id).open)$(id).close();if($('resultDialog').open)$('resultDialog').close();epoch++;cancelComputer();busy=false;board=XQ.initial();turn='r';selected=null;history=[];ended=false;last=null;legal=XQ.moves(board,turn);save();draw()}
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').style.opacity=0,2200)}
$('undo').onclick=()=>{if(mode==='online'||window.MQMasters?.isPlaying())return;if(!history.length||busy)return;window.MQAnalytics?.track('undo_used',analyticsGame());epoch++;let n=mode==='ai'&&turn==='r'&&history.length>1?2:1;while(n--&&history.length){let h=history.pop();board=h.board;turn=h.turn;last=h.last;}ended=false;drawAgreed=false;resignedSide=null;pendingResign=null;selected=null;legal=XQ.moves(board,turn);save();draw();toast('棋局已退回上一步')};$('new').onclick=startNewGame;function showConfirm(fn){let d=document.createElement('dialog');d.innerHTML='<div class="eyebrow">A NEW BEGINNING</div><h2>重新开启一局？</h2><p>当前棋局将被新的棋局替换。</p><button class="primary">确认新局 ↗</button><button style="width:100%;padding:18px">继续此局</button>';document.body.append(d);let bs=d.querySelectorAll('button');bs[0].onclick=()=>{d.close();d.remove();fn()};bs[1].onclick=()=>{d.close();d.remove();navigate('game')};d.showModal()}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{draftMode=b.dataset.mode;draw()});$('flip').onclick=()=>{flipped=!flipped;draw();save()};$('sound').onclick=()=>{setSoundEnabled(muted);audio()};$('help').onclick=()=>$('dialog').showModal();$('close').onclick=$('understood').onclick=()=>$('dialog').close();
try{let s=JSON.parse(localStorage.getItem('jing-xiangqi-v1'));if(s&&s.board.length===10){gameRecordId=s.gameRecordId||gameRecordId;gameRecordOwner=s.gameRecordOwner??null;gameStartedAt=s.gameStartedAt||Date.now();gameRecordLevel=Number(s.gameRecordLevel||s.level||2);gameTrackEligible=typeof s.gameTrackEligible==='boolean'?s.gameTrackEligible:!s.ended;({board,turn,history,mode,flipped,last,ended}=s);drawAgreed=s.drawAgreed===true;resignedSide=['r','b'].includes(s.resignedSide)?s.resignedSide:null;if(ended&&s.status?.includes('和棋')&&!drawAgreed)ended=false;if(s.level)$('level').value=s.level;if(ended){$('status').textContent=s.status;$('hint').textContent=s.hint}}}catch{}legal=XQ.moves(board,turn);

// Immersive view hides all surrounding UI; the board remains fully interactive.
let immersive=false;
function setImmersive(on){if(on&&pageView!=='game')return;if(on!==immersive)window.MQAnalytics?.track('immersive_changed',{enabled:on});immersive=on;document.body.classList.toggle('immersive',on);$('immersive').setAttribute('aria-pressed',String(on));if(on){document.activeElement?.blur();$('board').focus({preventScroll:true});if(ended)showResult()}else{$('immersive').focus({preventScroll:true})}}
$('immersive').onclick=()=>setImmersive(!immersive);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&immersive&&!$('resultDialog').open){e.preventDefault();setImmersive(false)}});
$('board').addEventListener('dblclick',e=>{if(immersive&&!e.target.closest('.piece')){e.preventDefault();setImmersive(false)}});
let immersionTouch=0;$('board').addEventListener('touchend',e=>{if(!immersive||e.target.closest('.piece'))return;let now=Date.now();if(now-immersionTouch<330){e.preventDefault();setImmersive(false);immersionTouch=0}else immersionTouch=now},{passive:false});

function showResult(){
 if(ended&&mode!=='online')window.MQAnalytics?.end({...analyticsGame(),outcome:drawAgreed?'draw':(resignedSide?resignedSide==='b':turn==='b')?(mode==='ai'?'win':'red_win'):(mode==='ai'?'loss':'black_win'),reason:drawAgreed?'draw':resignedSide?'resign':XQ.check(board,turn)?'checkmate':'stalemate',duration_ms:Math.max(0,Date.now()-gameStartedAt),plies:history.length});
 if(mode==='ai'&&ended&&gameTrackEligible){const redWon=resignedSide?resignedSide==='b':turn==='b';window.MQRecords?.recordResult({gameId:gameRecordId,owner:gameRecordOwner,outcome:drawAgreed?'draw':redWon?'win':'loss',reason:drawAgreed?'draw':resignedSide?(resignedSide==='b'?'opponent_resign':'resign'):XQ.check(board,turn)?'checkmate':'stalemate',level:Math.min(gameRecordLevel,Number($('level').value)),plies:history.length,startedAt:gameStartedAt,endedAt:Date.now()})}
 if(ended&&mode!=='online')window.MQReview?.capture({id:gameRecordId,owner:gameRecordOwner,board,history,turn,flipped,mode,winner:drawAgreed?'draw':resignedSide?(resignedSide==='r'?'b':'r'):turn==='r'?'b':'r',reason:drawAgreed?'draw':resignedSide?'resign':XQ.check(board,turn)?'checkmate':'stalemate'});
 if(pageView!=='game'||!ended||$('resultDialog').open)return;
 const drawGame=drawAgreed;
 const redWon=resignedSide?resignedSide==='b':turn==='b';
 $('resultTitle').textContent=drawGame?'和棋 · 双方同意':redWon?'红方获胜':'黑方获胜';
 $('resultSeal').textContent=drawGame?'和':redWon?'帥':'將';
 $('resultSeal').style.color=drawGame?'#84775e':redWon?'#933f36':'#414a40';
 const who=drawGame?'双方握手言和':mode==='ai'?(redWon?'你赢得了本局':'山隐赢得了本局'):(redWon?'朱方赢得了本局':'墨方赢得了本局');
 $('resultReason').textContent=who+' · '+(globalThis.MQI18n?.source($('hint'))??$('hint').textContent);
 window.MQReview?.decorateResult();window.MQMasters?.onResult();
 $('resultDialog').showModal();
}
function finishGame(){if(window.MQMasters?.leaveGame())return;if($('resultDialog').open)$('resultDialog').close();navigate('home')}
$('exitImmersive').onclick=()=>setImmersive(false);
$('playAgain').onclick=()=>{if(mode==='online'){window.MQOnline?.open();return}reset();window.MQAnalytics?.game(analyticsGame());if(immersive)$('board').focus({preventScroll:true})};
$('finishGame').onclick=finishGame;
$('resultDialog').addEventListener('cancel',e=>{e.preventDefault();$('resultDialog').close()});


// Home owns setup; game owns play and its compact controls.
const boardSection=document.querySelector('.game');
function navigate(view){if(location.hash==='#'+view)applyView(view);else location.hash=view}
function applyView(view){
 const analyticsViewStart=performance.now();
 window.MQMasters?.view(view);
 pageView=['game','learn','settings','masters','feedback'].includes(view)?view:'home';
 if(pageView!=='game'){
  if(immersive)setImmersive(false);
  epoch++;cancelComputer();busy=false;selected=null;
  if($('resultDialog').open)$('resultDialog').close();
  drawOffer=null;pendingResign=null;for(const id of ['drawOfferDialog','longCheckDialog','resignDialog'])if($(id).open)$(id).close();
  $('homePreview').prepend(boardSection);draftMode=mode;
 }else{$('gameStage').append(boardSection)}
 document.body.dataset.page=pageView;
 $('homePage').hidden=pageView!=='home';$('gamePage').hidden=pageView!=='game';
 $('learnPage').hidden=pageView!=='learn';$('settingsPage').hidden=pageView!=='settings';syncSoundSetting();
 window.MQFeedback?.view(pageView);
 $('continueGame').hidden=!history.length||ended;
 $('gameMore').open=false;
 draw();window.MQAnalytics?.page(pageView,skin,performance.now()-analyticsViewStart);window.scrollTo(0,0);scheduleHomeSkinFold();
 if(pageView==='game'){if(ended)showResult();else computer()}
}
function startNewGame(){
 if(draftMode==='online'){window.MQOnline?.open();return}
 const start=()=>{window.MQOnline?.suspend();mode=draftMode;reset();window.MQAnalytics?.game(analyticsGame());navigate('game')};
 if(history.length&&!ended)showConfirm(start);else start();
}
$('continueGame').onclick=()=>navigate('game');
$('backHome').onclick=()=>{if(window.MQMasters?.leaveGame())return;save();navigate('home')};
$('restartGame').onclick=()=>{if(window.MQMasters?.isPlaying())return;if(mode==='online'){window.MQOnline?.open();return}const start=()=>{reset();window.MQAnalytics?.game(analyticsGame());$('gameMore').open=false};if(history.length&&!ended)showConfirm(start);else start()};
document.querySelectorAll('[data-game-skin]').forEach(btn=>btn.onclick=()=>{window.MQAnalytics?.track('skin_changed',{from_skin:skin,to_skin:btn.dataset.gameSkin});skin=btn.dataset.gameSkin;try{localStorage.setItem('jing-xiangqi-skin',skin)}catch{}draw();toast('已切换皮肤');});
$('helpGame').onclick=()=>{$('gameMore').open=false;$('dialog').showModal()};
window.addEventListener('hashchange',()=>applyView(location.hash==='#game'?'game':location.hash==='#learn'?'learn':location.hash==='#settings'?'settings':location.hash==='#masters'?'masters':location.hash==='#feedback'?'feedback':'home'));
// Every fresh visit starts at home; only valid room invitations bypass it.
function initialView(){
 const invite=new URL(location.href).searchParams.get('room');
 const view=/^[A-Fa-f0-9]{8}$/.test(invite||'')?'game':'home';
 const url=new URL(location.href);
 if(view==='home')url.searchParams.delete('room');
 url.hash=view;
 window.history.replaceState(null,'',url);
 return view;
}
draftMode=mode;applyView(initialView());

// Board changes are purely visual and preserve the current game.
document.querySelectorAll('[data-map]').forEach(btn=>btn.onclick=()=>{terrainMap=btn.dataset.map;try{localStorage.setItem('jing-terrain-map',terrainMap)}catch{}draw();toast(terrainMap==='clean'?'已切换为素净棋盘':'已切换为柳岸行营');});

const levelNotes={2:'轻松入局，适合熟悉走法。',3:'基础攻防，适合日常练习。',4:'深入计算攻防变化，思考约 1 秒。',5:'高手强化：3倍思考预算，复杂局面最多约8.4秒。',6:'宗师快思：开局约2秒内，中局约5秒内，复杂攻防及残局最多约7秒。'};
function syncLevelPicker(){
 const input=$('level');
 document.querySelectorAll('[data-level]').forEach(button=>{
  const selected=button.dataset.level===input.value;
  button.setAttribute('aria-pressed',String(selected));
  button.classList.toggle('active',selected);
  button.disabled=input.disabled;
 });
 const row=document.querySelector('.mountain-levels');if(row)row.hidden=input.disabled;
}
function updateLevelNote(){$('levelNote').textContent=levelNotes[$('level').value]||levelNotes[2];syncLevelPicker();}
document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>{
 if(button.disabled)return;
 $('level').value=button.dataset.level;if(!ended&&history.length)gameRecordLevel=Math.min(gameRecordLevel,Number(button.dataset.level));updateLevelNote();save();
}));
$('level').addEventListener('change',updateLevelNote);updateLevelNote();

// Use the same original H1 artwork in the skin picker.
const previewObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){
  paintPiece(entry.target.querySelector('svg'),'rk',entry.target.closest('[data-skin]').dataset.skin);
  previewObserver.unobserve(entry.target);
 }
},{rootMargin:'100px'}):null;
document.querySelectorAll('.home-panel [data-skin]').forEach(button=>{
 const sample=button.querySelector('.skin-sample');sample.replaceChildren();
 const svg=node('svg',{viewBox:'-32 -32 64 64',width:64,height:64,'aria-hidden':'true'},sample);
 if(previewObserver)previewObserver.observe(sample);else paintPiece(svg,'rk',button.dataset.skin);
});



// Persist successful artwork downloads for later visits, without prefetching other skins.
if(typeof navigator!=='undefined'&&'serviceWorker' in navigator){setTimeout(()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}),1000);}






// Settings is a separate page; preferences apply to both home and game.
function syncSoundSetting(){
 $('soundSetting').checked=!muted;
 $('sound').textContent=muted?'♪　音效关':'♪　音效开';
}
function setSoundEnabled(enabled){
 muted=!enabled;syncSoundSetting();
 try{localStorage.setItem('miaoqi-sound',enabled?'on':'off')}catch{}
}
try{muted=localStorage.getItem('miaoqi-sound')!=='on'}catch{}
syncSoundSetting();
$('soundSetting').addEventListener('change',()=>{setSoundEnabled($('soundSetting').checked);if(!muted)audio()});
$('openProfile').onclick=()=>navigate('settings');
$('backSettings').onclick=()=>navigate('home');

// Keep the skin heading at the first-screen edge; thumbnails follow on scroll.
function updateHomeSkinFold(){
 const collection=document.querySelector('.home-collection');
 if(!collection||typeof window.matchMedia!=='function')return;
 collection.style.removeProperty('--skin-fold-space');
 if(pageView!=='home'||!window.matchMedia('(max-width:760px)').matches)return;
 const heading=collection.querySelector('.picker-title');if(!heading)return;
 const rect=heading.getBoundingClientRect(),top=rect.top+(window.scrollY||0);
 const viewport=document.documentElement.clientHeight||window.innerHeight;
 const space=Math.max(0,viewport-rect.height-12-top);
 collection.style.setProperty('--skin-fold-space',space+'px');
}
function scheduleHomeSkinFold(){
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(updateHomeSkinFold);
}
window.addEventListener('resize',scheduleHomeSkinFold);
if(typeof ResizeObserver==='function'){
 const homeFoldObserver=new ResizeObserver(scheduleHomeSkinFold);
 for(const item of document.querySelectorAll('.home-header,.home-actions,#homePreview'))homeFoldObserver.observe(item);
}
if(document.fonts?.ready)document.fonts.ready.then(scheduleHomeSkinFold);
scheduleHomeSkinFold();





// Controls are live only after all core handlers are installed.
window.MQStartup?.ready();





