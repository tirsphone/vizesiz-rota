/* Balkanlar & Avrupa, Kafkasya & Orta Asya
   Alan rehberi: v=vize türü (free|voa|eta|evisa), kim=kimlikle giriş, d=kalış (gün), ap=[IATA,enlem,boylam],
   dir=direkt uçuş (y=var, p=sınırlı/tek duraklı, n=yok), tz/tzs=Türkiye'ye göre saat farkı (standart/yaz saati),
   lvl=pahalılık 1–5, day=günlük € [ekonomik, orta, konforlu], px=fiyatlar € (meta.js pxLabels sırası),
   fl=gidiş-dönüş uçuş €, safe=1 çok güvenli … 3 dikkat, s=12 ay uygunluk (0/1/2), t=ortalama gündüz sıcaklığı °C,
   i=ilgi puanları (doga,kultur,plaj,gastro,gece,macera,sehir,kis), fest=[ad,aylar,yer,açıklama,tarih değişken mi] */
VR.add(
{ id:'kktc', iso:'KKTC', wn:'N. Cyprus', n:'KKTC (Kuzey Kıbrıs)', c:'Lefkoşa', reg:'avrupa', v:'free', kim:1, stay:'Kimlikle serbest giriş', d:90,
  vn:'Çipli T.C. kimlik kartıyla girilir. KKTC’ye gidişte yurt dışı çıkış harcı alınmaz. Güney Kıbrıs’a (Kıbrıs Cumhuriyeti) geçmek için ayrıca vize gerekir.',
  ap:['ECN',35.1547,33.4961], alt:'Ercan; Taşucu–Girne feribotu', dir:'y', cur:'TRY (Türk lirası)', lang:'Türkçe', tz:-1, tzs:0, plug:'G (İngiliz tipi)', em:'112 · 155 polis', lvl:3,
  day:[40,85,170], px:[3,10,28,3.5,1.2,90], fl:[60,180], safe:1, s:'111222112221', t:[17,17,20,25,30,34,37,37,34,29,23,18], tc:'Lefkoşa', i:'33434220',
  hl:'Pasaport bile gerekmez: Türk lirasıyla gezilen, kaleleri, Venedik surları ve ıssız Karpaz plajlarıyla en yakın “yurt dışı”.',
  exp:[
    ['Girne Kalesi ve Antik Liman','kultur','Girne','Kaledeki 2.300 yıllık batık gemi müzesi, ardından limanda gün batımında balık.'],
    ['St. Hilarion Kalesi','macera','Girne','Masallara ilham veren dağ kalesine tırmanış; Girne kıyısına kuş bakışı.'],
    ['Karpaz Altınkum ve yaban eşekleri','doga','Karpaz','Adanın ucunda el değmemiş kumsal; yolda serbest dolaşan eşeklerle karşılaşırsın.'],
    ['Salamis Antik Kenti','kultur','Gazimağusa','Gymnasium, tiyatro ve Roma hamamları; Gazimağusa surlarıyla birlikte yarım gün.'],
    ['Bellapais Manastırı','kultur','Bellapais','Gotik manastır avlusunda konser ya da limon ağaçları altında kahve.'],
    ['Alagadi kaplumbağa gecesi','doga','Alagadi','Haziran–Ağustos arası gönüllülerle caretta yuvalarını izle.']
  ],
  fest:[
    ['Bellapais Müzik Festivali',[5,6],'Bellapais','Manastırın akustiği güçlü avlusunda klasik müzik konserleri.',0],
    ['Mehmetçik Üzüm Festivali',[8],'Mehmetçik','Köy meydanında üzüm, pekmez, sucuk ve halk oyunları.',0],
    ['Zeytinlik Zeytin Festivali',[10],'Girne','Zeytin hasadı, yerel ürünler ve konserlerle köy şenliği.',0]
  ],
  food:['Hellim','Şeftali kebabı','Molehiya','Pilavuna','Kolokas'],
  tips:['Trafik soldan akar; araç kiralarken buna hazırlıklı ol.','Ercan’dan Girne’ye taksi pahalı; otobüs veya önceden ayarlanmış transfer daha ucuz.','Priz İngiliz tipi (G); adaptör al.','Kumarhaneli oteller her şey dahil paketlerle sık sık kampanya yapar.'],
  tip:'Restoranlarda %10 bahşiş yaygın; bazı yerler servis ücretini hesaba ekler.',
  pay:'Türk lirası geçer, kartın Türkiye’deki gibi çalışır; döviz gerekmez.' },

{ id:'gr-ada', iso:'GR', n:'Yunan Adaları', c:'Rodos, İstanköy, Sakız, Midilli…', reg:'avrupa', v:'voa', kim:0, stay:'7 gün (ada başına)', d:7, special:'Ada vizesi',
  vn:'Ekspres (kapı) vizesi 12 adada geçerli: Rodos, İstanköy (Kos), Sakız, Midilli, Sisam, Meis, Leros, Limni, Simi, Kalimnos, Patmos, Semadirek. Başvuru feribot şirketi veya acente üzerinden yaklaşık 7 gün önceden yapılır; resmi harç ~60 €, aracı ücretiyle toplam ~80–100 €. Vize yalnızca girilen adada geçerlidir; anakaraya ve diğer Schengen ülkelerine geçilemez.',
  mode:'ferry', tt:3,
  ferry:[['Bodrum','İstanköy (Kos)','~45 dk'],['Çeşme','Sakız','~45 dk'],['Marmaris','Rodos','~1 sa'],['Kaş','Meis','~20 dk'],['Ayvalık','Midilli','~1,5 sa'],['Kuşadası','Sisam','~1,5 sa']],
  pts:[[36.43,28.22,'Rodos'],[36.89,27.29,'İstanköy'],[38.37,26.14,'Sakız'],[39.11,26.55,'Midilli'],[37.75,26.98,'Sisam'],[36.15,29.59,'Meis'],[37.15,26.85,'Leros'],[39.92,25.24,'Limni'],[36.61,27.84,'Simi'],[36.95,26.98,'Kalimnos'],[37.31,26.55,'Patmos'],[40.47,25.53,'Semadirek']],
  ap:['RHO',36.4054,28.0862], alt:'Feribot limanları: Ayvalık, Dikili, Çeşme, Kuşadası, Bodrum, Datça, Marmaris, Fethiye, Kaş', dir:'y',
  cur:'EUR (Euro)', lang:'Yunanca; turistik yerlerde İngilizce', tz:-1, tzs:0, plug:'C/F', em:'112', lvl:4,
  day:[65,120,240], px:[4,15,28,5,1.8,110], fl:[40,120], safe:1, s:'000122222200', t:[15,16,18,21,25,29,31,32,29,25,20,17], tc:'Rodos', i:'34543220',
  hl:'Ege’nin karşı kıyısı bir feribot uzağında: kapı vizesiyle Rodos’un şövalye sokaklarında, Sakız’ın sakız köylerinde ya da Meis’in tek limanında 7 gün.',
  exp:[
    ['Rodos Eski Şehir','kultur','Rodos','Şövalyeler Sarayı ve UNESCO listesindeki surlar içinde ortaçağ sokakları.'],
    ['Lindos Akropolü','kultur','Rodos','Beyaz evlerin üstündeki akropole çık, aşağıda St. Paul koyunda yüz.'],
    ['Simi’nin renkli limanı','sehir','Simi','Pastel neoklasik evlerle çevrili limanda deniz ürünleri ve sünger dükkânları.'],
    ['Sakız köyleri Pirgi ve Mesta','kultur','Sakız','Geometrik desenli duvarlar, labirent sokaklar ve sakız ağacı bahçeleri.'],
    ['Meis Mavi Mağara','doga','Meis','Kaş’tan 20 dakikalık tekneyle gel, ışığın suyu maviye boyadığı mağaraya gir.'],
    ['Patmos Vahiy Mağarası','kultur','Patmos','UNESCO listesindeki manastır ve Yuhanna’nın vahiy aldığı mağara.']
  ],
  fest:[
    ['Ortodoks Paskalyası ve Roket Savaşı',[4,5],'Sakız (Vrontados)','Paskalya gecesi iki kilise arasında binlerce el yapımı roket atılır.',1],
    ['Hippokratia Festivali',[7,8],'İstanköy','Hipokrat’ın adasında açık hava tiyatro, konser ve sergiler.',0],
    ['Panagia Yortusu',[8],'Tüm adalar','15 Ağustos’ta köy panayırları, müzik ve dans.',0]
  ],
  food:['Souvlaki','Gyros','Izgara ahtapot','Loukoumades','Uzo ve meze'],
  tips:['Feribot seferleri kışın seyrekleşir; Nisan–Ekim arası çok daha fazla seçenek var.','Vize belgeni ve pasaportunu adadan ayrılana kadar yanında taşı.','Pasaportun ayrılış tarihinden sonra en az 3 ay geçerli olmalı (Schengen kuralı).','Adada scooter veya araç kiralamak için ehliyetini getir.'],
  tip:'Restoranlarda %5–10 bahşiş beklenir.',
  pay:'Euro; kart yaygın ama küçük tavernalarda nakit iste.' },

{ id:'al', iso:'AL', num:'008', n:'Arnavutluk', c:'Tiran', reg:'avrupa', v:'free', kim:0, stay:'90 gün (180 günde)', d:90,
  vn:'Pasaportla vizesiz giriş. Pasaportun girişte en az 3 ay geçerli olması gerekir.',
  ap:['TIA',41.4147,19.7206], alt:'', dir:'y', cur:'ALL (Lek); sahilde euro da geçer', lang:'Arnavutça; İtalyanca yaygın', tz:-2, tzs:-1, plug:'C/F', em:'112 · 129 polis', lvl:2,
  day:[35,65,130], px:[1.3,8,18,2.5,0.4,60], fl:[130,280], safe:1, s:'001122222100', t:[12,14,17,20,25,29,32,32,28,23,17,13], tc:'Tiran', i:'44533321',
  hl:'Avrupa’nın henüz keşfedilmemiş rivierası: turkuaz koylar, Osmanlı izli taş şehirler ve uygun fiyatlı deniz ürünleri.',
  exp:[
    ['Ksamil ve Arnavut Rivierası','plaj','Ksamil · Himara · Dhërmi','Korfu manzaralı turkuaz koylar; Haziran ve Eylül daha sakin.'],
    ['Butrint Antik Kenti','kultur','Saranda','Yunan, Roma, Bizans ve Venedik katmanları göl kıyısında, UNESCO listesinde.'],
    ['Berat ve Gjirokastër','kultur','Berat · Gjirokastër','“Bin pencereli” Berat ile taş çatılı Gjirokastër’de Osmanlı konakları.'],
    ['Theth–Valbona yürüyüşü','macera','Lanetli Dağlar','Kuzey Alplerinde bir günlük klasik geçiş; köy evlerinde konaklama.'],
    ['Mavi Göz kaynağı','doga','Muzinë','Dibi görünmeyen, buz gibi turkuaz kaynak suyu.'],
    ['Tiran: Bunk’Art ve Blloku','sehir','Tiran','Diktatörlük döneminin sığınağı müze oldu; akşam Blloku’da kafeler.']
  ],
  fest:[
    ['Dita e Verës (Yaz Günü)',[3],'Elbasan','14 Mart’ta baharı karşılayan şenlik; geleneksel ballokume kurabiyesi.',0],
    ['Kala Festival',[6],'Dhërmi','Plaj kenarında bir haftalık elektronik müzik festivali.',0],
    ['Korça Bira Festivali',[8],'Korça','Ağustos ortasında yerel bira, ızgara ve canlı müzik.',0]
  ],
  food:['Tavë kosi','Byrek','Fërgesë','Qofte','Trileçe'],
  tips:['Dağ yolları dar ve virajlı; araçla gezerken bol zaman ayır.','Sahil kasabaları arasında furgon (minibüs) ucuz ve sık.','Saranda’dan Korfu’ya feribot var ama Yunanistan Schengen’dir, vize gerekir.','Yaz ortasında Ksamil çok kalabalık; plaj şezlonglarını sabah erken kap.'],
  tip:'Restoranlarda %10 bahşiş takdir edilir.',
  pay:'Kart şehirlerde geçer; köylerde ve plaj barlarında nakit lek kullan.' },

{ id:'ba', iso:'BA', num:'070', n:'Bosna-Hersek', c:'Saraybosna', reg:'avrupa', v:'free', kim:0, stay:'90 gün (180 günde)', d:90,
  vn:'Pasaportla vizesiz giriş.',
  ap:['SJJ',43.8246,18.3315], alt:'Mostar (OMO) sezonluk', dir:'y', cur:'BAM (Konvertibl Mark; 1 € ≈ 1,96 KM)', lang:'Boşnakça, Sırpça, Hırvatça', tz:-2, tzs:-1, plug:'C/F', em:'112 · 122 polis', lvl:2,
  day:[35,60,120], px:[1.5,7,17,2.5,0.9,60], fl:[140,280], safe:2, s:'110122222101', t:[3,6,11,16,21,24,27,27,23,17,10,5], tc:'Saraybosna', i:'45042423',
  hl:'Başçarşı’da Boşnak kahvesi, Mostar Köprüsü’nden atlayan dalgıçlar ve yakın tarihin izleri: hem tanıdık hem çarpıcı.',
  exp:[
    ['Mostar Köprüsü ve dalgıçlar','kultur','Mostar','Mimar Hayreddin’in köprüsü; yazın Neretva’ya 21 metreden atlayışları izle.'],
    ['Başçarşı ve Gazi Hüsrev Bey Camii','kultur','Saraybosna','Sebil, bakırcılar sokağı ve cami; ardından bir porsiyon ćevapi.'],
    ['Tünel Müzesi ve Trebević','kultur','Saraybosna','Kuşatma tünelini gez, teleferikle eski olimpiyat bobsled pistine çık.'],
    ['Kravice Şelalesi','doga','Ljubuški','Yaz aylarında yüzülebilen, amfitiyatro biçimli şelale.'],
    ['Blagaj Tekkesi','kultur','Blagaj','Buna Nehri’nin kaynağında kayanın dibindeki 16. yüzyıl tekkesi.'],
    ['Jahorina’da kayak','kis','Jahorina','1984 Kış Olimpiyatları pistlerinde Alplere göre çok ucuz kayak.']
  ],
  fest:[
    ['Saraybosna Kış Festivali',[2,3],'Saraybosna','Tiyatro, müzik ve sergilerle şehrin uluslararası kış festivali.',0],
    ['Başçarşı Geceleri',[7],'Saraybosna','Temmuz boyunca eski çarşıda açık hava konserleri.',0],
    ['Mostar Köprü Atlama Yarışması',[7],'Mostar','Yüzyıllık geleneğin resmî yarışması; köprü çevresi bayram yeri.',0],
    ['Saraybosna Film Festivali',[8],'Saraybosna','Balkanların en büyük film festivali; açık hava gösterimleri.',0]
  ],
  food:['Ćevapi','Burek','Begova čorba','Klepe','Boşnak kahvesi','Tufahija'],
  tips:['Kırsalda işaretli patikaların dışına çıkma; savaştan kalma mayınlı alanlar hâlâ var.','Saraybosna–Mostar treni manzaralı ve ucuz.','Başçarşı’da Türkçe bilen esnafa sık rastlarsın.','Euro birçok yerde kabul edilir ama para üstü KM verilir.'],
  tip:'Hesabı yuvarlamak ya da %10 bırakmak yeterli.',
  pay:'Kart şehirlerde yaygın; çarşı ve köylerde nakit KM kullan.' },

{ id:'rs', iso:'RS', num:'688', n:'Sırbistan', c:'Belgrad', reg:'avrupa', v:'free', kim:0, stay:'90 gün (180 günde)', d:90,
  vn:'Pasaportla vizesiz giriş. Kosova’ya başka bir ülkeden girdiysen Kosova’dan Sırbistan’a geçişte sorun yaşayabilirsin.',
  ap:['BEG',44.8184,20.3091], alt:'Niş (INI)', dir:'y', cur:'RSD (Dinar)', lang:'Sırpça (Kiril ve Latin alfabe)', tz:-2, tzs:-1, plug:'C/F', em:'112 · 192 polis · 194 ambulans', lvl:2,
  day:[40,70,140], px:[2,8,20,2.8,0,70], fl:[120,260], safe:1, s:'001122222101', t:[4,7,12,18,23,26,29,29,24,18,11,6], tc:'Belgrad', i:'34045242',
  hl:'Gece hayatı efsanevi, mutfağı cömert: Tuna ile Sava’nın buluştuğu Belgrad’dan Guča trompetlerine Balkan enerjisi.',
  exp:[
    ['Kalemegdan Kalesi','kultur','Belgrad','Sava ile Tuna’nın birleştiği noktada gün batımı; kalede Osmanlı izleri.'],
    ['Splav’larda gece','gece','Belgrad','Nehir üstündeki yüzen kulüplerde sabaha kadar Balkan ve elektronik müzik.'],
    ['Skadarlija','gastro','Belgrad','Arnavut kaldırımlı bohem sokakta kafana (meyhane) ve canlı müzik.'],
    ['Novi Sad ve Petrovaradin','sehir','Novi Sad','Tuna kıyısındaki kalede saat kulesi ve renkli şehir merkezi.'],
    ['Tara Milli Parkı','doga','Tara','Drina Kanyonu manzaraları ve nehrin ortasındaki ünlü kulübe.'],
    ['Şargan Sekizi treni','macera','Mokra Gora','Dağlarda 8 biçiminde kıvrılan tarihi dar hat treni.']
  ],
  fest:[
    ['FEST Belgrad Film Festivali',[2,3],'Belgrad','Bölgenin köklü film festivali.',0],
    ['Guča Trompet Festivali',[8],'Guča','Bandolar, ızgara dumanı ve bitmeyen kolo dansı.',0],
    ['Nišville Caz Festivali',[8],'Niş','Kale içinde dört gün süren caz ve dünya müziği.',0],
    ['BEMUS Müzik Festivali',[10],'Belgrad','Klasik müziğin bölgedeki en eski festivali.',0]
  ],
  food:['Ćevapčići','Pljeskavica','Karađorđeva šnicla','Kajmak','Rakija'],
  tips:['Belgrad’da toplu taşıma 2025’ten beri herkese ücretsiz.','Taksi için uygulama kullan; sokaktan çevirmekten kaçın.','Restoranların bir kısmında kapalı alanda sigara içilebiliyor.','Kiril tabelaların çoğunun Latin harfli sürümü de var.'],
  tip:'%10 bahşiş yaygın.',
  pay:'Kart her yerde geçer; pazarlarda nakit dinar.' },

{ id:'mk', iso:'MK', num:'807', n:'Kuzey Makedonya', c:'Üsküp', reg:'avrupa', v:'free', kim:0, stay:'90 gün (180 günde)', d:90,
  vn:'Pasaportla vizesiz giriş.',
  ap:['SKP',41.9616,21.6214], alt:'Ohrid (OHD)', dir:'y', cur:'MKD (Denar)', lang:'Makedonca, Arnavutça; çarşıda Türkçe', tz:-2, tzs:-1, plug:'C/F', em:'112 · 192 polis', lvl:1,
  day:[30,55,110], px:[1.3,6,15,2.2,0.6,50], fl:[120,260], safe:1, s:'000122222100', t:[5,9,14,19,24,29,32,32,27,20,12,6], tc:'Üsküp', i:'44232321',
  hl:'Ohrid Gölü’nün kristal suyu, Üsküp Eski Çarşı’da Türkçe sohbet ve Balkanların en uygun fiyatları.',
  exp:[
    ['Ohrid Gölü ve eski şehir','doga','Ohrid','Avrupa’nın en eski göllerinden birinin kıyısında UNESCO listesindeki kasaba.'],
    ['Sveti Jovan Kaneo','kultur','Ohrid','Göle bakan yamaçtaki 13. yüzyıl kilisesi; en güzeli gün batımında.'],
    ['Matka Kanyonu','macera','Üsküp','Kanoyla ya da tekneyle kanyon gölünde Vrelo Mağarası’na.'],
    ['Üsküp Eski Çarşı','kultur','Üsküp','Taş Köprü, Mustafa Paşa Camii, hanlar ve Türkçe konuşan esnaf.'],
    ['Mavrovo Milli Parkı','doga','Mavrovo','Göl suyunun yarı yuttuğu kilise; kışın kayak merkezi.'],
    ['Tikveš şarap rotası','gastro','Kavadarci','Vranec ve Temjanika üzümleriyle küçük bağ evlerinde tadım.']
  ],
  fest:[
    ['Galičnik Düğünü',[7],'Galičnik','Dağ köyünde yüzyıllık geleneksel düğün töreni.',0],
    ['Ohrid Yaz Festivali',[7,8],'Ohrid','Antik tiyatroda konser, opera ve tiyatro.',0],
    ['Tikveš Bağ Bozumu',[9],'Kavadarci','Üzüm hasadı geçidi ve sokakta şarap tadımı.',0],
    ['Üsküp Caz Festivali',[10],'Üsküp','Avrupa’nın köklü caz festivallerinden.',0]
  ],
  food:['Tavče gravče','Şopska salata','Ajvar','Pastrmajlija','Burek'],
  tips:['Üsküp’ten Ohrid’e otobüsle yaklaşık 3 saat; Ohrid’in kendi havalimanı da var.','Çarşıda pazarlık normal.','Göl kıyısındaki tekne turları yaz akşamları çok keyifli.','Euro sınırlı yerde geçer; denar bozdur.'],
  tip:'%10 bahşiş yaygın.',
  pay:'Kart şehirlerde geçer; çarşıda nakit.' },

{ id:'xk', iso:'XK', wn:'Kosovo', n:'Kosova', c:'Priştine', reg:'avrupa', v:'free', kim:0, stay:'90 gün (180 günde)', d:90,
  vn:'Pasaportla vizesiz giriş. Sırbistan, Kosova giriş damgasını tanımaz; sonra Sırbistan’a geçeceksen Kosova’ya Sırbistan üzerinden gir.',
  ap:['PRN',42.5728,21.0358], alt:'', dir:'y', cur:'EUR (Euro)', lang:'Arnavutça, Sırpça; Prizren’de Türkçe', tz:-2, tzs:-1, plug:'C/F', em:'112 · 192 polis', lvl:1,
  day:[28,50,100], px:[1,5,13,2,0.5,45], fl:[130,280], safe:1, s:'000122222100', t:[3,6,11,16,21,25,28,28,24,17,10,5], tc:'Priştine', i:'44033322',
  hl:'Avrupa’nın en genç ülkesi: Prizren’de Türkçe konuşulan çarşılar, ucuz espresso kültürü ve Rugova’nın vahşi kanyonları.',
  exp:[
    ['Prizren Kalesi ve Taş Köprü','kultur','Prizren','Sinan Paşa Camii’nden kaleye çık; şehir Türkçe konuşulan bir Osmanlı kenti.'],
    ['Rugova Kanyonu','macera','Peja','Via ferrata, zipline ve kanyon boyunca yürüyüş.'],
    ['Visoki Dečani Manastırı','kultur','Dečani','UNESCO listesindeki 14. yüzyıl fresk hazinesi.'],
    ['Priştine’de kafe turu','sehir','Priştine','Newborn anıtı, Ulusal Kütüphane ve Avrupa’nın en ucuz iyi espressosu.'],
    ['Mirusha Şelaleleri','doga','Mirusha','Basamak basamak göller ve kanyonlarla yaz kaçamağı.'],
    ['Brezovica’da kayak','kis','Brezovica','Şar Dağları’nda sade ve ucuz kayak merkezi.']
  ],
  fest:[
    ['Bağımsızlık Günü',[2],'Priştine','17 Şubat’ta konserler ve sokak kutlamaları.',0],
    ['Dokufest',[8],'Prizren','Kale, nehir kıyısı ve açık havada belgesel film festivali.',0]
  ],
  food:['Flija','Tavë Prizreni','Qebapa','Pite','Makiato'],
  tips:['Prizren’de Türkçe ile her işini halledebilirsin.','Şehirler arası otobüsler sık ve ucuz.','Arnavutça konuşulan bölgelerde Sırpça yerine İngilizce kullan.','Euro kullanıldığı için döviz derdi yok.'],
  tip:'Hesabı yuvarlamak yeterli; %5–10 iyi karşılanır.',
  pay:'Kart yaygınlaşıyor ama küçük işletmelerde nakit euro.' },

{ id:'md', iso:'MD', num:'498', n:'Moldova', c:'Kişinev', reg:'avrupa', v:'free', kim:1, stay:'90 gün (180 günde)', d:90,
  vn:'Çipli kimlik kartıyla da girilebilir. Transdinyester bölgesi Moldova hükümetinin denetiminde değil; gitmeden güncel uyarıları kontrol et.',
  ap:['RMO',46.9277,28.9310], alt:'', dir:'y', cur:'MDL (Ley)', lang:'Rumence; Rusça yaygın; Gagavuzya’da Gagavuz Türkçesi', tz:-1, tzs:0, plug:'C/F', em:'112', lvl:1,
  day:[30,55,110], px:[1.8,7,16,2,0.3,55], fl:[130,280], safe:2, s:'000122222200', t:[1,3,9,16,22,26,28,28,22,15,8,3], tc:'Kişinev', i:'23052120',
  hl:'Dünyanın en büyük şarap mahzenleri, Gagavuz Türklerinin Komrat’ı ve kalabalıktan uzak sakin bir başkent.',
  exp:[
    ['Mileștii Mici mahzenleri','gastro','Mileștii Mici','200 km’lik yeraltı galerisi; Guinness rekorlu şarap koleksiyonu.'],
    ['Cricova yeraltı şehri','gastro','Cricova','Arabayla gezilen mahzen tünelleri ve köpüklü şarap tadımı.'],
    ['Orheiul Vechi','kultur','Trebujeni','Kayaya oyulmuş mağara manastırı ve nehir kıvrımına bakan tepeler.'],
    ['Gagavuzya ve Komrat','kultur','Komrat','Gagavuz Türklerinin merkezinde müze, şarap ve Türkçe sohbet.'],
    ['Soroca Kalesi','kultur','Soroca','Dinyester kıyısında daire planlı 15. yüzyıl kalesi.'],
    ['Purcari şaraphanesi','gastro','Purcari','Kraliyet sofralarına giden Negru de Purcari’nin evinde konaklama.']
  ],
  fest:[
    ['Mărțișor',[3],'Tüm ülke','1 Mart’ta kırmızı-beyaz püsküllerle baharı karşılama ve müzik festivali.',0],
    ['Ulusal Şarap Günü',[10],'Kişinev','Ekim’in ilk hafta sonu meydanda yüzlerce şaraphanenin tadımı.',0]
  ],
  food:['Mămăligă','Plăcinte','Sarmale','Zeamă','Fetească Neagră şarabı'],
  tips:['İstanbul’dan uçuş yaklaşık 1,5 saat; hafta sonu kaçamağına uygun.','Mahzen turlarını önceden ayır; bazıları yalnızca gruplarla çalışır.','Şehir içinde taksi uygulamaları ucuz ve yaygın.','Transdinyester’e gideceksen pasaport şart, kart geçmez.'],
  tip:'%10 bahşiş yaygın.',
  pay:'Kart Kişinev’de her yerde; köylerde nakit ley.' },

{ id:'by', iso:'BY', num:'112', n:'Belarus', c:'Minsk', reg:'avrupa', v:'free', kim:0, stay:'30 gün (yılda 90)', d:30,
  vn:'Pasaportla her girişte 30 güne kadar vizesiz. 10 günden uzun kalışta kayıt gerekir (oteller yapar). Polonya, Litvanya ve Letonya sınır kapılarında geçişler kısıtlı olabilir.',
  ap:['MSQ',53.8825,28.0307], alt:'', dir:'y', cur:'BYN (Belarus rublesi)', lang:'Belarusça, Rusça', tz:0, plug:'C/F', em:'102 polis · 103 ambulans', lvl:2,
  day:[35,60,120], px:[2,7,17,2,0.35,55], fl:[200,380], safe:2, s:'000122221100', t:[-3,-2,4,12,19,22,24,23,17,10,3,-1], tc:'Minsk', i:'33022131',
  hl:'Tertemiz bulvarlar, Sovyet modernizmi ve Avrupa’nın son ilkel ormanı: az bilinen, sakin bir Doğu Avrupa rotası.',
  exp:[
    ['Mir Kalesi ve Nesvij Sarayı','kultur','Mir · Nesvij','UNESCO listesindeki iki Radziwiłł yapısı; günübirlik tur.'],
    ['Belovejskaya Puşça','doga','Brest bölgesi','Avrupa bizonlarının yaşadığı, Polonya sınırındaki ilkel orman.'],
    ['Brest Kalesi','kultur','Brest','İkinci Dünya Savaşı’nın sembol savunmasının dev anıt kompleksi.'],
    ['Minsk’te Sovyet mimarisi','sehir','Minsk','Bağımsızlık Caddesi, elmas biçimli Ulusal Kütüphane ve Trinity mahallesi.'],
    ['Braslav gölleri','doga','Braslav','Ormanlar arasında kano ve göl kenarı kulübeleri.']
  ],
  fest:[
    ['Kupalle (Yaz gündönümü)',[7],'Tüm ülke','6–7 Temmuz gecesi ateş üstünden atlama ve çiçek taçları.',0],
    ['Slavianski Bazaar',[7],'Vitebsk','Slav dünyasının en büyük müzik ve sanat festivali.',0],
    ['Listapad Film Festivali',[11],'Minsk','Kasım’da düzenlenen uluslararası film festivali.',0]
  ],
  food:['Draniki','Machanka','Kolduny','Kvas','Syrniki'],
  tips:['Siyasi gösterilerden uzak dur; resmî binaları fotoğraflamaktan kaçın.','Yabancı kartlar her zaman çalışmayabilir; yanında euro veya dolar bulundur.','Birkaç Rusça kelime çok işe yarar; İngilizce sınırlı.','Otel kayıt belgesini çıkışa kadar sakla.'],
  tip:'%10 bahşiş yaygın.',
  pay:'Kart Minsk’te yaygın; yedek nakit getir.' },

{ id:'ru', iso:'RU', num:'643', n:'Rusya', c:'Moskova', reg:'avrupa', v:'free', kim:0, stay:'30 gün (180 günde 90)', d:30,
  vn:'Pasaportla her girişte 30 güne kadar vizesiz; 180 günde toplam 90 gün. 7 iş gününden uzun kalışta kayıt gerekir (oteller yapar).',
  ap:['SVO',55.9726,37.4146], alt:'St. Petersburg (LED), Kazan (KZN), Soçi (AER)', dir:'y', cur:'RUB (Ruble)', lang:'Rusça; Kazan’da Tatarca', tz:0, plug:'C/F', em:'112', lvl:3,
  day:[45,85,180], px:[3,9,25,3,0.7,80], fl:[200,450], safe:3, s:'110022221001', t:[-5,-4,2,11,19,22,25,22,16,8,1,-3], tc:'Moskova', i:'35134253',
  hl:'Kremlin’den Ermitaj’a dev müzeler, Kazan’da Tatar kültürü ve Baykal’ın buzu: ölçeği büyük, hazırlık isteyen bir rota.',
  exp:[
    ['Kızıl Meydan ve Kremlin','kultur','Moskova','Aziz Vasil Katedrali, GUM ve Kremlin’in Silah Odası müzesi.'],
    ['Ermitaj ve Beyaz Geceler','kultur','St. Petersburg','Haziran’da hiç kararmayan gecelerde Neva köprülerinin açılışını izle.'],
    ['Kazan Kremlin’i','kultur','Kazan','Kul Şerif Camii ve Tatar mutfağıyla Türk dünyasına tanıdık bir şehir.'],
    ['Moskova metrosu','sehir','Moskova','Avizeli, mozaikli istasyonlarda yeraltı müzesi turu.'],
    ['Baykal Gölü’nde buz','doga','İrkutsk','Şubat–Mart’ta camsı buz üzerinde yürüyüş ve buz mağaraları.'],
    ['Krasnaya Polyana’da kayak','kis','Soçi','2014 Olimpiyatları tesislerinde kış sporları.']
  ],
  fest:[
    ['Maslenitsa',[2,3],'Tüm ülke','Kışı uğurlayan krep (blini) haftası; tarih her yıl değişir.',1],
    ['Sabantuy',[6],'Kazan','Tatar bahar bayramı: güreş, at yarışı ve halk oyunları.',0],
    ['Kızıl Yelkenler',[6],'St. Petersburg','Mezuniyet gecesi Neva’da kırmızı yelkenli gemi ve havai fişek.',0],
    ['Yeni yıl ışıkları',[12,1],'Moskova','Şehir merkezinde ışık süslemeleri ve kış pazarları.',0]
  ],
  food:['Borş','Pelmeni','Blini','Beef Stroganoff','Çak-çak'],
  tips:['Türk banka kartları Rusya’da çalışmıyor; bütçenin tamamını euro veya dolar nakit götür.','Bazı uygulamalar ve internet aramaları kısıtlı olabilir; çevrimdışı harita indir.','Drone saldırıları nedeniyle havalimanlarında geçici kapanmalar olabiliyor; uçuşunu takip et.','Müze biletlerini resmî sitelerden önceden al.'],
  tip:'%10 bahşiş yaygın.',
  pay:'Visa/Mastercard çalışmaz; yanında nakit döviz getirip bozdur.' },

{ id:'ge', iso:'GE', num:'268', n:'Gürcistan', c:'Tiflis', reg:'kafkas', v:'free', kim:1, stay:'1 yıl', d:365,
  vn:'Çipli kimlik kartıyla girilebilir. 1 Ocak 2026’dan beri en az 30.000 GEL teminatlı sağlık ve kaza sigortası zorunlu; poliçe İngilizce veya Gürcüce olmalı.',
  ap:['TBS',41.6692,44.9547], alt:'Batum (BUS), Kutaisi (KUT); Sarp sınır kapısı', dir:'y', cur:'GEL (Lari)', lang:'Gürcüce; Rusça; Batum’da Türkçe', tz:1, plug:'C/F', em:'112', lvl:2,
  day:[30,60,130], px:[2.5,7,18,2.5,0.35,55], fl:[100,250], safe:1, s:'111122222211', t:[7,9,14,19,24,28,31,31,26,20,13,8], tc:'Tiflis', i:'54153434',
  hl:'Kimliğini al, iki saatte Kafkasya’dasın: 8.000 yıllık şarap kültürü, dağ köyleri ve sofrası hiç bitmeyen misafirperverlik.',
  exp:[
    ['Kazbegi ve Gergeti Kilisesi','doga','Stepantsminda','5.047 metrelik Kazbek’in eteğindeki 14. yüzyıl kilisesine yürüyüş.'],
    ['Kaheti şarap rotası','gastro','Sighnaghi · Telavi','Toprak küplerde (kvevri) yapılan amber şaraplar ve aile mahzenleri.'],
    ['Tiflis eski şehir ve hamamlar','kultur','Tiflis','Narikala’ya teleferik, ardından Abanotubani’de kükürtlü hamam.'],
    ['Svaneti ve Uşguli','macera','Mestia','Ortaçağ savunma kuleleri, buzullar ve Avrupa’nın en yüksek köylerinden biri.'],
    ['Gudauri’de kayak','kis','Gudauri','Aralık–Nisan arası uygun fiyatlı kayak ve freeride.'],
    ['Vardzia mağara şehri','kultur','Aspindza','Kraliçe Tamar’ın kayalara oyulmuş 12. yüzyıl manastır şehri.'],
    ['Batum sahili','plaj','Batum','Sarp’tan karayoluyla da gidilen sahil kenti; botanik bahçesi ve ışıklı bulvar.']
  ],
  fest:[
    ['Yeni Şarap Festivali',[5],'Tiflis','Mayıs’ta yüzlerce küçük üreticinin yeni şaraplarını tattığın açık hava festivali.',0],
    ['Art-Gene',[7],'Tiflis','Halk müziği, el sanatları ve yöresel mutfakla yaz festivali.',0],
    ['Rtveli (bağ bozumu)',[9,10],'Kaheti','Hasada katıl, üzüm ez, aile sofrasında supra deneyimi yaşa.',0],
    ['Tbilisoba',[10],'Tiflis','Ekim’de şehrin hasat ve kuruluş şenliği: sokak yemekleri, şarap, konserler.',0]
  ],
  food:['Haçapuri','Hinkali','Mtsvadi','Badrijani nigvzit','Çurçhela','Lobio'],
  tips:['Sigorta poliçeni sınırda göstermek için telefonda ve çıktı olarak taşı.','Tiflis’te metro ve taksi uygulamaları çok ucuz; metro için şarj edilebilir kart al.','Supra sofrasında kadeh kaldırma (tamada) geleneğine saygı göster.','Dağ yollarında kışın zincir şartı olabilir.'],
  tip:'Restoranlarda %10–18 servis genelde hesaba eklenir.',
  pay:'Kart her yerde geçer; köylerde ve minibüslerde nakit lari.' },

{ id:'az', iso:'AZ', num:'031', n:'Azerbaycan', c:'Bakü', reg:'kafkas', v:'free', kim:1, stay:'90 gün', d:90,
  vn:'Çipli kimlik kartıyla da girilebilir. 15 günden uzun kalışta göç kaydı gerekir (oteller yapar). Kara sınırları 2020’den beri yolculara büyük ölçüde kapalı; giriş havayoluyla.',
  ap:['GYD',40.4675,50.0467], alt:'Gence (GNJ), Nahçıvan (NAJ), Gabala (GBB)', dir:'y', cur:'AZN (Manat)', lang:'Azerbaycan Türkçesi', tz:1, plug:'C/F', em:'112 · 102 polis · 103 ambulans', lvl:2,
  day:[35,70,150], px:[3,8,20,3,0.35,70], fl:[150,330], safe:1, s:'111222112211', t:[7,7,10,16,22,27,30,30,25,19,13,9], tc:'Bakü', i:'34143242',
  hl:'“Bir millet iki devlet”in öbür yarısı: tercümansız gezilen Bakü’de Zaha Hadid binaları, İçerişehir ve yanan dağlar.',
  exp:[
    ['İçerişehir ve Kız Kalesi','kultur','Bakü','UNESCO listesindeki surlar, Şirvanşahlar Sarayı ve kervansaraylar.'],
    ['Haydar Aliyev Merkezi','sehir','Bakü','Zaha Hadid’in dalgalanan beyaz binası; akşam Alev Kuleleri’nin ışık gösterisi.'],
    ['Yanardağ ve Ateşgah','kultur','Abşeron','Binlerce yıldır sönmeyen doğal gaz alevleri ve ateşgede tapınağı.'],
    ['Gobustan ve çamur volkanları','doga','Gobustan','40.000 yıllık kaya resimleri, hemen yanında fokurdayan çamur volkanları.'],
    ['Şeki Han Sarayı','kultur','Şeki','Vitray pencereli saray, kervansarayda konaklama ve Şeki halvası.'],
    ['Şahdağ ve Gabala','kis','Gabala · Gusar','Teleferik, orman yürüyüşleri ve kışın Şahdağ’da kayak.']
  ],
  fest:[
    ['Novruz Bayramı',[3],'Tüm ülke','20–21 Mart’ta ateş üstünden atlama, şekerbura ve semeni.',0],
    ['Gabala Müzik Festivali',[7,8],'Gabala','Dağların arasında açık havada klasik ve caz konserleri.',0],
    ['Formula 1 Bakü Grand Prix',[9],'Bakü','Eski şehrin surları arasından geçen sokak pisti; tarih yıla göre değişir.',1],
    ['Göyçay Nar Bayramı',[10,11],'Göyçay','Nar hasadını kutlayan şenlik: nar ekşisi, müzik ve yarışmalar.',0]
  ],
  food:['Şah pilavı','Dolma','Kutab','Şeki pitisi','Şekerbura','Çay ve mürebbe'],
  tips:['Metro ve otobüs için BakıKart al; taksi uygulamaları ucuz.','Türkçe her yerde anlaşılır; bazı kelimelerin anlamı farklı olabilir.','Şeki ve Gabala’ya Bakü’den otobüs ve tren var; Şeki yolu ~5 saat.','Bakü’de rüzgâr eksik olmaz; ilkbahar ve sonbaharda bile hırka al.'],
  tip:'%10 bahşiş yaygın; bazı restoranlar servis ücreti ekler.',
  pay:'Kart Bakü’de her yerde; bölgelerde nakit manat.' },

{ id:'kz', iso:'KZ', num:'398', n:'Kazakistan', c:'Astana · Almatı', reg:'kafkas', v:'free', kim:0, stay:'30 gün (180 günde 90)', d:30,
  vn:'Pasaportla her girişte 30 güne kadar vizesiz; 180 günde toplam 90 gün.',
  ap:['ALA',43.3521,77.0405], alt:'Astana (NQZ), Şımkent (CIT), Türkistan (HSA)', dir:'y', cur:'KZT (Tenge)', lang:'Kazakça, Rusça', tz:2, plug:'C/F', em:'112 · 102 polis · 103 ambulans', lvl:2,
  day:[40,70,140], px:[3,8,20,3,0.4,65], fl:[250,450], safe:1, s:'110122222101', t:[0,2,9,18,23,28,31,30,25,17,8,2], tc:'Almatı', i:'53033434',
  hl:'Tanrı Dağları’nın eteğinde modern Almatı, bozkırın ortasında fütüristik Astana ve Hoca Ahmed Yesevi’nin Türkistan’ı.',
  exp:[
    ['Medeu ve Şımbulak','kis','Almatı','Şehirden 30 dakikada teleferikle 3.200 metreye; kışın kayak, yazın yürüyüş.'],
    ['Büyük Almatı Gölü','doga','Almatı','Dağların arasında turkuaz renkli buzul gölü.'],
    ['Çarın Kanyonu','macera','Almatı bölgesi','“Kalelerin Vadisi”nde kızıl kaya duvarlar arasında yürüyüş.'],
    ['Kolsay ve Kaindy gölleri','doga','Saty','Suyun içinden yükselen ladin gövdeleriyle batık orman.'],
    ['Hoca Ahmed Yesevi Türbesi','kultur','Türkistan','Timur’un yaptırdığı UNESCO listesindeki türbe; Türk dünyasının manevi merkezi.'],
    ['Astana’nın mimarisi','sehir','Astana','Bayterek Kulesi, Han Çadırı ve gece ışıklarıyla bozkırdaki başkent.']
  ],
  fest:[
    ['Nevruz (Nauryz)',[3],'Tüm ülke','21–23 Mart’ta keçe çadırlar, nauryz köje ve at oyunları.',0],
    ['Astana Günü',[7],'Astana','6 Temmuz’da konserler ve havai fişeklerle başkent kutlaması.',0]
  ],
  food:['Beşbarmak','Kazı','Baursak','Plov','Kımız','Lagman'],
  tips:['Taksi için uygulama kullan; fiyat baştan sabitlenir.','Almatı–Astana arası uçakla 1,5 saat; gece treni de bir macera.','QR ile ödeme her yerde; yabancı kartlar da çoğunlukla geçer.','Dağ gölleri için yollar Ekim sonrası kar nedeniyle kapanabilir.'],
  tip:'%10 bahşiş yaygın; bazı yerlerde servis ücreti hesapta.',
  pay:'Kart yaygın; pazarlarda nakit tenge.' },

{ id:'uz', iso:'UZ', num:'860', n:'Özbekistan', c:'Taşkent', reg:'kafkas', v:'free', kim:0, stay:'30 gün', d:30,
  vn:'Pasaportla 30 güne kadar vizesiz. 3 günden uzun kalışta kayıt zorunlu; oteller otomatik yapar, kayıt fişlerini sakla.',
  ap:['TAS',41.2579,69.2812], alt:'Semerkant (SKD), Buhara (BHK), Ürgenç (UGC)', dir:'y', cur:'UZS (Som)', lang:'Özbekçe, Rusça', tz:2, plug:'C/F', em:'102 polis · 103 ambulans', lvl:1,
  day:[30,55,110], px:[2,5,14,2.5,0.25,50], fl:[250,450], safe:1, s:'001221002210', t:[7,10,16,23,28,34,36,34,29,22,14,8], tc:'Taşkent', i:'25041130',
  hl:'İpek Yolu’nun turkuaz kubbeleri: Registan’da gün batımı, Buhara’nın kervansarayları ve dünyanın en iddialı pilavı.',
  exp:[
    ['Registan Meydanı','kultur','Semerkant','Üç medresenin çevrelediği meydan; akşam ışıklandırmasını kaçırma.'],
    ['Şah-ı Zinde','kultur','Semerkant','Mavi çinilerle kaplı türbeler sokağı.'],
    ['Buhara eski şehir','kultur','Buhara','Kalon Minaresi, Ark Kalesi ve Lyabi Havuz çevresinde akşam yemeği.'],
    ['Hive İçan Kale','kultur','Hive','Surlarla çevrili, açık hava müzesi gibi korunmuş şehir.'],
    ['Afrosiyab hızlı treni','macera','Taşkent–Semerkant','İki saatte Semerkant’a; biletleri önceden al.'],
    ['Çorsu Pazarı','gastro','Taşkent','Kubbeli pazarda baharat, kuru meyve ve dev kazanlarda pilav.']
  ],
  fest:[
    ['Nevruz',[3],'Tüm ülke','21 Mart’ta sümelek kazanları ve şenlikler.',0],
    ['İpek ve Baharat Festivali',[5,6],'Buhara','Zanaatkârlar, kostümlü geçit ve yöresel lezzetler.',0],
    ['Şark Taronaları',[8],'Semerkant','Registan’da iki yılda bir yapılan uluslararası müzik festivali (sıradaki 2027).',0]
  ],
  food:['Plov (oş)','Somsa','Lagman','Şaşlık','Semerkant ekmeği'],
  tips:['Yazın sıcaklık 40 °C’yi geçer; Nisan–Mayıs ve Eylül–Ekim ideal.','Tren biletlerini erkenden resmî demiryolu sitesinden al.','Camilerde ve medreselerde omuzlar ve dizler kapalı olmalı.','Taksi uygulamaları ucuz ve güvenli.'],
  tip:'%5–10 bahşiş iyi karşılanır.',
  pay:'Kart büyük otellerde geçer; çoğunlukla nakit som kullan.' },

{ id:'kg', iso:'KG', num:'417', n:'Kırgızistan', c:'Bişkek', reg:'kafkas', v:'free', kim:0, stay:'30 gün', d:30,
  vn:'Pasaportla vizesiz giriş. Kaynaklarda süre 30–60 gün arasında geçiyor; 30 günden uzun kalacaksan büyükelçilikten teyit et.',
  ap:['FRU',43.0613,74.4776], alt:'Oş (OSS)', dir:'y', cur:'KGS (Som)', lang:'Kırgızca, Rusça', tz:3, plug:'C/F', em:'112 · 102 polis · 103 ambulans', lvl:1,
  day:[28,50,100], px:[1.8,5,12,2,0.2,45], fl:[280,480], safe:2, s:'100012222100', t:[3,5,12,19,24,30,32,31,26,18,10,4], tc:'Bişkek', i:'53121513',
  hl:'Ülkenin %90’ı dağ: yurt kamplarında kımız, at sırtında yayla gölleri ve Issık Göl’ün dağlarla çevrili kıyıları.',
  exp:[
    ['Song-Köl’de yurt kampı','macera','Narın','3.000 metrede göl kıyısında yurtta uyu, at sırtında yaylayı gez.'],
    ['Issık Göl','plaj','Çolpon-Ata','Karlı zirvelere bakan, hiç donmayan dev dağ gölü.'],
    ['Ala-Arça Milli Parkı','doga','Bişkek','Başkente 40 dakika; buzul vadilerinde günübirlik yürüyüş.'],
    ['Karakol ve Yedi Boğa kayalıkları','doga','Karakol','Kızıl kaya oluşumları, sıcak su kaynakları ve trekking rotaları.'],
    ['Burana Kulesi','kultur','Tokmok','Karahanlı döneminden kalan minare ve balbal taşları.'],
    ['Taş Rabat Kervansarayı','kultur','Narın','Çin sınırına yakın, İpek Yolu’nun taş kervansarayı.']
  ],
  fest:[
    ['Nooruz',[3],'Tüm ülke','21 Mart’ta at oyunları, kök börü ve sümölök.',0],
    ['Salburun Avcı Kuş Festivali',[9,10],'Issık Göl','Kartal ve tazıyla avcılık gösterileri, okçuluk ve at oyunları.',0]
  ],
  food:['Beşbarmak','Lagman','Kımız','Borsok','Oromo','Plov'],
  tips:['Dağ rotaları için yerel rehber ve 4x4 araç şart.','Yükseklik hastalığına karşı ilk günlerde yavaş çık.','Şehirler arası ulaşım için paylaşımlı taksi ve minibüs kullan.','Kırgızca ile Türkçe arasında ortak kelime çok; selamlaşmalar tanıdık gelecek.'],
  tip:'%10 bahşiş iyi karşılanır.',
  pay:'Bişkek dışında nakit som şart.' }
);
