// チップチューン音源エンジン (WebAudio)
// MUSIC_TRACKS のシーケンスデータを再生 + 効果音
var Audio2 = (function () {
  var ctx = null;
  var master = null;
  var enabled = true;
  var current = null;       // 再生中トラック名
  var schedTimer = null;
  var channels = [];        // [{notes, idx, nextTime, kind}]
  var trackDef = null;
  var noiseBuf = null;
  var unlocked = false;

  var NOTE_BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function noteFreq(n) {
    var m = /^([A-G])(#?)(\d)$/.exec(n);
    if (!m) return 440;
    var semi = NOTE_BASE[m[1]] + (m[2] ? 1 : 0);
    var oct = parseInt(m[3], 10);
    var midi = (oct + 1) * 12 + semi;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function ensureCtx() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    var len = ctx.sampleRate * 0.5;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  function playNoise(time, dur, type, vol) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    var g = ctx.createGain();
    if (type === "k") { f.type = "lowpass"; f.frequency.value = 220; vol *= 2.2; dur = Math.min(dur, 0.09); }
    else if (type === "s") { f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.8; dur = Math.min(dur, 0.1); vol *= 1.3; }
    else { f.type = "highpass"; f.frequency.value = 7500; dur = Math.min(dur, 0.05); }
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(time); src.stop(time + dur + 0.02);
  }

  function playTone(time, dur, freq, wave, vol) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = wave;
    o.frequency.value = freq;
    var a = 0.005;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(vol, time + a);
    g.gain.setValueAtTime(vol, time + Math.max(a, dur - 0.03));
    g.gain.linearRampToValueAtTime(0.0001, time + dur);
    o.connect(g); g.connect(master);
    o.start(time); o.stop(time + dur + 0.02);
  }

  function scheduler() {
    if (!ctx || !trackDef) return;
    var ahead = ctx.currentTime + 0.18;
    var step = 60 / trackDef.tempo / 4; // 16分音符の長さ
    for (var c = 0; c < channels.length; c++) {
      var ch = channels[c];
      while (ch.nextTime < ahead) {
        if (ch.idx >= ch.notes.length) {
          if (trackDef.loop === false) { ch.done = true; break; }
          ch.idx = 0;
        }
        var ev = ch.notes[ch.idx];
        var dur = ev[1] * step;
        if (ev[0] !== null) {
          if (ch.kind === "noise") playNoise(ch.nextTime, dur, ev[0], 0.05);
          else if (ch.kind === "triangle") playTone(ch.nextTime, dur * 0.95, noteFreq(ev[0]), "triangle", 0.085);
          else playTone(ch.nextTime, dur * 0.92, noteFreq(ev[0]), "square", c === 0 ? 0.045 : 0.03);
        }
        ch.nextTime += dur;
        ch.idx++;
      }
    }
  }

  function stopMusic() {
    current = null;
    trackDef = null;
    channels = [];
    if (schedTimer) { clearInterval(schedTimer); schedTimer = null; }
  }

  function playTrack(name) {
    if (!enabled) { current = name; return; } // OFFでも名前は覚える(ONにした時用)
    ensureCtx();
    if (!ctx || !window.MUSIC_TRACKS || !MUSIC_TRACKS[name]) { current = name; return; }
    if (current === name && schedTimer) return;
    stopMusic();
    current = name;
    trackDef = MUSIC_TRACKS[name];
    var t0 = ctx.currentTime + 0.08;
    var defs = [["pulse1", "square"], ["pulse2", "square"], ["triangle", "triangle"], ["noise", "noise"]];
    for (var i = 0; i < defs.length; i++) {
      var notes = trackDef[defs[i][0]];
      if (notes && notes.length) channels.push({ notes: notes, idx: 0, nextTime: t0, kind: defs[i][1] });
    }
    schedTimer = setInterval(scheduler, 60);
    scheduler();
  }

  // ---- 効果音 ----
  function blip(freq, dur, wave, vol, slideTo) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx) return;
    var t = ctx.currentTime;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = wave || "square";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol || 0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noiseHit(dur, freqLP, vol) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx) return;
    playNoise(ctx.currentTime, dur, "s", vol || 0.1);
  }

  var sfx = {
    select: function () { blip(880, 0.07, "square", 0.05); },
    confirm: function () { blip(660, 0.05, "square", 0.05); blipAt(990, 0.08, 0.05, 0.05); },
    cancel: function () { blip(440, 0.1, "square", 0.05, 220); },
    bump: function () { blip(120, 0.08, "square", 0.05); },
    hit: function () { noiseHit(0.15, 1200, 0.12); blip(300, 0.12, "square", 0.05, 80); },
    superhit: function () { noiseHit(0.2, 800, 0.16); blip(500, 0.18, "square", 0.07, 60); },
    weakhit: function () { noiseHit(0.08, 2000, 0.07); },
    faint: function () { blip(400, 0.5, "square", 0.07, 60); },
    heal: function () { blipAt(523, 0, 0.09, 0.05); blipAt(659, 0.09, 0.09, 0.05); blipAt(784, 0.18, 0.09, 0.05); blipAt(1047, 0.27, 0.15, 0.05); },
    levelup: function () { blipAt(523, 0, 0.07, 0.06); blipAt(659, 0.07, 0.07, 0.06); blipAt(784, 0.14, 0.07, 0.06); blipAt(1047, 0.21, 0.2, 0.06); },
    throwBall: function () { blip(300, 0.2, "square", 0.06, 900); },
    shake: function () { blip(200, 0.1, "square", 0.06, 150); },
    catchOk: function () { blipAt(784, 0, 0.1, 0.06); blipAt(659, 0.1, 0.1, 0.06); blipAt(880, 0.2, 0.3, 0.06); },
    breakout: function () { noiseHit(0.2, 1000, 0.12); blip(500, 0.15, "square", 0.05, 200); },
    door: function () { blip(220, 0.12, "square", 0.05, 440); },
    save: function () { blipAt(660, 0, 0.08, 0.05); blipAt(880, 0.08, 0.08, 0.05); blipAt(1320, 0.16, 0.15, 0.05); },
    encounter: function () { blip(150, 0.3, "square", 0.07, 600); },
    statup: function () { blip(400, 0.15, "square", 0.05, 800); },
    statdown: function () { blip(800, 0.15, "square", 0.05, 400); }
  };
  function blipAt(freq, delay, dur, vol) {
    if (!enabled) return;
    ensureCtx();
    if (!ctx) return;
    var t = ctx.currentTime + delay;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  return {
    play: playTrack,
    stop: stopMusic,
    sfx: sfx,
    currentTrack: function () { return current; },
    setEnabled: function (on) {
      enabled = on;
      if (!on) { var c = current; stopMusic(); current = c; }
      else if (current) { var c2 = current; current = null; playTrack(c2); }
    },
    isEnabled: function () { return enabled; },
    unlock: function () {
      if (unlocked) { if (ctx && ctx.state === "suspended") ctx.resume(); return; }
      unlocked = true;
      ensureCtx();
      if (ctx && ctx.state === "suspended") ctx.resume();
      if (current) { var c = current; current = null; playTrack(c); }
    }
  };
})();
