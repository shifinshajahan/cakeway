document.documentElement.classList.add('js');
(function(){
  var WA='919544095452';
  // mobile menu
  var btn=document.querySelector('.menu-btn'),ul=document.getElementById('navlinks');
  btn.addEventListener('click',function(){var o=ul.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  ul.addEventListener('click',function(e){if(e.target.tagName==='A'){ul.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  // reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el,i){el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
  // gentle parallax on hero image
  var hi=document.querySelector('.arch img'),reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(hi&&!reduce){var tick=false;window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){var y=Math.min(window.scrollY,700);var mx=hi.offsetHeight-hi.parentNode.offsetHeight;hi.style.transform='translateY('+(-Math.min(y*0.08,Math.max(mx,0)))+'px)';tick=false})},{passive:true})}
  // cake menu filter
  var chips=document.querySelectorAll('.chip'),groups=document.querySelectorAll('.menu-group');
  chips.forEach(function(c){c.addEventListener('click',function(){var k=c.dataset.filter;chips.forEach(function(x){var on=x===c;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on)});groups.forEach(function(g){g.hidden=!(k==='all'||g.dataset.group===k);if(!g.hidden)g.classList.add('in')})})});
  // order prefill from cards
  document.querySelectorAll('[data-cake]').forEach(function(a){a.addEventListener('click',function(){var s=document.getElementById('f-type');for(var i=0;i<s.options.length;i++){if(s.options[i].text===a.dataset.cake){s.selectedIndex=i}}})});
  // min date = today
  var d=document.getElementById('f-date'),t=new Date();d.min=new Date(t.getTime()-t.getTimezoneOffset()*60000).toISOString().slice(0,10);
  // form -> WhatsApp
  var f=document.getElementById('orderForm'),err=document.getElementById('formErr');
  var getSel=document.getElementById('f-get'),dBox=document.getElementById('deliveryFields'),addr=document.getElementById('f-addr');
  function isDel(){return /delivery/i.test(getSel.value)}
  function syncDel(){var on=isDel();dBox.hidden=!on;addr.required=on;if(on){dBox.classList.remove('pop');void dBox.offsetWidth;dBox.classList.add('pop')}}
  getSel.addEventListener('change',syncDel);syncDel();
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(n){return (f.elements[n].value||'').trim()};
    var del=isDel();
    if(!v('name')||!v('date')||(del&&!v('address'))){err.hidden=false;(!v('name')?f.elements.name:!v('date')?f.elements.date:f.elements.address).focus();return}
    err.hidden=true;
    var dt=new Date(v('date')+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    var lines=['Hi Cake Way! I would like to order a cake.','','Branch: '+v('branch'),'Name: '+v('name'),'Occasion: '+v('occasion'),'Cake: '+v('type'),'Flavour: '+v('flavour'),'Size: '+v('size'),'Needed on: '+dt,'Pickup / delivery: '+v('get')];
    if(del){lines.push('Delivery address: '+v('address'));if(v('landmark'))lines.push('Landmark: '+v('landmark'))}
    if(v('msg'))lines.push('Message on cake: '+v('msg'));
    if(v('notes'))lines.push('Design ideas: '+v('notes'));
    lines.push('','Please share the price and confirm. Thank you!');
    var url='https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n'));
    f.dataset.lastUrl=url;
    window.open(url,'_blank','noopener');
  });
  // open now (IST)
  var on=document.getElementById('openNow');
  try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()).split(':');var m=+p[0]*60+ +p[1];
    if(m>=600&&m<1260){on.textContent='Open now · closes 9 PM';on.className='open-now is-open'}else{on.textContent='Closed now · opens 10 AM';on.className='open-now is-closed'}}catch(_){}
  // gallery lightbox
  var lbx=document.getElementById('lightbox');
  if(lbx){var li=lbx.querySelector('img'),lp=lbx.querySelector('p'),last=null;
    function closeLb(){lbx.hidden=true;document.body.style.overflow='';if(last)last.focus()}
    document.querySelectorAll('#sgallery button').forEach(function(b){b.addEventListener('click',function(){last=b;li.src=b.dataset.full;li.alt=b.querySelector('img').alt;lp.textContent=b.dataset.cap.replace('&amp;','&');lbx.hidden=false;document.body.style.overflow='hidden';lbx.querySelector('.lb-x').focus()})});
    lbx.addEventListener('click',function(e){if(e.target===lbx||e.target.classList.contains('lb-x'))closeLb()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lbx.hidden)closeLb()});}
  document.getElementById('yr').textContent=new Date().getFullYear();
})();
