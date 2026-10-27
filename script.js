(function () {
  var wishes = [
    "Semoga panjang umur dan sehat selalu ya, Mas!",
    "Semoga semua mimpinya jadi kenyataan ✨",
    "Semoga rezekinya dilancarkan, senyumnya semakin lebar 😁",
    "Semoga hari-hari mas manis seperti kue ini 🍰",
    "Semoga selalu dikelilingi orang-orang baik 💖",
    "Tambah umur, tambah bahagia, tambah sabarnya! 🍕",
    "Semoga semua urusan mas dimudahkan dan lancar selalu! 💪",
    "Semoga hari-hari mas penuh kebahagiaan 🐛➡️🦋",
  ];
  var colors = [
    "#ff7a2f",
    "#2ec4b6",
    "#ffc145",
    "#4a90e2",
    "#e63946",
    "#8bd450",
  ];
  var $ = function (i) {
    return document.getElementById(i);
  };
  var cnt = 0,
    audio;
  function beep(f) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      var o = audio.createOscillator(),
        g = audio.createGain();
      o.frequency.value = f;
      o.type = "triangle";
      g.gain.setValueAtTime(0.15, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.25);
      o.connect(g);
      g.connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + 0.25);
    } catch (e) {}
  }
  function pick() {
    return wishes[Math.floor(Math.random() * wishes.length)];
  }

  /* confetti */
  var cv = $("cv"),
    cx = cv.getContext("2d"),
    ps = [],
    run = false;
  function size() {
    cv.width = innerWidth;
    cv.height = innerHeight;
  }
  size();
  addEventListener("resize", size);
  function burst(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2,
        s = 3 + Math.random() * 7;
      ps.push({
        x: x,
        y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 4,
        r: 3 + Math.random() * 4,
        c: colors[i % colors.length],
        l: 90 + Math.random() * 40,
        rot: Math.random() * 6,
      });
    }
    if (!run) {
      run = true;
      loop();
    }
  }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps = ps.filter(function (p) {
      return p.l > 0;
    });
    ps.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.vx *= 0.99;
      p.l--;
      p.rot += 0.2;
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = p.c;
      cx.globalAlpha = Math.min(1, p.l / 30);
      cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      cx.restore();
    });
    if (ps.length) requestAnimationFrame(loop);
    else run = false;
  }
  function rain() {
    for (var i = 0; i < 6; i++)
      setTimeout(function () {
        burst(Math.random() * innerWidth, innerHeight * 0.25, 40);
      }, i * 250);
  }

  /* name */
  $("name").addEventListener("input", function (e) {
    $("nm").textContent = e.target.value.trim() || "Kamu";
  });

  /* umur */
  $("umur").addEventListener("input", function (e) {
    $("age").textContent = e.target.value || "0";
  });

  /* candles */
  var cg = $("candles"),
    NS = "http://www.w3.org/2000/svg",
    lit = 5;
  [70, 95, 120, 145, 170].forEach(function (x, i) {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "candle");
    g.innerHTML =
      '<rect x="' +
      (x - 12) +
      '" y="26" width="24" height="58" fill="transparent"/><rect x="' +
      (x - 4) +
      '" y="50" width="8" height="32" rx="2" fill="' +
      ["#ff7a2f", "#2ec4b6", "#ffc145", "#4a90e2", "#e63946"][i] +
      '"/><path class="flame" d="M' +
      x +
      ' 32q9 10 0 18q-9-8 0-18z" fill="#ffb300"/><path class="flame" d="M' +
      x +
      ' 39q4 5 0 9q-4-4 0-9z" fill="#fff6b0"/>';
    g.addEventListener("click", function () {
      if (!g.classList.contains("off")) {
        g.classList.add("off");
        lit--;
        beep(500 + i * 80);
        check(g);
      }
    });
    cg.appendChild(g);
  });
  function check() {
    if (lit === 0) {
      $("msg").textContent =
        "Yeay! Semua lilin padam. Semoga wishmu terkabul! 🌟";
      rain();
      beep(880);
      setTimeout(function () {
        beep(1100);
      }, 150);
    } else {
      $("msg").textContent = "Sisa " + lit + " lilin lagi… 💨";
    }
  }
  $("blow").onclick = function () {
    var cs = cg.children,
      d = 0;
    Array.prototype.forEach.call(cs, function (c, i) {
      if (!c.classList.contains("off")) {
        setTimeout(function () {
          c.classList.add("off");
          lit--;
          beep(500 + i * 80);
          if (lit === 0) check();
        }, d);
        d += 120;
      }
    });
  };
  $("relight").onclick = function () {
    Array.prototype.forEach.call(cg.children, function (c) {
      c.classList.remove("off");
    });
    lit = 5;
    $("msg").textContent = "Lilin menyala lagi! Tiup yuk 💨";
  };

  /* gift */
  $("gift").onclick = function () {
    var g = $("gift");
    g.classList.remove("shake");
    void g.offsetWidth;
    g.classList.add("shake");
    beep(660);
    setTimeout(function () {
      $("wish").textContent = pick();
      var r = g.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top, 50);
    }, 400);
  };

  /* BURUNG: ganti emoji dengan path gambar, mis. ["img/elang.png","Elang"] (png/jpg/gif/webp/svg) */
  var birds = [
    ["🐦", "Burung Pipit"],
    ["🦜", "Burung Beo"],
    ["🦆", "Bebek"],
    ["🦉", "Burung Hantu"],
    ["🦅", "Elang"],
    ["🕊️", "Merpati"],
    ["🐧", "Pinguin"],
    ["🦢", "Angsa"],
    ["🦩", "Flamingo"],
    ["🦚", "Merak"],
    ["🐤", "Anak Ayam"],
    ["🐓", "Ayam Jago"],
    ["🦃", "Kalkun"],
    ["🐥", "Kuning Mungil"],
  ];
  function bird(x, y) {
    var n = 1 + Math.floor(Math.random() * 3),
      first = "";
    for (var i = 0; i < n; i++) {
      var b = birds[Math.floor(Math.random() * birds.length)],
        e = document.createElement("div"),
        dx =
          (Math.random() < 0.5 ? -1 : 1) *
          (innerWidth * 0.2 + Math.random() * innerWidth * 0.3);
      if (!i) first = b[1];
      e.className = "bird";
      if (/\.(png|jpe?g|gif|webp|svg)$|^data:/i.test(b[0])) {
        var im = document.createElement("img");
        im.src = b[0];
        im.alt = b[1];
        e.appendChild(im);
      } else e.textContent = b[0];
      e.style.left = x + "px";
      e.style.top = y + "px";
      e.style.setProperty("--dx", dx + "px");
      e.style.setProperty("--dy", -(120 + Math.random() * 350) + "px");
      e.style.setProperty("--f", dx < 0 ? 1 : -1);
      e.style.setProperty("--rt", Math.random() * 30 - 15 + "deg");
      e.style.setProperty("--t", 2 + Math.random() * 1.5 + "s");
      e.addEventListener("animationend", function () {
        this.remove();
      });
      document.body.appendChild(e);
    }
    return first;
  }

  /* balloons */
  function balloon() {
    var b = document.createElement("div");
    b.className = "balloon";
    b.style.left = 4 + Math.random() * Math.max(100, innerWidth - 84) + "px";
    b.style.background = colors[Math.floor(Math.random() * colors.length)];
    b.style.setProperty("--dx", Math.random() * 80 - 40 + "px");
    b.style.animationDuration = 9 + Math.random() * 7 + "s";
    b.onclick = function () {
      var r = b.getBoundingClientRect();
      var px = r.left + r.width / 2,
        py = r.top + r.height / 2;
      burst(px, py, 35);
      var bn = bird(px, py);
      if (navigator.vibrate) navigator.vibrate(30);
      beep(300 + Math.random() * 500);
      cnt++;
      $("cnt").textContent = cnt;
      $("msg").textContent = "💥 " + pick();
      b.remove();
    };
    b.addEventListener("animationend", function () {
      b.remove();
    });
    document.body.appendChild(b);
  }
  for (var i = 0; i < 5; i++) setTimeout(balloon, i * 700);
  setInterval(balloon, 1800);
  setTimeout(function () {
    burst(innerWidth / 2, innerHeight / 3, 80);
  }, 500);
})();
