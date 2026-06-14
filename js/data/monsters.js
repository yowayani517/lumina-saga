// モンスターデータ (スプライト: Guardian Monsters by Georg Eckert / CC-BY-4.0)
// スプライトは「家族番号_進化段階」で統一 (進化しても同じ系統の見た目になる)
var MONSTERS = {
  1: {
    id: 1, name: "リーフィン", types: ["grass"],
    baseStats: {"hp":45,"atk":45,"def":45,"spa":60,"spdef":60,"spe":55},
    catchRate: 45, expYield: 64, evolvesTo: 2, evolveLevel: 16,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":5,"move":"seedshot"},
      {"level":9,"move":"leafcutter"},
      {"level":13,"move":"sleepspore"}
    ],
    desc: "せなかの はっぱで ひかりを あつめる ちいさな もりの りゅう。",
    sprite: "1_0"
  },
  2: {
    id: 2, name: "リーフォルン", types: ["grass"],
    baseStats: {"hp":60,"atk":60,"def":60,"spa":80,"spdef":80,"spe":70},
    catchRate: 45, expYield: 142, evolvesTo: 3, evolveLevel: 34,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"seedshot"},
      {"level":9,"move":"leafcutter"},
      {"level":13,"move":"sleepspore"},
      {"level":20,"move":"megadrain"},
      {"level":26,"move":"quickstrike"},
      {"level":30,"move":"solarburst"}
    ],
    desc: "せなかの はっぱが りっぱに そだった。もりの みはりやく。",
    sprite: "1_1"
  },
  3: {
    id: 3, name: "シンリンガ", types: ["grass","psychic"],
    baseStats: {"hp":80,"atk":75,"def":70,"spa":110,"spdef":100,"spe":90},
    catchRate: 45, expYield: 218, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"seedshot"},
      {"level":9,"move":"leafcutter"},
      {"level":13,"move":"sleepspore"},
      {"level":20,"move":"megadrain"},
      {"level":26,"move":"mindwave"},
      {"level":30,"move":"solarburst"},
      {"level":36,"move":"psychicray"},
      {"level":40,"move":"selfheal"}
    ],
    desc: "くびが くもまで とどく もりの ぬし。はなの かおりで もりを いやす。",
    sprite: "1_2"
  },
  4: {
    id: 4, name: "ヒノニャン", types: ["fire"],
    baseStats: {"hp":45,"atk":60,"def":40,"spa":55,"spdef":50,"spe":60},
    catchRate: 45, expYield: 64, evolvesTo: 5, evolveLevel: 16,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":5,"move":"emberblast"},
      {"level":9,"move":"quickstrike"},
      {"level":13,"move":"flamewheel"}
    ],
    desc: "しっぽから ひのこを とばす こねこ。おこりっぽい。",
    sprite: "3_0"
  },
  5: {
    id: 5, name: "カエンザウル", types: ["fire"],
    baseStats: {"hp":60,"atk":80,"def":55,"spa":70,"spdef":60,"spe":85},
    catchRate: 45, expYield: 142, evolvesTo: 6, evolveLevel: 34,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"emberblast"},
      {"level":9,"move":"quickstrike"},
      {"level":13,"move":"flamewheel"},
      {"level":20,"move":"willowisp"},
      {"level":26,"move":"fightspirit"},
      {"level":30,"move":"blazeburst"}
    ],
    desc: "せなかの トゲが あつく もえる。きんりょくも じまん。",
    sprite: "3_1"
  },
  6: {
    id: 6, name: "ゴウカオー", types: ["fire","fighting"],
    baseStats: {"hp":85,"atk":115,"def":75,"spa":95,"spdef":70,"spe":85},
    catchRate: 45, expYield: 218, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"emberblast"},
      {"level":9,"move":"quickstrike"},
      {"level":13,"move":"flamewheel"},
      {"level":20,"move":"willowisp"},
      {"level":26,"move":"karatechop"},
      {"level":30,"move":"blazeburst"},
      {"level":34,"move":"risingfist"},
      {"level":38,"move":"infernowave"}
    ],
    desc: "ごうかを まとう りゅうの おう。その キバは てつを とかす。",
    sprite: "3_2"
  },
  7: {
    id: 7, name: "ワニッコ", types: ["water"],
    baseStats: {"hp":50,"atk":48,"def":65,"spa":55,"spdef":55,"spe":37},
    catchRate: 45, expYield: 64, evolvesTo: 8, evolveLevel: 16,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":5,"move":"aquashot"},
      {"level":9,"move":"aquafang"},
      {"level":13,"move":"quickstrike"}
    ],
    desc: "みずべに すむ こワニ。おおきな くちで なんでも かじる。",
    sprite: "2_0"
  },
  8: {
    id: 8, name: "ワニリュウ", types: ["water"],
    baseStats: {"hp":70,"atk":63,"def":85,"spa":65,"spdef":70,"spe":57},
    catchRate: 45, expYield: 142, evolvesTo: 9, evolveLevel: 34,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":1,"move":"aquashot"},
      {"level":9,"move":"aquafang"},
      {"level":13,"move":"quickstrike"},
      {"level":20,"move":"mindwave"},
      {"level":26,"move":"hydroblast"},
      {"level":30,"move":"bodyblow"}
    ],
    desc: "りゅうの ツノが はえてきた。およぎは ちほういち。",
    sprite: "2_1"
  },
  9: {
    id: 9, name: "ミナモス", types: ["water","psychic"],
    baseStats: {"hp":90,"atk":75,"def":95,"spa":105,"spdef":95,"spe":65},
    catchRate: 45, expYield: 218, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":1,"move":"aquashot"},
      {"level":9,"move":"aquafang"},
      {"level":13,"move":"quickstrike"},
      {"level":20,"move":"mindwave"},
      {"level":26,"move":"hydroblast"},
      {"level":30,"move":"calmmind"},
      {"level":34,"move":"psychicray"},
      {"level":38,"move":"tidalwave"}
    ],
    desc: "みずうみの けんじゃと よばれる だいかいりゅう。こころを よむ。",
    sprite: "2_2"
  },
  10: {
    id: 10, name: "ヤリイタチ", types: ["normal"],
    baseStats: {"hp":45,"atk":50,"def":35,"spa":30,"spdef":35,"spe":55},
    catchRate: 255, expYield: 50, evolvesTo: 11, evolveLevel: 18,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":3,"move":"growl"},
      {"level":7,"move":"quickstrike"},
      {"level":11,"move":"bodyblow"},
      {"level":15,"move":"screech"}
    ],
    desc: "きのえだの ヤリを ふりまわす イタチ。まいにち けいこに はげむ。",
    sprite: "13_0"
  },
  11: {
    id: 11, name: "ヤリバンガ", types: ["fighting"],
    baseStats: {"hp":75,"atk":85,"def":60,"spa":55,"spdef":60,"spe":85},
    catchRate: 120, expYield: 145, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"quickstrike"},
      {"level":11,"move":"karatechop"},
      {"level":15,"move":"screech"},
      {"level":22,"move":"fightspirit"},
      {"level":30,"move":"risingfist"}
    ],
    desc: "ヤリさばきは たつじんの いき。むれを まもる せんし。",
    sprite: "13_1"
  },
  12: {
    id: 12, name: "エアルン", types: ["normal","flying"],
    baseStats: {"hp":40,"atk":45,"def":35,"spa":40,"spdef":35,"spe":65},
    catchRate: 255, expYield: 52, evolvesTo: 13, evolveLevel: 20,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":4,"move":"growl"},
      {"level":8,"move":"gust"},
      {"level":12,"move":"quickstrike"},
      {"level":16,"move":"wingstrike"}
    ],
    desc: "ピンクの はねで ふわふわ うかぶ。かぜを よむのが とくい。",
    sprite: "17_0"
  },
  13: {
    id: 13, name: "エアセラフ", types: ["flying","psychic"],
    baseStats: {"hp":70,"atk":85,"def":60,"spa":60,"spdef":55,"spe":100},
    catchRate: 120, expYield: 150, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":1,"move":"gust"},
      {"level":12,"move":"quickstrike"},
      {"level":16,"move":"wingstrike"},
      {"level":24,"move":"calmmind"},
      {"level":28,"move":"skydive"},
      {"level":36,"move":"psychicray"}
    ],
    desc: "てんしの つばさを もつと いわれる。そらの まもりがみ。",
    sprite: "17_1"
  },
  14: {
    id: 14, name: "コロミミ", types: ["normal"],
    baseStats: {"hp":40,"atk":35,"def":45,"spa":30,"spdef":40,"spe":30},
    catchRate: 255, expYield: 45, evolvesTo: 15, evolveLevel: 14,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":4,"move":"growl"},
      {"level":8,"move":"quickstrike"},
      {"level":12,"move":"bodyblow"}
    ],
    desc: "ふわふわの こウサギ。おおきな みみで とおくの おとを きく。",
    sprite: "21_0"
  },
  15: {
    id: 15, name: "ハナミミナ", types: ["normal","grass"],
    baseStats: {"hp":60,"atk":55,"def":55,"spa":80,"spdef":70,"spe":60},
    catchRate: 120, expYield: 138, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":1,"move":"seedshot"},
      {"level":12,"move":"sleepspore"},
      {"level":16,"move":"gust"},
      {"level":20,"move":"megadrain"},
      {"level":26,"move":"poisonspore"},
      {"level":30,"move":"solarburst"}
    ],
    desc: "みみから ツルと はなを さかせた すがた。あまい かおりで みかたを いやす。",
    sprite: "21_1"
  },
  16: {
    id: 16, name: "イワゴロン", types: ["rock"],
    baseStats: {"hp":60,"atk":65,"def":85,"spa":30,"spdef":35,"spe":25},
    catchRate: 150, expYield: 78, evolvesTo: 17, evolveLevel: 25,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":5,"move":"harden"},
      {"level":9,"move":"rockthrow"},
      {"level":16,"move":"screech"},
      {"level":20,"move":"rockslide"}
    ],
    desc: "いわの こうらを もつ アルマジロ。まるまって みを まもる。",
    sprite: "45_0"
  },
  17: {
    id: 17, name: "ガンセキオー", types: ["rock","fighting"],
    baseStats: {"hp":85,"atk":110,"def":110,"spa":45,"spdef":60,"spe":60},
    catchRate: 75, expYield: 165, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":1,"move":"rockthrow"},
      {"level":16,"move":"screech"},
      {"level":20,"move":"rockslide"},
      {"level":26,"move":"karatechop"},
      {"level":31,"move":"risingfist"},
      {"level":38,"move":"stoneedge"}
    ],
    desc: "やまの ぬしと よばれる よろいの せんし。いわの ツメで たたかう。",
    sprite: "45_2"
  },
  18: {
    id: 18, name: "ロボルト", types: ["electric"],
    baseStats: {"hp":40,"atk":45,"def":40,"spa":65,"spdef":50,"spe":60},
    catchRate: 190, expYield: 70, evolvesTo: 19, evolveLevel: 26,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":5,"move":"sparkshot"},
      {"level":9,"move":"growl"},
      {"level":13,"move":"quickstrike"},
      {"level":17,"move":"thunderwave"},
      {"level":22,"move":"wildvolt"}
    ],
    desc: "でんきで うごく ふしぎな カラクリ。タイヤで はしりまわる。",
    sprite: "44_0"
  },
  19: {
    id: 19, name: "ゴウボルト", types: ["electric"],
    baseStats: {"hp":65,"atk":70,"def":65,"spa":105,"spdef":75,"spe":80},
    catchRate: 75, expYield: 160, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"sparkshot"},
      {"level":1,"move":"growl"},
      {"level":13,"move":"quickstrike"},
      {"level":17,"move":"thunderwave"},
      {"level":22,"move":"wildvolt"},
      {"level":30,"move":"speedup"},
      {"level":34,"move":"thunderstorm"}
    ],
    desc: "おおきく しんかした カラクリ。からだから いなずまを はなつ。",
    sprite: "44_1"
  },
  20: {
    id: 20, name: "マジョニャ", types: ["ghost"],
    baseStats: {"hp":35,"atk":40,"def":35,"spa":75,"spdef":55,"spe":50},
    catchRate: 180, expYield: 72, evolvesTo: 21, evolveLevel: 28,
    learnset: [
      {"level":1,"move":"shadowsneak"},
      {"level":5,"move":"spookygaze"},
      {"level":9,"move":"willowisp"},
      {"level":13,"move":"shadowclaw"},
      {"level":18,"move":"hypnosis"},
      {"level":24,"move":"phantomray"}
    ],
    desc: "まよなかに あらわれる ふしぎな こねこ。ぼうしが おきにいり。",
    sprite: "47_0"
  },
  21: {
    id: 21, name: "マジョネコ", types: ["ghost"],
    baseStats: {"hp":60,"atk":55,"def":60,"spa":110,"spdef":90,"spe":95},
    catchRate: 70, expYield: 165, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"shadowsneak"},
      {"level":1,"move":"spookygaze"},
      {"level":13,"move":"shadowclaw"},
      {"level":18,"move":"hypnosis"},
      {"level":24,"move":"phantomray"},
      {"level":30,"move":"willowisp"},
      {"level":36,"move":"calmmind"}
    ],
    desc: "ほしの ステッキで まほうを つかう。やみよに めが ひかる。",
    sprite: "47_1"
  },
  22: {
    id: 22, name: "ミライム", types: ["psychic"],
    baseStats: {"hp":70,"atk":45,"def":65,"spa":110,"spdef":110,"spe":80},
    catchRate: 60, expYield: 168, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"mindwave"},
      {"level":8,"move":"calmmind"},
      {"level":14,"move":"hypnosis"},
      {"level":20,"move":"psychicray"},
      {"level":28,"move":"selfheal"}
    ],
    desc: "ピンクいろの ふしぎな スライム。みらいが すこし みえるという。",
    sprite: "19_0"
  },
  23: {
    id: 23, name: "コブシマル", types: ["fighting"],
    baseStats: {"hp":75,"atk":110,"def":70,"spa":40,"spdef":65,"spe":100},
    catchRate: 75, expYield: 160, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"karatechop"},
      {"level":6,"move":"growl"},
      {"level":12,"move":"fightspirit"},
      {"level":18,"move":"bodyblow"},
      {"level":24,"move":"risingfist"},
      {"level":32,"move":"recklesscharge"}
    ],
    desc: "まいあさ たきに むかって こぶしを みがく ボクサーうさぎ。",
    sprite: "21_2"
  },
  24: {
    id: 24, name: "ヌシゴイ", types: ["water"],
    baseStats: {"hp":100,"atk":85,"def":80,"spa":65,"spdef":80,"spe":80},
    catchRate: 45, expYield: 170, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"aquashot"},
      {"level":8,"move":"harden"},
      {"level":14,"move":"aquafang"},
      {"level":20,"move":"hydroblast"},
      {"level":28,"move":"bodyblow"},
      {"level":36,"move":"tidalwave"}
    ],
    desc: "みずうみの ぬし。ひゃくねん いきた さかなの なれのはて。",
    sprite: "22_1"
  },
  25: {
    id: 25, name: "カセキドン", types: ["rock","psychic"],
    baseStats: {"hp":80,"atk":70,"def":110,"spa":95,"spdef":90,"spe":50},
    catchRate: 35, expYield: 175, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"rockthrow"},
      {"level":10,"move":"mindwave"},
      {"level":16,"move":"harden"},
      {"level":22,"move":"rockslide"},
      {"level":28,"move":"psychicray"},
      {"level":36,"move":"stoneedge"}
    ],
    desc: "いせきで みつかった ひかる かめん。ふしぎな ちからを やどす。",
    sprite: "27_0"
  },
  26: {
    id: 26, name: "ホシリュウ", types: ["flying","psychic"],
    baseStats: {"hp":95,"atk":85,"def":90,"spa":125,"spdef":95,"spe":90},
    catchRate: 5, expYield: 220, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"gust"},
      {"level":1,"move":"mindwave"},
      {"level":18,"move":"wingstrike"},
      {"level":24,"move":"psychicray"},
      {"level":28,"move":"calmmind"},
      {"level":32,"move":"skydive"},
      {"level":36,"move":"selfheal"},
      {"level":40,"move":"thunderstorm"}
    ],
    desc: "おなかの ほしどけいで ときを よむ あおき でんせつの りゅう。",
    sprite: "42_2"
  },
  27: {
    id: 27, name: "フクロン", types: ["normal","flying"],
    baseStats: {"hp":60,"atk":50,"def":50,"spa":70,"spdef":75,"spe":55},
    catchRate: 160, expYield: 95, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":8,"move":"gust"},
      {"level":14,"move":"hypnosis"},
      {"level":20,"move":"wingstrike"},
      {"level":28,"move":"psychicray"}
    ],
    desc: "おうかんを かぶった フクロウの おうさま。よるの もりを みまもる。",
    sprite: "34_0"
  },
  28: {
    id: 28, name: "テレビット", types: ["electric"],
    baseStats: {"hp":45,"atk":45,"def":40,"spa":65,"spdef":50,"spe":85},
    catchRate: 190, expYield: 70, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"growl"},
      {"level":6,"move":"sparkshot"},
      {"level":12,"move":"quickstrike"},
      {"level":18,"move":"thunderwave"},
      {"level":26,"move":"wildvolt"}
    ],
    desc: "あたまの がめんに きもちが うつる。アンテナで でんぱを キャッチ。",
    sprite: "36_0"
  },
  29: {
    id: 29, name: "カサメレオン", types: ["grass","psychic"],
    baseStats: {"hp":65,"atk":40,"def":60,"spa":75,"spdef":80,"spe":35},
    catchRate: 150, expYield: 105, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"seedshot"},
      {"level":10,"move":"sleepspore"},
      {"level":16,"move":"mindwave"},
      {"level":22,"move":"megadrain"},
      {"level":30,"move":"psychicray"}
    ],
    desc: "しっぽの かさで あめやどりする カメレオン。きぶんで いろが かわる。",
    sprite: "33_0"
  },
  30: {
    id: 30, name: "ヤマキリン", types: ["rock"],
    baseStats: {"hp":60,"atk":70,"def":75,"spa":40,"spdef":50,"spe":55},
    catchRate: 140, expYield: 100, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"tackle"},
      {"level":1,"move":"harden"},
      {"level":9,"move":"rockthrow"},
      {"level":16,"move":"quickstrike"},
      {"level":24,"move":"rockslide"},
      {"level":32,"move":"stoneedge"}
    ],
    desc: "せなかに ゆきの つもった やまを せおう キリン。のんびりや。",
    sprite: "24_0"
  },
  31: {
    id: 31, name: "ピラズマ", types: ["ghost","electric"],
    baseStats: {"hp":55,"atk":40,"def":55,"spa":85,"spdef":70,"spe":65},
    catchRate: 120, expYield: 115, evolvesTo: null, evolveLevel: null,
    learnset: [
      {"level":1,"move":"spookygaze"},
      {"level":1,"move":"sparkshot"},
      {"level":12,"move":"willowisp"},
      {"level":18,"move":"shadowsneak"},
      {"level":26,"move":"thunderwave"},
      {"level":34,"move":"phantomray"}
    ],
    desc: "いせきの ピラミッドに かみなりの たましいが やどった すがた。",
    sprite: "27_1"
  },
  32: {
    id: 32, name: "ニジマル", types: ["normal"],
    baseStats: {"hp":70,"atk":75,"def":70,"spa":90,"spdef":85,"spe":110},
    catchRate: 30, expYield: 180, evolvesTo: null, evolveLevel: null, rare: true,
    learnset: [
      {"level":1,"move":"quickstrike"},
      {"level":1,"move":"growl"},
      {"level":14,"move":"speedup"},
      {"level":20,"move":"bodyblow"},
      {"level":28,"move":"mindwave"},
      {"level":36,"move":"recklesscharge"}
    ],
    desc: "にじを たべて そだつという アリクイ。であえると こううんが おとずれる。",
    sprite: "28_0"
  },
  33: {
    id: 33, name: "オーロラス", types: ["water","psychic"],
    baseStats: {"hp":85,"atk":60,"def":80,"spa":100,"spdef":95,"spe":75},
    catchRate: 25, expYield: 190, evolvesTo: null, evolveLevel: null, rare: true,
    learnset: [
      {"level":1,"move":"aquashot"},
      {"level":1,"move":"calmmind"},
      {"level":16,"move":"gust"},
      {"level":24,"move":"psychicray"},
      {"level":32,"move":"hydroblast"},
      {"level":40,"move":"selfheal"}
    ],
    desc: "オーロラいろに かがやく シカ。みずうみの ほうせきと よばれる。",
    sprite: "50_0"
  },
  34: {
    id: 34, name: "リュウキシン", types: ["fighting","flying"],
    baseStats: {"hp":90,"atk":115,"def":85,"spa":110,"spdef":85,"spe":105},
    catchRate: 4, expYield: 230, evolvesTo: null, evolveLevel: null, legendary: true,
    learnset: [
      {"level":1,"move":"karatechop"},
      {"level":1,"move":"gust"},
      {"level":20,"move":"wingstrike"},
      {"level":28,"move":"risingfist"},
      {"level":34,"move":"skydive"},
      {"level":42,"move":"recklesscharge"}
    ],
    desc: "ぎんの よろいを まとった りゅうの きしん。ほしふるよるに まいおりる。",
    sprite: "51_2"
  },
  35: {
    id: 35, name: "ツキノカミ", types: ["psychic","ghost"],
    baseStats: {"hp":100,"atk":80,"def":90,"spa":130,"spdef":110,"spe":95},
    catchRate: 4, expYield: 240, evolvesTo: null, evolveLevel: null, legendary: true,
    learnset: [
      {"level":1,"move":"mindwave"},
      {"level":1,"move":"spookygaze"},
      {"level":22,"move":"hypnosis"},
      {"level":30,"move":"phantomray"},
      {"level":38,"move":"calmmind"},
      {"level":45,"move":"psychicray"}
    ],
    desc: "ここのつの おを もつ ぎんいろの きつねがみ。つきひかりの ほこらで ねむる。",
    sprite: "48_0"
  }
};
