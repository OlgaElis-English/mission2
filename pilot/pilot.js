(function(){var s=document.currentScript;var BASE=s.src.replace(/[^\/]*$/,"");var root=document.getElementById("m2");if(!root){root=document.createElement("div");root.id="m2";s.parentNode.insertBefore(root,s);}root.innerHTML="\n<style>\n#m2{--bg:#12161C;--panel:#1C232D;--panel2:#232C38;--line:#2A3340;--text:#E8EDF2;--muted:#9AA6B2;--soft:#C3CCD5;--gold:#F2A93B;--blue:#4FB3E8;--green:#3DBE7A;--ork:#7BC043;--red:#F07167;\n  background:var(--bg);color:var(--text);font-family:Nunito,system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;max-width:480px;margin:0 auto;padding:20px 16px 28px;box-sizing:border-box;border-radius:16px;line-height:1.35;text-align:left}\n#m2 *{box-sizing:border-box}\n#m2 h1{font-family:\"Russo One\",Impact,sans-serif;font-weight:400;color:var(--gold);font-size:24px;margin:0 72px 2px 0;line-height:1.15}\n#m2 h2{font-family:\"Russo One\",Impact,sans-serif;font-weight:400;font-size:17px;margin:18px 0 8px;color:var(--text)}\n#m2 .sub{font-size:13px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-right:72px}\n#m2 .card{background:var(--panel);border-radius:14px;padding:12px;margin:8px 0}\n#m2 .row{display:flex;align-items:center;gap:8px}\n#m2 .txt{flex:1;font-size:16px}\n#m2 button{font-family:inherit;border:0;border-radius:10px;min-height:44px;cursor:pointer;color:var(--text);background:var(--line);font-size:14px;padding:0 12px}\n#m2 button.play{width:44px;padding:0;display:flex;align-items:center;justify-content:center}\n#m2 button.big{width:100%;height:52px;font-family:\"Russo One\",Impact,sans-serif;font-size:17px;background:var(--gold);color:#12161C;margin-top:8px}\n#m2 button.big.done{background:var(--green);color:#0d1f15}\n#m2 .heroes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n#m2 .hero{background:var(--panel);border-radius:14px;padding:10px;text-align:center}\n#m2 .hero img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--blue);display:block;margin:0 auto 6px}\n#m2 .hero.ork img{border-color:var(--ork)}\n#m2 .hero.gold img{border-color:var(--gold)}\n#m2 .hero b{display:block;font-size:13px}\n#m2 .hero span{font-size:12px;color:var(--soft)}\n#m2 .bubble{display:flex;gap:10px;align-items:flex-start}\n#m2 .bubble img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--blue);flex:0 0 52px}\n#m2 .bubble .say{background:var(--panel2);border-radius:4px 14px 14px 14px;padding:10px 12px;flex:1}\n#m2 .bubble .who{font-size:12px;color:var(--blue)}\n#m2 .bubble.ork img{border-color:var(--ork)} #m2 .bubble.ork .who{color:var(--ork)}\n#m2 .note{font-size:13px;color:var(--soft)}\n#m2 .ok{color:var(--green)} #m2 .bad{color:var(--red)}\n#m2 .modal{position:fixed;inset:0;background:rgba(0,0,0,.7);display:none;align-items:center;justify-content:center;z-index:99999;padding:16px}\n#m2 .modal.on{display:flex}\n#m2 .modal .box{background:var(--panel);border-radius:16px;padding:18px;width:100%;max-width:340px;color:var(--text);font-family:inherit}\n#m2 .pin{width:100%;height:52px;font-size:28px;letter-spacing:12px;text-align:center;border-radius:10px;border:2px solid var(--line);background:var(--bg);color:var(--text);margin:10px 0}\n#m2 a{color:var(--gold)}\n#m2 .hide{display:none}\n</style>\n\n<!-- ===== \u042d\u043a\u0440\u0430\u043d \u0415\u043b\u0438\u0441\u0435\u044f ===== -->\n<div id=\"m2-game\">\n  <div class=\"sub\">\u041f\u0440\u043e\u0431\u043d\u044b\u0439 \u0431\u043b\u043e\u043a \u00b7 \u0437\u0432\u0443\u043a \u0438 \u0444\u043e\u0442\u043e</div>\n  <h1>\u041c\u0438\u0441\u0441\u0438\u044f: 2 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c</h1>\n\n  <h2>\u0413\u0435\u0440\u043e\u0438 \u043e\u0442\u0440\u044f\u0434\u0430</h2>\n  <div class=\"heroes\">\n    <div class=\"hero\"><img alt=\"\u0411\u0438\u0431\u043b\u0438\u0430\u0440\u0438\u0439 \u0414\u0430\u0432\u0438\u0430\u043d \u0422\u0443\u043b\" src=\"@@BASE@@img/thule.jpg\"><b>Davian Thule</b><span>\u0431\u0438\u0431\u043b\u0438\u0430\u0440\u0438\u0439</span></div>\n    <div class=\"hero gold\"><img alt=\"\u041c\u0430\u0433\u0438\u0441\u0442\u0440 \u0413\u0430\u0431\u0440\u0438\u0435\u043b\u044c \u0410\u043d\u0433\u0435\u043b\u043e\u0441\" src=\"@@BASE@@img/angelos.jpg\"><b>Gabriel Angelos</b><span>\u043c\u0430\u0433\u0438\u0441\u0442\u0440</span></div>\n    <div class=\"hero gold\"><img alt=\"\u0422\u0435\u0445\u043d\u043e\u0434\u0435\u0441\u0430\u043d\u0442\u043d\u0438\u043a \u041d\u0430\u0440\u0438\u0443\u0441 \u0412\u0435\u043a\" src=\"@@BASE@@img/narius.jpg\"><b>Narius Vek</b><span>\u0442\u0435\u0445\u043d\u043e\u0434\u0435\u0441\u0430\u043d\u0442\u043d\u0438\u043a</span></div>\n    <div class=\"hero ork\"><img alt=\"\u0412\u043e\u0436\u0434\u044c \u0413\u0430\u043a\u0443\u043b \u0422\u0440\u0430\u043a\u0430\" src=\"@@BASE@@img/gakul.jpg\"><b>Gakul Traka</b><span>\u0432\u043e\u0436\u0434\u044c \u043e\u0440\u043a\u043e\u0432</span></div>\n  </div>\n\n  <h2>\u0413\u043e\u043b\u043e\u0441\u0430 \u0433\u0435\u0440\u043e\u0435\u0432: \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435</h2>\n  <p class=\"note\">\u0423 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0433\u0435\u0440\u043e\u044f \u0434\u0432\u0430 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u0430 \u0433\u043e\u043b\u043e\u0441\u0430. \u041f\u043e\u0441\u043b\u0443\u0448\u0430\u0439\u0442\u0435 \u0441 \u0415\u043b\u0438\u0441\u0435\u0435\u043c \u0438 \u0441\u043a\u0430\u0436\u0438\u0442\u0435 \u043c\u043d\u0435, \u043a\u0430\u043a\u043e\u0439 \u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c (A \u0438\u043b\u0438 B).</p>\n  <div id=\"m2-voices\"></div>\n\n  <h2>\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0437\u0432\u0443\u043a\u0430</h2>\n  <p class=\"note\">\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u25b6 (\u043e\u0431\u044b\u0447\u043d\u0430\u044f \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c) \u0438 \u00ab\u041c\u0435\u0434\u043b\u0435\u043d\u043d\u043e\u00bb. \u0421\u043b\u0443\u0448\u0430\u0439\u0442\u0435 \u0438\u043c\u0435\u043d\u0430: \u0415\u043b\u0438\u0441\u0435\u0439, \u041d\u043e\u0447\u043a\u0430, \u041d\u0430\u0440\u0438\u0443\u0441, \u041a\u0432\u0430\u0440\u0438\u0443\u0441.</p>\n  <div id=\"m2-sounds\"></div>\n\n  <h2>\u041a\u043e\u043d\u0435\u0446 \u0443\u0440\u043e\u043a\u0430</h2>\n  <div class=\"card\">\n    <div class=\"note\">\u0412\u043d\u0435 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430: \u00ab\u041b\u0435\u0433\u043e-\u043a\u0443\u0445\u043d\u044f\u00bb. \u0421\u043e\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u043b\u0435\u0433\u043e 3 \u0431\u043b\u044e\u0434\u0430 \u0438 \u043d\u0430\u0437\u0432\u0430\u0442\u044c: I like pizza. Yum!</div>\n    <button class=\"big\" id=\"m2-done\">\u0412\u043d\u0435 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430: \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u043b\u0438</button>\n    <div class=\"note\" id=\"m2-status\" style=\"margin-top:6px\"></div>\n  </div>\n  <p class=\"note\">\u0422\u0435\u0441\u0442 \u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f: <span id=\"m2-store\"></span></p>\n</div>\n\n<!-- ===== \u0420\u0435\u0436\u0438\u043c \u00ab\u0414\u043b\u044f \u043c\u0430\u043c\u044b\u00bb (\u0430\u0434\u0440\u0435\u0441 + #mama) ===== -->\n<div id=\"m2-mama\" class=\"hide\">\n  <div class=\"sub\">\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u043c\u0430\u043c\u044b</div>\n  <h1>\u0414\u043b\u044f \u043c\u0430\u043c\u044b</h1>\n  <div class=\"card\">\n    <b>\u0423\u0440\u043e\u043a 6 (\u043f\u0440\u0438\u043c\u0435\u0440). \u041b\u0430\u043d\u0447\u0431\u043e\u043a\u0441</b>\n    <p class=\"note\">\u041f\u0435\u0441\u043d\u044f \u0440\u0430\u0437\u043c\u0438\u043d\u043a\u0438: Snack time (British Council). \u0412\u043a\u043b\u044e\u0447\u0438\u0442\u0435 \u043d\u0430 \u0441\u0432\u043e\u0451\u043c \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0435, \u0415\u043b\u0438\u0441\u0435\u0439 \u043f\u043e\u0451\u0442.</p>\n    <a href=\"https://learnenglishkids.britishcouncil.org/listen-watch/songs/snack-time\" target=\"_blank\" rel=\"noopener\">\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0435\u0441\u043d\u044e Snack time</a>\n    <p class=\"note\"><b>\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439:</b> \u0441\u043b\u0435\u0434\u0438\u0442\u0435 \u0437\u0430 please \u0432 \u043f\u0440\u043e\u0441\u044c\u0431\u0435 Can I have some..., please? \u0411\u0435\u0437 please \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0432\u044b\u0434\u0430\u0451\u043c.</p>\n    <p class=\"note\"><b>\u0412\u043d\u0435 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430:</b> \u00ab\u0421\u0443\u0445\u043f\u0430\u0451\u043a\u00bb. \u0421\u043e\u0431\u0440\u0430\u0442\u044c \u043b\u0430\u043d\u0447\u0431\u043e\u043a\u0441, \u043a\u0430\u0436\u0434\u0443\u044e \u0432\u0435\u0449\u044c \u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u043e-\u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438.</p>\n  </div>\n  <div class=\"card\">\n    <p class=\"note\">\u042d\u0442\u043e \u043f\u0440\u043e\u0432\u0435\u0440\u043e\u0447\u043d\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f. \u0412 \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0439 \u0438\u0433\u0440\u0435 \u0437\u0434\u0435\u0441\u044c \u0431\u0443\u0434\u0435\u0442 \u0441\u043f\u0438\u0441\u043e\u043a \u0432\u0441\u0435\u0445 30 \u0443\u0440\u043e\u043a\u043e\u0432.</p>\n    <button id=\"m2-reset\">\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c PIN \u0438 \u043e\u0442\u043c\u0435\u0442\u043a\u0443 (\u0434\u043b\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438)</button>\n  </div>\n</div>\n\n<!-- ===== \u041e\u043a\u043d\u043e PIN ===== -->\n<div class=\"modal\" id=\"m2-modal\"><div class=\"box\">\n  <b id=\"m2-pin-title\">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 PIN \u043c\u0430\u043c\u044b</b>\n  <input class=\"pin\" id=\"m2-pin\" type=\"password\" inputmode=\"numeric\" maxlength=\"4\" autocomplete=\"off\">\n  <div class=\"note\" id=\"m2-pin-msg\"></div>\n  <div class=\"row\" style=\"margin-top:8px\"><button id=\"m2-pin-cancel\" style=\"flex:1\">\u041e\u0442\u043c\u0435\u043d\u0430</button><button id=\"m2-pin-ok\" style=\"flex:1;background:var(--gold);color:#12161C\">OK</button></div>\n</div></div>\n\n\n".split("@@BASE@@").join(BASE);(function(){
  var A={};["angelos_a", "angelos_b", "cheese", "cheese_slow", "chips", "chips_slow", "gakul", "gakul_a", "gakul_b", "gakul_slow", "kvarius", "kvarius_slow", "narius", "narius_a", "narius_b", "narius_slow", "nochka", "nochka_slow", "pizza", "pizza_slow", "thule_a", "thule_b", "well_done", "well_done_slow"].forEach(function(n){A[n]=BASE+"audio/"+n+".mp3";});
  var SOUNDS=[
    ['well_done','Well done, soldier!','Тул хвалит'],
    ['gakul',"Ha! You can't catch me, Elisey!",'Гакул дразнит (имя Елисей)'],
    ['narius','Techmarine Narius Vek. Armour is ready!','Нариус (НА-ри-ус)'],
    ['nochka','Nochka likes sausages.','имя Ночка'],
    ['kvarius','Can Kvarius swim? Yes, he can!','Квариус (КВА-ри-ус)'],
    ['pizza','pizza',''],['cheese','cheese',''],['chips','chips','']];
  var root=document.getElementById('m2');
  function $(id){return document.getElementById(id);}
  var cur=null;
  function play(key){try{if(cur){cur.pause();}cur=new Audio(A[key]);cur.play();}catch(e){}}
  var box=$('m2-sounds');
  SOUNDS.forEach(function(s){
    var d=document.createElement('div');d.className='card row';
    var t=document.createElement('div');t.className='txt';t.textContent=s[1];
    if(s[2]){var n=document.createElement('div');n.className='note';n.textContent=s[2];t.appendChild(n);}
    var b1=document.createElement('button');b1.className='play';b1.setAttribute('aria-label','Слушать');b1.textContent='▶';b1.onclick=function(){play(s[0]);};
    var b2=document.createElement('button');b2.textContent='Медленно';b2.onclick=function(){play(s[0]+'_slow');};
    d.appendChild(t);d.appendChild(b1);d.appendChild(b2);box.appendChild(d);
  });
  var VO=[['thule','Давиан Тул','спокойный британский','мягкий рассказчик'],
          ['angelos','Габриель Ангелос','строгий британский','низкий командирский'],
          ['narius','Нариус Век','металлический, как из шлема','обычный британский'],
          ['gakul','Гакул Трака','низкий рык','хриплый рык с помехами']];
  var vb=$('m2-voices');
  VO.forEach(function(v){
    var d=document.createElement('div');d.className='card';
    var h=document.createElement('b');h.textContent=v[1];d.appendChild(h);
    ['a','b'].forEach(function(x,i){
      var r=document.createElement('div');r.className='row';r.style.marginTop='6px';
      var t=document.createElement('div');t.className='txt';t.style.fontSize='14px';t.textContent=(x.toUpperCase())+': '+v[2+i];
      var b=document.createElement('button');b.className='play';b.setAttribute('aria-label','Слушать');b.textContent='▶';
      b.onclick=function(){play(v[0]+'_'+x);};
      r.appendChild(t);r.appendChild(b);d.appendChild(r);
    });
    vb.appendChild(d);
  });
  // хранение
  var mem={};
  function get(k){try{return localStorage.getItem(k);}catch(e){return mem[k]||null;}}
  function set(k,v){try{localStorage.setItem(k,v);}catch(e){mem[k]=v;}}
  function del(k){try{localStorage.removeItem(k);}catch(e){} delete mem[k];}
  var ok=true;try{localStorage.setItem('m2_t','1');localStorage.removeItem('m2_t');}catch(e){ok=false;}
  $('m2-store').innerHTML=ok?'<span class="ok">работает, прогресс сохранится</span>':'<span class="bad">браузер не даёт сохранять</span>';
  // отметка
  function refresh(){
    var d=get('m2_done_1');var b=$('m2-done');
    if(d){b.textContent='Выполнено ✓';b.className='big done';$('m2-status').textContent='Отмечено мамой: '+d+'. +20 реквизиции.';}
    else{b.textContent='Вне телефона: выполнили';b.className='big';$('m2-status').textContent='';}
  }
  var setting=false;
  $('m2-done').onclick=function(){
    if(get('m2_done_1'))return;
    setting=!get('m2_pin');
    $('m2-pin-title').textContent=setting?'Мама, придумайте PIN из 4 цифр':'Введите PIN мамы';
    $('m2-pin').value='';$('m2-pin-msg').textContent='';
    $('m2-modal').className='modal on';setTimeout(function(){$('m2-pin').focus();},50);
  };
  $('m2-pin-cancel').onclick=function(){$('m2-modal').className='modal';};
  $('m2-pin-ok').onclick=function(){
    var v=$('m2-pin').value;
    if(!/^\d{4}$/.test(v)){$('m2-pin-msg').textContent='Нужно 4 цифры';return;}
    if(setting){set('m2_pin',v);}
    else if(v!==get('m2_pin')){$('m2-pin-msg').textContent='Неверный PIN';return;}
    var now=new Date();set('m2_done_1',now.toLocaleDateString('ru-RU'));
    $('m2-modal').className='modal';refresh();
  };
  $('m2-reset').onclick=function(){del('m2_pin');del('m2_done_1');refresh();alertless();};
  function alertless(){var b=$('m2-reset');b.textContent='Сброшено ✓';setTimeout(function(){b.textContent='Сбросить PIN и отметку (для проверки)';},1500);}
  // режимы по адресу
  function route(){var m=(location.hash||'').toLowerCase()==='#mama';
    $('m2-game').className=m?'hide':'';$('m2-mama').className=m?'':'hide';}
  window.addEventListener('hashchange',route);route();refresh();
})();
})();