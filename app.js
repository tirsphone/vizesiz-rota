/* Vizesiz Rota — uygulama mantığı (bağımlılık: d3 + topojson yalnızca küre için) */
(function () {
  'use strict';

  var VRD = window.VR;
  var D = VRD.dest;
  var byId = {};
  D.forEach(function (d) { byId[d.id] = d; });

  // ---------- yardımcılar ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var MON3 = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  var LOC = ['Ocak’ta', 'Şubat’ta', 'Mart’ta', 'Nisan’da', 'Mayıs’ta', 'Haziran’da', 'Temmuz’da', 'Ağustos’ta', 'Eylül’de', 'Ekim’de', 'Kasım’da', 'Aralık’ta'];
  var IKEY = VRD.interests.map(function (x) { return x[0]; });
  var ILAB = {}; VRD.interests.forEach(function (x) { ILAB[x[0]] = x[1]; });
  var ISHORT = { doga: 'Doğa', kultur: 'Kültür', plaj: 'Plaj', gastro: 'Gastronomi', gece: 'Gece hayatı', macera: 'Macera', sehir: 'Şehir', kis: 'Kış' };
  var REG = {}; VRD.regions.forEach(function (r) { REG[r[0]] = r[1]; });
  var SUIT = ['Önerilmez', 'Orta', 'İdeal'];
  var LVL = ['', 'Çok uygun', 'Uygun', 'Orta', 'Pahalı', 'Çok pahalı'];
  var STYLE = ['Ekonomik', 'Orta', 'Konforlu'];
  var IST = { lat: 41.2753, lon: 28.7519 };
  var NOW = new Date();
  var CUR_M = NOW.getMonth() + 1;
  var NEXT_M = NOW.getDate() > 15 ? (CUR_M % 12) + 1 : CUR_M;
  var MFA = 'https://www.mfa.gov.tr/turk-vatandaslarinin-tabi-oldugu-vize-uygulamalari.tr.mfa';

  function lsGet(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* depolama kapalı olabilir */ } }
  function norm(s) { return String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i'); }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  function haversine(a, b) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  // ---------- bayraklar ----------
  var flagUri = {};
  function flagSrc(iso) {
    if (flagUri[iso]) return flagUri[iso];
    var svg = (window.FLAGS && window.FLAGS[iso]) || '';
    flagUri[iso] = svg ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) : '';
    return flagUri[iso];
  }
  function flag(iso, cls) {
    var src = flagSrc(iso);
    return '<span class="flag ' + (cls || '') + '" aria-hidden="true">' + (src ? '<img src="' + src + '" alt="" width="60" height="40" style="width:100%;height:100%;display:block;object-fit:cover">' : '') + '</span>';
  }
  function hex6(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join(''); return '#' + h.toUpperCase(); }
  function flagColors(iso) {
    var svg = (window.FLAGS && window.FLAGS[iso]) || '';
    var m = svg.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || [];
    var seen = {}, out = [];
    m.forEach(function (c) {
      c = hex6(c); if (seen[c]) return; seen[c] = 1;
      var r = parseInt(c.substr(1, 2), 16), g = parseInt(c.substr(3, 2), 16), b = parseInt(c.substr(5, 2), 16);
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (mx - mn > 50 && mx > 70) out.push(c);
    });
    return [out[0] || '#8C1736', out[1] || out[0] || '#1A2B5C'];
  }

  // ---------- türetilmiş alanlar ----------
  D.forEach(function (d) {
    d.km = haversine(IST, { lat: d.ap[1], lon: d.ap[2] });
    d.fh = d.km / 850 + 0.5;
    d.th = d.mode === 'ferry' ? d.tt : d.fh + (d.dir === 'y' ? 0 : d.dir === 'p' ? 1.5 : 3.5);
    d.colors = flagColors(d.iso);
    d.search = norm([d.n, d.c, d.ap[0], d.alt, d.hl, REG[d.reg], d.cur, d.lang, d.food.join(' '),
      d.exp.map(function (e) { return e[0] + ' ' + e[2] + ' ' + e[3]; }).join(' '),
      d.fest.map(function (f) { return f[0] + ' ' + f[2] + ' ' + f[3]; }).join(' ')].join(' '));
  });

  // ---------- durum ----------
  var S = {
    view: 'kesfet',
    q: '', reg: 'all', visa: new Set(), ints: new Set(),
    month: NEXT_M, idealOnly: false, festOnly: false, directOnly: false, favOnly: false,
    maxH: 26, maxDay: 320, sort: 'oneri',
    layout: lsGet('vr-layout', 'kart'),
    fav: new Set(lsGet('vr-fav', [])),
    cmp: (lsGet('vr-cmp', ['ge', 'jp', 'ma']) || []).filter(function (id) { return !id || byId[id]; }).slice(0, 3),
    cmpTouched: false,
    cur: lsGet('vr-cur', 'EUR'),
    rate: +lsGet('vr-rate', VRD.eurTry) || VRD.eurTry,
    calM: CUR_M,
    check: new Set(lsGet('vr-check', [])),
    plan: { month: NEXT_M, days: 7, people: 2, budget: 1200, style: 1, maxH: 8, ints: new Set(['kultur', 'gastro']), kimOnly: false, directOnly: false },
    filtersOpen: window.innerWidth > 760
  };
  while (S.cmp.length < 3) S.cmp.push('');

  // ---------- biçimlendirme ----------
  var nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function money(eur, cur) {
    cur = cur || S.cur;
    if (eur === 0) return 'Ücretsiz';
    if (cur === 'TRY') {
      var v = eur * S.rate;
      if (v >= 1000) v = Math.round(v / 10) * 10; else if (v >= 100) v = Math.round(v);
      return (v < 100 ? nf1.format(v) : nf0.format(v)) + ' ₺';
    }
    return '€' + (eur < 10 && eur % 1 ? nf1.format(eur) : nf0.format(Math.round(eur)));
  }
  function moneyAlt(eur) { return money(eur, S.cur === 'TRY' ? 'EUR' : 'TRY'); }
  function dur(h) {
    var t = Math.round(h * 12) * 5, H = Math.floor(t / 60), M = t % 60;
    return H ? H + ' sa' + (M ? ' ' + String(M).padStart(2, '0') + ' dk' : '') : M + ' dk';
  }
  function tzOne(x) {
    if (x === 0) return 'aynı saat';
    var a = Math.abs(x), H = Math.floor(a), M = Math.round((a - H) * 60);
    return (x > 0 ? '+' : '−') + H + (M ? ':' + String(M).padStart(2, '0') : '') + ' sa';
  }
  function tzText(d) { var s = tzOne(d.tz); if (d.tzs != null && d.tzs !== d.tz) s += ' (yaz saatinde ' + tzOne(d.tzs) + ')'; return s; }
  function plugInfo(p) {
    var toks = p.split('(')[0].split(/[\/\s,]+/).filter(Boolean);
    var ok = toks.some(function (t) { return t === 'C' || t === 'E' || t === 'F'; });
    var vm = p.match(/(\d{3}) ?V/);
    return { ok: ok, text: ok ? 'Türk fişi genelde uyar' : 'Adaptör gerekir', volt: vm ? vm[1] + ' V' : '220–240 V' };
  }
  function vcls(d) { return d.v === 'evisa' ? 'eta' : d.v; }
  function vlabel(d) { return d.special || VRD.visa[d.v].label; }
  function vstamp(d) { return d.special ? 'ADA VİZESİ' : VRD.visa[d.v].stamp; }
  function dirLabel(d) { return d.mode === 'ferry' ? 'Ege kıyısından feribot' : d.dir === 'y' ? 'Direkt sefer var' : d.dir === 'p' ? 'Sınırlı / tek duraklı' : 'Aktarmalı'; }
  function dirShort(d) { return d.mode === 'ferry' ? 'FERİBOT' : d.dir === 'y' ? 'DİREKT' : d.dir === 'p' ? 'SINIRLI' : 'AKTARMA'; }
  function travelText(d) { return d.mode === 'ferry' ? '20 dk – 1,5 sa' : dur(d.fh); }
  function suitDots(s) { return '<span class="suit s' + (s + 1) + '" aria-hidden="true"><i></i><i></i><i></i></span>'; }
  function meter(l) { var h = '<span class="meter" aria-label="Pahalılık ' + l + '/5">'; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= l ? 'on' : '') + '"></i>'; return h + '</span>'; }
  function ic(name, extra) { return '<svg class="ic"' + (extra ? ' ' + extra : '') + '><use href="#i-' + name + '"/></svg>'; }
  function score(d, k) { return +d.i[IKEY.indexOf(k)]; }
  function topInts(d, n) { return IKEY.slice().sort(function (a, b) { return score(d, b) - score(d, a); }).slice(0, n); }
  function bestMonths(d) {
    var ms = []; for (var i = 0; i < 12; i++) if (d.s[i] === '2') ms.push(i);
    if (!ms.length) return '—';
    // ardışık ayları aralık olarak yaz (döngüsel)
    var runs = [], start = ms[0], prev = ms[0];
    for (var j = 1; j < ms.length; j++) { if (ms[j] === prev + 1) { prev = ms[j]; } else { runs.push([start, prev]); start = prev = ms[j]; } }
    runs.push([start, prev]);
    if (runs.length > 1 && runs[0][0] === 0 && runs[runs.length - 1][1] === 11) { var last = runs.pop(); runs[0][0] = last[0]; }
    return runs.map(function (r) { return r[0] === r[1] ? MON3[r[0]] : MON3[r[0]] + '–' + MON3[r[1]]; }).join(', ');
  }
  function festsIn(d, m) { return d.fest.filter(function (f) { return f[1].indexOf(m) >= 0; }); }
  function festMonthsText(ms) {
    if (ms.length === 12) return 'Her ay';
    if (ms.length === 1) return MONTHS[ms[0] - 1];
    return ms.map(function (m) { return MON3[m - 1]; }).join(' · ');
  }
  function formFor(iso) { return VRD.forms.filter(function (f) { return f[0] === iso; })[0]; }

  // ---------- pasaport damgası ----------
  var stampN = 0;
  function stamp(d) {
    var id = 'sp' + (++stampN);
    var rot = (hash(d.id) % 19) - 11;
    var big, small;
    if (d.id === 'kktc') { big = '∞'; small = 'SERBEST'; }
    else if (d.d >= 365) { big = '1'; small = 'YIL'; }
    else if (d.d >= 120 && d.d % 30 === 0) { big = String(d.d / 30); small = 'AY'; }
    else { big = String(d.d); small = 'GÜN'; }
    var top = vstamp(d);
    var bottom = d.kim ? 'KİMLİKLE GİRİŞ' : 'GİRİŞ · ' + d.ap[0];
    return '<svg class="stamp ' + vcls(d) + '" viewBox="0 0 100 100" style="transform:rotate(' + rot + 'deg)" role="img" aria-label="' + esc(vlabel(d) + ', ' + d.stay) + '">' +
      '<g filter="url(#ink)" fill="none" stroke="currentColor">' +
      '<circle cx="50" cy="50" r="46" stroke-width="2.6"/><circle cx="50" cy="50" r="38.5" stroke-width="1"/>' +
      '<path id="' + id + 't" d="M 21 50 A 29 29 0 0 1 79 50" stroke="none"/>' +
      '<path id="' + id + 'b" d="M 14 50 A 36 36 0 0 0 86 50" stroke="none"/>' +
      '<text fill="currentColor" stroke="none" font-size="' + (top.length > 9 ? 8.4 : 10) + '" letter-spacing="1"><textPath href="#' + id + 't" xlink:href="#' + id + 't" startOffset="50%" text-anchor="middle">' + top + '</textPath></text>' +
      '<text fill="currentColor" stroke="none" font-size="7" letter-spacing=".8"><textPath href="#' + id + 'b" xlink:href="#' + id + 'b" startOffset="50%" text-anchor="middle">' + esc(bottom) + '</textPath></text>' +
      '<text x="50" y="' + (big.length > 2 ? 58 : 59) + '" fill="currentColor" stroke="none" font-size="' + (big.length > 2 ? 20 : 24) + '" text-anchor="middle">' + big + '</text>' +
      '<text x="50" y="69.5" fill="currentColor" stroke="none" font-size="7.4" letter-spacing="1.2" text-anchor="middle">' + small + '</text>' +
      '<path d="M 30 36.5 h 40" stroke-width="1"/>' +
      '</g></svg>';
  }

  // ---------- filtreleme ----------
  function filtered() {
    var words = norm(S.q.trim()).split(/\s+/).filter(Boolean);
    return D.filter(function (d) {
      if (S.reg !== 'all' && d.reg !== S.reg) return false;
      if (S.visa.size) {
        var ok = (S.visa.has('free') && d.v === 'free') || (S.visa.has('kim') && d.kim) || (S.visa.has('voa') && d.v === 'voa') || (S.visa.has('online') && (d.v === 'eta' || d.v === 'evisa'));
        if (!ok) return false;
      }
      var ints = Array.from(S.ints);
      for (var i = 0; i < ints.length; i++) if (score(d, ints[i]) < 4) return false;
      if (S.maxH < 26 && d.th > S.maxH) return false;
      if (S.maxDay < 320 && d.day[1] > S.maxDay) return false;
      if (S.idealOnly && d.s[S.month - 1] !== '2') return false;
      if (S.festOnly && !festsIn(d, S.month).length) return false;
      if (S.directOnly && d.dir !== 'y') return false;
      if (S.favOnly && !S.fav.has(d.id)) return false;
      for (var w = 0; w < words.length; w++) if (d.search.indexOf(words[w]) < 0) return false;
      return true;
    });
  }
  function recScore(d) {
    var s = +d.s[S.month - 1];
    var ints = Array.from(S.ints);
    var iv = ints.length ? ints.reduce(function (a, k) { return a + score(d, k); }, 0) / (5 * ints.length) : topInts(d, 3).reduce(function (a, k) { return a + score(d, k); }, 0) / 15;
    var prox = 1 - Math.min(d.th, 24) / 24;
    return s / 2 * 0.45 + iv * 0.3 + prox * 0.25 + (festsIn(d, S.month).length ? 0.03 : 0);
  }
  function sorted(list) {
    var f = {
      oneri: function (a, b) { return recScore(b) - recScore(a); },
      ucus: function (a, b) { return a.th - b.th; },
      butce: function (a, b) { return a.day[1] - b.day[1]; },
      kalis: function (a, b) { return b.d - a.d || a.th - b.th; },
      ad: function (a, b) { return a.n.localeCompare(b.n, 'tr'); }
    }[S.sort];
    return list.slice().sort(f);
  }

  // ---------- KEŞFET: üst bölüm ----------
  function renderHero() {
    var c = { free: 0, kim: 0, voa: 0, online: 0 };
    D.forEach(function (d) { if (d.v === 'free') c.free++; if (d.kim) c.kim++; if (d.v === 'voa') c.voa++; if (d.v === 'eta' || d.v === 'evisa') c.online++; });
    var near = D.slice().sort(function (a, b) { return a.th - b.th; })[0];
    $('#upd').textContent = VRD.updated;
    $('#upd2').textContent = VRD.updated;
    $('#lede').textContent = 'Vize başvurusu yapmadan gidebileceğin ' + D.length + ' rota: uçuş süresi, günlük bütçe, deneyimler, festivaller ve en iyi zaman tek ekranda.';
    $('#stats').innerHTML = [
      [c.free, 'vizesiz ülke', 'var(--night-free)'],
      [c.kim, 'yalnızca kimlikle', 'var(--night-ink)'],
      [c.voa, 'kapıda vize', 'var(--night-voa)'],
      [c.online, 'online izin / e-vize', 'var(--night-eta)']
    ].map(function (s) { return '<div class="stat"><div class="v"><i style="background:' + s[2] + '"></i>' + s[0] + '</div><div class="l">' + s[1] + '</div></div>'; }).join('');
    $('#legend').innerHTML =
      '<span><i style="background:var(--night-free)"></i>Vizesiz</span>' +
      '<span><i style="background:var(--night-voa)"></i>Kapıda vize</span>' +
      '<span><i style="background:var(--night-eta)"></i>Online izin / e-vize</span>' +
      '<span><i class="hatch"></i>Önerilmiyor</span>' +
      '<span><i style="background:var(--night-land);box-shadow:inset 0 0 0 1px var(--night-border)"></i>Vize gerekli</span>' +
      '<span><i style="background:var(--night-tr)"></i>Türkiye</span>';
    renderQuick();
    void near;
  }

  var QUICK = [
    { id: 'kim', label: function () { return 'Kimlikle gidilenler'; }, on: function () { return S.visa.size === 1 && S.visa.has('kim'); }, act: function (on) { S.visa = on ? new Set(['kim']) : new Set(); } },
    { id: 'yakin', label: function () { return '3 saatten yakın'; }, on: function () { return S.maxH === 3; }, act: function (on) { S.maxH = on ? 3 : 26; } },
    { id: 'ucuz', label: function () { return 'Günlük ' + money(50) + ' altı'; }, on: function () { return S.maxDay === 50; }, act: function (on) { S.maxDay = on ? 50 : 320; } },
    { id: 'ideal', label: function () { return LOC[S.month - 1] + ' havası ideal'; }, on: function () { return S.idealOnly; }, act: function (on) { S.idealOnly = on; } },
    { id: 'fest', label: function () { return LOC[S.month - 1] + ' festival var'; }, on: function () { return S.festOnly; }, act: function (on) { S.festOnly = on; } },
    { id: 'fav', label: function () { return 'Favorilerim (' + S.fav.size + ')'; }, on: function () { return S.favOnly; }, act: function (on) { S.favOnly = on; } }
  ];
  function renderQuick() {
    $('#quick').innerHTML = QUICK.map(function (q) { return '<button type="button" data-quick="' + q.id + '" aria-pressed="' + q.on() + '">' + esc(q.label()) + '</button>'; }).join('');
  }

  function renderNews() {
    var kind = { kisit: 'Yeni kısıtlama', kolay: 'Kolaylık', kural: 'Yeni kural' };
    $('#news').innerHTML = VRD.news.map(function (n) {
      var d = D.filter(function (x) { return x.iso === n.iso; })[0];
      var fl = n.iso === 'TR' ? flag('TR', 'sm') : flag(n.iso === 'ME' ? 'ME' : n.iso, 'sm');
      return '<article><div class="top"><span class="pill ' + n.k + '">' + kind[n.k] + '</span><span class="num">' + esc(n.d) + '</span></div>' +
        '<h3>' + fl + esc(n.t) + '</h3><p>' + esc(n.x) + '</p>' +
        (d ? '<button class="linkbtn" type="button" data-open="' + d.id + '" style="justify-self:start">' + esc(d.n) + ' sayfası</button>' : '') +
        '<a class="src" href="' + esc(n.src) + '" target="_blank" rel="noopener">Kaynak ↗</a></article>';
    }).join('');
  }

  // ---------- filtre paneli ----------
  function renderFilters() {
    var activeN = (S.reg !== 'all') + S.visa.size + S.ints.size + (S.maxH < 26) + (S.maxDay < 320) + S.idealOnly + S.festOnly + S.directOnly + S.favOnly + (S.q ? 1 : 0);
    var monthOpts = MONTHS.map(function (m, i) { return '<option value="' + (i + 1) + '"' + (S.month === i + 1 ? ' selected' : '') + '>' + m + '</option>'; }).join('');
    var regs = [['all', 'Tümü']].concat(VRD.regions);
    var html =
      '<div class="frow" style="justify-content:space-between">' +
        '<strong style="font-family:var(--font-display);font-size:17px;display:inline-flex;align-items:center;gap:8px">' + ic('sliders') + 'Filtrele' + (activeN ? ' <span class="pill kolay">' + activeN + ' etkin</span>' : '') + '</strong>' +
        '<span style="display:inline-flex;gap:10px;align-items:center">' + (activeN ? '<button type="button" class="linkbtn" data-act="reset">Temizle</button>' : '') +
        '<button type="button" class="btn sm" data-act="ftoggle" aria-expanded="' + S.filtersOpen + '">' + (S.filtersOpen ? 'Gizle' : 'Göster') + '</button></span>' +
      '</div>';
    if (S.filtersOpen) {
      html +=
        '<div class="frow"><span class="flabel">Bölge</span><div class="chips">' + regs.map(function (r) { return '<button type="button" class="chip" data-reg="' + r[0] + '" aria-pressed="' + (S.reg === r[0]) + '">' + esc(r[1]) + '</button>'; }).join('') + '</div></div>' +
        '<div class="frow"><span class="flabel">Giriş</span><div class="chips">' +
          '<button type="button" class="chip" data-visa="free" aria-pressed="' + S.visa.has('free') + '"><i class="dot" style="background:var(--free)"></i>Vizesiz</button>' +
          '<button type="button" class="chip" data-visa="kim" aria-pressed="' + S.visa.has('kim') + '">' + ic('id') + 'Kimlikle</button>' +
          '<button type="button" class="chip" data-visa="voa" aria-pressed="' + S.visa.has('voa') + '"><i class="dot" style="background:var(--voa)"></i>Kapıda vize</button>' +
          '<button type="button" class="chip" data-visa="online" aria-pressed="' + S.visa.has('online') + '"><i class="dot" style="background:var(--eta)"></i>Online izin / e-vize</button>' +
        '</div></div>' +
        '<div class="frow"><span class="flabel">İlgi</span><div class="chips">' + IKEY.map(function (k) { return '<button type="button" class="chip" data-int="' + k + '" aria-pressed="' + S.ints.has(k) + '">' + ic(k) + esc(ILAB[k]) + '</button>'; }).join('') + '</div></div>' +
        '<div class="fgrid">' +
          '<div class="field"><label for="fMonth">Seyahat ayı</label><select id="fMonth">' + monthOpts + '</select></div>' +
          '<div class="field"><label for="fH">Maks. yolculuk <output>' + (S.maxH >= 26 ? 'Sınırsız' : S.maxH + ' sa') + '</output></label><input id="fH" type="range" min="1" max="26" step="1" value="' + S.maxH + '"></div>' +
          '<div class="field"><label for="fB">Maks. günlük bütçe <output>' + (S.maxDay >= 320 ? 'Sınırsız' : money(S.maxDay)) + '</output></label><input id="fB" type="range" min="20" max="320" step="10" value="' + S.maxDay + '"></div>' +
          '<div class="field" style="gap:8px">' +
            '<label class="toggle"><input type="checkbox" id="fIdeal"' + (S.idealOnly ? ' checked' : '') + '>Sadece ' + LOC[S.month - 1].toLocaleLowerCase('tr') + ' ideal olanlar</label>' +
            '<label class="toggle"><input type="checkbox" id="fFest"' + (S.festOnly ? ' checked' : '') + '>Bu ay festival olanlar</label>' +
            '<label class="toggle"><input type="checkbox" id="fDir"' + (S.directOnly ? ' checked' : '') + '>Sadece direkt uçuş</label>' +
            '<label class="toggle"><input type="checkbox" id="fFav"' + (S.favOnly ? ' checked' : '') + '>Favorilerim</label>' +
          '</div>' +
        '</div>' +
        (S.ints.size ? '<p style="font-size:12.5px;color:var(--muted)">İlgi filtresi: seçtiğin her alanda puanı 4 veya 5 olan rotalar.</p>' : '');
    }
    $('#filters').innerHTML = html;
  }

  // ---------- sonuçlar ----------
  function card(d) {
    var m = S.month, s = +d.s[m - 1], t = d.t[m - 1];
    var fav = S.fav.has(d.id), inCmp = S.cmp.indexOf(d.id) >= 0;
    return '<article class="pass" style="--c1:' + d.colors[0] + ';--c2:' + d.colors[1] + '">' +
      '<div class="pass-top"><div class="pass-id">' + flag(d.iso) +
        '<div style="min-width:0"><h3>' + esc(d.n) + '</h3><div class="sub"><span>' + esc(d.c) + '</span><span aria-hidden="true">·</span><span class="num">' + esc(d.ap[0]) + '</span>' + (d.kim ? '<span class="pill kim">' + ic('id', 'style="width:13px;height:13px"') + 'Kimlikle</span>' : '') + '</div></div></div>' +
        stamp(d) +
        '<p class="hl">' + esc(d.hl) + '</p></div>' +
      '<div class="perf" aria-hidden="true"></div>' +
      '<div class="pass-bot">' +
        '<div class="kv"><div class="k">' + (d.mode === 'ferry' ? 'Feribot' : 'Uçuş') + '</div><div class="v">' + travelText(d) + '</div><div class="x">' + (d.mode === 'ferry' ? 'Ege kıyısından' : dirShort(d) === 'DİREKT' ? 'Direkt' : d.dir === 'p' ? 'Sınırlı' : 'Aktarmalı') + '</div></div>' +
        '<div class="kv"><div class="k">Günlük</div><div class="v">' + money(d.day[1]) + '</div><div class="x">' + meter(d.lvl) + '</div></div>' +
        '<div class="kv"><div class="k">' + MONTHS[m - 1] + '</div><div class="v">' + t + '°C</div><div class="x">' + suitDots(s) + SUIT[s] + '</div></div>' +
      '</div>' +
      '<div class="pass-foot"><div class="tags">' + topInts(d, 3).map(function (k) { return '<span class="tag">' + ic(k) + ISHORT[k] + '</span>'; }).join('') + '</div>' +
        '<div class="acts"><button type="button" class="iconbtn fav" data-fav="' + d.id + '" aria-pressed="' + fav + '" aria-label="' + esc(d.n) + ' favorilere ' + (fav ? 'eklendi' : 'ekle') + '">' + ic('heart') + '</button>' +
        '<button type="button" class="iconbtn cmp" data-cmp="' + d.id + '" aria-pressed="' + inCmp + '" aria-label="' + esc(d.n) + ' karşılaştırmaya ' + (inCmp ? 'eklendi' : 'ekle') + '">' + ic('compare') + '</button></div></div>' +
      '<a class="cover" href="#ulke-' + d.id + '" aria-label="' + esc(d.n) + ' ayrıntıları"></a>' +
      '</article>';
  }
  function board(list) {
    var m = S.month;
    return '<div class="boardwrap"><table class="board"><caption>KALKIŞ · İSTANBUL (IST) · ' + MONTHS[m - 1].toLocaleUpperCase('tr') + ' İÇİN</caption>' +
      '<thead><tr><th>VARIŞ</th><th>KOD</th><th>SÜRE</th><th>SEFER</th><th>GİRİŞ</th><th>KALIŞ</th><th>GÜNLÜK</th><th>HAVA</th></tr></thead><tbody>' +
      list.map(function (d) {
        var s = +d.s[m - 1];
        return '<tr data-row="' + d.id + '"><td><div class="dest">' + flag(d.iso, 'sm') + '<button type="button" data-open="' + d.id + '">' + esc(d.n) + '</button></div></td>' +
          '<td class="code">' + esc(d.ap[0]) + '</td><td>' + (d.mode === 'ferry' ? 'FERİBOT' : dur(d.fh)) + '</td><td>' + dirShort(d) + '</td>' +
          '<td><span class="fids ' + d.v + '">' + vstamp(d) + '</span>' + (d.kim ? ' <span class="fids free">KİMLİK</span>' : '') + '</td>' +
          '<td>' + esc(d.stay.toLocaleUpperCase('tr')) + '</td><td>' + money(d.day[1]) + '</td><td>' + d.t[m - 1] + '°C · ' + SUIT[s].toLocaleUpperCase('tr') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function renderResults() {
    var list = sorted(filtered());
    $('#count').textContent = list.length;
    $('#sort').value = S.sort;
    $$('[data-layout]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.layout === S.layout)); });
    var el = $('#results');
    if (!list.length) {
      el.innerHTML = '<div class="empty">' + ic('search', 'style="width:28px;height:28px"') + '<strong>Bu filtrelere uyan rota yok.</strong><span>Yolculuk süresini veya bütçeyi artırmayı ya da ilgi alanı seçimini azaltmayı dene.</span><button type="button" class="btn" data-act="reset">Filtreleri temizle</button></div>';
    } else if (S.layout === 'pano') {
      el.innerHTML = board(list);
    } else {
      el.innerHTML = '<div class="cards">' + list.map(card).join('') + '</div>';
    }
    if (Globe.ready) Globe.setVisible(list);
    renderQuick();
  }
  function renderSide() {
    $('#risk').innerHTML = VRD.risk.map(function (r) {
      return '<div class="ritem">' + flag(r.iso, 'sm') + '<div><b>' + esc(r.n) + '</b> <span class="vv">· ' + esc(r.v) + '</span></div><div class="why">' + esc(r.why) + '</div></div>';
    }).join('');
    $('#needvisa').innerHTML = VRD.needVisa.map(function (r) {
      return '<div class="ritem">' + flag(r[0], 'sm') + '<div><b>' + esc(r[1]) + '</b></div><div class="why">' + esc(r[2]) + '</div></div>';
    }).join('');
  }
  function applyFilters(scroll) {
    renderFilters(); renderResults();
    if (scroll) { var h = $('#resH'); if (h) h.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
  }

  // ---------- KÜRE ----------
  var Globe = (function () {
    var api = { ready: false };
    var box, canvas, ctx, W = 0, H = 0, DPR = 1, proj, path, feats = [], grat, sphere = { type: 'Sphere' };
    var rot = [-36, -26, 0], zoom = 1, flat = false, spin = !reduceMotion, lastUser = -1e9, drag = null, hover = null, sel = null;
    var visible = new Set(D.map(function (d) { return d.id; })), visList = D.slice();
    var C = {}, hatch = null, onscreen = true, lastDraw = 0, fly = null, dirty = true;
    var gcx = 0, gcy = 0, lgH = 34, TOP = 46;

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      ['night-sea', 'night-land', 'night-border', 'night-free', 'night-voa', 'night-eta', 'night-risk', 'night-gold', 'night-tr', 'night-ink', 'night-ink-2'].forEach(function (k) { C[k] = cs.getPropertyValue('--' + k).trim() || '#888'; });
      var p = document.createElement('canvas'); p.width = p.height = 8;
      var g = p.getContext('2d'); g.fillStyle = C['night-land']; g.fillRect(0, 0, 8, 8);
      g.strokeStyle = C['night-risk']; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-2, 10); g.lineTo(10, -2); g.moveTo(-2, 2); g.lineTo(2, -2); g.moveTo(6, 10); g.lineTo(10, 6); g.stroke();
      hatch = ctx.createPattern(p, 'repeat');
    }
    function colorOf(d) { return C['night-' + vcls(d)]; }
    function makeProj() {
      var availH = Math.max(120, H - TOP - lgH);
      gcx = W / 2; gcy = TOP + availH / 2;
      if (flat) {
        proj = d3.geoEqualEarth().rotate([rot[0], 0, 0]);
        proj.fitExtent([[6, TOP], [W - 6, TOP + availH]], sphere);
        proj.scale(proj.scale() * zoom).translate([gcx, gcy]);
      } else {
        proj = d3.geoOrthographic().rotate(rot).scale(Math.min(W * 0.47, availH / 2) * zoom).translate([gcx, gcy]).clipAngle(90).precision(0.7);
      }
      path = d3.geoPath(proj, ctx);
    }
    function center() { return [-rot[0], -rot[1]]; }
    function front(p) { return flat || d3.geoDistance(p, center()) < Math.PI / 2 - 0.02; }
    function ptsOf(d) { return d.pts ? d.pts.map(function (p) { return [p[1], p[0]]; }) : [[d.ap[2], d.ap[1]]]; }

    function draw(now) {
      if (!W) return;
      makeProj();
      var t = now || performance.now();
      ctx.clearRect(0, 0, W, H);
      var r = proj.scale(), cx = gcx, cy = gcy;
      if (!flat) {
        var g = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.16);
        g.addColorStop(0, 'rgba(110,160,255,0.32)'); g.addColorStop(1, 'rgba(110,160,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 1.16, 0, Math.PI * 2); ctx.fill();
        var og = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.42, r * 0.05, cx, cy, r);
        og.addColorStop(0, '#1B2A4C'); og.addColorStop(1, C['night-sea']);
        ctx.fillStyle = og;
      } else { ctx.fillStyle = C['night-sea']; }
      ctx.beginPath(); path(sphere); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.6; ctx.beginPath(); path(grat); ctx.stroke();

      for (var i = 0; i < feats.length; i++) {
        var f = feats[i];
        ctx.beginPath(); path(f);
        if (f.tr) { ctx.fillStyle = C['night-tr']; ctx.fill(); continue; }
        if (f.risk) { ctx.fillStyle = hatch; ctx.fill(); continue; }
        ctx.fillStyle = C['night-land']; ctx.fill();
        if (f.dest) {
          var on = visible.has(f.dest.id);
          ctx.globalAlpha = on ? ((hover && hover === f.dest) || (sel && sel === f.dest) ? 1 : 0.88) : 0.22;
          ctx.fillStyle = colorOf(f.dest); ctx.fill(); ctx.globalAlpha = 1;
        }
      }
      ctx.strokeStyle = 'rgba(8,12,24,0.85)'; ctx.lineWidth = 0.5; ctx.beginPath();
      for (var j = 0; j < feats.length; j++) path(feats[j]);
      ctx.stroke();
      var hl = hover || sel;
      if (hl && hl.feat) { ctx.strokeStyle = C['night-ink']; ctx.lineWidth = 1.4; ctx.beginPath(); path(hl.feat); ctx.stroke(); }

      // uçuş yayları
      ctx.lineWidth = 0.9; ctx.strokeStyle = 'rgba(240,196,99,0.20)'; ctx.beginPath();
      visList.forEach(function (d) { if (d.mode === 'ferry') return; path({ type: 'LineString', coordinates: [[IST.lon, IST.lat], [d.ap[2], d.ap[1]]] }); });
      ctx.stroke();
      if (hl && hl.mode !== 'ferry') {
        var line = { type: 'LineString', coordinates: [[IST.lon, IST.lat], [hl.ap[2], hl.ap[1]]] };
        ctx.save(); ctx.strokeStyle = C['night-gold']; ctx.lineWidth = 2; ctx.setLineDash([7, 6]);
        ctx.lineDashOffset = reduceMotion ? 0 : -(t / 40) % 13;
        ctx.beginPath(); path(line); ctx.stroke(); ctx.restore();
        if (!reduceMotion) {
          var interp = d3.geoInterpolate([IST.lon, IST.lat], [hl.ap[2], hl.ap[1]]);
          var k = (t % 2600) / 2600, p = interp(k);
          if (front(p)) { var q = proj(p); if (q) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, Math.PI * 2); ctx.fill(); } }
        }
      }
      // işaretler
      var zr = Math.sqrt(zoom);
      visList.forEach(function (d) {
        ptsOf(d).forEach(function (p) {
          if (!front(p)) return; var q = proj(p); if (!q) return;
          var big = d === hl, rr = (d.pts ? 2.4 : 3.4) * zr * (big ? 1.6 : 1);
          ctx.beginPath(); ctx.arc(q[0], q[1], rr + 1.6, 0, Math.PI * 2); ctx.fillStyle = C['night-sea']; ctx.fill();
          ctx.beginPath(); ctx.arc(q[0], q[1], rr, 0, Math.PI * 2); ctx.fillStyle = big ? '#fff' : colorOf(d); ctx.fill();
        });
      });
      // İstanbul
      var ist = [IST.lon, IST.lat];
      if (front(ist)) {
        var iq = proj(ist);
        if (!reduceMotion) { var ph = (t % 2200) / 2200; ctx.beginPath(); ctx.arc(iq[0], iq[1], 4 + ph * 14, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(240,196,99,' + (0.7 * (1 - ph)) + ')'; ctx.lineWidth = 1.5; ctx.stroke(); }
        ctx.beginPath(); ctx.arc(iq[0], iq[1], 4.2, 0, Math.PI * 2); ctx.fillStyle = C['night-gold']; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = C['night-sea']; ctx.stroke();
        ctx.font = '700 11px "JetBrains Mono", monospace'; ctx.fillStyle = C['night-ink']; ctx.fillText('IST', iq[0] + 8, iq[1] - 6);
      }
      if (hl) {
        var hp = ptsOf(hl)[0];
        if (front(hp)) {
          var hq = proj(hp);
          ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif';
          var label = hl.n + (hl.mode === 'ferry' ? ' · feribot' : ' · ' + dur(hl.fh));
          var tw = ctx.measureText(label).width, lx = clamp(hq[0] + 10, 4, W - tw - 14), ly = clamp(hq[1] - 12, 16, H - 8);
          ctx.fillStyle = 'rgba(7,11,22,0.82)'; ctx.beginPath(); roundRect(ctx, lx - 6, ly - 14, tw + 12, 20, 6); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.fillText(label, lx, ly);
        }
      }
    }
    function roundRect(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    function resize() {
      var rc = box.getBoundingClientRect();
      W = Math.max(260, rc.width); H = Math.max(240, rc.height);
      DPR = Math.min(2, window.devicePixelRatio || 1);
      var lgEl = $('#legend'); lgH = (lgEl ? lgEl.offsetHeight : 24) + 12;
      TOP = W < 520 ? 48 : 46;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      dirty = true; draw();
    }
    function local(e) { var rc = canvas.getBoundingClientRect(); return [e.clientX - rc.left, e.clientY - rc.top]; }
    function pick(xy) {
      var best = null, bd = 13;
      visList.forEach(function (d) {
        ptsOf(d).forEach(function (p) { if (!front(p)) return; var q = proj(p); if (!q) return; var dd = Math.hypot(q[0] - xy[0], q[1] - xy[1]); if (dd < bd) { bd = dd; best = d; } });
      });
      if (best) return { d: best };
      if (!flat && Math.hypot(xy[0] - gcx, xy[1] - gcy) > proj.scale()) return null;
      var ll = proj.invert(xy); if (!ll || isNaN(ll[0])) return null;
      for (var i = 0; i < feats.length; i++) if (d3.geoContains(feats[i], ll)) return { f: feats[i], d: feats[i].dest };
      return null;
    }
    function tipFor(hit, e) {
      var tip = $('#tip');
      if (!hit) { tip.hidden = true; return; }
      var html;
      if (hit.d) {
        var d = hit.d;
        html = '<b>' + esc(d.n) + '</b><div class="r"><span>Giriş</span><span>' + esc(vlabel(d)) + (d.kim ? ' · kimlik' : '') + '</span></div>' +
          '<div class="r"><span>' + (d.mode === 'ferry' ? 'Feribot' : 'Uçuş') + '</span><span>' + travelText(d) + '</span></div>' +
          '<div class="r"><span>Günlük</span><span>' + money(d.day[1]) + '</span></div>' +
          '<div class="r"><span>' + MONTHS[S.month - 1] + '</span><span>' + d.t[S.month - 1] + '°C · ' + SUIT[+d.s[S.month - 1]] + '</span></div>';
      } else if (hit.f) {
        var nm = (window.TR_NAMES && (window.TR_NAMES[hit.f.id] || window.TR_NAMES[hit.f.properties.name])) || hit.f.properties.name;
        var rk = VRD.risk.filter(function (x) { return x.n === nm || (hit.f.risk && nm.indexOf(x.n) === 0); })[0];
        html = '<b>' + esc(nm) + '</b><div class="r"><span>' + (hit.f.tr ? 'Buradasın' : hit.f.risk ? 'Vizesiz, ancak seyahat önerilmiyor' : 'Önceden vize gerekir ya da listede yok') + '</span><span></span></div>' + (rk ? '<div class="r"><span>' + esc(rk.why) + '</span><span></span></div>' : '');
      } else { tip.hidden = true; return; }
      tip.innerHTML = html; tip.hidden = false;
      var x = e.clientX + 16, y = e.clientY + 14, w = tip.offsetWidth, h = tip.offsetHeight;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - 12;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    }
    function setHover(d) { if (hover !== d) { hover = d; dirty = true; } }
    function bind() {
      canvas.addEventListener('pointerdown', function (e) {
        drag = { x: e.clientX, y: e.clientY, rot: rot.slice(), moved: 0, id: e.pointerId, type: e.pointerType };
        try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* yok say */ }
        lastUser = performance.now(); fly = null;
      });
      canvas.addEventListener('pointermove', function (e) {
        if (drag && drag.id === e.pointerId) {
          var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
          drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
          var k = flat ? 0.32 : 0.3 / zoom;
          rot = [drag.rot[0] + dx * k, flat ? 0 : clamp(drag.rot[1] - dy * k, -65, 65), 0];
          $('#tip').hidden = true; dirty = true; lastUser = performance.now();
        } else if (e.pointerType === 'mouse') {
          var hit = pick(local(e));
          setHover(hit && hit.d ? hit.d : null);
          canvas.style.cursor = hit && (hit.d || hit.f) ? 'pointer' : 'grab';
          tipFor(hit, e);
        }
      });
      canvas.addEventListener('pointerup', function (e) {
        if (drag && drag.moved < 6) {
          var hit = pick(local(e));
          if (hit && hit.d) { location.hash = 'ulke-' + hit.d.id; }
          else if (hit && hit.f) {
            var nm = (window.TR_NAMES && (window.TR_NAMES[hit.f.id] || window.TR_NAMES[hit.f.properties.name])) || hit.f.properties.name;
            toast(hit.f.tr ? 'Rotalar İstanbul’dan hesaplanıyor.' : hit.f.risk ? nm + ': vizesiz ama şu an seyahat önerilmiyor.' : nm + ': bordo pasaportla önceden vize gerekir ya da bu listede yok.');
          }
        }
        drag = null; lastUser = performance.now();
      });
      canvas.addEventListener('pointercancel', function () { drag = null; });
      canvas.addEventListener('pointerleave', function () { if (!drag) { setHover(null); $('#tip').hidden = true; } });
      $('#gIn').addEventListener('click', function () { zoom = clamp(zoom * 1.25, 1, flat ? 2 : 3.2); dirty = true; lastUser = performance.now(); });
      $('#gOut').addEventListener('click', function () { zoom = clamp(zoom / 1.25, 1, 3.2); dirty = true; });
      $('#gSpin').addEventListener('click', function () {
        spin = !spin; this.setAttribute('aria-pressed', String(spin)); this.setAttribute('aria-label', spin ? 'Dönmeyi durdur' : 'Döndür');
        this.innerHTML = ic(spin ? 'pause' : 'play'); lastUser = -1e9;
      });
      $('#gMode').addEventListener('click', function () {
        flat = !flat; zoom = 1; if (flat) rot = [rot[0], 0, 0]; else rot = [rot[0], -26, 0];
        this.setAttribute('aria-pressed', String(flat)); this.textContent = flat ? 'Küre' : 'Düz harita'; dirty = true;
      });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onscreen = es[0].isIntersecting; if (onscreen) dirty = true; }).observe(box);
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(box); else window.addEventListener('resize', resize);
    }
    function loop(now) {
      requestAnimationFrame(loop);
      if (!onscreen || document.hidden || !api.ready) return;
      if (fly) {
        var k = clamp((now - fly.t0) / fly.ms, 0, 1), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        rot = [fly.a[0] + (fly.b[0] - fly.a[0]) * e, fly.a[1] + (fly.b[1] - fly.a[1]) * e, 0];
        dirty = true; if (k >= 1) fly = null;
      } else if (spin && !drag && !hover && now - lastUser > 5000) {
        rot[0] += flat ? 0.05 : 0.08; dirty = true;
      }
      var animating = !reduceMotion; // İstanbul nabzı ve seçili rota çizgisi
      if (dirty || (animating && now - lastDraw > 33)) { draw(now); lastDraw = now; dirty = false; }
    }
    api.init = function () {
      box = $('#globeBox'); canvas = $('#globe');
      if (!window.d3 || !window.topojson || !window.WORLD_TOPO || !canvas.getContext) {
        box.insertAdjacentHTML('beforeend', '<div class="gfail">Harita kitaplığı yüklenemedi. Liste, filtreler ve diğer bölümler normal çalışıyor.</div>');
        $('#ghint').hidden = true; $('.globe-ctl').hidden = true; return;
      }
      ctx = canvas.getContext('2d');
      readColors();
      feats = topojson.feature(window.WORLD_TOPO, window.WORLD_TOPO.objects.countries).features;
      var byNum = {}, byName = {};
      D.forEach(function (d) { if (d.num) byNum[d.num] = d; if (d.wn) byName[d.wn] = d; });
      var riskIds = { '804': 1, '364': 1, '422': 1, '376': 1, '862': 1, '332': 1 };
      feats.forEach(function (f) {
        f.dest = byNum[f.id] || byName[f.properties.name] || null;
        if (f.dest) f.dest.feat = f;
        f.risk = !!riskIds[f.id]; f.tr = f.id === '792';
      });
      grat = d3.geoGraticule10();
      api.ready = true;
      bind(); resize();
      if (reduceMotion) { $('#gSpin').setAttribute('aria-pressed', 'false'); $('#gSpin').innerHTML = ic('play'); }
      requestAnimationFrame(loop);
    };
    api.setVisible = function (list) { visList = list; visible = new Set(list.map(function (d) { return d.id; })); dirty = true; };
    api.select = function (id) {
      sel = id ? byId[id] : null; dirty = true;
      if (sel && !flat && api.ready) { var p = ptsOf(sel)[0]; fly = { a: rot.slice(), b: [-p[0], clamp(-p[1] * 0.85, -60, 60)], t0: performance.now(), ms: reduceMotion ? 1 : 900 }; lastUser = performance.now(); }
    };
    return api;
  })();

  // ---------- DETAY PENCERESİ ----------
  var dlg = $('#detail');
  var DT = { d: null, tab: 'genel', expCat: 'all', calc: { days: 7, people: 2, style: 1 }, month: NEXT_M };
  var TABS = [['genel', 'Genel bakış'], ['deneyim', 'Deneyimler'], ['festival', 'Festivaller'], ['butce', 'Bütçe'], ['iklim', 'Ne zaman?'], ['pratik', 'Pratik bilgiler']];

  function fact(icon, k, v, x) { return '<div class="fact"><div class="k">' + ic(icon) + k + '</div><div class="v">' + v + '</div>' + (x ? '<div class="x">' + x + '</div>' : '') + '</div>'; }
  function openDetail(id) {
    var d = byId[id]; if (!d) return;
    var same = DT.d === d && dlg.open;
    DT.d = d; if (!same) { DT.tab = 'genel'; DT.expCat = 'all'; DT.month = S.month; }
    var p = plugInfo(d.plug), fav = S.fav.has(d.id), inCmp = S.cmp.indexOf(d.id) >= 0;
    dlg.innerHTML = '<div class="dscroll" id="dScroll">' +
      '<div class="dhero" style="--c1:' + d.colors[0] + ';--c2:' + d.colors[1] + '">' +
        '<div class="dhero-top"><div class="dhero-id">' + flag(d.iso, 'lg') + '<div><h2 id="dTitle">' + esc(d.n) + '</h2><div class="sub">' + esc(d.c) + ' · ' + esc(REG[d.reg]) + '</div></div></div>' +
        '<div class="dacts">' +
          '<button type="button" class="gbtn" data-fav="' + d.id + '" aria-pressed="' + fav + '" aria-label="Favori">' + ic('heart') + '<span class="t">' + (fav ? 'Favoride' : 'Favori') + '</span></button>' +
          '<button type="button" class="gbtn" data-cmp="' + d.id + '" aria-pressed="' + inCmp + '" aria-label="Karşılaştır">' + ic('compare') + '<span class="t">' + (inCmp ? 'Kıyasta' : 'Kıyasla') + '</span></button>' +
          '<button type="button" class="gbtn" data-act="close" aria-label="Kapat">' + ic('x') + '</button>' +
        '</div></div>' +
        '<div style="display:flex;gap:16px;align-items:flex-end;justify-content:space-between;flex-wrap:wrap"><p class="hl">' + esc(d.hl) + '</p>' + stamp(d) + '</div>' +
      '</div>' +
      '<div class="facts">' +
        fact('plane', d.mode === 'ferry' ? 'Feribot' : 'Tahmini uçuş', travelText(d), dirLabel(d)) +
        fact('pass', 'Kalış', esc(d.stay), esc(vlabel(d)) + (d.kim ? ' · kimlikle' : '')) +
        fact('wallet', 'Günlük (orta)', money(d.day[1]), meter(d.lvl) + ' ' + LVL[d.lvl]) +
        fact('sun', 'En iyi aylar', bestMonths(d), MONTHS[S.month - 1] + ': ' + d.t[S.month - 1] + '°C, ' + SUIT[+d.s[S.month - 1]].toLocaleLowerCase('tr')) +
        fact('clock', 'Saat farkı', tzText(d), '') +
        fact('coins', 'Para birimi', esc(d.cur), '') +
        fact('chat', 'Dil', esc(d.lang), '') +
        fact('plug', 'Priz', esc(d.plug), p.text + ' · ' + p.volt) +
      '</div>' +
      '<div class="dtabs" role="tablist" aria-label="Ayrıntı bölümleri">' + TABS.map(function (t) {
        var n = t[0] === 'deneyim' ? d.exp.length : t[0] === 'festival' ? d.fest.length : 0;
        return '<button type="button" role="tab" id="tab-' + t[0] + '" aria-controls="dBody" data-dtab="' + t[0] + '" aria-selected="' + (DT.tab === t[0]) + '">' + t[1] + (n ? ' <span class="n">' + n + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="dbody" id="dBody" role="tabpanel"></div>' +
    '</div>';
    renderDTab();
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
    if (!same) { var sc = $('#dScroll'); if (sc) sc.scrollTop = 0; }
    Globe.select(d.id);
    document.title = d.n + ' · Vizesiz Rota';
  }
  function closeDetail() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', function () {
    DT.d = null; Globe.select(null); document.title = 'Vizesiz Rota';
    if (location.hash.indexOf('#ulke-') === 0) { history.replaceState(null, '', '#' + S.view); }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDetail(); });

  function renderDTab() {
    var d = DT.d; if (!d) return;
    $$('[data-dtab]', dlg).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.dtab === DT.tab)); });
    var body = $('#dBody'); body.setAttribute('aria-labelledby', 'tab-' + DT.tab);
    body.innerHTML = ({ genel: tabGenel, deneyim: tabDeneyim, festival: tabFestival, butce: tabButce, iklim: tabIklim, pratik: tabPratik })[DT.tab](d);
  }

  function tabGenel(d) {
    var f = formFor(d.iso);
    var visaBox = '<div class="box visa-box" style="--vc:var(--' + vcls(d) + ')">' +
      '<h4>' + ic('pass') + 'Giriş koşulları</h4>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap"><span class="pill ' + d.v + '">' + esc(vlabel(d)) + '</span>' + (d.kim ? '<span class="pill kim">' + ic('id', 'style="width:13px;height:13px"') + 'Kimlikle de girilir</span>' : '') + '<span class="pill dir">Kalış: ' + esc(d.stay) + '</span></div>' +
      '<p>' + esc(d.vn) + '</p>' +
      (f ? '<p><b>Varıştan önce:</b> ' + esc(f[2]) + ' — ' + esc(f[3]) + (f[4] ? ' · <a href="' + esc(f[4]) + '" target="_blank" rel="noopener">resmî site ↗</a>' : '') + '</p>' : '') +
      '<p style="font-size:12.5px;color:var(--muted)">Kurallar değişebilir; gitmeden önce <a href="' + MFA + '" target="_blank" rel="noopener">Dışişleri vize bilgisini ↗</a> kontrol et.</p></div>';
    var ula;
    if (d.mode === 'ferry') {
      ula = '<div class="box"><h4>' + ic('ship') + 'Ulaşım: feribot</h4><div class="ferry">' + d.ferry.map(function (r) { return '<div><span>' + esc(r[0]) + '</span><span aria-hidden="true">→</span><span>' + esc(r[1]) + '</span><span class="num">' + esc(r[2]) + '</span></div>'; }).join('') + '</div>' +
        '<p>Feribot gidiş-dönüş yaklaşık ' + money(d.fl[0]) + '–' + money(d.fl[1]) + ' (sezona göre). ' + esc(d.alt) + '.</p></div>';
    } else {
      ula = '<div class="box"><h4>' + ic('plane') + 'Ulaşım</h4>' +
        '<p><b class="num">IST → ' + esc(d.ap[0]) + '</b> · kuş uçuşu ' + nf0.format(Math.round(d.km / 10) * 10) + ' km</p>' +
        '<p>Tahmini direkt uçuş süresi <b>' + dur(d.fh) + '</b>. ' + (d.dir === 'y' ? 'İstanbul’dan direkt sefer var.' : d.dir === 'p' ? 'Seferler sınırlı ya da tek duraklı; toplam yolculuk ~' + dur(d.th) + '.' : 'Genellikle aktarmalı; toplam yolculuk ~' + dur(d.th) + '.') + '</p>' +
        (d.alt ? '<p>Diğer giriş noktaları: ' + esc(d.alt) + '</p>' : '') +
        '<p>Gidiş-dönüş ekonomi bilet: <b>' + money(d.fl[0]) + '–' + money(d.fl[1]) + '</b> <span style="color:var(--muted)">(tahmini, sezona göre değişir)</span></p></div>';
    }
    var bars = '<div class="box"><h4>' + ic('star') + 'Bu rota kimler için?</h4><div class="ibars">' + IKEY.map(function (k) {
      var v = score(d, k); return '<div class="ibar"><span>' + esc(ILAB[k]) + '</span><span class="tr"><i style="width:' + (v / 5 * 100) + '%"></i></span><span class="num">' + v + '/5</span></div>';
    }).join('') + '</div></div>';
    var next = nextFest(d);
    var top = '<div class="box"><h4>' + ic('macera') + 'Öne çıkanlar</h4><ul>' + d.exp.slice(0, 3).map(function (e) { return '<li><b>' + esc(e[0]) + '</b> — ' + esc(e[3]) + '</li>'; }).join('') + '</ul>' +
      '<button type="button" class="linkbtn" data-dtab="deneyim" style="justify-self:start">Tüm deneyimler (' + d.exp.length + ')</button>' +
      (next ? '<h4 style="margin-top:6px">' + ic('cal') + 'Sıradaki festival</h4><p><b>' + esc(next[0]) + '</b> · ' + festMonthsText(next[1]) + ' · ' + esc(next[2]) + '</p>' : '') + '</div>';
    return '<div class="dgrid">' + visaBox + ula + '</div><div class="dgrid">' + bars + top + '</div>';
  }
  function nextFest(d) {
    var best = null, bd = 99;
    d.fest.forEach(function (f) { f[1].forEach(function (m) { var dd = (m - CUR_M + 12) % 12; if (f[1].length < 12 && dd < bd) { bd = dd; best = f; } }); });
    return best;
  }
  function tabDeneyim(d) {
    var cats = []; d.exp.forEach(function (e) { if (cats.indexOf(e[1]) < 0) cats.push(e[1]); });
    var list = d.exp.filter(function (e) { return DT.expCat === 'all' || e[1] === DT.expCat; });
    return '<div class="chips">' + [['all', 'Tümü']].concat(cats.map(function (c) { return [c, ILAB[c]]; })).map(function (c) {
      return '<button type="button" class="chip" data-expcat="' + c[0] + '" aria-pressed="' + (DT.expCat === c[0]) + '">' + (c[0] !== 'all' ? ic(c[0]) : '') + esc(c[1]) + '</button>';
    }).join('') + '</div>' +
      '<div class="exps">' + list.map(function (e) {
        return '<div class="exp"><span class="cat"><span class="ico">' + ic(e[1]) + '</span>' + esc(ISHORT[e[1]]) + '</span><h5>' + esc(e[0]) + '</h5><span class="pl">' + ic('pin', 'style="width:13px;height:13px"') + esc(e[2]) + '</span><p>' + esc(e[3]) + '</p></div>';
      }).join('') + '</div>';
  }
  function tabFestival(d) {
    var on = {}; d.fest.forEach(function (f) { if (f[1].length < 12) f[1].forEach(function (m) { on[m] = 1; }); });
    var list = d.fest.slice().sort(function (a, b) { return (a[1].length === 12) - (b[1].length === 12) || a[1][0] - b[1][0]; });
    return '<div class="box" style="background:var(--surface)"><h4>' + ic('cal') + 'Yıl boyunca</h4><div class="timeline" aria-hidden="true">' + MON3.map(function (m, i) { return '<div class="' + (on[i + 1] ? 'on' : '') + (i + 1 === CUR_M ? ' cur' : '') + '">' + m + '</div>'; }).join('') + '</div></div>' +
      '<div class="fests">' + list.map(function (f) {
        return '<div class="fest"><div class="when">' + esc(festMonthsText(f[1])) + '</div><div><b>' + esc(f[0]) + '</b><span class="pl">' + esc(f[2]) + (f[4] ? ' · <span class="pill kural">Tarih her yıl değişir</span>' : '') + '</span><p>' + esc(f[3]) + '</p></div></div>';
      }).join('') + '</div>';
  }
  function tabButce(d) {
    var tiles = '<div class="tiles">' + [0, 1, 2].map(function (i) { return '<div class="tile"><div class="l">' + STYLE[i] + ' · günlük</div><div class="v">' + money(d.day[i]) + '</div><div class="x">' + moneyAlt(d.day[i]) + ' · kişi başı</div></div>'; }).join('') + '</div>';
    var rows = VRD.pxLabels.map(function (lab, i) {
      var a = d.px[i], b = VRD.istanbul[i], mx = Math.max(a, b) || 1, pct = b ? Math.round((a - b) / b * 100) : 0;
      var delta = a === 0 ? '<span class="delta down">ücretsiz</span>' : pct <= -5 ? '<span class="delta down">▼ %' + Math.abs(pct) + ' ucuz</span>' : pct >= 5 ? '<span class="delta up">▲ %' + pct + ' pahalı</span>' : '<span class="delta">≈ aynı</span>';
      return '<div class="cost-row"><div>' + esc(lab) + '</div><div class="cbars" title="' + esc(d.n) + ': ' + money(a) + ' · İstanbul: ' + money(b) + '"><i class="a" style="width:' + (a / mx * 100) + '%"></i><i class="b" style="width:' + (b / mx * 100) + '%"></i></div><div class="vals">' + money(a) + ' ' + delta + '<small>İstanbul ' + money(b) + '</small></div></div>';
    }).join('');
    var c = DT.calc, fl = (d.fl[0] + d.fl[1]) / 2;
    var flT = fl * c.people, stayT = d.day[c.style] * c.days * c.people, tot = flT + stayT;
    return '<div class="dgrid"><div class="box"><h4>' + ic('wallet') + 'Günlük harcama (kişi başı)</h4>' + tiles +
      '<p>Pahalılık: ' + meter(d.lvl) + ' <b>' + LVL[d.lvl] + '</b>. Konaklama (iki kişilik odayı paylaşarak), yeme-içme, şehir içi ulaşım ve birkaç giriş ücreti dahil.</p></div>' +
      '<div class="box calc"><h4>' + ic('coins') + 'Gezi bütçesi hesapla</h4>' +
        '<div class="field"><label for="cDays">Süre <output>' + c.days + ' gün</output></label><input id="cDays" type="range" min="2" max="30" value="' + c.days + '"></div>' +
        '<div class="frow" style="justify-content:space-between"><div class="field"><span class="lab">Kişi</span><div class="stepper"><button type="button" data-cstep="-1" aria-label="Kişi azalt">−</button><output>' + c.people + '</output><button type="button" data-cstep="1" aria-label="Kişi artır">+</button></div></div>' +
        '<div class="field"><span class="lab">Tarz</span><div class="seg" role="group" aria-label="Seyahat tarzı">' + STYLE.map(function (s, i) { return '<button type="button" data-cstyle="' + i + '" aria-pressed="' + (c.style === i) + '">' + s + '</button>'; }).join('') + '</div></div></div>' +
        '<div class="total"><div><div class="x">Toplam (' + c.people + ' kişi, ' + c.days + ' gün)</div><div class="v">' + money(tot) + '</div></div><div class="x" style="text-align:right">≈ ' + moneyAlt(tot) + '<br>Kişi başı ' + money(tot / c.people) + '</div></div>' +
        '<p style="font-size:12.5px;color:var(--muted)">' + (d.mode === 'ferry' ? 'Feribot' : 'Uçuş') + ' ~' + money(flT) + ' + günlük harcama ~' + money(stayT) + '. Bilet fiyatı tahmini ortalamadır.</p>' +
      '</div></div>' +
      '<div class="box" style="background:var(--surface)"><h4>' + ic('food') + 'Örnek fiyatlar: İstanbul ile kıyas</h4>' +
        '<div class="keyrow"><span><i style="background:var(--s1)"></i>' + esc(d.n) + '</span><span><i style="background:var(--line-2)"></i>İstanbul</span><span style="color:var(--muted)">Her satır kendi ölçeğinde</span></div>' +
        '<div>' + rows + '</div><p style="font-size:12.5px;color:var(--muted)">2026 için yaklaşık değerler; turistik bölgelerde daha yüksek olabilir.</p></div>';
  }
  function tabIklim(d) {
    var ts = d.t, lo = Math.floor((Math.min(0, Math.min.apply(null, ts)) - 1) / 10) * 10, hi = Math.ceil((Math.max.apply(null, ts) + 4) / 10) * 10;
    var span = hi - lo, pos = function (v) { return (hi - v) / span * 100; };
    var ticks = []; for (var v = lo; v <= hi; v += 10) ticks.push(v);
    var imax = ts.indexOf(Math.max.apply(null, ts)), imin = ts.indexOf(Math.min.apply(null, ts));
    var sel = DT.month - 1;
    var grid = ticks.map(function (t) { return '<div class="cl-g' + (t === 0 ? ' z' : '') + '" style="top:' + pos(t) + '%"><span>' + t + '°</span></div>'; }).join('');
    var cols = ts.map(function (t, i) {
      var s = +d.s[i], top = Math.min(pos(t), pos(0)), h = Math.abs(pos(t) - pos(0));
      var lab = (i === sel || i === imax || i === imin) ? '<span class="cl-v" style="top:calc(' + (t >= 0 ? top : top + h) + '% ' + (t >= 0 ? '- 18px' : '+ 2px') + ')">' + t + '°</span>' : '';
      return '<button type="button" class="cl-col' + (i === sel ? ' sel' : '') + '" data-cm="' + (i + 1) + '" aria-label="' + MONTHS[i] + ': ' + t + '°C, ' + SUIT[s] + '" title="' + MONTHS[i] + ': ' + t + '°C · ' + SUIT[s] + '"><span class="cl-plot"><i class="cl-b q' + s + (t < 0 ? ' neg' : '') + '" style="top:' + top + '%;height:max(2px,' + h + '%)"></i>' + lab + '</span><span class="cl-m">' + MON3[i] + '</span></button>';
    }).join('');
    var fs = festsIn(d, DT.month).filter(function (f) { return f[1].length < 12; });
    return '<div class="box" style="background:var(--surface)"><h4>' + ic('sun') + 'Aylık ortalama gündüz sıcaklığı · ' + esc(d.tc) + '</h4>' +
      '<div class="keyrow"><span><i style="background:var(--q2)"></i>İdeal</span><span><i style="background:var(--q1)"></i>Orta</span><span><i style="background:var(--q0)"></i>Önerilmez</span><span style="color:var(--muted)">Bir aya dokun, ayrıntısını gör</span></div>' +
      '<div class="clim"><div class="cl-grid">' + grid + '</div><div class="cl-cols">' + cols + '</div></div>' +
      '<p><b>' + MONTHS[sel] + ':</b> ' + ts[sel] + '°C, ' + SUIT[+d.s[sel]].toLocaleLowerCase('tr') + (fs.length ? ' · Festival: ' + fs.map(function (f) { return esc(f[0]); }).join(', ') : '') + '</p>' +
      '<p><b>En iyi dönem:</b> ' + bestMonths(d) + '</p>' +
      '<details><summary style="cursor:pointer;font-size:13px;color:var(--ink-2)">Tablo olarak gör</summary><div style="overflow-x:auto"><table class="formt" style="min-width:520px"><thead><tr><th>Ay</th>' + MON3.map(function (m) { return '<th>' + m + '</th>'; }).join('') + '</tr></thead><tbody><tr><td>°C</td>' + ts.map(function (t) { return '<td class="num">' + t + '</td>'; }).join('') + '</tr><tr><td>Durum</td>' + ts.map(function (t, i) { return '<td>' + SUIT[+d.s[i]] + '</td>'; }).join('') + '</tr></tbody></table></div></details></div>';
  }
  function tabPratik(d) {
    var p = plugInfo(d.plug), f = formFor(d.iso);
    return '<div class="dgrid">' +
      '<div class="box"><h4>' + ic('coins') + 'Para ve ödeme</h4><ul><li><b>Para birimi:</b> ' + esc(d.cur) + '</li><li>' + esc(d.pay) + '</li><li><b>Bahşiş:</b> ' + esc(d.tip) + '</li></ul></div>' +
      '<div class="box"><h4>' + ic('plug') + 'Elektrik, saat ve dil</h4><ul><li><b>Priz:</b> ' + esc(d.plug) + ' — ' + p.text + ' (' + p.volt + ')</li><li><b>Saat farkı:</b> ' + tzText(d) + '</li><li><b>Dil:</b> ' + esc(d.lang) + '</li></ul></div>' +
      '</div><div class="dgrid">' +
      '<div class="box"><h4>' + ic('check') + 'İpuçları</h4><ul class="flist">' + d.tips.map(function (t) { return '<li>' + ic('check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' + (f ? '<p><b>Ön kayıt:</b> ' + esc(f[2]) + ' — ' + esc(f[3]) + '</p>' : '') + '</div>' +
      '<div class="box"><h4>' + ic('phone') + 'Acil durumda</h4><p><b>Yerel acil hat:</b> <span class="num">' + esc(d.em) + '</span></p>' +
        '<p><b>Dışişleri Konsolosluk Çağrı Merkezi (7/24):</b></p><div class="copyline"><code>+90 312 292 29 29</code><button type="button" class="btn sm" data-copy="+90 312 292 29 29">Kopyala</button></div>' +
        '<h4 style="margin-top:6px">' + ic('food') + 'Yemeden dönme</h4><div class="chips food">' + d.food.map(function (x) { return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div></div>' +
      '</div>';
  }

  // ---------- PLANLAYICI ----------
  function planScore(d, P) {
    var m = P.month, s = +d.s[m - 1];
    var weather = s === 2 ? 1 : s === 1 ? 0.55 : 0.1;
    var ints = Array.from(P.ints);
    var iv = ints.length ? ints.reduce(function (a, k) { return a + score(d, k); }, 0) / (5 * ints.length) : 0.6;
    var fl = (d.fl[0] + d.fl[1]) / 2, cost = fl + d.day[P.style] * P.days;
    var fit = cost <= P.budget ? 1 : Math.max(0, 1 - (cost - P.budget) / P.budget * 1.6);
    var prox = Math.max(0, 1 - d.th / Math.max(P.maxH, 2) * 0.5);
    var sc = 0.34 * iv + 0.28 * weather + 0.24 * fit + 0.14 * prox + (festsIn(d, m).some(function (f) { return f[1].length < 12; }) ? 0.05 : 0) + (d.safe === 1 ? 0.02 : d.safe === 3 ? -0.06 : 0);
    if (P.days <= 5 && d.th > 6) sc -= 0.12;
    if (P.days <= 3 && d.th > 4) sc -= 0.12;
    return { sc: clamp(sc, 0, 1), cost: cost, s: s, iv: iv, fit: fit };
  }
  function renderPlanForm() {
    var P = S.plan;
    $('#pform').innerHTML =
      '<div class="field"><span class="lab">Ne zaman?</span><div class="months" role="group" aria-label="Ay">' + MON3.map(function (m, i) { return '<button type="button" data-pm="' + (i + 1) + '" aria-pressed="' + (P.month === i + 1) + '">' + m + '</button>'; }).join('') + '</div></div>' +
      '<div class="field"><label for="pDays">Süre <output id="pDaysO">' + P.days + ' gün</output></label><input id="pDays" type="range" min="2" max="21" value="' + P.days + '"></div>' +
      '<div class="frow" style="justify-content:space-between;align-items:end">' +
        '<div class="field"><span class="lab">Kişi sayısı</span><div class="stepper"><button type="button" data-pstep="-1" aria-label="Kişi azalt">−</button><output id="pPeople">' + P.people + '</output><button type="button" data-pstep="1" aria-label="Kişi artır">+</button></div></div>' +
        '<div class="field"><span class="lab">Tarz</span><div class="seg" role="group" aria-label="Seyahat tarzı">' + STYLE.map(function (s, i) { return '<button type="button" data-pstyle="' + i + '" aria-pressed="' + (P.style === i) + '">' + s + '</button>'; }).join('') + '</div></div>' +
      '</div>' +
      '<div class="field"><label for="pBudget">Kişi başı toplam bütçe <output id="pBudgetO">' + money(P.budget) + '</output></label><input id="pBudget" type="range" min="300" max="5000" step="50" value="' + P.budget + '"></div>' +
      '<div class="field"><label for="pH">Maks. yolculuk süresi <output id="pHO">' + (P.maxH >= 26 ? 'Sınırsız' : P.maxH + ' sa') + '</output></label><input id="pH" type="range" min="1" max="26" value="' + P.maxH + '"></div>' +
      '<div class="field"><span class="lab">İlgi alanların</span><div class="chips">' + IKEY.map(function (k) { return '<button type="button" class="chip" data-pint="' + k + '" aria-pressed="' + P.ints.has(k) + '">' + ic(k) + esc(ISHORT[k]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="field" style="gap:8px"><label class="toggle"><input type="checkbox" id="pKim"' + (P.kimOnly ? ' checked' : '') + '>Sadece kimlikle gidilenler</label><label class="toggle"><input type="checkbox" id="pDir"' + (P.directOnly ? ' checked' : '') + '>Sadece direkt uçuş</label></div>';
  }
  function renderPlanResults() {
    var P = S.plan;
    var pool = D.filter(function (d) { return (P.maxH >= 26 || d.th <= P.maxH) && (!P.kimOnly || d.kim) && (!P.directOnly || d.dir === 'y') && d.d >= P.days; });
    var ranked = pool.map(function (d) { return { d: d, r: planScore(d, P) }; }).sort(function (a, b) { return b.r.sc - a.r.sc; }).slice(0, 8);
    if (!ranked.length) { $('#presults').innerHTML = '<div class="empty"><strong>Bu tercihlere uyan rota yok.</strong><span>Yolculuk süresini artır ya da kimlik/direkt uçuş seçimini kaldır.</span></div>'; return; }
    $('#presults').innerHTML = '<p style="color:var(--muted);font-size:13.5px">' + pool.length + ' rota tercihlerine uydu; en yüksek uygunluk puanlı ' + ranked.length + ' tanesi aşağıda. Bütçe kişi başı, uçuş dahil.</p>' + ranked.map(function (x, i) {
      var d = x.d, r = x.r, m = P.month, pct = Math.round(r.sc * 100);
      var fs = festsIn(d, m).filter(function (f) { return f[1].length < 12; });
      var good = Array.from(P.ints).filter(function (k) { return score(d, k) >= 4; });
      var C = 2 * Math.PI * 26;
      return '<article class="pres"><div class="rank">' + (i + 1) + '</div>' +
        '<div class="main" style="min-width:0"><h3>' + flag(d.iso, 'sm') + esc(d.n) + ' <span class="pill ' + d.v + '">' + esc(vlabel(d)) + '</span>' + (d.kim ? '<span class="pill kim">Kimlikle</span>' : '') + '</h3>' +
          '<div class="why"><span>' + ic('sun') + MONTHS[m - 1] + ': ' + d.t[m - 1] + '°C, ' + SUIT[r.s].toLocaleLowerCase('tr') + '</span>' +
          '<span>' + ic('plane') + (d.mode === 'ferry' ? 'Feribotla kıyıdan' : dur(d.th) + (d.dir === 'y' ? ' · direkt' : ' · aktarmalı')) + '</span>' +
          (good.length ? '<span>' + ic('star') + good.map(function (k) { return ISHORT[k]; }).join(', ') + ' güçlü</span>' : '') +
          (fs.length ? '<span>' + ic('cal') + esc(fs[0][0]) + '</span>' : '') + '</div>' +
          '<div class="cost">Tahmini kişi başı <b>' + money(r.cost) + '</b> (' + (d.mode === 'ferry' ? 'feribot' : 'uçuş') + ' ~' + money((d.fl[0] + d.fl[1]) / 2) + ' + ' + money(d.day[P.style]) + ' × ' + P.days + ' gün) · ' + P.people + ' kişi: ' + money(r.cost * P.people) + (r.fit < 1 ? ' · <span style="color:var(--risk-ink)">bütçeyi aşıyor</span>' : '') + '</div></div>' +
        '<div class="ring" role="img" aria-label="Uygunluk %' + pct + '"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--raise)" stroke-width="6"/><circle cx="32" cy="32" r="26" fill="none" stroke="var(--brand)" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (C * pct / 100) + ' ' + C + '"/></svg><span class="t">%' + pct + '</span></div>' +
        '<div class="pres-acts"><button type="button" class="btn sm primary" data-open="' + d.id + '">Ayrıntılar</button><button type="button" class="btn sm" data-cmp="' + d.id + '" aria-pressed="' + (S.cmp.indexOf(d.id) >= 0) + '">' + ic('compare') + 'Karşılaştır</button></div>' +
        '</article>';
    }).join('');
  }

  // ---------- TAKVİM ----------
  function renderCalendar() {
    var m = S.calM;
    $('#mchips').innerHTML = MON3.map(function (x, i) { return '<button type="button" data-calm="' + (i + 1) + '" aria-pressed="' + (m === i + 1) + '">' + x + '</button>'; }).join('');
    $('#calH').textContent = MONTHS[m - 1] + ' festivalleri';
    var items = [];
    D.forEach(function (d) { d.fest.forEach(function (f) { if (f[1].indexOf(m) >= 0) items.push({ d: d, f: f }); }); });
    items.sort(function (a, b) { return (a.f[1].length === 12) - (b.f[1].length === 12) || a.d.th - b.d.th; });
    $('#fCountH').textContent = items.length + ' festival ve etkinlik';
    $('#flist').innerHTML = items.length ? items.map(function (x) {
      return '<button type="button" class="frow2" data-open="' + x.d.id + '">' + flag(x.d.iso) + '<div style="min-width:0"><b>' + esc(x.f[0]) + '</b><div class="meta">' + esc(x.d.n) + ' · ' + esc(x.f[2]) + ' · ' + esc(festMonthsText(x.f[1])) + (x.f[4] ? ' · tarih değişken' : '') + '</div><p>' + esc(x.f[3]) + '</p></div></button>';
    }).join('') : '<p style="color:var(--muted)">Bu ay için kayıtlı festival yok.</p>';
    var ideal = D.filter(function (d) { return d.s[m - 1] === '2'; }).sort(function (a, b) { return a.th - b.th; });
    $('#ideal').innerHTML = ideal.map(function (d) { return '<button type="button" data-open="' + d.id + '">' + flag(d.iso, 'sm') + esc(d.n) + ' <span class="num">' + d.t[m - 1] + '°</span></button>'; }).join('') || '<p style="color:var(--muted)">Bu ay için ideal rota bulunamadı.</p>';
    renderHeat();
  }
  var heatBuilt = false;
  function renderHeat() {
    var m = S.calM;
    $('#heatKey').innerHTML = '<span><i style="background:var(--q2)"></i>İdeal</span><span><i style="background:var(--q1)"></i>Orta</span><span><i style="background:var(--q0);opacity:.55"></i>Önerilmez</span><span><i style="background:var(--surface);box-shadow:inset 0 0 0 1.5px var(--ink);border-radius:50%;width:8px;height:8px"></i>Festival</span>';
    if (!heatBuilt) {
      var h = '<div></div>' + MON3.map(function (x, i) { return '<div class="h" data-hm="' + (i + 1) + '">' + x + '</div>'; }).join('');
      VRD.regions.forEach(function (r) {
        var ds = D.filter(function (d) { return d.reg === r[0]; }); if (!ds.length) return;
        h += '<div class="rg">' + esc(r[1]) + '</div>';
        ds.forEach(function (d) {
          h += '<button type="button" class="nm" data-open="' + d.id + '">' + flag(d.iso, 'sm') + '<span>' + esc(d.n) + '</span></button>';
          for (var i = 0; i < 12; i++) {
            var s = +d.s[i], fs = festsIn(d, i + 1).filter(function (f) { return f[1].length < 12; });
            h += '<div class="c v' + s + (fs.length ? ' f' : '') + '" data-hc="' + (i + 1) + '" title="' + esc(d.n + ' · ' + MONTHS[i] + ': ' + SUIT[s] + ', ' + d.t[i] + '°C' + (fs.length ? ' · ' + fs.map(function (f) { return f[0]; }).join(', ') : '')) + '"></div>';
          }
        });
      });
      $('#heat').innerHTML = h; heatBuilt = true;
    }
    $$('#heat [data-hc]').forEach(function (c) { c.classList.toggle('cur', +c.dataset.hc === m); });
    $$('#heat [data-hm]').forEach(function (c) { c.classList.toggle('cur', +c.dataset.hm === m); });
  }

  // ---------- KARŞILAŞTIR ----------
  var SER = ['var(--s1)', 'var(--s2)', 'var(--s3)'];
  function renderCompare() {
    var opts = D.slice().sort(function (a, b) { return a.n.localeCompare(b.n, 'tr'); });
    $('#cmpPick').innerHTML = [0, 1, 2].map(function (j) {
      return '<div class="field"><label for="cmp' + j + '"><span style="display:inline-flex;align-items:center;gap:8px"><i class="sw" style="background:' + SER[j] + '"></i>' + (j + 1) + '. rota</span></label><select id="cmp' + j + '" data-cmpsel="' + j + '"><option value="">— Seç —</option>' +
        opts.map(function (d) { return '<option value="' + d.id + '"' + (S.cmp[j] === d.id ? ' selected' : '') + '>' + esc(d.n) + '</option>'; }).join('') + '</select></div>';
    }).join('');
    var L = S.cmp.map(function (id) { return id ? byId[id] : null; });
    var act = L.filter(Boolean);
    // nokta grafiği (HTML)
    var dp = '<div class="keyrow" style="margin-bottom:10px">' + L.map(function (d, j) { return d ? '<span><i style="background:' + SER[j] + ';border-radius:50%;width:10px;height:10px"></i>' + esc(d.n) + '</span>' : ''; }).join('') + '</div>' +
      '<div class="dp"><div class="dp-row dp-ax"><span></span><div class="dp-t">' + [0, 1, 2, 3, 4, 5].map(function (v) { return '<span style="left:' + (v / 5 * 100) + '%">' + v + '</span>'; }).join('') + '</div></div>' +
      IKEY.map(function (k) {
        return '<div class="dp-row"><span class="dp-l">' + ic(k) + esc(ILAB[k]) + '</span><div class="dp-t">' + [0, 1, 2, 3, 4, 5].map(function (v) { return '<i class="dp-g" style="left:' + (v / 5 * 100) + '%"></i>'; }).join('') +
          L.map(function (d, j) { if (!d) return ''; var v = score(d, k); return '<b class="dp-d" style="left:' + (v / 5 * 100) + '%;top:calc(50% + ' + ((j - 1) * 9) + 'px);background:' + SER[j] + '" title="' + esc(d.n + ' · ' + ILAB[k] + ': ' + v + '/5') + '"></b>'; }).join('') + '</div></div>';
      }).join('') + '</div>';
    $('#dotplot').innerHTML = act.length ? dp : '<p style="color:var(--muted)">Karşılaştırmak için en az bir rota seç.</p>';
    if (!act.length) { $('#cmpTable').innerHTML = ''; return; }
    var m = S.month;
    function best(vals, low) { var f = vals.filter(function (v) { return v != null; }); var b = low ? Math.min.apply(null, f) : Math.max.apply(null, f); return function (v) { return act.length > 1 && v === b ? '<span class="best">' + (low ? 'en düşük' : 'en iyi') + '</span>' : ''; }; }
    var rows = [
      ['Giriş', function (d) { return '<span class="pill ' + d.v + '">' + esc(vlabel(d)) + '</span>' + (d.kim ? ' <span class="pill kim">Kimlikle</span>' : ''); }],
      ['Kalış süresi', function (d, b) { return esc(d.stay) + b(d.d); }, best(L.map(function (d) { return d && d.d; }), false)],
      ['Yolculuk', function (d, b) { return (d.mode === 'ferry' ? 'Feribot' : dur(d.fh) + ' · ' + (d.dir === 'y' ? 'direkt' : 'aktarmalı ~' + dur(d.th))) + b(d.th); }, best(L.map(function (d) { return d && d.th; }), true)],
      ['Günlük bütçe (orta)', function (d, b) { return '<span class="num">' + money(d.day[1]) + '</span>' + b(d.day[1]); }, best(L.map(function (d) { return d && d.day[1]; }), true)],
      ['Bilet (gidiş-dönüş)', function (d) { return '<span class="num">' + money(d.fl[0]) + '–' + money(d.fl[1]) + '</span>'; }],
      ['Pahalılık', function (d) { return meter(d.lvl) + ' ' + LVL[d.lvl]; }],
      ['Kahve · bira · otel', function (d) { return '<span class="num">' + money(d.px[0]) + ' · ' + money(d.px[3]) + ' · ' + money(d.px[5]) + '</span>'; }],
      [MONTHS[m - 1] + ' havası', function (d) { return d.t[m - 1] + '°C · ' + SUIT[+d.s[m - 1]]; }],
      ['En iyi aylar', function (d) { return bestMonths(d); }],
      ['Festival sayısı', function (d) { return d.fest.length + ' (' + d.fest.slice(0, 2).map(function (f) { return esc(f[0]); }).join(', ') + ')'; }],
      ['Güvenlik', function (d) { return ['', 'Çok güvenli', 'Genel olarak güvenli', 'Dikkatli olunmalı'][d.safe]; }],
      ['Saat farkı', function (d) { return tzText(d); }],
      ['Para · dil', function (d) { return esc(d.cur) + '<br><span style="color:var(--muted)">' + esc(d.lang) + '</span>'; }],
      ['Priz', function (d) { return esc(d.plug) + '<br><span style="color:var(--muted)">' + plugInfo(d.plug).text + '</span>'; }]
    ];
    $('#cmpTable').innerHTML = '<thead><tr><th></th>' + L.map(function (d, j) { return d ? '<th><div class="hd"><i class="sw" style="background:' + SER[j] + ';width:10px;height:10px;border-radius:50%;display:inline-block"></i>' + flag(d.iso, 'sm') + '<button type="button" class="linkbtn" style="color:var(--ink);text-decoration:none;font-size:16px" data-open="' + d.id + '">' + esc(d.n) + '</button></div></th>' : ''; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + L.map(function (d) { return d ? '<td>' + r[1](d, r[2] || function () { return ''; }) + '</td>' : ''; }).join('') + '</tr>'; }).join('') + '</tbody>';
  }
  function toggleCmp(id) {
    var i = S.cmp.indexOf(id);
    if (i >= 0) { S.cmp[i] = ''; toast(byId[id].n + ' karşılaştırmadan çıkarıldı.'); }
    else {
      var e = S.cmp.indexOf('');
      if (e < 0) { S.cmp.shift(); S.cmp.push(id); } else S.cmp[e] = id;
      toast(byId[id].n + ' karşılaştırmaya eklendi.');
    }
    S.cmpTouched = true;
    lsSet('vr-cmp', S.cmp);
    refreshCmpButtons(); renderTray();
    if (S.view === 'karsilastir') renderCompare();
  }
  function refreshCmpButtons() {
    $$('[data-cmp]').forEach(function (b) {
      var on = S.cmp.indexOf(b.dataset.cmp) >= 0; b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('gbtn')) b.innerHTML = ic('compare') + '<span class="t">' + (on ? 'Kıyasta' : 'Kıyasla') + '</span>';
    });
  }
  function renderTray() {
    var tray = $('#cmpTray'), ids = S.cmp.filter(Boolean);
    if (!S.cmpTouched || !ids.length || S.view === 'karsilastir') { tray.hidden = true; return; }
    tray.innerHTML = '<span class="flags">' + ids.map(function (id) { return flag(byId[id].iso); }).join('') + '</span><span>' + ids.length + '/3</span><a href="#karsilastir">Karşılaştır</a>';
    tray.hidden = false;
  }

  // ---------- HAZIRLIK ----------
  function renderPrep() {
    var total = 0, done = 0;
    VRD.checklist.forEach(function (g) { g[1].forEach(function (it) { total++; if (S.check.has(it[0])) done++; }); });
    var pct = Math.round(done / total * 100);
    var kimlik = D.filter(function (d) { return d.kim; });
    $('#prep').innerHTML =
      '<div style="display:grid;gap:18px;min-width:0">' +
        '<div class="panel"><h3>' + ic('check') + 'Hazırlık listem</h3><div class="prog" style="margin:10px 0 14px"><div class="bar"><i style="width:' + pct + '%"></i></div><span class="num" style="font-weight:700">' + done + '/' + total + '</span><button type="button" class="linkbtn" data-act="chkreset">Sıfırla</button></div>' +
          '<div class="chk">' + VRD.checklist.map(function (g) { return '<div><h4>' + esc(g[0]) + '</h4>' + g[1].map(function (it) { return '<label><input type="checkbox" data-chk="' + it[0] + '"' + (S.check.has(it[0]) ? ' checked' : '') + '><span>' + esc(it[1]) + '</span></label>'; }).join('') + '</div>'; }).join('') + '</div></div>' +
        '<div class="panel"><h3>' + ic('info') + 'Varıştan önce doldurulan formlar</h3><p>Vizesiz ülkelerin bir kısmı da online ön kayıt istiyor. Yalnızca resmî sitelerden başvur; aracı siteler ek ücret alır.</p>' +
          '<div style="overflow-x:auto"><table class="formt"><thead><tr><th>Ülke</th><th>Ne gerekiyor?</th><th>Ne zaman · ücret</th><th>Resmî site</th></tr></thead><tbody>' +
          VRD.forms.map(function (f) { return '<tr><td><span style="display:inline-flex;gap:8px;align-items:center">' + flag(f[0], 'sm') + esc(f[1]) + '</span></td><td>' + esc(f[2]) + '</td><td>' + esc(f[3]) + '</td><td>' + (f[4] ? '<a href="' + esc(f[4]) + '" target="_blank" rel="noopener">' + esc(f[4].replace(/^https?:\/\//, '').split('/')[0]) + ' ↗</a>' : '—') + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '</div>' +
      '<div style="display:grid;gap:18px;min-width:0">' +
        '<div class="panel"><h3>' + ic('coins') + 'Yurt dışı çıkış harcı · 2026</h3><div class="big" style="margin:8px 0">' + nf0.format(VRD.exitFee) + ' ₺</div>' +
          '<ul class="flist"><li>' + ic('check') + '<span>GİB Dijital Vergi Dairesi, mobil uygulama, banka, PTT veya havalimanı kiosklarından ödenir.</span></li><li>' + ic('check') + '<span>7 yaşından küçükler muaf; KKTC’ye kimlikle gidişte alınmaz.</span></li><li>' + ic('check') + '<span>Ödeme pasaporta işlenmez, sisteme kaydolur; dekontu sakla.</span></li></ul></div>' +
        '<div class="panel"><h3>' + ic('id') + 'Pasaport yerine kimlikle</h3><p>Yalnızca çipli yeni nesil T.C. kimlik kartıyla.</p><div class="rlist">' +
          kimlik.map(function (d) { return '<div class="ritem">' + flag(d.iso, 'sm') + '<div><b>' + esc(d.n) + '</b> <span class="vv">· ' + esc(d.stay) + '</span></div></div>'; }).join('') +
          '<div class="ritem">' + flag('UA', 'sm') + '<div><b>Ukrayna</b> <span class="vv">· savaş nedeniyle önerilmiyor</span></div></div></div></div>' +
        '<div class="panel"><h3>' + ic('pass') + 'Pasaport kuralları</h3><ul class="flist"><li>' + ic('check') + '<span>Çoğu ülke dönüş tarihinden itibaren en az 6 ay geçerlilik ister.</span></li><li>' + ic('check') + '<span>Yunan adalarında (Schengen) ayrılıştan sonra en az 3 ay geçerlilik yeterli.</span></li><li>' + ic('check') + '<span>Güney Afrika en az 2 boş sayfa ister; diğerlerinde de 2 boş sayfa bırak.</span></li></ul></div>' +
        '<div class="panel"><h3>' + ic('phone') + 'Acil durumda</h3><p>Dışişleri Konsolosluk Çağrı Merkezi 7 gün 24 saat açık.</p><div class="copyline"><code>+90 312 292 29 29</code><button type="button" class="btn sm" data-copy="+90 312 292 29 29">Kopyala</button></div>' +
          '<p style="margin-top:10px"><a href="https://www.mfa.gov.tr/yurt-disina-seyahat-edeceklere-konsolosluk-rehberi.tr.mfa" target="_blank" rel="noopener">Yurt dışına seyahat edeceklere konsolosluk rehberi ↗</a></p></div>' +
        '<div class="panel"><h3>' + ic('wallet') + 'Döviz kuru</h3><p>Tutarlar euro bazlıdır; ₺ gösterimi bu kurla hesaplanır.</p><div class="field"><label for="rate">1 € = ? ₺</label><input id="rate" type="number" inputmode="decimal" min="1" step="0.01" value="' + S.rate + '" style="height:40px;border-radius:10px;border:1px solid var(--line-2);background:var(--surface);padding:0 12px;font-family:var(--font-mono);font-weight:700;max-width:180px"></div><p style="font-size:12.5px;color:var(--muted)">Varsayılan: 16 Kasım 2026 kuru ' + nf2.format(VRD.eurTry) + ' ₺.</p></div>' +
      '</div>' +
      '<div class="panel" style="grid-column:1/-1"><h3>' + ic('link') + 'Kaynaklar</h3><p>Vize bilgileri aşağıdaki kaynaklardan derlendi; fiyat, iklim ve deneyim bilgileri genel seyahat bilgisine dayanan tahminlerdir.</p><ul class="src" style="display:grid;gap:6px;padding-left:18px;margin:0">' +
        VRD.sources.map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + ' ↗</a></li>'; }).join('') + '</ul></div>';
  }

  // ---------- görünümler ve yönlendirme ----------
  var VIEWS = ['kesfet', 'planla', 'takvim', 'karsilastir', 'hazirlik'];
  var rendered = {};
  function showView(v) {
    var changed = S.view !== v;
    S.view = v;
    VIEWS.forEach(function (x) { $('#v-' + x).hidden = x !== v; });
    $$('[data-view]').forEach(function (a) { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (v === 'planla') { if (!rendered.planla) { renderPlanForm(); rendered.planla = 1; } renderPlanResults(); }
    if (v === 'takvim') renderCalendar();
    if (v === 'karsilastir') renderCompare();
    if (v === 'hazirlik') renderPrep();
    renderTray();
    if (changed) window.scrollTo(0, 0);
  }
  function route() {
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (h.indexOf('ulke-') === 0) {
      var id = h.slice(5);
      if (byId[id]) { if (!rendered.view) { showView(S.view); rendered.view = 1; } openDetail(id); return; }
    }
    if (dlg.open) dlg.close();
    showView(VIEWS.indexOf(h) >= 0 ? h : 'kesfet');
    rendered.view = 1;
  }

  // ---------- bildirim ----------
  var toastT = 0;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function renderMoneyEverywhere() {
    $$('.cur button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cur === S.cur)); });
    renderFilters(); renderResults();
    if (S.view === 'planla') { renderPlanForm(); renderPlanResults(); }
    if (S.view === 'karsilastir') renderCompare();
    if (DT.d && dlg.open) openDetail(DT.d.id);
  }

  // ---------- olaylar ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'); if (!t) return;
    var ds = t.dataset;
    if (ds.quick) { var q = QUICK.filter(function (x) { return x.id === ds.quick; })[0]; q.act(!q.on()); applyFilters(true); return; }
    if (ds.reg) { S.reg = ds.reg; applyFilters(); return; }
    if (ds.visa) { S.visa.has(ds.visa) ? S.visa.delete(ds.visa) : S.visa.add(ds.visa); applyFilters(); return; }
    if (ds.int) { S.ints.has(ds.int) ? S.ints.delete(ds.int) : S.ints.add(ds.int); applyFilters(); return; }
    if (ds.layout) { S.layout = ds.layout; lsSet('vr-layout', S.layout); renderResults(); return; }
    if (ds.fav) {
      var id = ds.fav;
      if (S.fav.has(id)) { S.fav.delete(id); toast(byId[id].n + ' favorilerden çıkarıldı.'); } else { S.fav.add(id); toast(byId[id].n + ' favorilere eklendi.'); }
      lsSet('vr-fav', Array.from(S.fav));
      $$('[data-fav="' + id + '"]').forEach(function (b) { var on = S.fav.has(id); b.setAttribute('aria-pressed', String(on)); if (b.classList.contains('gbtn')) b.innerHTML = ic('heart') + '<span class="t">' + (on ? 'Favoride' : 'Favori') + '</span>'; });
      renderQuick(); if (S.favOnly) renderResults();
      return;
    }
    if (ds.cmp) { toggleCmp(ds.cmp); return; }
    if (ds.open) { e.preventDefault(); location.hash = 'ulke-' + ds.open; return; }
    if (ds.dtab) { DT.tab = ds.dtab; renderDTab(); var sc = $('#dScroll'), tb = $('.dtabs', dlg); if (sc && tb && sc.scrollTop > tb.offsetTop) sc.scrollTop = tb.offsetTop; return; }
    if (ds.expcat) { DT.expCat = ds.expcat; renderDTab(); return; }
    if (ds.cm) { DT.month = +ds.cm; renderDTab(); return; }
    if (ds.cstep) { DT.calc.people = clamp(DT.calc.people + +ds.cstep, 1, 6); renderDTab(); return; }
    if (ds.cstyle != null && ds.cstyle !== '') { DT.calc.style = +ds.cstyle; renderDTab(); return; }
    if (ds.pm) { S.plan.month = +ds.pm; $$('[data-pm]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); renderPlanResults(); return; }
    if (ds.pstep) { S.plan.people = clamp(S.plan.people + +ds.pstep, 1, 6); $('#pPeople').textContent = S.plan.people; renderPlanResults(); return; }
    if (ds.pstyle != null && ds.pstyle !== '') { S.plan.style = +ds.pstyle; $$('[data-pstyle]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); renderPlanResults(); return; }
    if (ds.pint) { var P = S.plan; P.ints.has(ds.pint) ? P.ints.delete(ds.pint) : P.ints.add(ds.pint); t.setAttribute('aria-pressed', String(P.ints.has(ds.pint))); renderPlanResults(); return; }
    if (ds.calm) { S.calM = +ds.calm; renderCalendar(); return; }
    if (ds.cur) { S.cur = ds.cur; lsSet('vr-cur', S.cur); renderMoneyEverywhere(); return; }
    if (ds.copy) {
      var txt = ds.copy;
      try { navigator.clipboard.writeText(txt).then(function () { toast('Kopyalandı: ' + txt); }, function () { selectCode(t); }); } catch (er) { selectCode(t); }
      return;
    }
    if (ds.act === 'reset') { S.reg = 'all'; S.visa = new Set(); S.ints = new Set(); S.maxH = 26; S.maxDay = 320; S.idealOnly = S.festOnly = S.directOnly = S.favOnly = false; S.q = ''; $('#q').value = ''; applyFilters(); return; }
    if (ds.act === 'ftoggle') { S.filtersOpen = !S.filtersOpen; renderFilters(); return; }
    if (ds.act === 'close') { closeDetail(); return; }
    if (ds.act === 'chkreset') { S.check = new Set(); lsSet('vr-check', []); renderPrep(); return; }
  });
  function selectCode(btn) {
    var code = btn.parentElement && btn.parentElement.querySelector('code');
    if (code) { var r = document.createRange(); r.selectNodeContents(code); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
    toast('Numara seçildi; kopyalamak için kısayolu kullan.');
  }
  // kalkış panosu satırı
  document.addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-row]'); if (!tr || e.target.closest('button')) return;
    location.hash = 'ulke-' + tr.dataset.row;
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'q') { S.q = t.value; renderFilters(); renderResults(); return; }
    if (t.id === 'fH') { S.maxH = +t.value; t.previousElementSibling.querySelector('output').textContent = S.maxH >= 26 ? 'Sınırsız' : S.maxH + ' sa'; renderResults(); return; }
    if (t.id === 'fB') { S.maxDay = +t.value; t.previousElementSibling.querySelector('output').textContent = S.maxDay >= 320 ? 'Sınırsız' : money(S.maxDay); renderResults(); return; }
    if (t.id === 'pDays') { S.plan.days = +t.value; $('#pDaysO').textContent = t.value + ' gün'; renderPlanResults(); return; }
    if (t.id === 'pBudget') { S.plan.budget = +t.value; $('#pBudgetO').textContent = money(S.plan.budget); renderPlanResults(); return; }
    if (t.id === 'pH') { S.plan.maxH = +t.value; $('#pHO').textContent = S.plan.maxH >= 26 ? 'Sınırsız' : t.value + ' sa'; renderPlanResults(); return; }
    if (t.id === 'cDays') { DT.calc.days = +t.value; renderDTab(); var r = $('#cDays'); if (r) r.focus(); return; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'fMonth') { S.month = +t.value; applyFilters(); return; }
    if (t.id === 'fIdeal') { S.idealOnly = t.checked; applyFilters(); return; }
    if (t.id === 'fFest') { S.festOnly = t.checked; applyFilters(); return; }
    if (t.id === 'fDir') { S.directOnly = t.checked; applyFilters(); return; }
    if (t.id === 'fFav') { S.favOnly = t.checked; applyFilters(); return; }
    if (t.id === 'sort') { S.sort = t.value; renderResults(); return; }
    if (t.id === 'pKim') { S.plan.kimOnly = t.checked; renderPlanResults(); return; }
    if (t.id === 'pDir') { S.plan.directOnly = t.checked; renderPlanResults(); return; }
    if (t.dataset && t.dataset.cmpsel != null) { S.cmp[+t.dataset.cmpsel] = t.value; lsSet('vr-cmp', S.cmp); renderCompare(); return; }
    if (t.dataset && t.dataset.chk) { if (t.checked) S.check.add(t.dataset.chk); else S.check.delete(t.dataset.chk); lsSet('vr-check', Array.from(S.check)); renderPrep(); return; }
    if (t.id === 'rate') { var v = parseFloat(String(t.value).replace(',', '.')); if (v > 1 && v < 1000) { S.rate = v; lsSet('vr-rate', v); toast('Kur güncellendi: 1 € = ' + nf2.format(v) + ' ₺'); renderMoneyEverywhere(); } return; }
  });
  $('#q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyFilters(true); } });
  window.addEventListener('hashchange', route);

  // ---------- başlat ----------
  renderHero(); renderNews(); renderFilters(); renderResults(); renderSide();
  $$('.cur button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cur === S.cur)); });
  try { Globe.init(); } catch (err) { $('#globeBox').insertAdjacentHTML('beforeend', '<div class="gfail">Harita başlatılamadı. Diğer tüm bölümler çalışıyor.</div>'); }
  renderResults();
  route();
})();
