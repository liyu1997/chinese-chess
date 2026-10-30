(function(){
const $=id=>document.getElementById(id),{stages,lessons,position}=XQLessons,NS='http://www.w3.org/2000/svg';
let stage='basics',lesson=lessons[0],step=0,practice=false,chosen=null,completed=new Set(),board=position(lesson,XQ);
try{const ids=JSON.parse(localStorage.getItem('jing-academy-v1'));if(Array.isArray(ids))completed=new Set(ids.filter(id=>lessons.some(l=>l.id===id)));}catch{}
function element(tag,attrs={},text){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;}
function progress(){
 $('learnProgress').textContent=`已完成 ${completed.size} / ${lessons.length} 课`;
 $('learnProgressBar').value=completed.size;$('learnProgressBar').max=lessons.length;
 for(const b of $('learnLessonList').querySelectorAll('button')){const l=lessons.find(l=>l.id===b.dataset.lesson);b.querySelector('.lesson-done').textContent=completed.has(l.id)?'✓':'○';}
}
function renderNav(){
 const tabs=$('learnStages');tabs.replaceChildren();
 stages.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',s.id===stage);b.innerHTML=`<span class="stage-number">0${i+1}</span><strong>${s.name}</strong><small>${s.subtitle}</small>`;b.onclick=()=>{stage=s.id;openLesson(lessons.find(l=>l.stage===stage));};tabs.append(b);});
 const current=stages.find(s=>s.id===stage);$('learnStageIntro').textContent=current.intro;$('learnStageGoal').textContent=current.goal;
 const list=$('learnLessonList');list.replaceChildren();
 lessons.filter(l=>l.stage===stage).forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.dataset.lesson=l.id;b.setAttribute('aria-current',l.id===lesson.id?'step':'false');b.innerHTML=`<span class="lesson-done">${completed.has(l.id)?'✓':'○'}</span><span><strong>${l.title}</strong><small>第 ${i+1} 课 · 约 ${l.time} 分钟</small></span><span aria-hidden="true">↗</span>`;b.onclick=()=>openLesson(l);list.append(b);});progress();
}
function openLesson(l){lesson=l;stage=l.stage;step=0;practice=false;chosen=null;board=position(l,XQ);renderNav();renderLesson();}
function renderLesson(){
 $('lessonStage').textContent=stages.find(s=>s.id===stage).name+' · '+(practice?'动手练习':'棋法讲解');
 $('lessonTitle').textContent=lesson.title;$('lessonSummary').textContent=lesson.summary;
 $('lessonPoints').replaceChildren(...lesson.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('lessonMistake').textContent=lesson.mistake;$('lessonTakeaway').textContent=lesson.takeaway;
 $('learnPractice').textContent=practice?'退出练习':'自己试一试';$('learnPractice').setAttribute('aria-pressed',practice);
 $('learnPrev').disabled=practice||step===0;$('learnNext').disabled=practice||step===lesson.steps.length;
 $('learnStep').textContent=`${step} / ${lesson.steps.length}`;
 $('learnNext').textContent='下一步 →';
 const next=lesson.steps[step];
 $('learnBoardTitle').textContent=practice?'按提示完成这段棋法':'跟着棋盘，一步步看';
 $('learnFeedback').className='learn-feedback';
 $('learnFeedback').textContent=next?(practice?'轮到你：':'下一步：')+next.text:practice?'练习完成！你已亲手走完这段棋法。':lesson.mate?'演示完成：黑方已被将死，观察各子如何封住逃路。':'演示完成。点击“自己试一试”，亲手走一遍。';
 $('learnMark').textContent=completed.has(lesson.id)?'已完成 ✓':'标记已学会';
 const index=lessons.indexOf(lesson);$('learnFollowing').textContent=index===lessons.length-1?'回到第一课 ↗':'学习下一课 ↗';
 drawBoard();
}
function drawBoard(){
 const svg=$('learnBoard');svg.replaceChildren();
 const add=(tag,attrs,text)=>{const el=element(tag,attrs,text);svg.append(el);return el;};
 add('rect',{x:3,y:3,width:466,height:526,rx:20,fill:'#efe4cd',stroke:'#d2c3a5','stroke-width':2});
 for(let y=0;y<10;y++)add('path',{d:`M36 ${38+y*50}H436`,stroke:'#b29f7e','stroke-width':1});
 for(let x=0;x<9;x++){let X=36+x*50;add('path',{d:`M${X} 38V238 M${X} 288V488`,stroke:'#b29f7e','stroke-width':1});}
 add('path',{d:'M36 38V488 M436 38V488 M186 38L286 138 M286 38L186 138 M186 388L286 488 M286 388L186 488',fill:'none',stroke:'#b29f7e','stroke-width':1});
 add('text',{x:236,y:270,'text-anchor':'middle',fill:'#a49170','font-size':15,'letter-spacing':10},'楚河  汉界');
 const next=lesson.steps[step];
 if(next&&!practice){
  const x=36+next.x*50,y=38+next.y*50,X=36+next.X*50,Y=38+next.Y*50;
  add('path',{d:`M${x} ${y}L${X} ${Y}`,stroke:'#84966f','stroke-width':5,opacity:.45,'stroke-dasharray':'7 6'});
  add('circle',{cx:X,cy:Y,r:13,fill:'#96a47b',opacity:.6});
 }
 for(let y=0;y<10;y++)for(let x=0;x<9;x++){
  const p=board[y][x],X=36+x*50,Y=38+y*50;
  const label=`${p?(p[0]==='r'?'红':'黑')+XQ.names[p[0]][p[1]]:'空位'} ${x+1}列${y+1}行`;
  const g=add('g',{role:'button',tabindex:practice?'0':'-1','aria-label':label,transform:`translate(${X} ${Y})`,class:'learn-square'});
  const append=(tag,attrs,text)=>g.append(element(tag,attrs,text));
  append('circle',{r:24,fill:'transparent'});
  if(p){append('circle',{cy:2,r:21,fill:'#baa88a',opacity:.45});append('circle',{r:21,fill:'#fff9e9',stroke:chosen?.x===x&&chosen?.y===y?'#6f865d':'#c5b596','stroke-width':chosen?.x===x&&chosen?.y===y?3:1.3});append('circle',{r:17.7,fill:'none',stroke:'#e7dcc5','stroke-width':1});append('text',{'text-anchor':'middle',y:8,'font-size':24,'font-weight':700,fill:p[0]==='r'?'#a05745':'#4d584e','pointer-events':'none'},XQ.names[p[0]][p[1]]);}
  if(practice&&chosen){const legal=XQ.moves(board,board[chosen.y][chosen.x][0]);if(legal.some(m=>m.x===chosen.x&&m.y===chosen.y&&m.X===x&&m.Y===y))append('circle',{r:p?23:6,fill:p?'none':'#81936d',stroke:'#81936d','stroke-width':2,'pointer-events':'none'});}
  g.onclick=()=>pick(x,y);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x,y);}};
 }
}
function pick(x,y){
 if(!practice||step>=lesson.steps.length)return;
 const target=lesson.steps[step],side=board[target.y][target.x][0],p=board[y][x];
 if(p?.[0]===side){chosen={x,y};drawBoard();$('learnFeedback').textContent='已选择'+XQ.names[p[0]][p[1]]+'，请选择落点。';return;}
 if(!chosen){$('learnFeedback').textContent='先点选要移动的棋子，再点击落点。';return;}
 const m={x:chosen.x,y:chosen.y,X:x,Y:y};
 if(!XQ.moves(board,side).some(a=>a.x===m.x&&a.y===m.y&&a.X===m.X&&a.Y===m.Y)){$('learnFeedback').textContent='这一步不符合走棋规则，棋盘保持原样。请检查路线、马腿、炮架或将帅安全。';return;}
 if(['x','y','X','Y'].some(k=>m[k]!==target[k])){$('learnFeedback').textContent='这步可以走，但不是本课的示范路线。再想想：'+target.text;return;}
 board=XQ.play(board,m);step++;chosen=null;
 if(step===lesson.steps.length)markComplete(false);
 renderLesson();
}
function markComplete(render=true){completed.add(lesson.id);try{localStorage.setItem('jing-academy-v1',JSON.stringify([...completed]));}catch{}progress();if(render)renderLesson();}
function seek(n){step=n;chosen=null;board=position(lesson,XQ);for(let i=0;i<step;i++)board=XQ.play(board,lesson.steps[i]);renderLesson();}
$('learnPrev').onclick=()=>seek(Math.max(0,step-1));$('learnNext').onclick=()=>seek(Math.min(lesson.steps.length,step+1));
$('learnReplay').onclick=()=>{chosen=null;seek(0);};
$('learnPractice').onclick=()=>{practice=!practice;seek(0);};
$('learnHint').onclick=()=>{const m=lesson.steps[step];if(!m)return;$('learnFeedback').textContent=`提示：移动${m.x+1}列${m.y+1}行的棋子，到${m.X+1}列${m.Y+1}行。`;};
$('learnMark').onclick=()=>markComplete();$('learnFollowing').onclick=()=>{openLesson(lessons[(lessons.indexOf(lesson)+1)%lessons.length]);$('lessonTitle').focus({preventScroll:true});};
$('openAcademy').onclick=()=>navigate('learn');$('closeAcademy').onclick=()=>navigate('home');
$('learnResume').onclick=()=>{const next=lessons.find(l=>!completed.has(l.id))||lessons[0];openLesson(next);navigate('learn');};
openLesson(lessons.find(l=>!completed.has(l.id))||lessons[0]);
})();
