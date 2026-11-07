/* Миссия: 2 четверть. Движок игры. */
(function(){
'use strict';
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,'');
var V=window.M2_VERSION||'1';
var APP=document.getElementById('app');
var DATA=null, MAN={};
var KEY='m2_state_v1';var TEST=/[?&]test=1/.test(location.search);

/* ---------- хранение ---------- */
var mem=null;
function load(){var s=null;try{s=JSON.parse(localStorage.getItem(KEY));}catch(e){s=mem;}
  s=s||{};s.done=s.done||{};s.offline=s.offline||{};s.err=s.err||{};s.owned=s.owned||[];s.pts=s.pts||0;s.seen=s.seen||{};return s;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){mem=S;}}
var S=load();

/* ---------- утилиты ---------- */
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function tx(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function btn(label,cls,fn){var b=tx('button',cls||'',label);b.type='button';if(fn)b.onclick=fn;return b;}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function clear(){APP.innerHTML='';window.scrollTo(0,0);}
function norm(s){return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z' ]/g,' ').replace(/\s+/g,' ').trim();}
function toast(t,ms){var d=tx('div','toast',t);document.body.appendChild(d);setTimeout(function(){d.remove();},ms||1800);}

/* ---------- звук ---------- */
var cur=null;
function play(text,voice,slow){
  var k=(voice||'emma')+'|'+text;var f=MAN[k];
  try{if(cur){cur.pause();}}catch(e){}
  if(f){cur=new Audio(BASE+'audio/'+f+(slow?'_slow':'')+'.mp3?v='+V);var p=cur.play();if(p&&p.catch)p.catch(function(){});return;}
  try{var u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=slow?0.6:0.8;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
}
/* сыграть фразу и дождаться конца, потом cb (фраза не обрывается) */
function playThen(text,voice,cb){var doneF=false;function fin(){if(doneF)return;doneF=true;setTimeout(cb,350);}
  var k=(voice||'emma')+'|'+text;var f=MAN[k];
  try{if(cur){cur.pause();}}catch(e){}
  if(!f){play(text,voice);setTimeout(fin,1500);return;}
  cur=new Audio(BASE+'audio/'+f+'.mp3?v='+V);var a=cur;
  a.addEventListener('ended',fin);a.addEventListener('error',function(){setTimeout(fin,800);});
  var pr=a.play();if(pr&&pr.catch)pr.catch(function(){setTimeout(fin,1200);});
  setTimeout(fin,9000);}
function sndRow(text,voice){var r=el('div','row');
  r.appendChild(btn('▶','ico',function(){play(text,voice);}));
  r.appendChild(btn('Медленно','',function(){play(text,voice,true);}));return r;}

/* ---------- герои ---------- */
var HEROES={
 thule:{name:'Давиан Тул',en:'Librarian Davian Thule',img:'img/thule.jpg',cls:'',voice:'thule'},
 angelos:{name:'Габриель Ангелос',en:'Master Gabriel Angelos',img:'img/angelos.jpg',cls:'gold',voice:'angelos'},
 narius:{name:'Нариус Век',en:'Techmarine Narius Vek',img:'img/narius.jpg',cls:'gold',voice:'narius'},
 gakul:{name:'Гакул Трака',en:'Warboss Gakul Traka',img:'img/gakul.jpg',cls:'ork',voice:'gakul'}};
function heroSay(h,en,ru,auto){var H=HEROES[h];var d=el('div','hero '+H.cls);
  var im=el('img');im.src=BASE+H.img+'?v='+V;im.alt=H.name;d.appendChild(im);
  var s=el('div','say');s.appendChild(tx('div','who',H.name));
  if(en){var e=tx('div','en',en);s.appendChild(e);}
  if(ru)s.appendChild(tx('div','ru',ru));
  if(en){s.style.cursor='pointer';s.onclick=function(){play(en,H.voice);};}
  d.appendChild(s);if(en&&auto)setTimeout(function(){play(en,H.voice);},250);return d;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function praise(){return pick(DATA.lines.praise);} function encourage(){return pick(DATA.lines.encourage);}

/* ---------- оболочка экрана ---------- */
function shell(opts){clear();
  var top=el('div','topbar');
  top.appendChild(btn('←','ico',opts.back||function(){go('');}));
  if(opts.cheat)top.appendChild(btn('📜 Шпаргалка','',opts.cheat));
  var sp=el('div','grow');top.appendChild(sp);
  top.appendChild(el('div','','')).style.width='64px'; /* правый верх свободен */
  APP.appendChild(top);
  if(opts.progress!=null){var p=el('div','prog');var i=el('i');i.style.width=Math.round(opts.progress*100)+'%';p.appendChild(i);APP.appendChild(p);}
  if(opts.sub)APP.appendChild(tx('div','sub',opts.sub));
  if(opts.title)APP.appendChild(tx('h1','',opts.title));
  var body=el('div','');body.style.display='flex';body.style.flexDirection='column';body.style.gap='12px';APP.appendChild(body);return body;}

/* ---------- задания ---------- */
/* каждый тип: render(task, body, done(firstTry)) ; task.items = раунды */
function errKey(t,i){return t.key+'#'+i;}
function markErr(t,i){var k=errKey(t,i);S.err[k]=(S.err[k]||0)+1;save();}
function feedback(body,ok){var f=ok?heroSay('thule',praise().en,praise().ru):null;return f;}

var R={};
/* выбор ответа: слушание / чтение / грамматика */
R.pick=function(t,body,next){var items=t.items;var i=0;var first=true;
  function round(){body.innerHTML='';first=true;var it=items[i];
    if(t.prompt)body.appendChild(tx('div','note',t.prompt));
    if(it.q)body.appendChild(tx('div','q',it.q));
    if(it.big)body.appendChild(tx('div','face',it.big)).style.textAlign='center';
    if(it.say){body.appendChild(sndRow(it.say,it.v));if(t.autoplay!==false)setTimeout(function(){play(it.say,it.v);},300);}
    var ch=el('div','choices'+((it.c.length===4||it.pics)?' two':''));
    var order=shuffle(it.c.map(function(c,k){return {c:c,k:k};}));
    if(t.keepOrder)order=it.c.map(function(c,k){return {c:c,k:k};});
    var fb=el('div','');
    order.forEach(function(o){var b=btn(o.c,'choice'+(it.pics?' pic':''));if(TEST&&o.k===it.a)b.setAttribute('data-ok','1');
      b.onclick=function(){
        if(o.k===it.a){b.classList.add('ok');lock();var p=praise();fb.innerHTML='';fb.appendChild(heroSay('thule',p.en,p.ru,false));
          reward(first);playThen(p.en,'thule',function(){i++;if(i<items.length)round();else next();});}
        else{b.classList.add('no');b.disabled=true;if(first){markErr(t,i);first=false;}var e=encourage();fb.innerHTML='';fb.appendChild(heroSay('thule',e.en,e.ru,true));
          if(it.why)fb.appendChild(tx('div','note',it.why));}
      };ch.appendChild(b);});
    function lock(){[].forEach.call(ch.children,function(b){b.disabled=true;});}
    body.appendChild(ch);body.appendChild(fb);
    body.appendChild(tx('div','small',(i+1)+' / '+items.length));}
  round();};
/* верно / неверно */
R.tf=function(t,body,next){t.items.forEach(function(it){it.c=['Правда','Ложь'];it.a=it.t?0:1;});t.keepOrder=true;R.pick(t,body,next);};
/* сборка слова из букв */
R.build=function(t,body,next){var i=0;
  function round(){body.innerHTML='';var it=t.items[i];var word=it.w;var first=true;var pos=0;
    if(t.prompt)body.appendChild(tx('div','note',t.prompt));
    if(it.hint)body.appendChild(tx('div','face',it.hint)).style.textAlign='center';
    if(it.say)body.appendChild(sndRow(it.say||word,it.v));
    var slots=el('div','slots');body.appendChild(slots);
    var L=el('div','letters');body.appendChild(L);var fb=el('div','');body.appendChild(fb);
    var letters=shuffle(word.replace(/ /g,'').split(''));
    letters.forEach(function(ch){var b=btn(ch,'letter');if(TEST)b.setAttribute('data-ch',ch);b.onclick=function(){
      var need=word.replace(/ /g,'')[pos];
      if(ch===need){pos++;b.disabled=true;b.style.visibility='hidden';slots.appendChild(tx('span','slot',ch));
        if(pos===word.replace(/ /g,'').length){reward(first);var p=praise();fb.appendChild(heroSay('narius',p.en,p.ru,false));
          playThen(it.say||word,it.v,function(){playThen(p.en,'narius',function(){i++;if(i<t.items.length)round();else next();});});}}
      else{if(first){markErr(t,i);first=false;}b.classList.add('no');setTimeout(function(){b.classList.remove('no');},400);toast('Не та буква. Подсказка: следующая буква «'+need+'»');}
    };L.appendChild(b);});
    body.appendChild(tx('div','small',(i+1)+' / '+t.items.length));}
  round();};
/* сборка предложения */
R.order=function(t,body,next){var i=0;
  function round(){body.innerHTML='';var it=t.items[i];var words=it.s.split(' ');var first=true;var pos=0;
    if(t.prompt)body.appendChild(tx('div','note',t.prompt));
    if(it.ru)body.appendChild(tx('div','q',it.ru));
    var slots=el('div','slots');body.appendChild(slots);var L=el('div','letters');body.appendChild(L);var fb=el('div','');body.appendChild(fb);
    shuffle(words.map(function(w,k){return {w:w,k:k};})).forEach(function(o){var b=btn(o.w,'letter');if(TEST)b.setAttribute('data-w',o.w);b.style.fontSize='17px';
      b.onclick=function(){if(o.w===words[pos]){pos++;b.style.visibility='hidden';slots.appendChild(tx('span','slot w',o.w));
          if(pos===words.length){reward(first);var p=praise();fb.appendChild(heroSay('narius',p.en,p.ru,false));playThen(it.s,it.v,function(){playThen(p.en,'narius',function(){i++;if(i<t.items.length)round();else next();});});}}
        else{if(first){markErr(t,i);first=false;}b.classList.add('no');setTimeout(function(){b.classList.remove('no');},400);toast('Не то слово. Какое слово идёт дальше?');}};
      L.appendChild(b);});
    body.appendChild(tx('div','small',(i+1)+' / '+t.items.length));}
  round();};
/* напечатать слово: на слух или расшифровка */
R.type=function(t,body,next){var i=0;
  function round(){body.innerHTML='';var it=t.items[i];var first=true;
    if(t.prompt)body.appendChild(tx('div','note',t.prompt));
    if(t.cipher)body.appendChild(cipherTable());
    if(it.code)body.appendChild(tx('div','q',it.code)).style.textAlign='center';
    if(it.say){body.appendChild(sndRow(it.say,it.v));setTimeout(function(){play(it.say,it.v);},300);}
    var inp=el('input','typ');if(TEST)inp.setAttribute('data-a',it.w);inp.setAttribute('autocomplete','off');inp.setAttribute('autocapitalize','off');inp.setAttribute('spellcheck','false');body.appendChild(inp);
    var fb=el('div','');
    var ok=btn('Проверить','big blue',function(){
      if(norm(inp.value)===norm(it.w)){reward(first);fb.innerHTML='';var p=praise();fb.appendChild(heroSay('thule',p.en,p.ru,false));ok.disabled=true;playThen(p.en,'thule',function(){i++;if(i<t.items.length)round();else next();});}
      else{if(first){markErr(t,i);first=false;}fb.innerHTML='';var e=encourage();fb.appendChild(heroSay('thule',e.en,e.ru,true));fb.appendChild(tx('div','note','Подсказка: в слове '+it.w.length+' букв, первая «'+it.w[0]+'».'));}});
    body.appendChild(ok);body.appendChild(fb);body.appendChild(tx('div','small',(i+1)+' / '+t.items.length));setTimeout(function(){inp.focus();},400);}
  round();};
function cipherTable(){var d=el('div','cipher');var A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(var k=0;k<26;k++){var c=el('div','');c.innerHTML='<b>'+A[k]+'</b>'+A[25-k];d.appendChild(c);}
  var w=el('div','card');w.appendChild(tx('div','small','Шифр орков: буква сверху = буква снизу (A=Z, B=Y...)'));w.appendChild(d);return w;}
/* память: пары */
R.memory=function(t,body,next){body.innerHTML='';if(t.prompt)body.appendChild(tx('div','note',t.prompt));
  var cards=[];t.pairs.forEach(function(p,k){cards.push({k:k,t:p[0],pic:false,say:p[0]});cards.push({k:k,t:p[1],pic:true,say:p[0]});});
  cards=shuffle(cards);var g=el('div','mem');var open=[];var left=t.pairs.length;var miss=0;
  cards.forEach(function(c){var b=btn('?','');if(TEST)b.setAttribute('data-k',c.k);b.onclick=function(){if(open.length===2||b.classList.contains('open'))return;
      b.textContent=c.t;b.classList.add('open');if(c.pic)b.classList.add('pic');if(!c.pic)play(c.say);open.push({b:b,c:c});
      if(open.length===2){var a=open[0],z=open[1];
        if(a.c.k===z.c.k){setTimeout(function(){a.b.classList.add('gone');z.b.classList.add('gone');open=[];left--;reward(true);
            if(left===0){body.appendChild(heroSay('thule','Well done, soldier!','Отлично, боец!',false));playThen('Well done, soldier!','thule',next);}},600);}
        else{miss++;setTimeout(function(){[a,z].forEach(function(o){o.b.textContent='?';o.b.classList.remove('open','pic');});open=[];},900);}}};
    g.appendChild(b);});
  body.appendChild(g);};
/* сортировка по ящикам */
R.sort=function(t,body,next){body.innerHTML='';if(t.prompt)body.appendChild(tx('div','note',t.prompt));
  var sel=null;var left=t.items.length;var first={};
  var pool=el('div','letters');var bins=el('div','bins');
  t.bins.forEach(function(name,bi){var b=el('div','bin');b.appendChild(tx('div','hd',name));
    b.onclick=function(){if(!sel)return;var it=sel.it;
      if(it.b===bi){sel.btn.remove();b.appendChild(tx('span','',it.w));if(!first[it.w])reward(true);left--;sel=null;if(left===0){body.appendChild(heroSay('thule','Well done, soldier!','Отлично, боец!',false));playThen('Well done, soldier!','thule',next);}}
      else{if(!first[it.w]){first[it.w]=1;S.err[t.key+'#'+it.w]=(S.err[t.key+'#'+it.w]||0)+1;save();}toast('Не сюда. Попробуй другой ящик.');}};
    bins.appendChild(b);});
  shuffle(t.items).forEach(function(it){var b=btn(it.w,'chip');if(TEST)b.setAttribute('data-b',it.b);b.onclick=function(){if(sel)sel.btn.classList.remove('sel');sel={btn:b,it:it};b.classList.add('sel');play(it.say||it.w);};pool.appendChild(b);});
  body.appendChild(tx('div','small','Нажми слово (оно прозвучит), потом нажми ящик.'));body.appendChild(pool);body.appendChild(bins);};
/* повтори за героем: оценивает мама или сам */
R.repeat=function(t,body,next){var i=0;
  function round(){body.innerHTML='';var it=t.items[i];
    body.appendChild(tx('div','note',t.prompt||'Послушай и повтори вслух. Мама скажет, получилось ли.'));
    body.appendChild(tx('div','q',it.s));if(it.ru)body.appendChild(tx('div','note',it.ru));
    if(it.tip)body.appendChild(tx('div','note','💡 '+it.tip));
    body.appendChild(sndRow(it.s,it.v));setTimeout(function(){play(it.s,it.v);},300);
    var r=el('div','row');
    r.appendChild(btn('Ещё раз','grow',function(){play(it.s,it.v,true);}));
    r.appendChild(btn('Сказал ✓','grow big green',function(){reward(true);i++;if(i<t.items.length)round();else next();}));
    body.appendChild(r);body.appendChild(tx('div','small',(i+1)+' / '+t.items.length));}
  round();};
/* диалог: выбери реплику */
R.dialog=function(t,body,next){var i=0;
  function round(){body.innerHTML='';var it=t.items[i];if(t.prompt)body.appendChild(tx('div','note',t.prompt));
    body.appendChild(heroSay(it.h||'thule',it.line,it.ru,true));
    body.appendChild(tx('div','note','Что ответишь?'));
    var sub={key:t.key,items:[{c:it.c,a:it.a,why:it.why}],keepOrder:false};
    var holder=el('div','');body.appendChild(holder);
    R.pick(sub,holder,function(){playThen(it.c[it.a],'emma',function(){i++;if(i<t.items.length)round();else next();});});}
  round();};
/* чтение текста + вопросы */
R.read=function(t,body,next){body.innerHTML='';var c=el('div','card');c.appendChild(tx('div','hd',t.title||'Разведданные'));
  t.text.forEach(function(s){var p=tx('div','text',s);p.style.cursor='pointer';p.onclick=function(){play(s);};c.appendChild(p);});
  c.appendChild(tx('div','small','Нажми на предложение, чтобы услышать его.'));
  body.appendChild(c);var go=btn('Прочитал, к вопросам','big blue',function(){go.remove();var h=el('div','');body.appendChild(h);R.pick({key:t.key,items:t.items},h,next);body.insertBefore(c,body.firstChild);});
  body.appendChild(go);};
/* быстрый огонь: 30 секунд */
R.blitz=function(t,body,next){body.innerHTML='';var sec=TEST?2:(t.sec||30);var score=0;var items=shuffle(t.items);var k=0;
  body.appendChild(tx('div','note',t.prompt||'30 секунд! Отвечай как можно быстрее.'));
  var start=btn('Огонь!','big',function(){start.remove();run();});body.appendChild(start);
  function run(){var tm=tx('div','timer',sec+'');body.appendChild(tm);var area=el('div','');body.appendChild(area);
    var iv=setInterval(function(){sec--;tm.textContent=sec+'';if(sec<=0){clearInterval(iv);finish();}},1000);
    function q(){area.innerHTML='';var it=items[k%items.length];k++;area.appendChild(tx('div','q',it.q));var ch=el('div','choices two');
      it.c.forEach(function(c,ci){var b=btn(c,'choice');b.onclick=function(){if(ci===it.a){score++;reward(true);q();}else{b.classList.add('no');S.err[t.key+'#'+it.q]=(S.err[t.key+'#'+it.q]||0)+1;save();setTimeout(q,500);}};ch.appendChild(b);});area.appendChild(ch);}
    q();
    function finish(){area.innerHTML='';var best=S.seen['blitz_'+t.key]||0;if(score>best){S.seen['blitz_'+t.key]=score;save();}
      area.appendChild(heroSay('angelos','Good shooting, soldier!','Попаданий: '+score+(score>best?' Новый рекорд!':' Рекорд: '+best),true));
      area.appendChild(btn('Дальше','big',next));}}};
/* письмо: проверяет мама */
R.write=function(t,body,next){body.innerHTML='';body.appendChild(tx('div','note',t.prompt));
  if(t.sample){var c=el('div','card');c.appendChild(tx('div','small','Образец'));t.sample.forEach(function(s){c.appendChild(tx('div','text',s));});body.appendChild(c);}
  var ta=el('textarea');ta.placeholder='Пиши здесь по-английски...';body.appendChild(ta);
  body.appendChild(btn('Мама проверила ✓','big green',function(){if(ta.value.trim().length<5){toast('Сначала напиши хотя бы одно предложение');return;}reward(true);S.seen['w_'+t.key]=ta.value;save();next();}));};
/* брифинг */
function briefing(b,body,next){body.innerHTML='';
  body.appendChild(heroSay('thule','Listen up, soldier!','Слушай внимательно, боец! Новое правило.',true));
  var c=el('div','card');c.appendChild(tx('div','hd',b.title));c.appendChild(el('div','text',b.rule));
  (b.formula||[]).forEach(function(f){var fd=el('div','formula');f.forEach(function(p){fd.appendChild(tx('span',p[1]||'',p[0]));});c.appendChild(fd);fd.style.marginTop='8px';});
  if(b.note)c.appendChild(el('div','note',b.note));body.appendChild(c);
  var ex=el('div','');ex.style.display='flex';ex.style.flexDirection='column';ex.style.gap='6px';
  b.examples.forEach(function(e){var r=el('div','card row');var t=el('div','grow');t.appendChild(tx('div','text',e[0]));if(e[1])t.appendChild(tx('div','small',e[1]));r.appendChild(t);
    r.appendChild(btn('▶','ico',function(){play(e[0]);}));r.appendChild(btn('🐢','ico',function(){play(e[0],null,true);}));ex.appendChild(r);});
  body.appendChild(ex);
  if(b.trap){var tr=el('div','trap');tr.appendChild(tx('div','sub','Ловушка'));b.trap.forEach(function(p){tr.appendChild(el('div','text','<span class="bad">'+p[0]+'</span> → <span class="good">'+p[1]+'</span>'));if(p[2])tr.appendChild(tx('div','note',p[2]));});body.appendChild(tr);}
  body.appendChild(btn('Проверка: 3 вопроса','big blue',next));}

/* ---------- награды ---------- */
var earned=0;
function reward(first){var p=first?10:3;S.pts+=p;earned+=p;save();}

/* ---------- урок ---------- */
function lessonById(n){return DATA.lessons.filter(function(l){return l.n===n;})[0];}
function unlocked(n){if(n===1)return true;return !!S.done[n-1];}
function cheatModal(L){var m=el('div','modal');var b=el('div','box');m.appendChild(b);
  b.appendChild(tx('h2','','Шпаргалка'));
  (L.cheat||[]).forEach(function(c){var d=el('div','card');d.style.marginTop='8px';d.appendChild(tx('div','hd',c.t));c.lines.forEach(function(s){var r=el('div','row');r.appendChild(el('div','grow text',s));
      var en=s.replace(/<[^>]+>/g,'');if(/[a-z]/i.test(en)&&!/[а-я]/i.test(en))r.appendChild(btn('▶','ico',function(){play(en);}));d.appendChild(r);});b.appendChild(d);});
  if(!L.cheat||!L.cheat.length)b.appendChild(tx('div','note','В этом уроке новых правил нет. Удачи, боец!'));
  b.appendChild(btn('Закрыть','big',function(){m.remove();}));m.onclick=function(e){if(e.target===m)m.remove();};document.body.appendChild(m);}

function buildSteps(L){var st=[];
  st.push({kind:'song'});
  (L.review||[]).forEach(function(t){st.push({kind:'task',t:t,label:'Разминка'});});
  if(L.briefing){st.push({kind:'brief'});(L.briefing.check||[]).forEach(function(t){st.push({kind:'task',t:t,label:'Проверка брифинга'});});}
  var tasks=L.tasks||[];
  if(L.review_lesson){tasks=reviewTasks(L).concat(tasks);}
  tasks.forEach(function(t){st.push({kind:'task',t:t,label:'Задание'});});
  st.push({kind:'offline'});st.push({kind:'end'});return st;}

function reviewTasks(L){/* разбор полётов: задания с ошибками из уроков блока */
  var out=[];var counts={};Object.keys(S.err).forEach(function(k){var tk=k.split('#')[0];counts[tk]=(counts[tk]||0)+S.err[k];});
  var all=[];DATA.lessons.forEach(function(l){if(l.n<L.n&&l.n>=L.from){(l.tasks||[]).concat(l.review||[]).forEach(function(t){if(counts[t.key]&&['pick','tf','build','order','type','dialog'].indexOf(t.type)>=0)all.push(t);});}});
  all.sort(function(a,b){return counts[b.key]-counts[a.key];});
  all.slice(0,4).forEach(function(t){var c=JSON.parse(JSON.stringify(t));c.key='r'+L.n+'_'+t.key;out.push(c);});
  L._fromErrors=out.length;return out;}

function lesson(n){var L=lessonById(n);
  if(!L){var b=shell({title:'Урок '+n});b.appendChild(heroSay('angelos','','Эта точка ещё в тумане войны. Скоро разведка доложит!'));b.appendChild(btn('На карту','big',function(){go('');}));return;}
  if(!unlocked(n)){var b2=shell({title:'Урок '+n});b2.appendChild(heroSay('thule','','Сначала захвати точку '+(n-1)+', боец!'));b2.appendChild(btn('На карту','big',function(){go('');}));return;}
  earned=0;var steps=buildSteps(L);var k=0;S.last=n;save();
  function show(){var st=steps[k];
    var body=shell({sub:'Урок '+n+' · '+L.point,title:L.title,progress:k/steps.length,cheat:function(){cheatModal(L);},back:function(){if(confirm('Выйти на карту? Урок начнётся заново.'))go('');}});
    function next(){k++;show();}
    if(st.kind==='song')return songStep(L,body,next);
    if(st.kind==='brief')return briefing(L.briefing,body,next);
    if(st.kind==='offline')return offlineStep(L,body,next);
    if(st.kind==='end')return endStep(L,body);
    var t=st.t;body.appendChild(tx('div','sub',st.label+(t.name?': '+t.name:'')));
    if(t.gakul)body.appendChild(heroSay('gakul',t.gakul[0],t.gakul[1],true));
    var holder=el('div','');holder.style.display='flex';holder.style.flexDirection='column';holder.style.gap='12px';body.appendChild(holder);
    (R[t.type]||R.pick)(t,holder,next);}
  show();}

function songStep(L,body,next){var s=L.song;body.appendChild(tx('div','sub','Разминка: песня'));
  if(s.type==='mg'){body.appendChild(heroSay('thule','','Боевая кричалка! Послушай и расскажи вместе с мамой.'));
    var c=el('div','card');c.appendChild(tx('div','hd',s.title));s.text.forEach(function(l){c.appendChild(tx('div','text',l));});
    c.appendChild(tx('div','small','Народный английский стишок (The Real Mother Goose, 1916)'));body.appendChild(c);
    body.appendChild(sndRow(s.text.join(' '),'emma'));}
  else{body.appendChild(heroSay('thule','','Боевая песня! Мама включает её на своём телефоне. Пой вместе!'));
    var c2=el('div','card');c2.appendChild(tx('div','hd',s.title));c2.appendChild(tx('div','note',s.type==='tb'?'Песня из учебника, '+s.where:'British Council, LearnEnglish Kids'));if(s.tip)c2.appendChild(tx('div','note',s.tip));body.appendChild(c2);}
  body.appendChild(btn('Спели ✓','big green',next));}

function askPin(cb){var m=el('div','modal');var b=el('div','box');m.appendChild(b);var setting=!S.pin;
  b.appendChild(tx('div','hd',setting?'Мама, придумайте PIN из 4 цифр':'Введите PIN мамы'));
  var i=el('input','pin');i.type='password';i.setAttribute('inputmode','numeric');i.maxLength=4;b.appendChild(i);var msg=tx('div','note','');b.appendChild(msg);
  var r=el('div','row');r.appendChild(btn('Отмена','grow',function(){m.remove();}));
  r.appendChild(btn('OK','grow big',function(){var v=i.value;if(!/^\d{4}$/.test(v)){msg.textContent='Нужно 4 цифры';return;}
    if(setting){S.pin=v;save();}else if(v!==S.pin){msg.textContent='Неверный PIN';return;}m.remove();cb();}));
  b.appendChild(r);document.body.appendChild(m);setTimeout(function(){i.focus();},60);}

function markOffline(n,cb){askPin(function(){S.offline[n]=new Date().toLocaleDateString('ru-RU');S.pts+=20;save();toast('Задание вне телефона засчитано! +20');if(cb)cb();});}

function offlineStep(L,body,next){body.appendChild(tx('div','sub','Вне телефона'));
  body.appendChild(heroSay('angelos','','Боец, задание без экрана! Отложи телефон и выполни его вместе с мамой.'));
  var c=el('div','card');c.appendChild(tx('div','hd',L.offline.title));c.appendChild(el('div','text',L.offline.text));if(L.offline.need)c.appendChild(tx('div','small','Понадобится: '+L.offline.need));body.appendChild(c);
  var done=btn(S.offline[L.n]?'Выполнено ✓':'Вне телефона: выполнили (мама)','big '+(S.offline[L.n]?'green':''),function(){if(S.offline[L.n]){next();return;}markOffline(L.n,next);});
  body.appendChild(done);
  body.appendChild(btn('Сделаем позже','',next));}

function endStep(L,body){var first=!S.done[L.n];S.done[L.n]=new Date().toLocaleDateString('ru-RU');save();
  body.appendChild(heroSay(L.fortress?'angelos':'thule',L.fortress?'The fortress is ours!':'Point captured! Well done, soldier!',(L.fortress?'Крепость наша! ':'Точка захвачена! ')+L.point,true));
  var c=el('div','card');c.appendChild(tx('div','hd','Итог'));c.appendChild(tx('div','text','Реквизиция за урок: +'+earned));c.appendChild(tx('div','text','Всего: '+S.pts));
  if(!S.offline[L.n])c.appendChild(tx('div','note','Задание вне телефона ждёт в «Долгах отряда» на карте.'));body.appendChild(c);
  body.appendChild(btn('В Арсенал','big blue',function(){go('arsenal');}));
  body.appendChild(btn('На карту','big',function(){go('');}));}

/* ---------- карта ---------- */
function map(){var b=shell({sub:'Боец Елисей · 2 четверть',title:'Сектор: Калдерис',back:function(){go('');}});
  APP.querySelector('.topbar').firstChild.style.visibility='hidden';
  var st=el('div','stats');var nDone=Object.keys(S.done).length;
  [['Реквизиция',S.pts],['Точки',nDone+' / 30'],['Ошибок в базе',Object.keys(S.err).length]].forEach(function(x){var d=el('div','stat');d.appendChild(tx('b','',x[1]+''));d.appendChild(tx('span','',x[0]));st.appendChild(d);});b.appendChild(st);
  var next=1;while(S.done[next])next++;
  DATA.planets.forEach(function(p){var c=el('div','card');c.appendChild(tx('div','hd',p.name));c.appendChild(tx('div','small',p.sub));
    var list=el('div','lesson-list');list.style.marginTop='8px';
    for(var n=p.from;n<=p.to;n++){(function(n){var L=lessonById(n);var a=el('a','ll'+(S.done[n]?' done':'')+(n===next&&L?' next':'')+(!L||!unlocked(n)?' lock':''));a.href='#'+n;
      a.appendChild(tx('div','num',S.done[n]?'✓':n+''));var t=el('div','grow');t.appendChild(tx('div','',L?L.title:'В тумане войны'));t.appendChild(tx('div','small',L?L.point+(S.offline[n]?' · вне телефона ✓':''):'скоро'));a.appendChild(t);list.appendChild(a);})(n);}
    c.appendChild(list);b.appendChild(c);});
  var debts=Object.keys(S.done).filter(function(n){return !S.offline[n];});
  if(debts.length){var d=el('div','card');d.appendChild(tx('div','hd','Долги отряда'));d.appendChild(tx('div','small','Задания вне телефона, которые ещё не отмечены'));
    debts.forEach(function(n){var L=lessonById(+n);if(!L)return;var r=el('div','row');r.style.marginTop='6px';r.appendChild(tx('div','grow','Урок '+n+': '+L.offline.title));r.appendChild(btn('Отметить','',function(){markOffline(+n,map);}));d.appendChild(r);});b.appendChild(d);}
  b.appendChild(btn('Арсенал','big blue',function(){go('arsenal');}));}

/* ---------- арсенал ---------- */
function arsenal(){var b=shell({sub:'Реквизиция: '+S.pts,title:'Арсенал'});
  b.appendChild(heroSay('narius','Armour is ready, soldier!','Снаряжение готово! Нажми на вещь: услышишь слово. Купи за реквизицию.',true));
  var g=el('div','gear');DATA.gear.forEach(function(it){var own=S.owned.indexOf(it.en)>=0;var bt=btn('', own?'own':'');
    bt.appendChild(tx('b','',it.en));bt.appendChild(tx('span','small',it.ru));bt.appendChild(tx('span','',own?'✓ есть':it.cost+' реквизиции'));
    bt.onclick=function(){play(it.en);if(own)return;if(S.pts<it.cost){toast('Не хватает реквизиции. Проходи уроки!');return;}
      if(confirm('Купить '+it.en+' за '+it.cost+'?')){S.pts-=it.cost;S.owned.push(it.en);save();toast(it.en+' теперь в отряде!');arsenal();}};g.appendChild(bt);});
  b.appendChild(g);}

/* ---------- для мамы ---------- */
function mama(){var b=shell({sub:'Только для мамы',title:'Для мамы'});
  b.appendChild(tx('div','note','Здесь песни разминки, комментарии и задания «вне телефона». Ваш телефон ничего не записывает в прогресс Елисея.'));
  DATA.lessons.forEach(function(L){var c=el('div','card');c.appendChild(tx('div','hd','Урок '+L.n+'. '+L.title));c.appendChild(tx('div','small',(L.pages||'')+' · '+L.point));
    var s=L.song;var p=el('div','note');p.style.marginTop='6px';
    if(s.url){p.innerHTML='<b>Песня:</b> ';var a=tx('a','',s.title);a.href=s.url;a.target='_blank';a.rel='noopener';p.appendChild(a);}else p.innerHTML='<b>Песня:</b> '+s.title+(s.where?' ('+s.where+')':'');
    c.appendChild(p);
    (L.mama||[]).forEach(function(m){c.appendChild(el('div','note','• '+m));});
    c.appendChild(el('div','note','<b>Вне телефона:</b> '+L.offline.title+'. '+L.offline.text));b.appendChild(c);});
  b.appendChild(tx('div','small','Версия '+V));}

/* ---------- роутер ---------- */
function go(h){location.hash=h?('#'+h):'#map';}
function route(){var h=(location.hash||'').replace('#','').toLowerCase();
  if(h==='mama')return mama();if(h==='arsenal')return arsenal();
  var n=parseInt(h,10);if(n>=1&&n<=30)return lesson(n);map();}

/* ---------- старт ---------- */
function start(){var c=0;function ok(){if(++c===2){window.addEventListener('hashchange',route);route();}}
  fetch(BASE+'data/block1.json?v='+V).then(function(r){return r.json();}).then(function(d){DATA=d;ok();}).catch(function(){APP.textContent='Не удалось загрузить уроки. Проверьте интернет и обновите страницу.';});
  fetch(BASE+'audio/manifest.json?v='+V).then(function(r){return r.json();}).then(function(m){MAN=m;ok();}).catch(function(){MAN={};ok();});}
start();
})();
