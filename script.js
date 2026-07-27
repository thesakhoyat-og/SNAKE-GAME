(() => {
  // ---------- DOM refs ----------
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highEl  = document.getElementById('high');
  const lenEl   = document.getElementById('len');
  const speedEl = document.getElementById('speed');
  const stateEl = document.getElementById('state');
  const overlay = document.getElementById('overlay');
  const logEl   = document.getElementById('log');
  const clockEl = document.getElementById('clock');

  // ---------- Constants ----------
  const COLS = 30, ROWS = 30;
  const CELL = canvas.width / COLS;
  const HIGH_KEY = 'snake.high.v1';

  // ---------- State ----------
  let snake, dir, nextDir, food, score, high, alive, paused, started, tickMs, accum, lastT;

  // ---------- Lifecycle ----------
  function reset() {
    const cx = (COLS / 2) | 0, cy = (ROWS / 2) | 0;
    snake = [{x: cx-1, y: cy}, {x: cx-2, y: cy}, {x: cx-3, y: cy}];
    dir = {x: 1, y: 0};
    nextDir = dir;
    score = 0;
    alive = true;
    paused = false;
    started = false;
    tickMs = 110;
    accum = 0;
    lastT = performance.now();
    placeFood();
    high = +localStorage.getItem(HIGH_KEY) || 0;
    updateHud();
    showOverlay('SNAKE.EXE', '// intercepting data packets on encrypted grid //', false);
    clearLog();
    log('info', 'boot complete. grid 30x30 initialized.');
    log('info', 'awaiting input from operator...');
  }

  function placeFood() {
    while (true) {
      const f = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 };
      if (!snake.some(s => s.x === f.x && s.y === f.y)) { food = f; return; }
    }
  }

  // ---------- HUD ----------
  function updateHud() {
    scoreEl.textContent = String(score).padStart(4, '0');
    highEl.textContent  = String(high).padStart(4, '0');
    lenEl.textContent   = snake.length;
    const mult = (110 / tickMs).toFixed(2);
    speedEl.textContent = mult + 'x';
    stateEl.textContent = !started ? 'IDLE' : !alive ? 'TERMINATED' : paused ? 'PAUSED' : 'RUNNING';
    stateEl.style.color =
      !alive ? 'var(--accent)' :
      paused ? 'var(--warn)' :
      !started ? 'var(--fg-dim)' : 'var(--fg)';
  }

  function showOverlay(title, sub, bad) {
    const h1 = overlay.querySelector('h1');
    h1.textContent = title;
    h1.setAttribute('data-t', title);
    h1.classList.toggle('bad', !!bad);
    overlay.querySelector('p').textContent = sub;
    overlay.classList.add('show');
  }
  function hideOverlay() { overlay.classList.remove('show'); }

  // ---------- Syslog ----------
  function log(kind, msg) {
    const l = document.createElement('div');
    l.className = 'line ' + kind;
    l.textContent = msg;
    logEl.appendChild(l);
    while (logEl.childElementCount > 40) logEl.removeChild(logEl.firstChild);
    logEl.scrollTop = logEl.scrollHeight;
  }
  function clearLog() { logEl.innerHTML = ''; }

  // ---------- Game tick ----------
  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      return die('SEGFAULT — out of bounds at (' + head.x + ',' + head.y + ')');
    }
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      return die('STACK OVERFLOW — self-intersection');
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      const hexFood = '0x' + ((Math.random()*0xFFFF)|0).toString(16).padStart(4,'0').toUpperCase();
      log('ok', 'packet captured ' + hexFood + ' (+10)');
      if (score % 50 === 0 && tickMs > 55) {
        tickMs = Math.max(55, tickMs - 8);
        log('info', 'cpu freq up — tick=' + tickMs + 'ms');
      }
      placeFood();
      if (score > high) {
        high = score;
        localStorage.setItem(HIGH_KEY, String(high));
      }
    } else {
      snake.pop();
    }
    updateHud();
  }

  function die(reason) {
    alive = false;
    log('bad', reason);
    log('bad', 'process terminated. score=' + score + ' len=' + snake.length);
    showOverlay('GAME OVER', '// ' + reason + ' // press R to retry //', true);
    updateHud();
  }

  // ---------- Render ----------
  function draw() {
    // background
    ctx.fillStyle = '#0a0e0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = 'rgba(0,255,122,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(canvas.width, i * CELL + 0.5);
      ctx.stroke();
    }

    // food — pulsing red packet with crosshair targeting lines
    const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 180);
    ctx.fillStyle = 'rgba(255,46,99,' + pulse + ')';
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.strokeStyle = 'rgba(255,46,99,0.8)';
    ctx.lineWidth = 1;
    ctx.strokeRect(food.x * CELL + 1.5, food.y * CELL + 1.5, CELL - 3, CELL - 3);
    ctx.strokeStyle = 'rgba(255,46,99,0.35)';
    ctx.beginPath();
    ctx.moveTo(food.x * CELL + CELL/2, 0);
    ctx.lineTo(food.x * CELL + CELL/2, canvas.height);
    ctx.moveTo(0, food.y * CELL + CELL/2);
    ctx.lineTo(canvas.width, food.y * CELL + CELL/2);
    ctx.stroke();

    // snake body — gradient fade from head
    for (let i = snake.length - 1; i >= 0; i--) {
      const s = snake[i];
      const isHead = i === 0;
      const t = 1 - i / snake.length;
      if (isHead) {
        ctx.fillStyle = '#00ff7a';
        ctx.shadowColor = '#00ff7a';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = 'rgba(0,255,122,' + (0.25 + 0.55 * t) + ')';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
      if (!isHead) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(s.x * CELL + CELL/2 - 1, s.y * CELL + CELL/2 - 1, 2, 2);
      }
    }

    // head eyes — point in direction of travel
    const h = snake[0];
    ctx.fillStyle = '#0a0e0a';
    const ex = h.x * CELL + CELL/2 + dir.x * 3;
    const ey = h.y * CELL + CELL/2 + dir.y * 3;
    ctx.fillRect(ex - 3, ey - 3, 2, 2);
    ctx.fillRect(ex + 1, ey + 1, 2, 2);
  }

  function loop(now) {
    const dt = now - lastT;
    lastT = now;
    if (started && alive && !paused) {
      accum += dt;
      while (accum >= tickMs) {
        tick();
        accum -= tickMs;
        if (!alive) break;
      }
    }
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- Input ----------
  function setDir(nx, ny) {
    if (snake.length > 1 && nx === -dir.x && ny === -dir.y) return; // no reverse
    nextDir = {x: nx, y: ny};
    if (!started && alive) {
      started = true;
      hideOverlay();
      log('ok', 'session started — sniffing packets...');
      updateHud();
    }
  }

  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()) || ' ' === e.key) {
      e.preventDefault();
    }
    if (!alive) {
      if (k === 'r') reset();
      return;
    }
    if      (k === 'arrowup'    || k === 'w') setDir(0, -1);
    else if (k === 'arrowdown'  || k === 's') setDir(0,  1);
    else if (k === 'arrowleft'  || k === 'a') setDir(-1, 0);
    else if (k === 'arrowright' || k === 'd') setDir(1,  0);
    else if (k === ' ') {
      if (!started) {
        started = true;
        hideOverlay();
        log('ok', 'session started — sniffing packets...');
      } else {
        paused = !paused;
        if (paused) showOverlay('PAUSED', '// process suspended — press SPACE to resume //', false);
        else hideOverlay();
        log('info', paused ? 'SIGSTOP received.' : 'SIGCONT received.');
      }
      updateHud();
    } else if (k === 'r') {
      reset();
    }
  });

  // ---------- Clock ----------
  function tickClock() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    clockEl.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  setInterval(tickClock, 1000);
  tickClock();

  // ---------- Boot ----------
  reset();
  requestAnimationFrame(loop);
})();
