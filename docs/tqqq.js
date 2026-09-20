(()=>{
  const app=document.getElementById('tqqq'),money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n),date=t=>new Date(t).toLocaleDateString('en-CA',{year:'numeric',month:'short',day:'2-digit'}),API='https://vector-jpy-trend.kensuke5704.chatgpt.site/api/market/TQQQ';
  let loaded=false,loading=false;
  function draw(series){
    const recent=series.slice(-180),lo=Math.min(...recent.map(x=>x.price)),hi=Math.max(...recent.map(x=>x.price)),range=hi-lo||1,path=recent.map((x,i)=>`${i?'L':'M'}${(i/(recent.length-1)*100).toFixed(2)} ${(88-(x.price-lo)/range*72).toFixed(2)}`).join(' ');
    return `<svg class="tqqq-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="TQQQ adjusted close, latest 180 trading sessions"><path class="tqqq-guide" d="M0 18H100M0 52H100M0 88H100"/><path class="tqqq-line" d="${path}"/></svg>`;
  }
  async function load(refresh=false){
    if((loaded&&!refresh)||loading)return;loading=true;if(!loaded)app.innerHTML='<div class="tqqq-loading">Loading TQQQ daily data…</div>';
    try{
      const r=await fetch(API,{cache:'no-store'});if(!r.ok)throw Error('provider');const x=await r.json(),{series,latest,ath,maximumDrawdown:maximum}=x,dd=x.currentDrawdown*100;if(!series.length)throw Error('empty');
      app.innerHTML=`<p class="label market-title">TQQQ · MARKET OVERVIEW</p><section class="tqqq-hero"><div class="tqqq-key"><span class="label">CURRENT ADJUSTED CLOSE</span><strong>${money(latest.price)}</strong><small>${date(latest.time)} · Yahoo Finance daily close</small></div><div class="tqqq-key ${dd<0?'tqqq-negative':''}"><span class="label">CURRENT DRAWDOWN FROM ATH</span><strong>${dd.toFixed(1)}%</strong><small>ATH ${money(ath.price)} · ${date(ath.time)}</small></div><div class="tqqq-key tqqq-negative"><span class="label">MAX DRAWDOWN SINCE INCEPTION</span><strong>${(maximum.value*100).toFixed(1)}%</strong><small>${date(maximum.peak.time)} → ${date(maximum.trough.time)}</small></div></section><section class="tqqq-panel"><div class="label">TQQQ · LAST 180 TRADING SESSIONS</div>${draw(series)}<div class="tqqq-note">Refreshes every 60 seconds, in line with the Market tab. Uses Yahoo Finance adjusted closes, reflecting splits and distributions.</div></section>`;
      loaded=true;
    }catch{app.innerHTML='<div class="tqqq-loading">TQQQ daily data is temporarily unavailable. Please try again later.</div>'}finally{loading=false}
  }
  addEventListener('tqqq:show',load);if(location.hash==='#tqqq')load();setInterval(()=>{if(location.hash==='#tqqq')load(true)},60000);
})();
