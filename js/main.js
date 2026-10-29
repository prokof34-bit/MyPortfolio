var nv=document.querySelector('.nav'),bg=nv&&nv.querySelector('.burger');
function closeNav(){nv.classList.remove('open');bg.setAttribute('aria-expanded',false)}
if(nv&&bg){
bg.addEventListener('click',function(){var o=nv.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
nv.querySelectorAll('ul a').forEach(function(a){a.addEventListener('click',closeNav)});
document.addEventListener('click',function(e){if(nv.classList.contains('open')&&!e.target.closest('#menu')&&!e.target.closest('.burger'))closeNav()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav()});

/* скругления шапки пропадают после 35px скролла и возвращаются наверху */
function corners(){nv.classList.toggle('stuck',(window.scrollY||0)>35)}

/* подсветка раздела: тот, чей верх уже прошёл середину экрана; внизу страницы всегда последний */
var links=[].slice.call(nv.querySelectorAll('#menu a'));
var secs=links.map(function(a){var h=a.getAttribute('href');return h&&h.charAt(0)==='#'?document.querySelector(h):null});
function active(){
  if(!secs.some(Boolean))return;
  var mid=innerHeight/2,cur=-1;
  secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=mid)cur=i});
  if(innerHeight+(window.scrollY||0)>=document.documentElement.scrollHeight-4)cur=secs.length-1;
  links.forEach(function(a,i){a.classList.toggle('on',i===cur)});
}
var tick=false;
function onScroll(){corners();active()}
addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;onScroll()})},{passive:true});
addEventListener('resize',onScroll);
onScroll();
}

/* копирование почты */
document.querySelectorAll('[data-copy]').forEach(function(b){
  var s=b.querySelector('[data-s]'),old=s&&s.textContent,t;
  function done(){b.classList.add('ok');if(s)s.textContent='Скопировано';clearTimeout(t);t=setTimeout(function(){b.classList.remove('ok');if(s)s.textContent=old},2200)}
  b.addEventListener('click',function(){
    var v=b.getAttribute('data-copy');
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(v).then(done,fallback)}else fallback();
    function fallback(){var a=document.createElement('textarea');a.value=v;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();done()}
  });
});

/* кнопки на страницах кейсов */
(function(){
  var top=document.querySelector('.fab-top'),back=document.querySelector('.fab-back');
  if(!top)return;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function upd(){var y=window.scrollY||0;top.classList.toggle('show',y>400);if(back)back.classList.toggle('show',y>260)}
  addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
  top.addEventListener('click',function(){
    var el=document.documentElement,y0=window.scrollY,t0=null,d=Math.min(650,260+y0/10);
    if(reduce||y0<2){window.scrollTo(0,0);return}
    el.style.scrollBehavior='auto';
    (function step(t){if(t0===null)t0=t;var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);window.scrollTo(0,y0*(1-e));
      if(p<1)requestAnimationFrame(step);else el.style.scrollBehavior=''})(performance.now());
  });
})();
