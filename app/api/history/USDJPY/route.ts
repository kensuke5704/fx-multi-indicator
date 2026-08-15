import type { Candle } from "../../../../lib/types";

export const runtime = "edge";
const headers = { "Access-Control-Allow-Origin": "https://kensuke5704.github.io", "Access-Control-Allow-Methods": "GET" };

export async function GET() {
  try {
    const response = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/JPY%3DX?range=1y&interval=1d", { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("provider unavailable");
    const json = await response.json();
    const result = json.chart.result[0];
    const quote = result.indicators.quote[0];
    const candles: Candle[] = result.timestamp.map((time: number, i: number) => ({ time: time * 1000, open: quote.open[i], high: quote.high[i], low: quote.low[i], close: quote.close[i] })).filter((c: Candle) => Number.isFinite(c.close));
    return Response.json({ symbol: "USDJPY", candles, updatedAt: new Date().toISOString(), source: "Yahoo Finance · daily close (delayed)" }, { headers });
  } catch {
    return Response.json({ error: "Daily history temporarily unavailable" }, { status: 503, headers });
  }
}
