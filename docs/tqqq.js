(()=>{
  const app=document.getElementById('tqqq'),money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n),date=t=>new Date(t).toLocaleDateString('en-CA',{year:'numeric',month:'short',day:'2-digit'}),API='https://vector-jpy-trend.kensuke5704.chatgpt.site/api/market/quote';
  let loaded=false,loading=false;
  function draw(series){
    const recent=series.slice(-180),lo=Math.min(...recent.map(x=>x.price)),hi=Math.max(...recent.map(x=>x.price)),range=hi-lo||1,mid=(hi+lo)/2,x=i=>11+i/(recent.length-1)*89,y=price=>8+(hi-price)/range*72,path=recent.map((point,i)=>`${i?'L':'M'}${x(i).toFixed(2)} ${y(point.price).toFixed(2)}`).join(' '),short=time=>new Date(time).toLocaleDateString('en-US',{month:'short',year:'2-digit'}),price=value=>`$${value.toFixed(0)}`;
    return `<svg class="tqqq-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="TQQQ adjusted close, latest 180 trading sessions"><path class="tqqq-axis" d="M11 8V80H100"/><path class="tqqq-guide" d="M11 8H100M11 44H100M11 80H100"/><path class="tqqq-line" d="${path}"/><g class="tqqq-axis-label"><text x="9" y="10" text-anchor="end">${price(hi)}</text><text x="9" y="46" text-anchor="end">${price(mid)}</text><text x="9" y="82" text-anchor="end">${price(lo)}</text><text x="11" y="96" text-anchor="start">${short(recent[0].time)}</text><text x="100" y="96" text-anchor="end">${short(recent.at(-1).time)}</text></g></svg>`;
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
