const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};

type Point={time:number;price:number};

export async function OPTIONS(){return new Response(null,{headers:cors})}

export async function GET(){
  try{
    const response=await fetch("https://query1.finance.yahoo.com/v8/finance/chart/TQQQ?range=max&interval=1d&events=div%2Csplits",{headers:{"User-Agent":"Mozilla/5.0"},next:{revalidate:60}});
    if(!response.ok)throw Error("provider");
    const payload=await response.json(),chart=payload.chart.result[0],quote=chart.indicators.quote[0],adjusted=chart.indicators.adjclose?.[0]?.adjclose||quote.close;
    const series:Point[]=chart.timestamp.map((time:number,index:number)=>({time:time*1000,price:adjusted[index]??quote.close[index]})).filter((point:Point)=>Number.isFinite(point.price)&&point.price>0);
    if(!series.length)throw Error("empty");
    const latest=series.at(-1)!,ath=series.reduce((best:Point,point:Point)=>point.price>best.price?point:best,series[0]);
    let high=series[0],maximum={value:0,peak:high,trough:high};
    for(const point of series){if(point.price>high.price)high=point;const value=point.price/high.price-1;if(value<maximum.value)maximum={value,peak:high,trough:point}}
    return Response.json({latest,ath,currentDrawdown:latest.price/ath.price-1,maximumDrawdown:maximum,series:series.slice(-180),updatedAt:new Date().toISOString(),source:"Yahoo Finance · daily adjusted close (delayed)"},{headers:{...cors,"Cache-Control":"no-store"}});
  }catch{return Response.json({error:"TQQQ data temporarily unavailable"},{status:503,headers:cors})}
}
