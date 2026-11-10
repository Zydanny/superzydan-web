import { gtaCountdown } from "@/lib/site";

/*
 * Stream overlay for OBS / Streamlabs (Browser Source):
 *   https://superzydanofficial.com/overlay/gta6
 * Transparent background by default; add ?bg=sunset for the same sunset panel
 * as the home page section. Everything scales with the Browser Source size
 * (800 x 260 is a good start). It's a bare HTML page served by this handler,
 * outside the site layout, so there's no header, footer or analytics, and it's
 * kept out of search with X-Robots-Tag. Delete this folder after launch.
 */
export const dynamic = "force-static";

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>GTA VI countdown overlay</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@900&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: "Big Shoulders", "Arial Narrow", sans-serif; font-weight: 900; color: #fff;
    text-transform: uppercase;
  }
  body.sunset {
    background: linear-gradient(180deg, #1a0b33 0%, #4a1460 35%, #b8327a 70%, #ff7a59 100%);
  }
  .row { display: flex; align-items: center; gap: 9vh; }
  .title { text-align: center; font-style: italic; line-height: 0.82; white-space: nowrap; }
  .big {
    display: block; font-size: 40vh; letter-spacing: 0.01em;
    text-shadow: 0.8vh 0.8vh 0 #ff3fb4, 1.6vh 1.6vh 0 #2fe0ff, 0 0 3vh rgba(0,0,0,.6);
  }
  .small {
    display: block; font-size: 13vh; letter-spacing: 0.08em; color: #ffd9ef; margin-top: 2vh;
    text-shadow: 0.4vh 0.4vh 0 #ff3fb4, 0 0 2vh rgba(0,0,0,.7);
  }
  .timer { display: flex; gap: 3vh; }
  .unit {
    min-width: 36vh; padding: 2vh 0 1.5vh; text-align: center;
    background: rgba(26, 11, 51, 0.82); border: 0.5vh solid #2fe0ff;
    clip-path: polygon(10% 0, 90% 0, 100% 14%, 100% 86%, 90% 100%, 10% 100%, 0 86%, 0 14%);
  }
  .num {
    display: block; font-size: 28vh; line-height: 0.9; font-variant-numeric: tabular-nums;
    text-shadow: 0 0 0.4vh #fff, 0 0 2vh #2fe0ff, 0 0 4vh #ff3fb4;
  }
  .label { display: block; font-size: 6vh; letter-spacing: 0.12em; color: #ffd9ef; margin-top: 0.5vh; }
</style>
</head>
<body>
  <div class="row">
  <div class="title"><span class="big">GTA VI</span><span class="small" id="small">drops in</span></div>
  <div class="timer" id="timer">
    <div class="unit"><span class="num" id="d">--</span><span class="label">days</span></div>
    <div class="unit"><span class="num" id="h">--</span><span class="label">hrs</span></div>
    <div class="unit"><span class="num" id="m">--</span><span class="label">min</span></div>
    <div class="unit"><span class="num" id="s">--</span><span class="label">sec</span></div>
  </div>
  </div>
<script>
  var launchAt = Date.parse(${JSON.stringify(gtaCountdown.launchAt)});
  if (new URLSearchParams(location.search).get("bg") === "sunset") document.body.className = "sunset";
  var pad = function (n) { return String(n).padStart(2, "0"); };
  function tick() {
    var now = Date.now();
    var left = Math.max(0, Math.floor((launchAt - now) / 1000));
    if (left === 0) {
      document.getElementById("timer").style.display = "none";
      document.getElementById("small").textContent = "is out now";
      return;
    }
    document.getElementById("d").textContent = pad(Math.floor(left / 86400));
    document.getElementById("h").textContent = pad(Math.floor((left % 86400) / 3600));
    document.getElementById("m").textContent = pad(Math.floor((left % 3600) / 60));
    document.getElementById("s").textContent = pad(left % 60);
    setTimeout(tick, 1000 - (now % 1000));
  }
  tick();
</script>
</body>
</html>`;

export function GET() {
  return new Response(page, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
