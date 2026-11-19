/* Vizesiz Rota — sabit bilgiler, güncel değişiklikler ve yardımcı listeler.
   Derleme tarihi: 19 Kasım 2026. Vize kuralları değişebilir; seyahat öncesi resmi kaynaktan teyit edin. */
window.VR = {
  updated: '19 Kasım 2026',
  eurTry: 55.6, // 16 Kasım 2026 EUR/TRY (bigpara); arayüzden değiştirilebilir
  exitFee: 1250, // 2026 yurt dışı çıkış harcı (TL)
  dest: [],
  add: function () { for (var i = 0; i < arguments.length; i++) this.dest.push(arguments[i]); },

  regions: [
    ['avrupa', 'Balkanlar & Avrupa'],
    ['kafkas', 'Kafkasya & Orta Asya'],
    ['dogu-asya', 'Doğu Asya'],
    ['gd-asya', 'Güneydoğu Asya'],
    ['guney-asya', 'Güney Asya & Okyanusya'],
    ['orta-dogu', 'Orta Doğu'],
    ['afrika', 'Afrika & Hint Okyanusu'],
    ['g-amerika', 'Güney Amerika'],
    ['o-amerika', 'Orta Amerika & Karayipler']
  ],

  // ilgi alanı puanları (i alanı) bu sırayla 0–5 arası kodlanır
  interests: [
    ['doga', 'Doğa & manzara'],
    ['kultur', 'Tarih & kültür'],
    ['plaj', 'Deniz & plaj'],
    ['gastro', 'Gastronomi'],
    ['gece', 'Gece hayatı'],
    ['macera', 'Macera & aktivite'],
    ['sehir', 'Şehir & alışveriş'],
    ['kis', 'Kış & kayak']
  ],

  visa: {
    free: { label: 'Vizesiz', stamp: 'VİZESİZ' },
    voa: { label: 'Kapıda vize', stamp: 'KAPIDA VİZE' },
    eta: { label: 'Online izin (ETA)', stamp: 'ONLINE İZİN' },
    evisa: { label: 'e-Vize', stamp: 'E-VİZE' }
  },

  // İstanbul referans fiyatları (EUR, Kasım 2026 tahmini) — px sırasıyla
  pxLabels: ['Kahve (kapuçino)', 'Ucuz restoranda öğün', 'Orta restoranda akşam yemeği (kişi)', 'Bira (0,5 L, barda)', 'Toplu taşıma (tek biniş)', 'Orta seviye otel (2 kişilik oda/gece)'],
  istanbul: [3.1, 9, 30, 4.8, 0.75, 100],

  news: [
    { d: '1 Kasım 2026', k: 'kisit', iso: 'ME', t: 'Karadağ artık vize istiyor', x: 'AB vize politikasına uyum kapsamında bordo pasaport sahipleri Karadağ’a ancak Karadağ vizesi veya geçerli Schengen vizesiyle girebiliyor.', src: 'https://tr.euronews.com/2026/09/26/karadag-ab-uyelik-sureci-kapsaminda-turk-vatandaslarina-1-kasimdan-itibaren-vize-uygulayac' },
    { d: '15 Eylül 2026', k: 'kisit', iso: 'TH', t: 'Tayland’da vizesiz kalış 30 güne indi', x: '60 günlük program kaldırıldı. Türkiye yeni 60 ülkelik listede; kalış süresi 30 gün. Varıştan önce TDAC dijital varış kartı zorunlu.', src: 'https://en.thairath.co.th/news/local/2956797' },
    { d: '25 Mayıs 2026', k: 'kolay', iso: 'LK', t: 'Sri Lanka ETA ücreti kaldırıldı', x: 'Türkiye’nin de aralarında olduğu 40 ülke için 30 günlük turist ETA’sı ücretsiz. Online başvuru hâlâ zorunlu.', src: 'https://www.adaderana.lk/news.php?nid=122919' },
    { d: '31 Mart 2026', k: 'kolay', iso: 'GR', t: 'Yunan adalarında kapı vizesi bir yıl uzadı', x: '12 Ege adasında 7 günlük ekspres vize sürüyor. Başvuru feribot şirketi veya acente üzerinden yapılıyor.', src: 'https://tr.euronews.com/2026/03/31/yunanistan-turklere-yonelik-kapida-vize-programini-1-yil-daha-uzatti' },
    { d: '1 Ocak 2026', k: 'kural', iso: 'GE', t: 'Gürcistan’da seyahat sigortası zorunlu', x: 'Kimlik veya pasaportla giren herkes için en az 30.000 GEL teminatlı sağlık ve kaza sigortası isteniyor.', src: 'https://www.interpressnews.ge/en/article/147168-georgia-introduces-mandatory-travel-insurance-for-all-foreign-visitors-in-2026/' },
    { d: '1 Ocak 2026', k: 'kural', iso: 'TR', t: 'Yurt dışı çıkış harcı 1.250 TL', x: 'GİB Dijital Vergi Dairesi, banka, PTT ya da havalimanı kiosklarından ödenebilir. 7 yaş altı muaf.', src: 'https://www.turkiyesigorta.com.tr/blog/seyahat/yurt-disi-cikis-harci-ne-kadar' },
    { d: 'Aralık 2025', k: 'kolay', iso: 'OM', t: 'Umman’a vizesiz giriş', x: 'Karşılıklı muafiyet anlaşmasıyla her ziyarette 30 güne kadar vizesiz kalınabiliyor.', src: 'https://gazeteoksijen.com/turkiye/turk-vatandaslari-bir-ulkeye-daha-vizesiz-seyahat-edebilecek-260486' },
    { d: 'Temmuz 2025', k: 'kolay', iso: 'ID', t: 'Endonezya (Bali) vizesiz oldu', x: 'Turizm, iş ve tedavi amaçlı 30 günlük vizesiz giriş. Süre uzatılamıyor.', src: 'https://www.aa.com.tr/en/asia-pacific/indonesia-grants-visa-free-entry-to-turkish-citizens/3620893' }
  ],

  // Vizesiz/kolay giriş olan ama şu an seyahatin önerilmediği yerler
  risk: [
    { iso: 'UA', n: 'Ukrayna', v: 'Vizesiz 90 gün · kimlikle', why: 'Savaş sürüyor, sivil hava sahası kapalı. Dışişleri seyahat uyarısı geçerli.' },
    { iso: 'IR', n: 'İran', v: 'Vizesiz', why: 'Dışişleri 2026’da acil olmayan seyahatlerin ertelenmesini önerdi; güvenlik durumu hassas.' },
    { iso: 'LB', n: 'Lübnan', v: 'Ücretsiz kapıda vize', why: 'Güney bölgelerde süren saldırılar; ani güvenlik değişikliklerine açık.' },
    { iso: 'IL', n: 'İsrail', v: 'Vizesiz (ETA-IL gerekli)', why: 'Bölgesel çatışma ortamı; Türkiye’den direkt sefer yok.' },
    { iso: 'VE', n: 'Venezuela', v: 'Vizesiz 90 gün', why: 'Siyasi kriz, yüksek suç oranı ve sınırlı konsolosluk desteği.' },
    { iso: 'HT', n: 'Haiti', v: 'Vizesiz', why: 'Silahlı çete şiddeti; başkent ve havalimanı çevresi çok riskli.' }
  ],

  // Sık sorulan ama bordo pasaportla vize gereken yerler
  needVisa: [
    ['EU', 'Schengen ülkeleri', 'Yunanistan anakarası, İtalya, İspanya, Fransa…'],
    ['ME', 'Karadağ', '1 Kasım 2026’dan beri vize gerekli'],
    ['GB', 'Birleşik Krallık', 'Ziyaretçi vizesi'],
    ['US', 'ABD', 'B1/B2 vizesi; aktarmada da gerekir'],
    ['CA', 'Kanada', 'Ziyaretçi vizesi'],
    ['AE', 'BAE (Dubai)', 'Önceden vize gerekir'],
    ['CN', 'Çin', 'Türkiye 2026’da tek taraflı muafiyet verdi; Çin henüz vermedi'],
    ['MX', 'Meksika', 'ABD/Schengen/İngiltere vizesi olanlara istisna var'],
    ['CY', 'Kıbrıs Cumhuriyeti', 'Güney Kıbrıs için ulusal vize'],
    ['AU', 'Avustralya', 'Ziyaretçi vizesi'],
    ['SA', 'Suudi Arabistan', 'Online e-vize ile gidilebiliyor']
  ],

  // Varıştan önce doldurulan formlar / ön izinler
  forms: [
    ['KR', 'Güney Kore', 'K-ETA', 'Uçuştan en az 72 saat önce · ~10.000 KRW', 'https://www.k-eta.go.kr'],
    ['TH', 'Tayland', 'TDAC dijital varış kartı', 'Varıştan önceki 3 gün içinde · ücretsiz', 'https://tdac.immigration.go.th'],
    ['MY', 'Malezya', 'MDAC dijital varış kartı', 'Varıştan önceki 3 gün içinde · ücretsiz', 'https://imigresen-online.imi.gov.my/mdac/main'],
    ['SG', 'Singapur', 'SG Arrival Card', 'Varıştan önceki 3 gün içinde · ücretsiz', 'https://eservices.ica.gov.sg/sgarrivalcard/'],
    ['ID', 'Endonezya (Bali)', 'Bali turist vergisi + gümrük beyanı', '150.000 IDR · online ödenebilir', 'https://lovebali.baliprov.go.id'],
    ['PH', 'Filipinler', 'eTravel kaydı', 'Varıştan önceki 72 saat içinde · ücretsiz', 'https://etravel.gov.ph'],
    ['MV', 'Maldivler', 'IMUGA yolcu beyanı', 'Varıştan önceki 96 saat içinde · ücretsiz', 'https://imuga.immigration.gov.mv'],
    ['LK', 'Sri Lanka', 'ETA', 'Online · 2026’dan beri ücretsiz', 'https://www.eta.gov.lk'],
    ['VN', 'Vietnam', 'e-Vize', '25 $ tek giriş · 90 güne kadar · yalnızca resmi siteden', 'https://evisa.gov.vn'],
    ['KH', 'Kamboçya', 'e-Vize (veya kapıda vize)', '~36 $ online · kapıda 30 $', 'https://www.evisa.gov.kh'],
    ['KE', 'Kenya', 'eTA', 'Seyahatten en az 3 gün önce · ~30 $ + hizmet bedeli', 'https://www.etakenya.go.ke'],
    ['TZ', 'Tanzanya / Zanzibar', 'e-Vize + Zanzibar sigortası', '50 $ vize · Zanzibar için zorunlu sigorta ~44 $', 'https://visa.immigration.go.tz'],
    ['EG', 'Mısır', 'Kapıda vize', '25 $ · 30 gün; yalnızca Güney Sina’da 15 güne kadar ücretsiz damga', 'https://visa2egypt.gov.eg'],
    ['NP', 'Nepal', 'Kapıda vize', '15 gün 30 $ · 30 gün 50 $ · 90 gün 125 $', ''],
    ['SC', 'Seyşeller', 'Seyahat izni (Travel Authorisation)', 'Uçuştan önce online · küçük ücret', 'https://seychelles.govtas.com'],
    ['GE', 'Gürcistan', 'Zorunlu seyahat sigortası', 'En az 30.000 GEL teminat · İngilizce/Gürcüce poliçe', ''],
    ['GR', 'Yunan adaları', 'Ekspres ada vizesi', 'Feribot şirketi/acente ile ~7 gün önce · ~60 € harç', ''],
    ['EC', 'Ekvador (Galapagos)', 'Galapagos giriş ücreti', '200 $ park ücreti + 20 $ geçiş kartı', '']
  ],

  checklist: [
    ['Belgeler', [
      ['pas6', 'Pasaportun dönüş tarihinden sonra en az 6 ay geçerli ve 2 boş sayfası var'],
      ['kimlik', 'Kimlikle gidiyorsan çipli yeni nesil T.C. kimlik kartın yanında'],
      ['bilet', 'Dönüş bileti ve konaklama rezervasyonu telefonda ve çıktı olarak hazır'],
      ['form', 'Hedef ülkenin ön kaydı/izni tamam (K-ETA, TDAC, MDAC, ETA, IMUGA…)'],
      ['sigorta', 'Seyahat sağlık sigortası alındı (Gürcistan’da zorunlu)']
    ]],
    ['Para', [
      ['harc', 'Yurt dışı çıkış harcı ödendi (2026: 1.250 TL, 7 yaş altı muaf)'],
      ['kart', 'Kartların yurt dışı ve internet kullanımı açık, limitler kontrol edildi'],
      ['nakit', 'Yedek nakit EUR/USD var (Rusya’da Türk kartları çalışmıyor)'],
      ['doviz', 'Komisyonsuz döviz kartı veya çoklu para birimi hesabı hazır']
    ]],
    ['İletişim', [
      ['esim', 'eSIM ya da yurt dışı paketi alındı, veri dolaşımı ayarlandı'],
      ['harita', 'Çevrimdışı harita ve çeviri uygulaması indirildi'],
      ['priz', 'Gerekirse priz adaptörü çantada (Japonya, G tipi ülkeler…)'],
      ['kopya', 'Pasaport ve sigorta poliçesinin kopyası bulutta']
    ]],
    ['Sağlık & güvenlik', [
      ['asi', 'Gerekli aşılar yapıldı (sarı humma, hepatit vb. için hudut sağlık aşı merkezleri)'],
      ['ilac', 'Düzenli ilaçlar reçetesiyle birlikte el bagajında'],
      ['uyari', 'Dışişleri seyahat uyarıları kontrol edildi'],
      ['konsolos', 'Konsolosluk Çağrı Merkezi (+90 312 292 29 29) telefona kaydedildi']
    ]],
    ['Dönüş', [
      ['imei', 'Yurt dışından telefon alacaksan IMEI kaydını 120 gün içinde yaptıracağını biliyorsun'],
      ['gumruk', 'Gümrük muafiyet limitleri (sigara, alkol, parfüm) kontrol edildi']
    ]]
  ],

  sources: [
    ['T.C. Dışişleri Bakanlığı — Türk vatandaşlarının tabi olduğu vize uygulamaları', 'https://www.mfa.gov.tr/turk-vatandaslarinin-tabi-oldugu-vize-uygulamalari.tr.mfa'],
    ['T.C. Dışişleri Bakanlığı — Yurt dışına seyahat edeceklere konsolosluk rehberi', 'https://www.mfa.gov.tr/yurt-disina-seyahat-edeceklere-konsolosluk-rehberi.tr.mfa'],
    ['Euronews — Karadağ vize kararı (26.09.2026)', 'https://tr.euronews.com/2026/09/26/karadag-ab-uyelik-sureci-kapsaminda-turk-vatandaslarina-1-kasimdan-itibaren-vize-uygulayac'],
    ['Thairath — Tayland 30 günlük vize muafiyeti listesi (01.09.2026)', 'https://en.thairath.co.th/news/local/2956797'],
    ['Euronews — Yunan adaları kapı vizesi uzatıldı (31.03.2026)', 'https://tr.euronews.com/2026/03/31/yunanistan-turklere-yonelik-kapida-vize-programini-1-yil-daha-uzatti'],
    ['Interpressnews — Gürcistan zorunlu seyahat sigortası', 'https://www.interpressnews.ge/en/article/147168-georgia-introduces-mandatory-travel-insurance-for-all-foreign-visitors-in-2026/'],
    ['Anadolu Ajansı — Endonezya’dan Türk vatandaşlarına vizesiz giriş', 'https://www.aa.com.tr/en/asia-pacific/indonesia-grants-visa-free-entry-to-turkish-citizens/3620893'],
    ['Ada Derana — Sri Lanka ücretsiz ETA', 'https://www.adaderana.lk/news.php?nid=122919'],
    ['Gazete Oksijen — Umman vize muafiyeti', 'https://gazeteoksijen.com/turkiye/turk-vatandaslari-bir-ulkeye-daha-vizesiz-seyahat-edebilecek-260486'],
    ['T.C. Dışişleri — Ürdün’e seyahat edeceklerin dikkatine', 'https://www.mfa.gov.tr/urdun-seyahat-edecek-turk-vatandaslarinin-dikkatine.tr.mfa'],
    ['Türkiye Sigorta — 2026 yurt dışı çıkış harcı', 'https://www.turkiyesigorta.com.tr/blog/seyahat/yurt-disi-cikis-harci-ne-kadar'],
    ['Bigpara — EUR/TRY kuru (16.11.2026)', 'https://bigpara.hurriyet.com.tr/doviz/euro-ne-kadar/']
  ]
};
