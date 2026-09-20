(()=>{
  const tone=value=>/^[+↑]/.test(value)?'up':/^[-↓]/.test(value)?'down':'neutral';
  const paint=()=>{const tiles=[...document.querySelectorAll('.hero-tile')],score=tiles.find(tile=>tile.dataset.key==='TREND SCORE')?.dataset.value||'';tiles.forEach(tile=>{if(tile.dataset.key==='USD / JPY · SPOT FX'){tile.classList.remove('up','down','neutral');return}let value=tile.dataset.value||'';if(tile.dataset.key==='CURRENT REGIME')value=value==='RANGE'?'':score;tile.classList.remove('up','down','neutral');tile.classList.add(tone(value))})};
  const app=document.getElementById('app');if(app)new MutationObserver(paint).observe(app,{childList:true});paint();
  const nav=document.querySelector('.tabs');if(!nav||document.getElementById('tqqqTab'))return;
  const tab=document.createElement('a');tab.id='tqqqTab';tab.href='#tqqq';tab.textContent='TQQQ';nav.append(tab);
  const section=document.createElement('section');section.id='tqqq';section.innerHTML='<div class="tqqq-loading">Loading TQQQ drawdown monitor…</div>';document.body.append(section);
  tab.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();history.pushState(null,'','#tqqq');dispatchEvent(new PopStateEvent('popstate'));scrollTo({top:0,behavior:'auto'})});
  const script=document.createElement('script');script.src='tqqq.js?v=5';document.body.append(script);
})();
