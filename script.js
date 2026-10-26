(function () {
  var sealBtn   = document.getElementById('sealBtn');
  var sealGlow  = document.getElementById('sealGlow');
  var invite    = document.getElementById('invite');
  var revealed  = document.getElementById('revealed');
  var opened    = false;

  // Opening sequence: seal sinks + flap swings open -> card slides out of the envelope
  // -> envelope drifts away while the invitation cross-fades in.
  function openInvite() {
    if (opened) return;
    opened = true;
    sealBtn.disabled = true;

    invite.classList.add('opening');
    sealBtn.classList.add('opening');
    sealGlow.classList.add('opening');

    window.setTimeout(function () { invite.classList.add('rising'); }, 750);
    window.setTimeout(function () { invite.classList.add('zoom'); }, 2150);

    window.setTimeout(function () {
      invite.classList.add('leaving');
      revealed.hidden = false;
      void revealed.offsetWidth; // force reflow so the opacity transition runs
      revealed.style.opacity = '1';
      revealed.classList.add('enter');
    }, 2500);

    window.setTimeout(function () { invite.hidden = true; }, 3300);
  }

  sealBtn.addEventListener('click', openInvite);
  sealBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvite(); }
  });

  revealed.style.opacity = '0';

  // ---------------- floating petals ----------------
  var petalField = document.getElementById('petals');

  // two simple, non-emoji flower shapes: a soft petal and a tiny four-petal blossom
  var petalShapes = [
    '<svg viewBox="0 0 24 24"><path d="M12 1c3.8 3.6 7 7.4 7 11.2 0 4.1-3.1 7.6-7 8.8-3.9-1.2-7-4.7-7-8.8C5 8.4 8.2 4.6 12 1z" fill="currentColor"/></svg>',
    '<svg viewBox="0 0 24 24"><g fill="currentColor"><ellipse cx="12" cy="6.5" rx="3.6" ry="5.2"/><ellipse cx="12" cy="17.5" rx="3.6" ry="5.2"/><ellipse cx="6.5" cy="12" rx="5.2" ry="3.6"/><ellipse cx="17.5" cy="12" rx="5.2" ry="3.6"/><circle cx="12" cy="12" r="2.4" fill="var(--gold)"/></g></svg>'
  ];
  var petalColors = ['var(--gold-bright)', 'var(--gold)', 'var(--maroon-light)', '#f3e3c9'];

  function spawnPetals(count, field, colors) {
    field = field || petalField;
    colors = colors || petalColors;
    if (!field) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'petal';
      var size   = 10 + Math.random() * 14;          // 10–24px
      var left   = Math.random() * 100;               // 0–100%
      var drift  = (Math.random() * 70 - 35).toFixed(0) + 'px';
      var spin   = (180 + Math.random() * 260).toFixed(0) + 'deg';
      var rise   = (10 + Math.random() * 9).toFixed(1) + 's';   // 10–19s
      var delay  = (-Math.random() * 18).toFixed(1) + 's';      // negative = mid-flight at start
      var sway   = (2.4 + Math.random() * 2.4).toFixed(1) + 's';
      var color  = colors[Math.floor(Math.random() * colors.length)];
      var shape  = petalShapes[Math.floor(Math.random() * petalShapes.length)];

      el.style.setProperty('--size', size.toFixed(0) + 'px');
      el.style.left = left.toFixed(1) + '%';
      el.style.setProperty('--drift', drift);
      el.style.setProperty('--spin', spin);
      el.style.setProperty('--rise-dur', rise);
      el.style.setProperty('--rise-delay', delay);
      el.style.setProperty('--sway-dur', sway);
      el.style.setProperty('--petal-color', color);
      el.innerHTML = shape;
      frag.appendChild(el);
    }
    field.appendChild(frag);
  }
  spawnPetals(14);

  // ---------------- scroll-down cue -> smoothly snap to the invitation-frame page ----------------
  var scrollCta  = document.getElementById('scrollCta');
  var scrollArea = document.getElementById('scrollArea');
  var invitePage = document.getElementById('invitePage');
  if (scrollCta && scrollArea && invitePage) {
    scrollCta.addEventListener('click', function () {
      invitePage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // play the invitation-frame page's reveal animation the first time it scrolls into view
  if (invitePage && 'IntersectionObserver' in window) {
    var invitePlayed = false;
    var invObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45 && !invitePlayed) {
          invitePlayed = true;
          invitePage.classList.add('enter');
          invObserver.disconnect();
        }
      });
    }, { root: scrollArea, threshold: [0, 0.45, 1] });
    invObserver.observe(invitePage);
  } else if (invitePage) {
    invitePage.classList.add('enter');
  }

  // play the families page's reveal animation the first time it scrolls into view
  var familiesPage = document.getElementById('familiesPage');
  if (familiesPage && 'IntersectionObserver' in window) {
    var familiesPlayed = false;
    var famObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !familiesPlayed) {
          familiesPlayed = true;
          familiesPage.classList.add('enter');
          famObserver.disconnect();
        }
      });
    }, { root: scrollArea, threshold: [0, 0.35, 1] });
    famObserver.observe(familiesPage);
  } else if (familiesPage) {
    familiesPage.classList.add('enter');
  }

  // ---------------- "scroll down" cue: families page -> countdown page ----------------
  var countdownPage   = document.getElementById('countdownPage');
  var familiesNextCta = document.getElementById('familiesNextCta');
  if (familiesNextCta && scrollArea && countdownPage) {
    familiesNextCta.addEventListener('click', function () {
      countdownPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // play the countdown page's reveal animation the first time it scrolls into view
  if (countdownPage && 'IntersectionObserver' in window) {
    var countdownPlayed = false;
    var ctdObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !countdownPlayed) {
          countdownPlayed = true;
          countdownPage.classList.add('enter');
          ctdObserver.disconnect();
        }
      });
    }, { root: scrollArea, threshold: [0, 0.35, 1] });
    ctdObserver.observe(countdownPage);
  } else if (countdownPage) {
    countdownPage.classList.add('enter');
  }

  // ---------------- "scroll down" cue: countdown page -> events page ----------------
  var eventsPage      = document.getElementById('eventsPage');
  var countdownNextCta = document.getElementById('countdownNextCta');
  if (countdownNextCta && scrollArea && eventsPage) {
    countdownNextCta.addEventListener('click', function () {
      eventsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // play the events page's reveal animation the first time it scrolls into view
  if (eventsPage && 'IntersectionObserver' in window) {
    var eventsPlayed = false;
    var evObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !eventsPlayed) {
          eventsPlayed = true;
          eventsPage.classList.add('enter');
          evObserver.disconnect();
        }
      });
    }, { root: scrollArea, threshold: [0, 0.35, 1] });
    evObserver.observe(eventsPage);
  } else if (eventsPage) {
    eventsPage.classList.add('enter');
  }

  // ---------------- "scroll down" cue: events page -> message page ----------------
  var messagePage     = document.getElementById('messagePage');
  var mehndiPage      = document.getElementById('mehndiPage');
  var eventsNextCta   = document.getElementById('eventsNextCta');
  if (eventsNextCta && scrollArea && messagePage) {
    eventsNextCta.addEventListener('click', function () {
      messagePage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  var messageNextCta = document.getElementById('messageNextCta');
  if (messageNextCta && mehndiPage) {
    messageNextCta.addEventListener('click', function () {
      mehndiPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  // ---------------- event detail pages (Mehndi / Nikkah / Walima) ----------------
  document.querySelectorAll('.ev-page').forEach(function (page) {
    // themed petals drifting up behind the page
    var field = page.querySelector('.mh-petals');
    var cols  = (page.dataset.petals || '').split(',').filter(Boolean);
    if (field && cols.length) spawnPetals(14, field, cols);

    // "Scroll Down" -> the next page in the flow
    var nextBtn = page.querySelector('.mh-next');
    var nextEl  = document.getElementById(page.dataset.next);
    if (nextBtn && nextEl) nextBtn.addEventListener('click', function () {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // reveal animation the first time the page scrolls into view
    if ('IntersectionObserver' in window) {
      var played = false;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !played) {
            played = true;
            page.classList.add('enter');
            obs.disconnect();
          }
        });
      }, { root: scrollArea, threshold: [0, 0.35, 1] });
      obs.observe(page);
    } else {
      page.classList.add('enter');
    }

    // "Add to Calendar": builds a small .ics file from the page's data-* attributes
    var calBtn = page.querySelector('.mh-cal');
    if (calBtn) calBtn.addEventListener('click', function () {
      var d = page.dataset;
      var esc = function (t) { return String(t).replace(/([,;])/g, '\\$1'); };
      var ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invite//EN', 'BEGIN:VEVENT',
        'UID:' + page.id + '-' + d.start + '@wedding-invite',
        'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        'DTSTART:' + d.start, 'DTEND:' + d.end,
        'SUMMARY:' + esc(d.title), 'LOCATION:' + esc(d.location),
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = page.id.replace('Page', '') + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
  });

  // ---------------- FAQ accordion: one answer open at a time ----------------
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  // play the message page's reveal animation the first time it scrolls into view
  if (messagePage && 'IntersectionObserver' in window) {
    var messagePlayed = false;
    var msgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !messagePlayed) {
          messagePlayed = true;
          messagePage.classList.add('enter');
          msgObserver.disconnect();
        }
      });
    }, { root: scrollArea, threshold: [0, 0.35, 1] });
    msgObserver.observe(messagePage);
  } else if (messagePage) {
    messagePage.classList.add('enter');
  }

  // ---------------- live countdown to the event ----------------
  var EVENT_DATE = new Date('2027-01-31T19:30:00');
  var numEls = {
    days:  document.getElementById('numDays'),
    hours: document.getElementById('numHours'),
    mins:  document.getElementById('numMins'),
    secs:  document.getElementById('numSecs')
  };
  function pad(n){ return String(n).padStart(2, '0'); }
  function tickCountdown(){
    var diff = EVENT_DATE.getTime() - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (numEls.days)  numEls.days.textContent  = d;
    if (numEls.hours) numEls.hours.textContent = pad(h);
    if (numEls.mins)  numEls.mins.textContent  = pad(m);
    if (numEls.secs)  numEls.secs.textContent  = pad(s);
  }
  tickCountdown();
  window.setInterval(tickCountdown, 1000);

  // ---------------- scratch-to-reveal cards ----------------
  // One pointer handler lives on the whole grid, so a single drag keeps scratching
  // card after card (it never gets "stuck" on the card it started on, and the gaps /
  // centre of the grid don't interrupt it). Every card reveals on its own once enough
  // of its foil has been rubbed away; the celebration plays when all four are done.
  function paintFoil(ctx, w, h){
    // soft rose-gold foil
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0,   '#f6d3c8');
    g.addColorStop(.25, '#dba596');
    g.addColorStop(.5,  '#f9e4dc');
    g.addColorStop(.75, '#cf9486');
    g.addColorStop(1,   '#efc3b5');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // fine brushed-metal speckle
    for (var i = 0; i < 90; i++){
      ctx.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.22)' : 'rgba(124,27,43,.07)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
    }
    // thin inner border
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4.5, 4.5, w - 9, h - 9);

    // little sparkles
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    for (var j = 0; j < 5; j++){
      var x = 10 + Math.random() * (w - 20), y = 10 + Math.random() * (h - 20), sz = 1.2 + Math.random() * 1.8;
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -sz * 3); ctx.lineTo(sz * .7, 0); ctx.lineTo(0, sz * 3); ctx.lineTo(-sz * .7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // "scratch" label
    ctx.fillStyle = 'rgba(124,27,43,.55)';
    ctx.font = '600 ' + Math.max(9, Math.round(h * .15)) + 'px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S C R A T C H', w / 2, h / 2);
  }

  var scratchGrid   = document.getElementById('scratchGrid');
  var scratchCards  = document.querySelectorAll('.scratch-card');
  var scratchHint   = document.getElementById('scratchHint');
  var cardRigs      = [];
  var SCRATCH_RADIUS = 17;
  var REVEAL_AT      = 0.5;     // fraction of foil removed before a card pops open

  function revealCard(rig){
    if (rig.revealed) return;
    rig.revealed = true;
    rig.canvas.classList.add('fade-out');
    rig.card.classList.add('revealed');
    window.setTimeout(function () {
      if (rig.canvas.parentNode) rig.canvas.remove();
    }, 600);
    if (cardRigs.every(function (r) { return r.revealed; })) {
      if (scratchHint) scratchHint.style.opacity = '0';
      celebrate();
    }
  }

  function clearedFraction(rig){
    var c = rig.canvas;
    if (!c.width || !c.height) return 0;
    var data;
    try { data = rig.ctx.getImageData(0, 0, c.width, c.height).data; } catch (err) { return 0; }
    var total = 0, clear = 0;
    for (var i = 3; i < data.length; i += 16){ // sample every 4th pixel
      total++;
      if (data[i] < 128) clear++;
    }
    return total ? clear / total : 0;
  }

  function initScratchCard(card){
    var canvas = card.querySelector('.scratch-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var rig = { card: card, canvas: canvas, ctx: ctx, revealed: false, touched: false };
    cardRigs.push(rig);

    function sizeCanvas(){
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = card.clientWidth, h = card.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, w, h);
      rig.touched = false;
    }
    sizeCanvas();
    window.addEventListener('resize', function(){ if (!rig.revealed) sizeCanvas(); });
    // the card starts at 0x0 while its page is [hidden] (before the envelope opens),
    // so repaint as soon as it actually gets real dimensions.
    if ('ResizeObserver' in window){
      var lastW = 0, lastH = 0;
      var ro = new ResizeObserver(function(){
        if (rig.revealed) { ro.disconnect(); return; }
        if (card.clientWidth !== lastW || card.clientHeight !== lastH){
          lastW = card.clientWidth; lastH = card.clientHeight;
          if (!rig.touched) sizeCanvas();
        }
      });
      ro.observe(card);
    }
  }
  scratchCards.forEach(initScratchCard);

  // scratch a straight stroke (x0,y0 -> x1,y1 in viewport px) onto every card it passes over
  function scratchStroke(x0, y0, x1, y1){
    var touchedNow = [];
    cardRigs.forEach(function (rig) {
      if (rig.revealed) return;
      var r = rig.canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var pad = SCRATCH_RADIUS;
      var minX = Math.min(x0, x1) - pad, maxX = Math.max(x0, x1) + pad;
      var minY = Math.min(y0, y1) - pad, maxY = Math.max(y0, y1) + pad;
      if (maxX < r.left || minX > r.right || maxY < r.top || minY > r.bottom) return;
      var ctx = rig.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = SCRATCH_RADIUS * 2;
      ctx.beginPath();
      ctx.moveTo(x0 - r.left, y0 - r.top);
      ctx.lineTo(x1 - r.left, y1 - r.top);
      ctx.stroke();
      ctx.restore();
      rig.touched = true;
      touchedNow.push(rig);
    });
    return touchedNow;
  }

  if (scratchGrid){
    var scratching = false, lastX = 0, lastY = 0, lastCheck = 0;

    function checkCards(rigs){
      rigs.forEach(function (rig) {
        if (!rig.revealed && clearedFraction(rig) >= REVEAL_AT) revealCard(rig);
      });
    }

    scratchGrid.addEventListener('pointerdown', function (e) {
      scratching = true;
      lastX = e.clientX; lastY = e.clientY;
      // capture on the GRID (not a single card) so the drag follows the finger/cursor
      // across every card, the gaps between them, and even just outside the grid
      try { scratchGrid.setPointerCapture(e.pointerId); } catch (err) {}
      checkCards(scratchStroke(lastX, lastY, lastX + .01, lastY + .01));
      e.preventDefault();
    });
    scratchGrid.addEventListener('pointermove', function (e) {
      if (!scratching) return;
      var hit = scratchStroke(lastX, lastY, e.clientX, e.clientY);
      lastX = e.clientX; lastY = e.clientY;
      var now = performance.now();
      if (now - lastCheck > 90){ lastCheck = now; checkCards(hit); }
      e.preventDefault();
    });
    function endScratch(e){
      if (!scratching) return;
      scratching = false;
      try { scratchGrid.releasePointerCapture(e.pointerId); } catch (err) {}
      checkCards(cardRigs.filter(function (r) { return r.touched; })); // final check once the finger lifts
    }
    scratchGrid.addEventListener('pointerup', endScratch);
    scratchGrid.addEventListener('pointercancel', endScratch);
  }

  // ---------------- celebration: red rose petals + leaves, bursting from the centre ----------------
  var celebrateField = document.getElementById('celebrateField');
  var roseShape = '<svg viewBox="0 0 24 24"><path d="M12 2c3 2.6 5.4 5.6 5.4 9 0 3.6-2.4 6.6-5.4 7.8C9 17.6 6.6 14.6 6.6 11 6.6 7.6 9 4.6 12 2z" fill="currentColor"/></svg>';
  var leafShape = '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="5.2" ry="10" transform="rotate(45 12 12)" fill="currentColor"/><line x1="5" y1="5" x2="19" y2="19" stroke="rgba(0,0,0,.2)" stroke-width="1"/></svg>';
  var celebrateColors = ['var(--maroon-bright)', 'var(--maroon)', '#5c7a3c', '#7a9a52', 'var(--gold-bright)'];

  function celebrate(){
    if (!celebrateField) return;
    var count = 46;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++){
      var el = document.createElement('div');
      el.className = 'confetto';
      var isLeaf = Math.random() < 0.3;
      var size  = 11 + Math.random() * 15;
      var angle = Math.random() * Math.PI * 2;
      var tx    = (Math.cos(angle) * (30 + Math.random() * 130)).toFixed(0) + 'px';   // gentle sideways spread
      var ty    = '-' + (130 + Math.random() * 230).toFixed(0) + 'px';                // always travels UP from the centre, never down
      var spin  = (180 + Math.random() * 360).toFixed(0) + 'deg';
      var dur   = (6 + Math.random() * 3.5).toFixed(1) + 's';   // slow motion
      var delay = (Math.random() * .9).toFixed(2) + 's';
      var color = isLeaf ? celebrateColors[2 + Math.floor(Math.random() * 2)]
                          : celebrateColors[Math.floor(Math.random() * 3)];

      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.color = color;
      el.style.setProperty('--tx', tx);
      el.style.setProperty('--ty', ty);
      el.style.setProperty('--spin', spin);
      el.style.setProperty('--fall-dur', dur);
      el.style.setProperty('--fall-delay', delay);
      el.innerHTML = isLeaf ? leafShape : roseShape;
      frag.appendChild(el);

      (function (node, life) {
        window.setTimeout(function(){ if (node.parentNode) node.remove(); }, life);
      })(el, (parseFloat(dur) + parseFloat(delay) + .3) * 1000);
    }
    celebrateField.appendChild(frag);
  }

  // ---------------- message-page chips -> jump to that event on the events page ----------------
  var eventRows = document.querySelectorAll('.event-row');
  document.querySelectorAll('.msg-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (!eventsPage) return;
      eventsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var row = eventRows[parseInt(chip.getAttribute('data-event'), 10)];
      if (!row) return;
      window.setTimeout(function () {
        row.classList.remove('hl'); void row.offsetWidth; row.classList.add('hl');
        window.setTimeout(function () { row.classList.remove('hl'); }, 2100);
      }, 900);
    });
  });

  // ---------------- final page: reveal on first view + blue/gold petals ----------------
  var finalPage = document.getElementById('finalPage');
  if (finalPage) {
    var finalField = finalPage.querySelector('.final-petals');
    spawnPetals(12, finalField, ['#a2283a', '#e0bb62', '#f6ecd2', '#c17c86', '#e8c164']);
    if ('IntersectionObserver' in window) {
      var finalPlayed = false;
      var finObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !finalPlayed) {
            finalPlayed = true;
            finalPage.classList.add('enter');
            finObserver.disconnect();
          }
        });
      }, { root: scrollArea, threshold: [0, 0.35, 1] });
      finObserver.observe(finalPage);
    } else {
      finalPage.classList.add('enter');
    }
  }
})();
