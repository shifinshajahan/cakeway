/* Cake Way v4 — cake slider (arrows, dots, swipe, auto-advance; no scroll hijack) + hero nav state. */
(function(){
  var nav=document.querySelector('.nav'),hero=document.getElementById('hero'),ul=document.getElementById('navlinks');
  function navh(){if(nav)document.documentElement.style.setProperty('--navh',nav.offsetHeight+'px')}
  function top(){if(!nav)return;var open=ul&&ul.classList.contains('open');nav.classList.toggle('is-top',!!hero&&window.scrollY<40&&!open);document.body.classList.toggle('at-hero',!!hero&&window.scrollY<window.innerHeight*.55)}
  navh();top();window.addEventListener('resize',navh);window.addEventListener('scroll',top,{passive:true});
  if(ul)new MutationObserver(top).observe(ul,{attributes:true,attributeFilter:['class']});
})();
(function(){
  var sec=document.getElementById('showcase'); if(!sec) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cakes=[].slice.call(sec.querySelectorAll('.sl-cake')),slides=[].slice.call(sec.querySelectorAll('.sl-slide')),
      dots=[].slice.call(sec.querySelectorAll('.sl-dot')),num=document.getElementById('slNum'),ring=sec.querySelector('.sl-ring'),
      stage=document.getElementById('slStage');
  var N=cakes.length,cur=0,turns=0,timer=null,paused=false,visible=false,resumeT=null,DELAY=3500;
  function show(i,dir){
    i=(i+N)%N; dir=dir||1;
    if(i!==cur){
      var t=cakes[i],o=cakes[cur];
      t.classList.add('no-anim');t.classList.remove('is-on','is-prev','is-next');t.classList.add(dir>0?'is-next':'is-prev');void t.offsetWidth;
      t.classList.remove('no-anim','is-next','is-prev');t.classList.add('is-on');
      o.classList.remove('is-on');o.classList.add(dir>0?'is-prev':'is-next');
    }
    slides.forEach(function(s,k){var on=k===i;s.classList.toggle('is-on',on);s.setAttribute('aria-hidden',on?'false':'true')});
    dots.forEach(function(d,k){var on=k===i;d.classList.toggle('is-on',on);d.setAttribute('aria-current',on?'true':'false')});
    var s=slides[i]; sec.style.setProperty('--bg',s.dataset.bg); sec.style.setProperty('--ink',s.dataset.ink);
    if(num) num.textContent=('0'+(i+1)).slice(-2);
    turns+=dir; if(ring) ring.style.setProperty('--rr',(turns*72)+'deg');
    cur=i;
  }
  // first paint: cake 1 in place without animation
  cakes.forEach(function(c,k){c.classList.add('no-anim');c.classList.add(k===0?'is-on':'is-next')});
  show(0,1); turns=0; if(ring) ring.style.setProperty('--rr','0deg');
  requestAnimationFrame(function(){cakes.forEach(function(c){c.classList.remove('no-anim')})});
  function next(){show(cur+1,1)} function prev(){show(cur-1,-1)}
  function schedule(){clearInterval(timer);timer=null;if(!reduce&&visible&&!paused&&!document.hidden)timer=setInterval(next,DELAY)}
  function hold(ms){paused=true;schedule();clearTimeout(resumeT);resumeT=setTimeout(function(){paused=false;schedule()},ms||6000)}
  document.getElementById('slNext').addEventListener('click',function(){next();hold()});
  document.getElementById('slPrev').addEventListener('click',function(){prev();hold()});
  dots.forEach(function(d,k){d.addEventListener('click',function(){if(k!==cur)show(k,k>cur?1:-1);hold()})});
  // swipe (optional) — horizontal only, vertical scroll untouched
  var sx=0,sy=0,tracking=false;
  sec.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;tracking=true;hold(8000)},{passive:true});
  sec.addEventListener('touchend',function(e){if(!tracking)return;tracking=false;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){dx<0?next():prev()}},{passive:true});
  sec.addEventListener('mouseenter',function(){paused=true;schedule()});sec.addEventListener('mouseleave',function(){paused=false;schedule()});
  sec.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){next();hold()}else if(e.key==='ArrowLeft'){prev();hold()}});
  document.addEventListener('visibilitychange',schedule);
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;schedule()},{threshold:.35}).observe(sec)}else{visible=true;schedule()}
})();
(function(){
  // branch picker: "Order from here" buttons preselect the branch in the custom order form
  var sel=document.getElementById('f-branch'); if(!sel) return;
  document.querySelectorAll('[data-pick-branch]').forEach(function(a){a.addEventListener('click',function(){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===a.dataset.pickBranch)sel.selectedIndex=i}})});
})();
