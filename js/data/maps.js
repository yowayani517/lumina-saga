// ルミナちほう マップデータ (担当: ワールドチーム/リード引き継ぎ)
var GAME_START = { map: "home", x: 4, y: 4 };

var MAPS = {

  // ================= しゅじんこうのいえ =================
  home: {
    name: "ユウのいえ",
    music: "town",
    outdoor: false,
    tiles: [
      "##########",
      "#b_t____b#",
      "#________#",
      "#_mm_____#",
      "#_mm___t_#",
      "#________#",
      "#________#",
      "#____E___#",
      "##########"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "mom", x: 2, y: 2, sprite: "woman",
        dialogue: ["ママ『あら ユウ おはよう!", "きょうは カエデはかせが\nまっているわよ。", "けんきゅうじょは むらの\nひがしがわよ。いってらっしゃい!』"],
        altDialogue: { flag: "starter", lines: ["ママ『すてきな パートナーね!", "つかれたら いつでも\nかえってきなさいね。』"] },
        heal: true
      }
    ],
    warps: [{ x: 5, y: 7, to: "hajimari", tx: 5, ty: 5 }]
  },

  // ================= ハジマリむら =================
  hajimari: {
    name: "ハジマリむら",
    music: "town",
    outdoor: true,
    tiles: [
      "TTTTTTTTTTTPTTTTTTTT",
      "T..........P.......T",
      "T..RRRRR...P..RRRRRT",
      "T..RRRRR...P..RRRRRT",
      "T..BBDBB...P..BBDBBT",
      "T..,.P.,...P...,P..T",
      "T....P.....P....P..T",
      "T....PPPPPPPPPPPP..T",
      "T,...,.....P.......T",
      "T....F.....P...F...T",
      "T,...F..,..P...F..,T",
      "T....F.....P...F...T",
      "T.WWW......P......,T",
      "T.WWW......P..,....T",
      "T,.........,.......T",
      "TTTTTTTTTTTTTTTTTTTT"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "sign_village", x: 10, y: 8, sprite: "sign",
        dialogue: ["ハジマリむら\n「すべての ぼうけんは ここから」"]
      },
      {
        id: "blocker0", x: 11, y: 1, sprite: "oldman", hideIfFlag: "starter",
        dialogue: ["まちなさい!", "モンスターを つれずに くさむらへ\nいくのは きけんじゃよ!", "まずは けんきゅうじょの\nカエデはかせを たずねなさい。"]
      },
      {
        id: "girl1", x: 8, y: 10, sprite: "girl",
        dialogue: ["カエデはかせは すごいんだよ。", "モンスターの ことなら\nなんでも しってるんだから!"],
        altDialogue: { flag: "starter", lines: ["わあ! モンスターを\nつれてるんだね!", "くさむらでは モンスターが\nとびだしてくるから きをつけて!"] }
      },
      {
        id: "oldman1", x: 14, y: 12, sprite: "oldman",
        dialogue: ["むかしむかし ほしぞらから\nひかりが まいおりてな……", "それが でんせつのモンスター\nじゃと いわれておる。", "ホタルどうくつの おくで\nねむっている という うわさじゃ。"]
      },
      {
        id: "woman1", x: 4, y: 11, sprite: "woman",
        dialogue: ["きたの みちを ぬけると\nイシズエタウンよ。", "そこの ジムリーダーは\nいわタイプの つかいてなの。"]
      }
    ],
    warps: [
      { x: 11, y: 0, to: "route1", tx: 7, ty: 22 },
      { x: 5, y: 4, to: "home", tx: 5, ty: 6 },
      { x: 16, y: 4, to: "lab", tx: 6, ty: 7 }
    ]
  },

  // ================= けんきゅうじょ =================
  lab: {
    name: "カエデけんきゅうじょ",
    music: "center",
    outdoor: false,
    tiles: [
      "############",
      "#bb_ttt_bb_#",
      "#__________#",
      "#__________#",
      "#_t______t_#",
      "#__________#",
      "#__________#",
      "#__________#",
      "#_____E____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "prof", x: 5, y: 3, sprite: "prof",
        dialogue: ["カエデはかせ『おお ユウ!\nまっていたよ。", "きみに ぼうけんの パートナーを\nプレゼントしよう!", "さあ この 3びきの なかから\nすきな こを えらびたまえ!』"],
        altDialogue: { flag: "starter", lines: ["カエデはかせ『ずかんの かんせい\nたのんだよ!", "ジムバッジを 3つ あつめれば\nルミナホールに ちょうせんできるぞ。』"] },
        starter: true
      },
      {
        id: "rival", x: 7, y: 5, sprite: "rival",
        flagRequired: "starter", hideIfFlag: "rival1",
        dialogue: ["レン『よう ユウ!』"],
        trainer: {
          name: "ライバルの レン",
          portrait: "p_rival",
          party: [{ rival: true, stage: 1, level: 5 }],
          reward: 200,
          introDialogue: ["レン『おまえも はかせから\nモンスターを もらったのか!", "それなら さっそく しょうぶだ!\nオレの ほうが つよいぜ!』"],
          defeatDialogue: ["なっ なんで まけるんだ!"],
          afterDialogue: ["レン『つぎは まけないからな!\nルミナホールで まってるぜ!』"],
          flagSet: "rival1"
        }
      },
      {
        id: "assistant", x: 2, y: 6, sprite: "boy",
        dialogue: ["ぼくは はかせの じょしゅ。", "モンスターは レベルが あがると\nしんかする ことも あるんだ!"]
      }
    ],
    warps: [{ x: 6, y: 8, to: "hajimari", tx: 16, ty: 5 }]
  },

  // ================= 1ばんどうろ =================
  route1: {
    name: "1ばんどうろ",
    music: "route",
    outdoor: true,
    tiles: [
      "TTTTTTTPTTTTTT",
      "T.....,P.....T",
      "T.GGG..P..,..T",
      "T.GGG..P.GGG.T",
      "T.GGG..P.GGG.T",
      "T......P.GGG.T",
      "T..,...P.....T",
      "T...PPPP..F..T",
      "T...P.....F,.T",
      "T...P..GGGGG.T",
      "T...P..GGGGG.T",
      "T...P..GGGGG.T",
      "T...P........T",
      "T...PPPP..,..T",
      "T...,..P.....T",
      "T.GGG..P.GGG.T",
      "T.GGG..P.GGG.T",
      "T.GGG..P.GGG.T",
      "T......P.....T",
      "T..,...P...,.T",
      "T......P.....T",
      "T....,.P..,..T",
      "T......P.....T",
      "TTTTTTTPTTTTTT"
    ],
    encounterRate: 0.14,
    encounters: [
      { species: 10, min: 2, max: 4, weight: 40 },
      { species: 12, min: 2, max: 4, weight: 35 },
      { species: 14, min: 3, max: 5, weight: 25 }
    ],
    rareChance: 0.04,
    rareEncounters: [
      { species: 32, min: 5, max: 6, weight: 100 }
    ],
    npcs: [
      {
        id: "r1_boy", x: 8, y: 8, sprite: "boy",
        dialogue: ["かわいい モンスターあつめが\nオレの しゅみさ!"],
        trainer: {
          name: "モンスターずきの コタ",
          party: [{ species: 14, level: 3 }, { species: 10, level: 3 }],
          reward: 60,
          introDialogue: ["めが あったら しょうぶ!\nそれが トレーナーの ルールだ!"],
          defeatDialogue: ["つよいなあ……!"],
          afterDialogue: ["くさむらを よけて あるけば\nモンスターは でてこないんだぜ。"]
        }
      },
      {
        id: "r1_girl", x: 5, y: 16, sprite: "girl",
        dialogue: ["かわいい モンスター だいすき!"],
        trainer: {
          name: "ミニスカートの ユメ",
          party: [{ species: 12, level: 4 }],
          reward: 80,
          introDialogue: ["わたしの かわいい エアルン\nみせて あげる!"],
          defeatDialogue: ["まけちゃった〜!"],
          afterDialogue: ["イシズエタウンの ジムは\nいわタイプ。くさや みずが ゆうこうよ!"]
        }
      },
      { id: "r1_item1", x: 2, y: 6, sprite: "ball", item: "potion", hideIfFlag: "item_r1_potion", flagSetOnTalk: "item_r1_potion" },
      { id: "r1_item2", x: 11, y: 19, sprite: "ball", item: "capsule", hideIfFlag: "item_r1_capsule", flagSetOnTalk: "item_r1_capsule" },
      {
        id: "r1_sign", x: 8, y: 21, sprite: "sign",
        dialogue: ["↑ イシズエタウン\n↓ ハジマリむら"]
      }
    ],
    warps: [
      { x: 7, y: 23, to: "hajimari", tx: 11, ty: 1 },
      { x: 7, y: 0, to: "ishizue", tx: 8, ty: 16 }
    ]
  },

  // ================= イシズエタウン =================
  ishizue: {
    name: "イシズエタウン",
    music: "town",
    outdoor: true,
    theme: "rock",
    landmarks: [
      { image: "building_monster_center", x: 4, y: 5 },
      { image: "building_rock_gym", x: 15, y: 4 }
    ],
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTT",
      "T....,.......LLLLLT..T",
      "T.LLLLL......LLLLLT..T",
      "T.LLLLL......LLPLLT..T",
      "T.LLPLL.......P...T..T",
      "T...P.........P...T..T",
      "T...P.........P...T..T",
      "T...PPPPPPPPPPP...T..T",
      "T,......P.......,.T..T",
      "T..F....P....F....T..T",
      "T..F....P....F...,T..T",
      "T.......P.........T..T",
      "T..RRRR.P.........T..T",
      "T..RRRR.PPPPPPPPPPPPPP",
      "T..BBDB.P.....,...T..T",
      "T....,..P..,.....,T..T",
      "T.......P.........T..T",
      "TTTTTTTTPTTTTTTTTTTTTT"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "sign_town", x: 7, y: 8, sprite: "sign",
        dialogue: ["イシズエタウン\n「いしと ともに いきる まち」"]
      },
      {
        id: "blocker1", x: 18, y: 13, sprite: "man", hideIfFlag: "badge1",
        dialogue: ["ここから さきは あぶないよ。", "ジムバッジを もってない ひとは\nとおせない きまりなんだ。", "ジムは まちの きたがわに あるよ。"]
      },
      {
        id: "i_boy", x: 10, y: 11, sprite: "boy",
        dialogue: ["ジムリーダーの ゴロウさんは\nいわのように つよいんだ!", "でも くさタイプの わざなら\nいわを くだけるかも!"]
      },
      {
        id: "i_oldman", x: 3, y: 8, sprite: "oldman",
        dialogue: ["モンスターセンターでは\nただで かいふくしてくれるぞ。", "しろい びょういんのような\nたてものじゃよ。"]
      },
      {
        id: "i_girl", x: 16, y: 15, sprite: "girl",
        dialogue: ["ひがしの どうろの さきには\nホタルどうくつが あるの。", "よるみたいに くらいけど\nひかる いしが きれいなんだって!"]
      }
    ],
    warps: [
      { x: 8, y: 17, to: "route1", tx: 7, ty: 1 },
      { x: 4, y: 4, to: "center1", tx: 6, ty: 6 },
      { x: 15, y: 3, to: "gym1", tx: 5, ty: 9 },
      { x: 5, y: 14, to: "house1", tx: 5, ty: 5 },
      { x: 21, y: 13, to: "route2", tx: 1, ty: 5 }
    ]
  },

  // ================= モンスターセンター(イシズエ) =================
  center1: {
    name: "モンスターセンター",
    music: "center",
    outdoor: false,
    theme: "hospital",
    tiles: [
      "############",
      "#h________t#",
      "#___cc_cc__#",
      "#__________#",
      "#_t______t_#",
      "#__________#",
      "#__________#",
      "#_____E____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "nurse", x: 6, y: 2, sprite: "nurse",
        dialogue: ["いらっしゃいませ!\nモンスターセンターです。", "モンスターたちを\nおあずかり しますね。"],
        heal: true
      },
      {
        id: "clerk", x: 9, y: 3, sprite: "clerk",
        dialogue: ["いらっしゃい!\nなにを おもとめですか?"],
        shop: ["capsule", "potion"]
      },
      {
        id: "c1_boy", x: 2, y: 5, sprite: "boy",
        dialogue: ["モンスターカプセルは\nよわらせてから なげると\nつかまえやすいんだって!"]
      }
    ],
    warps: [{ x: 6, y: 7, to: "ishizue", tx: 4, ty: 5 }]
  },

  // ================= ジム1 (いわ) =================
  gym1: {
    name: "イシズエジム",
    music: "gym",
    outdoor: false,
    theme: "rock",
    tiles: [
      "############",
      "#__x____x__#",
      "#____mm____#",
      "#__x_mm_x__#",
      "#____mm____#",
      "#____mm____#",
      "#__x_mm_x__#",
      "#____mm____#",
      "#____mm____#",
      "#____mm____#",
      "#____EE____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "gym1_minion", x: 6, y: 6, sprite: "boy",
        dialogue: ["リーダーは そのさきだ!"],
        trainer: {
          name: "いわおとこの ガンタ",
          party: [{ species: 16, level: 8 }],
          reward: 160,
          introDialogue: ["リーダーに あいたければ\nまず オレを たおしていけ!"],
          defeatDialogue: ["かたい いしも くだけるか…!"],
          afterDialogue: ["リーダーの いわは\nもっと かたいぞ!"]
        }
      },
      {
        id: "gym1_leader", x: 5, y: 1, sprite: "leader1",
        dialogue: ["……。"],
        trainer: {
          name: "ジムリーダーの ゴロウ",
          portrait: "p_leader1",
          party: [{ species: 16, level: 10 }, { species: 17, level: 12 }],
          reward: 720,
          introDialogue: ["ようこそ。わしは ゴロウ。", "いわのこころは ゆるがぬ こころ。", "きみの かくごが ほんものか\nためさせて もらおう!"],
          defeatDialogue: ["みごとだ……\nいわよりも かたい いしを みた!"],
          afterDialogue: ["ロックバッジを もつ きみなら\nどこまでも いけるだろう。", "ひがしの どうろから\nつぎの まちを めざすと いい。"],
          flagSet: "badge1"
        }
      }
    ],
    warps: [
      { x: 5, y: 10, to: "ishizue", tx: 15, ty: 4 },
      { x: 6, y: 10, to: "ishizue", tx: 15, ty: 4 }
    ]
  },

  // ================= みんか(イシズエ) =================
  house1: {
    name: "みんか",
    music: "town",
    outdoor: false,
    tiles: [
      "##########",
      "#bb____tt#",
      "#________#",
      "#__mm____#",
      "#__mm____#",
      "#________#",
      "#____E___#",
      "##########"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "h1_oldwoman", x: 3, y: 3, sprite: "oldwoman",
        dialogue: ["モンスターには とくいな タイプと\nにがてな タイプが あるのよ。", "ほのおは くさに つよく\nみずに よわい。", "あいしょうを おぼえるのが\nつよさへの ちかみちよ。"]
      }
    ],
    warps: [{ x: 5, y: 6, to: "ishizue", tx: 5, ty: 15 }]
  },

  // ================= 2ばんどうろ =================
  route2: {
    name: "2ばんどうろ",
    music: "route",
    outdoor: true,
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "T.,..GGGG......,....MMMMMMMT",
      "T....GGGG..F.......MMMMMMMMT",
      "T....GGGG..F....,..MMMMMMMMT",
      "T..........F.......MMMCMMMMT",
      "PPPPPPPPPPPPPPPPPPPPPPP....T",
      "T...,....GGGG......,.......T",
      "T........GGGG..,...GGG.....T",
      "T..,.....GGGG......GGG..,..T",
      "T.................GGG......T",
      "T..,..........,............T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    encounterRate: 0.14,
    encounters: [
      { species: 10, min: 6, max: 9, weight: 28 },
      { species: 12, min: 6, max: 9, weight: 22 },
      { species: 14, min: 7, max: 9, weight: 18 },
      { species: 15, min: 10, max: 10, weight: 5 },
      { species: 18, min: 8, max: 9, weight: 17 },
      { species: 28, min: 7, max: 9, weight: 10 }
    ],
    rareChance: 0.05,
    rareEncounters: [
      { species: 32, min: 9, max: 11, weight: 100 }
    ],
    npcs: [
      {
        id: "r2_sign", x: 2, y: 4, sprite: "sign",
        dialogue: ["→ ホタルどうくつ\n← イシズエタウン"]
      },
      {
        id: "r2_boy", x: 7, y: 6, sprite: "boy",
        dialogue: ["とっくんの せいかを みせるぜ!"],
        trainer: {
          name: "たんパンこぞうの ダイチ",
          party: [{ species: 10, level: 7 }, { species: 14, level: 7 }],
          reward: 140,
          introDialogue: ["この みちを とおりたければ\nオレと しょうぶだ!"],
          defeatDialogue: ["はやすぎる……!"],
          afterDialogue: ["どうくつの なかは くらいから\nきを つけろよ!"]
        }
      },
      {
        id: "r2_girl", x: 15, y: 8, sprite: "girl",
        dialogue: ["そらを とぶ モンスターって\nかっこいいよね!"],
        trainer: {
          name: "そらつかいの ツバサ",
          party: [{ species: 12, level: 8 }, { species: 12, level: 8 }],
          reward: 160,
          introDialogue: ["わたしの エアルンたちの\nコンビネーション みせてあげる!"],
          defeatDialogue: ["そんなあ! つばさが おれちゃう!"],
          afterDialogue: ["でんきタイプには きをつけて。\nとりは でんきに よわいの。"]
        }
      },
      {
        id: "r2_rival", x: 13, y: 5, sprite: "rival",
        dialogue: ["レン『また あったな!』"],
        trainer: {
          name: "ライバルの レン",
          portrait: "p_rival",
          party: [{ species: 12, level: 8 }, { rival: true, stage: 1, level: 9 }],
          reward: 300,
          introDialogue: ["レン『おっ ユウ!\nバッジ とったみたいだな。", "オレも つよくなったぜ。\nどっちが うえか きめようぜ!』"],
          defeatDialogue: ["くそっ まだ たりないのか…!"],
          afterDialogue: ["レン『おまえ ほんとに つよいな。", "オレは とっくんして ルミナホールで\nまってるからな!』"],
          flagSet: "rival2"
        }
      },
      { id: "r2_item1", x: 3, y: 2, sprite: "ball", item: "potion", hideIfFlag: "item_r2_potion", flagSetOnTalk: "item_r2_potion" },
      { id: "r2_item2", x: 24, y: 8, sprite: "ball", item: "capsule", hideIfFlag: "item_r2_capsule", flagSetOnTalk: "item_r2_capsule" }
    ],
    warps: [
      { x: 0, y: 5, to: "ishizue", tx: 20, ty: 13 },
      { x: 22, y: 4, to: "cave", tx: 3, ty: 13 }
    ]
  },

  // ================= ホタルどうくつ =================
  cave: {
    name: "ホタルどうくつ",
    music: "cave",
    outdoor: false,
    tiles: [
      "MMMMMMMMMMMMMMMMMMMM",
      "MMCCCCCCMMMCCCCCCCMM",
      "MMCGGCCCCCCCGGCCCCMM",
      "MMCGGCMMMMCCGGCMMCMM",
      "MMCCCCMMMMCCCCCMMCMM",
      "MMMMCCCMMMMxCCCMMCMM",
      "MMGGCCCMMMMCCMMMMCMM",
      "MMGGCCCCCCMCCMMCCCMM",
      "MMGGCMMMMCMCCMMCMMMM",
      "MMCCCMMMMCCCCCMCCCMM",
      "MMCMMMMMMMMMMCMMMCMM",
      "MMCCCCCGGGMMMCCCCCMM",
      "MMMMMCCGGGMMMMCMMMMM",
      "MMMCCCCGGGMCCCCCMMMM",
      "MMMCMMMMMMMCCMMMMMMM",
      "MMMMMMMMMMMMMMMMMMMM"
    ],
    encounterRate: 0.16,
    encounters: [
      { species: 16, min: 12, max: 15, weight: 38 },
      { species: 20, min: 13, max: 15, weight: 30 },
      { species: 23, min: 14, max: 14, weight: 14 },
      { species: 25, min: 14, max: 14, weight: 8 },
      { species: 31, min: 13, max: 15, weight: 10 }
    ],
    rareChance: 0.06,
    rareEncounters: [
      { species: 31, min: 14, max: 16, weight: 70 },
      { species: 26, min: 30, max: 30, weight: 30 }
    ],
    npcs: [
      {
        id: "cv_man", x: 4, y: 4, sprite: "man",
        dialogue: ["この ひかりごけ きれいだろ?"],
        trainer: {
          name: "たんけんかの イワオ",
          party: [{ species: 20, level: 13 }, { species: 16, level: 12 }],
          reward: 280,
          introDialogue: ["どうくつの ぬしは オレだ!\nとおりたければ かかってこい!"],
          defeatDialogue: ["まいった まいった!"],
          afterDialogue: ["このおくで ほしのように ひかる\nおおきな かげを みたんだ……", "あれが でんせつの モンスター\nなのかも しれない。"]
        }
      },
      {
        id: "cv_boy", x: 12, y: 7, sprite: "boy",
        dialogue: ["まっくらで まいごに なりそう!"],
        trainer: {
          name: "たんけんこぞうの ホリオ",
          party: [{ species: 16, level: 13 }],
          reward: 260,
          introDialogue: ["どうくつで あうのも なにかのえん!\nしょうぶしようぜ!"],
          defeatDialogue: ["つよっ!?"],
          afterDialogue: ["でぐちは きたの ほうだぜ。\nひかりを たどって いくといい。"]
        }
      },
      { id: "cv_item1", x: 3, y: 6, sprite: "ball", item: "superpotion", hideIfFlag: "item_cv_sp", flagSetOnTalk: "item_cv_sp" },
      { id: "cv_item2", x: 8, y: 11, sprite: "ball", item: "greatcapsule", hideIfFlag: "item_cv_gc", flagSetOnTalk: "item_cv_gc" },
      { id: "cv_item3", x: 16, y: 13, sprite: "ball", item: "revive", hideIfFlag: "item_cv_rv", flagSetOnTalk: "item_cv_rv" }
    ],
    warps: [
      { x: 3, y: 13, to: "route2", tx: 22, ty: 5 },
      { x: 17, y: 1, to: "raiden", tx: 18, ty: 16 }
    ]
  },

  // ================= ライデンシティ =================
  raiden: {
    name: "ライデンシティ",
    music: "town",
    outdoor: true,
    theme: "electric",
    landmarks: [
      { image: "building_monster_center", x: 6, y: 4 },
      { image: "building_electric_gym", x: 15, y: 4 }
    ],
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTT",
      "T...LLLLL....LLLLL..TT",
      "T...LLLLL....LLLLL..TT",
      "T...LLPLL....LLPLL..TT",
      "T.....P........P....TT",
      "T.....P........P....TT",
      "T..PPPPPPPPPPPPPPPP.TT",
      "T..P..,...........P.TT",
      "T..P...RRRR...,...P.TT",
      "T..P...RRRR.......P.TT",
      "T..P...BBDB.......PPPP",
      "T..P....P......,..P.TT",
      "T..PPPPPP..WWW....P.TT",
      "T....,.....WWW....P.TT",
      "T..,.......WWW..,.P.TT",
      "T.................P.TT",
      "T.................P.TT",
      "TTTTTTTTTTTTTTTTTTPTTT"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "sign_raiden", x: 4, y: 7, sprite: "sign",
        dialogue: ["ライデンシティ\n「いなずまの かがやく まち」"]
      },
      {
        id: "blocker2", x: 20, y: 10, sprite: "man", hideIfFlag: "badge2",
        dialogue: ["この さきは 3ばんどうろ。", "スパークバッジを もってないなら\nとおすわけには いかないな。"]
      },
      {
        id: "ra_girl", x: 6, y: 7, sprite: "girl",
        dialogue: ["ジムリーダーの デンマさんは\nでんきタイプの たつじん!", "いわタイプなら でんきが\nきかないって しってた?"]
      },
      {
        id: "ra_man", x: 15, y: 13, sprite: "man",
        dialogue: ["みなみの どうくつを ぬけてきたのか!\nすごいな!", "つぎの まち ヨゾラシティには\nゴーストつかいの ジムが あるぞ。"]
      },
      {
        id: "ra_oldman", x: 8, y: 15, sprite: "oldman",
        dialogue: ["みずうみの ぬしを みたことが\nあるかね?", "3ばんどうろの みずうみに\nぬしが すんでいると いう……"]
      }
    ],
    warps: [
      { x: 18, y: 17, to: "cave", tx: 17, ty: 2 },
      { x: 6, y: 3, to: "center2", tx: 6, ty: 6 },
      { x: 15, y: 3, to: "gym2", tx: 5, ty: 9 },
      { x: 9, y: 10, to: "house2", tx: 5, ty: 5 },
      { x: 21, y: 10, to: "route3", tx: 1, ty: 5 }
    ]
  },

  // ================= モンスターセンター(ライデン) =================
  center2: {
    name: "モンスターセンター",
    music: "center",
    outdoor: false,
    theme: "hospital",
    tiles: [
      "############",
      "#h________t#",
      "#___cc_cc__#",
      "#__________#",
      "#_t______t_#",
      "#__________#",
      "#__________#",
      "#_____E____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "nurse", x: 6, y: 2, sprite: "nurse",
        dialogue: ["いらっしゃいませ!", "モンスターたちを\nげんきに しますね。"],
        heal: true
      },
      {
        id: "clerk", x: 9, y: 3, sprite: "clerk",
        dialogue: ["いらっしゃい!\nしなぞろえ ばっちりですよ!"],
        shop: ["capsule", "greatcapsule", "potion", "superpotion", "fullheal"]
      },
      {
        id: "c2_woman", x: 2, y: 5, sprite: "woman",
        dialogue: ["どく じょうたいは たたかいが\nおわっても なおらないの。", "なんでもなおしを もっておくと\nあんしんよ。"]
      }
    ],
    warps: [{ x: 6, y: 7, to: "raiden", tx: 6, ty: 4 }]
  },

  // ================= ジム2 (でんき) =================
  gym2: {
    name: "ライデンジム",
    music: "gym",
    outdoor: false,
    theme: "electric",
    tiles: [
      "############",
      "#_t__m___t_#",
      "#____m_____#",
      "#_xxxxxxx__#",
      "#________x_#",
      "#_xxxxxx_x_#",
      "#_x______x_#",
      "#_x_xxxxxx_#",
      "#_x________#",
      "#_xxx_xxxx_#",
      "#____EE____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "gym2_minion", x: 6, y: 4, sprite: "girl",
        dialogue: ["ビリビリ いくわよ!"],
        trainer: {
          name: "でんきずきの シズク",
          party: [{ species: 18, level: 15 }],
          reward: 300,
          introDialogue: ["デンマさんに あうまえに\nわたしが あいてよ!"],
          defeatDialogue: ["しびれちゃった……"],
          afterDialogue: ["デンマさんの でんげきは\nほんとに はやいんだから!"]
        }
      },
      {
        id: "gym2_leader", x: 5, y: 1, sprite: "leader2",
        dialogue: ["……ビリッと いくぜ?"],
        trainer: {
          name: "ジムリーダーの デンマ",
          portrait: "p_leader2",
          party: [{ species: 18, level: 16 }, { species: 18, level: 16 }, { species: 19, level: 19 }],
          reward: 1140,
          introDialogue: ["オレは いなずまの デンマ!", "スピードこそ パワー!", "オレの でんこうせっかな バトル\nついてこれるか!?"],
          defeatDialogue: ["まぶしいぜ……\nオレの でんきより はやい とは!"],
          afterDialogue: ["スパークバッジは きみのものだ!", "ひがしの みずうみを こえれば\nヨゾラシティに つくぜ。"],
          flagSet: "badge2"
        }
      }
    ],
    warps: [
      { x: 5, y: 10, to: "raiden", tx: 15, ty: 4 },
      { x: 6, y: 10, to: "raiden", tx: 15, ty: 4 }
    ]
  },

  // ================= みんか(ライデン) =================
  house2: {
    name: "みんか",
    music: "town",
    outdoor: false,
    tiles: [
      "##########",
      "#bb____tt#",
      "#________#",
      "#__mm____#",
      "#__mm____#",
      "#________#",
      "#____E___#",
      "##########"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "h2_man", x: 3, y: 3, sprite: "man",
        dialogue: ["モンスターは 6ぴきまで\nつれて あるけるんだ。", "それいじょう つかまえると\nボックスに おくられるぞ。", "ボックスは メニューから\nいつでも みられるんだ。べんりだろ?"]
      }
    ],
    warps: [{ x: 5, y: 6, to: "raiden", tx: 9, ty: 11 }]
  },

  // ================= 3ばんどうろ =================
  route3: {
    name: "3ばんどうろ",
    music: "route",
    outdoor: true,
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "T,....GGG.....,...GGGG.....T",
      "T.....GGG..........GGGG....T",
      "T..F..GGG...WWWWW..GGGG..,.T",
      "T..F........WWWWW..........T",
      "PPPPPPPP....WWWWW...PPPPPPPP",
      "T......P....WWWWW...P......T",
      "T..,...PPPPPPPPPPPPPP..,...T",
      "T.GGGG.......,.......GGG...T",
      "T.GGGG...,........,..GGG.,.T",
      "T,.GGGG..............GGG...T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    encounterRate: 0.13,
    encounters: [
      { species: 13, min: 18, max: 21, weight: 26 },
      { species: 18, min: 17, max: 20, weight: 20 },
      { species: 11, min: 19, max: 19, weight: 18 },
      { species: 22, min: 19, max: 19, weight: 13 },
      { species: 24, min: 20, max: 20, weight: 10 },
      { species: 27, min: 18, max: 20, weight: 13 }
    ],
    rareChance: 0.05,
    rareEncounters: [
      { species: 33, min: 20, max: 22, weight: 100 }
    ],
    npcs: [
      {
        id: "r3_sign", x: 1, y: 6, sprite: "sign",
        dialogue: ["→ ヨゾラシティ\n← ライデンシティ"]
      },
      {
        id: "r3_girl", x: 9, y: 7, sprite: "girl",
        dialogue: ["みずうみ きれいでしょ?"],
        trainer: {
          name: "スイマーの ナミ",
          party: [{ species: 13, level: 19 }, { species: 18, level: 18 }],
          reward: 380,
          introDialogue: ["みずべの しょうぶは\nわたしの どくだんじょう!"],
          defeatDialogue: ["なみに のまれた きぶん……"],
          afterDialogue: ["みずうみの そこに おおきな かげが\nみえるときが あるの。ぬしかな?"]
        }
      },
      {
        id: "r3_man", x: 14, y: 7, sprite: "man",
        dialogue: ["つりは こころの しゅぎょうだ。"],
        trainer: {
          name: "つりびとの コウジ",
          party: [{ species: 24, level: 20 }],
          reward: 420,
          introDialogue: ["オレの つりあげた あいぼうの\nちからを みせてやろう!"],
          defeatDialogue: ["にがした さかなは おおきい……"],
          afterDialogue: ["ぬしさまは みずタイプ。\nでんきや くさが よく きくぞ。"]
        }
      },
      {
        id: "r3_oldman", x: 21, y: 9, sprite: "oldman",
        dialogue: ["としよりだと あなどるなよ?"],
        trainer: {
          name: "ベテランの ゲンゾウ",
          party: [{ species: 22, level: 20 }, { species: 11, level: 19 }],
          reward: 400,
          introDialogue: ["ながねん きたえた わしの チーム\nうけてみよ!"],
          defeatDialogue: ["ほっほう みごとじゃ!"],
          afterDialogue: ["ヨゾラシティの ジムリーダーは\nゴーストつかいの レイカどの。", "ノーマルわざは ゴーストに\nまったく きかんぞ。きをつけよ。"]
        }
      },
      { id: "r3_item1", x: 2, y: 1, sprite: "ball", item: "fullheal", hideIfFlag: "item_r3_fh", flagSetOnTalk: "item_r3_fh" },
      { id: "r3_item2", x: 24, y: 3, sprite: "ball", item: "hyperpotion", hideIfFlag: "item_r3_hp", flagSetOnTalk: "item_r3_hp" }
    ],
    warps: [
      { x: 0, y: 5, to: "raiden", tx: 20, ty: 10 },
      { x: 27, y: 5, to: "yozora", tx: 1, ty: 8 }
    ]
  },

  // ================= ヨゾラシティ =================
  yozora: {
    name: "ヨゾラシティ",
    music: "town",
    outdoor: true,
    theme: "ghost",
    landmarks: [
      { image: "building_monster_center", x: 6, y: 4 },
      { image: "building_ghost_gym", x: 15, y: 4 }
    ],
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTT",
      "T,..LLLLL....LLLLL..TT",
      "T...LLLLL....LLLLL..TT",
      "T...LLPLL....LLPLL..TT",
      "T.....P........P....TT",
      "T,....P........P....TT",
      "T..PPPPPPPPPPPPPPPP.TT",
      "T..P..............P.TT",
      "PPPP...RRRR.......P.TT",
      "T..,...RRRR.......P.TT",
      "T......BBDB.......P.TT",
      "T..,..............PPPP",
      "T....,.......WWW....TT",
      "T............WWW..,.TT",
      "T..,....,....WWW....TT",
      "T...................TT",
      "T,..,....,....,...,.TT",
      "TTTTTTTTTTPTTTTTTTTTTT"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "yo_man2", x: 12, y: 15, sprite: "man",
        dialogue: ["みなみの もりは こもれびのもり。", "その さきには ツキカゲむらが ある。", "ふるい いいつたえの のこる\nしずかな むらだよ。"]
      },
      {
        id: "sign_yozora", x: 4, y: 5, sprite: "sign",
        dialogue: ["ヨゾラシティ\n「ほしに いちばん ちかい まち」"]
      },
      {
        id: "blocker3", x: 20, y: 11, sprite: "man", hideIfFlag: "badge3",
        dialogue: ["この さきは ルミナホールへの みち。", "3つの バッジを もつものだけが\nとおれる きまりだ。"]
      },
      {
        id: "yo_boy", x: 17, y: 7, sprite: "boy",
        dialogue: ["ルミナホールには チャンピオンの\nリュウオウさんが いるんだ!", "ルミナちほうで いちばん つよい\nトレーナーなんだって!"]
      },
      {
        id: "yo_oldwoman", x: 11, y: 14, sprite: "oldwoman",
        dialogue: ["よぞらの ほしを みていると\nでんせつを おもいだすよ。", "ほしから まいおりた モンスターは\nいまも どこかで ねむっている……"]
      },
      {
        id: "yo_girl", x: 5, y: 12, sprite: "girl",
        dialogue: ["ゴーストタイプには ノーマルわざが\nきかないの。", "ゴーストか エスパーの わざで\nたたかうのが おすすめよ!"]
      }
    ],
    warps: [
      { x: 0, y: 8, to: "route3", tx: 26, ty: 5 },
      { x: 6, y: 3, to: "center3", tx: 6, ty: 6 },
      { x: 15, y: 3, to: "gym3", tx: 5, ty: 9 },
      { x: 9, y: 10, to: "house3", tx: 5, ty: 5 },
      { x: 21, y: 11, to: "route4", tx: 1, ty: 24 },
      { x: 10, y: 17, to: "route5", tx: 7, ty: 1 }
    ]
  },

  // ================= モンスターセンター(ヨゾラ) =================
  center3: {
    name: "モンスターセンター",
    music: "center",
    outdoor: false,
    theme: "hospital",
    tiles: [
      "############",
      "#h________t#",
      "#___cc_cc__#",
      "#__________#",
      "#_t______t_#",
      "#__________#",
      "#__________#",
      "#_____E____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "nurse", x: 6, y: 2, sprite: "nurse",
        dialogue: ["いらっしゃいませ!", "ルミナホールに いくまえに\nしっかり きゅうそく してくださいね。"],
        heal: true
      },
      {
        id: "clerk", x: 9, y: 3, sprite: "clerk",
        dialogue: ["いらっしゃい!\nさいごの たたかいの じゅんびは\nできていますか?"],
        shop: ["greatcapsule", "hypercapsule", "superpotion", "hyperpotion", "fullheal", "revive"]
      },
      {
        id: "c3_oldman", x: 2, y: 5, sprite: "oldman",
        dialogue: ["チャンピオンの きりふだは\nでんせつの モンスターだと いう うわさ……", "げんきのかけらを わすれるなよ。"]
      }
    ],
    warps: [{ x: 6, y: 7, to: "yozora", tx: 6, ty: 4 }]
  },

  // ================= ジム3 (ゴースト) =================
  gym3: {
    name: "ヨゾラジム",
    music: "gym",
    outdoor: false,
    theme: "ghost",
    tiles: [
      "############",
      "#_t__m___t_#",
      "#__x_m_x___#",
      "#x___m___x_#",
      "#__x_m_x___#",
      "#____m_____#",
      "#xx_xmx_xx_#",
      "#____m_____#",
      "#_x__m__x__#",
      "#__x_m_x___#",
      "#____EE____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "gym3_minion", x: 4, y: 7, sprite: "woman",
        dialogue: ["うふふ…… きたのね。"],
        trainer: {
          name: "きとうしの ミヤビ",
          party: [{ species: 20, level: 22 }],
          reward: 440,
          introDialogue: ["この ジムは まよなかの やみ……\nぬけられるかしら?"],
          defeatDialogue: ["やみが はらわれた……"],
          afterDialogue: ["レイカさまは やみの むこうで\nまっておられるわ。"]
        }
      },
      {
        id: "gym3_leader", x: 5, y: 1, sprite: "leader3",
        dialogue: ["…………ふふ。"],
        trainer: {
          name: "ジムリーダーの レイカ",
          portrait: "p_leader3",
          party: [{ species: 20, level: 23 }, { species: 20, level: 24 }, { species: 21, level: 26 }],
          reward: 1560,
          introDialogue: ["ようこそ…… わたしは レイカ。", "みえないものを おそれる こころが\nあなたを よわくする……", "さあ やみの せかいへ\nごしょうたい しましょう。"],
          defeatDialogue: ["やみの むこうに……\nひかりが みえたわ……"],
          afterDialogue: ["ファントムバッジは あなたのもの。", "3つの バッジを あつめた あなたは\nルミナホールへ いけるわ。", "チャンピオン リュウオウ……\nきをつけて いきなさい。"],
          flagSet: "badge3"
        }
      }
    ],
    warps: [
      { x: 5, y: 10, to: "yozora", tx: 15, ty: 4 },
      { x: 6, y: 10, to: "yozora", tx: 15, ty: 4 }
    ]
  },

  // ================= みんか(ヨゾラ) =================
  house3: {
    name: "みんか",
    music: "town",
    outdoor: false,
    tiles: [
      "##########",
      "#bb____tt#",
      "#________#",
      "#__mm____#",
      "#__mm____#",
      "#________#",
      "#____E___#",
      "##########"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "h3_girl", x: 3, y: 3, sprite: "girl",
        dialogue: ["ねむり じょうたいの モンスターは\nつかまえやすいんだよ!", "HPを ぎりぎりまで へらして\nねむらせてから カプセル!", "これが プロの テクニック!"]
      }
    ],
    warps: [{ x: 5, y: 6, to: "yozora", tx: 9, ty: 11 }]
  },

  // ================= 4ばんどうろ =================
  route4: {
    name: "4ばんどうろ",
    music: "route",
    outdoor: true,
    landmarks: [
      { image: "building_lumina_hall", x: 7.5, y: 5 }
    ],
    tiles: [
      "TTTTTTTTTTTTTTTT",
      "T...TTTTTTTT...T",
      "T...TTTTTTTT...T",
      "T...TTTTTTTT...T",
      "T......PP......T",
      "T......PP......T",
      "T..,...PP...,..T",
      "T......PP......T",
      "T.GGGG.PP.GGG..T",
      "T.GGGG.PP.GGG..T",
      "T.GGGG.PP.GGG..T",
      "T......PP......T",
      "T..,...PP......T",
      "T......PP..,...T",
      "T.GGG..PP.GGGG.T",
      "T.GGG..PP.GGGG.T",
      "T.GGG..PP.GGGG.T",
      "T......PP......T",
      "T..,...PP...,..T",
      "T......PP......T",
      "T.GGG..PP.GGG..T",
      "T.GGG..PP.GGG..T",
      "T......PP......T",
      "T..,...PP..,...T",
      "PPPPPPPPP......T",
      "TTTTTTTTTTTTTTTT"
    ],
    encounterRate: 0.13,
    encounters: [
      { species: 13, min: 25, max: 28, weight: 26 },
      { species: 17, min: 25, max: 27, weight: 17 },
      { species: 19, min: 25, max: 27, weight: 17 },
      { species: 21, min: 26, max: 28, weight: 17 },
      { species: 23, min: 26, max: 26, weight: 10 },
      { species: 30, min: 25, max: 28, weight: 13 }
    ],
    rareChance: 0.06,
    rareEncounters: [
      { species: 33, min: 27, max: 29, weight: 60 },
      { species: 34, min: 38, max: 38, weight: 40 }
    ],
    npcs: [
      {
        id: "r4_sign", x: 5, y: 23, sprite: "sign",
        dialogue: ["↑ ルミナホール\nつわものたちの さいごの みち"]
      },
      {
        id: "r4_man", x: 8, y: 18, sprite: "man",
        dialogue: ["ここまで これたとはな!"],
        trainer: {
          name: "エリートの タケル",
          party: [{ species: 13, level: 26 }, { species: 19, level: 25 }],
          reward: 520,
          introDialogue: ["ルミナホールに いどむものよ!\nまず オレが ためしてやる!"],
          defeatDialogue: ["これほどとは……!"],
          afterDialogue: ["きみなら チャンピオンに\nとどくかも しれないな。"]
        }
      },
      {
        id: "r4_woman", x: 7, y: 12, sprite: "woman",
        dialogue: ["ここからが ほんばんよ。"],
        trainer: {
          name: "エリートの アヤメ",
          party: [{ species: 21, level: 26 }, { species: 17, level: 25 }],
          reward: 540,
          introDialogue: ["この みちを こえたいなら\nわたしを たおしてから!"],
          defeatDialogue: ["かんぺきな バトルだったわ……"],
          afterDialogue: ["チャンピオンの リュウオウは\nでんせつを したがえると いうわ。"]
        }
      },
      {
        id: "r4_boy", x: 8, y: 5, sprite: "boy",
        dialogue: ["ホールは もう めのまえだ!"],
        trainer: {
          name: "かくとうずきの ゴウ",
          party: [{ species: 23, level: 26 }, { species: 13, level: 25 }],
          reward: 520,
          introDialogue: ["きあいだーー!!\nオレの こぶしを うけてみろ!"],
          defeatDialogue: ["ぐはっ! いい きあいだ!"],
          afterDialogue: ["きみの モンスターには\nたましいが こもってるぜ!"]
        }
      },
      {
        id: "r4_rival", x: 7, y: 7, sprite: "rival",
        dialogue: ["レン『よお。』"],
        trainer: {
          name: "ライバルの レン",
          portrait: "p_rival",
          party: [
            { species: 13, level: 27 },
            { species: 15, level: 26 },
            { rival: true, stage: 3, level: 29 }
          ],
          reward: 1200,
          introDialogue: ["レン『ユウ…… やっぱり きたか。", "チャンピオンに いどむまえに\nオレを こえていけ!", "これが オレの ぜんりょくだ!!』"],
          defeatDialogue: ["……かんぺきに まけた。"],
          afterDialogue: ["レン『おまえは オレの\nさいこうの ライバルだ。", "いけよ ユウ。\nチャンピオンを たおしてこい!』"],
          flagSet: "rival3"
        }
      },
      { id: "r4_item1", x: 12, y: 6, sprite: "ball", item: "revive", hideIfFlag: "item_r4_rv", flagSetOnTalk: "item_r4_rv" },
      { id: "r4_item2", x: 11, y: 13, sprite: "ball", item: "hypercapsule", hideIfFlag: "item_r4_hc", flagSetOnTalk: "item_r4_hc" },
      { id: "r4_item3", x: 3, y: 23, sprite: "ball", item: "hyperpotion", hideIfFlag: "item_r4_hp", flagSetOnTalk: "item_r4_hp" }
    ],
    warps: [
      { x: 0, y: 24, to: "yozora", tx: 20, ty: 11 },
      { x: 7, y: 4, to: "hall", tx: 6, ty: 13 },
      { x: 8, y: 4, to: "hall", tx: 7, ty: 13 }
    ]
  },

  // ================= ルミナホール =================
  hall: {
    name: "ルミナホール",
    music: "gym",
    outdoor: false,
    theme: "champion",
    tiles: [
      "##############",
      "#bb__mmmm__bb#",
      "#____mmmm____#",
      "#__t_mmmm_t__#",
      "#____mmmm____#",
      "#____mmmm____#",
      "#__t_mmmm_t__#",
      "#____mmmm____#",
      "#____mmmm____#",
      "#__t_mmmm_t__#",
      "#____mmmm____#",
      "#____mmmm____#",
      "#____mmmm____#",
      "#____mmmm____#",
      "#_____EE_____#",
      "##############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "hall_nurse", x: 2, y: 12, sprite: "nurse",
        dialogue: ["ここが さいごの かいふくポイントです。", "チャンピオンせんの まえに\nじゅんびを どうぞ。"],
        heal: true
      },
      {
        id: "champion", x: 6, y: 2, sprite: "champ",
        dialogue: ["……。"],
        altDialogue: { flag: "champion", lines: ["リュウオウ『チャンピオン ユウ。", "この ばしょは いつでも\nきみの ちょうせんを まっている。", "ルミナちほうの ぼうけんを\nたのしんでくれ。』"] },
        trainer: {
          name: "チャンピオンの リュウオウ",
          portrait: "p_champ",
          party: [
            { species: 13, level: 30 },
            { species: 17, level: 31 },
            { species: 19, level: 31 },
            { species: 22, level: 32 },
            { species: 26, level: 34 }
          ],
          reward: 5000,
          introDialogue: ["よく きた ちょうせんしゃよ。", "わたしは チャンピオンの リュウオウ。", "ほしの ちからを やどす ものとして\nきみの ひかりを ためそう。", "さあ…… でんせつに いどむがいい!"],
          defeatDialogue: ["みごとだ……!\nあたらしい ひかりの たんじょうだ!"],
          afterDialogue: ["きみこそ しんの チャンピオンだ。"],
          flagSet: "champion"
        }
      }
    ],
    warps: [
      { x: 6, y: 14, to: "route4", tx: 7, ty: 5 },
      { x: 7, y: 14, to: "route4", tx: 8, ty: 5 }
    ]
  },

  // ================= 5ばんどうろ (こもれびのもり) =================
  route5: {
    name: "こもれびのもり",
    music: "route",
    outdoor: true,
    tiles: [
      "TTTTTTTPTTTTTTTT",
      "T..,...P.......T",
      "T.GGG..P..GGG..T",
      "T.GGG..PP.GGG..T",
      "T.GGG...P......T",
      "T....,..P..,...T",
      "T..PPPPPP......T",
      "T..P....,..GGG.T",
      "T..P..GGGG.GGG.T",
      "T..P..GGGG....,T",
      "T..P..GGGG.....T",
      "T..PPPP....,...T",
      "T.....P..GGG...T",
      "T,....P..GGG.,.T",
      "T.....P..GGG...T",
      "T..,..P........T",
      "T.GGG.P.GGGG...T",
      "T.GGG.P.GGGG.,.T",
      "T.....P........T",
      "TTTTTTTPTTTTTTTT"
    ],
    encounterRate: 0.14,
    encounters: [
      { species: 29, min: 21, max: 24, weight: 30 },
      { species: 27, min: 21, max: 24, weight: 25 },
      { species: 14, min: 20, max: 23, weight: 20 },
      { species: 20, min: 22, max: 24, weight: 15 },
      { species: 2, min: 23, max: 25, weight: 10 }
    ],
    rareChance: 0.06,
    rareEncounters: [
      { species: 32, min: 22, max: 24, weight: 60 },
      { species: 33, min: 24, max: 26, weight: 40 }
    ],
    npcs: [
      {
        id: "r5_sign", x: 6, y: 1, sprite: "sign",
        dialogue: ["こもれびのもり\n↑ ヨゾラシティ  ↓ ツキカゲむら"]
      },
      {
        id: "r5_girl", x: 9, y: 7, sprite: "girl",
        dialogue: ["もりの きのこ かわいい!"],
        trainer: {
          name: "もりずきの モカ",
          party: [{ species: 29, level: 23 }, { species: 14, level: 22 }],
          reward: 460,
          introDialogue: ["もりの なかまたちの ちから\nみせて あげる!"],
          defeatDialogue: ["きのこたちが しょんぼり……"],
          afterDialogue: ["もりの ひがしに ふしぎな くぼみが\nあるの。なにか いる きがして……"]
        }
      },
      {
        id: "r5_man", x: 5, y: 13, sprite: "man",
        dialogue: ["よるの もりは ロマンだ。"],
        trainer: {
          name: "やちょうかんさつの フクジ",
          party: [{ species: 27, level: 24 }, { species: 27, level: 24 }],
          reward: 480,
          introDialogue: ["フクロンの かわいさを\nしらしめて やる!"],
          defeatDialogue: ["ホーホー…… まけたか。"],
          afterDialogue: ["ツキカゲむらは みなみだ。\nしずかで いい むらだぞ。"]
        }
      },
      { id: "r5_item1", x: 13, y: 2, sprite: "ball", item: "hyperpotion", hideIfFlag: "item_r5_hp", flagSetOnTalk: "item_r5_hp" },
      { id: "r5_item2", x: 2, y: 18, sprite: "ball", item: "hypercapsule", hideIfFlag: "item_r5_hc", flagSetOnTalk: "item_r5_hc" }
    ],
    warps: [
      { x: 7, y: 0, to: "yozora", tx: 10, ty: 16 },
      { x: 7, y: 19, to: "tsukikage", tx: 7, ty: 1 },
      { x: 14, y: 9, to: "kakushi", tx: 6, ty: 8 }
    ]
  },

  // ================= ツキカゲむら =================
  tsukikage: {
    name: "ツキカゲむら",
    music: "town",
    outdoor: true,
    theme: "moon",
    landmarks: [
      { image: "building_monster_center", x: 4, y: 5 }
    ],
    tiles: [
      "TTTTTTTPTTTTTTTTTTTT",
      "T......P.....,.....T",
      "T.LLLLL....RRRRR...T",
      "T.LLLLL....RRRRR...T",
      "T.LLPLL....BBDBB...T",
      "T...P........P.....T",
      "T...PPPPPPPPPP.....T",
      "T.WWWW...P....WWWW.T",
      "T.WWWW...P....WWWW.T",
      "T..,.....P..,......T",
      "T....PPPPPPPP......T",
      "T.,..P......P...,..T",
      "T....P......P......T",
      "TTTTTPTTTTTTTTTTTTTT"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "sign_tsuki", x: 8, y: 9, sprite: "sign",
        dialogue: ["ツキカゲむら\n「つきのひかりが まもる むら」"]
      },
      {
        id: "ts_oldwoman", x: 12, y: 9, sprite: "oldwoman",
        dialogue: ["むかし この むらは つきのかみさまに\nまもられて いたんだよ。", "かみさまは もりの おくの ほこらで\nいまも ねむって いるはずさ。", "ぎんいろの きつね……\nみた ものは しあわせに なれるとか。"]
      },
      {
        id: "ts_boy", x: 4, y: 11, sprite: "boy",
        dialogue: ["むらの みなみは ほしふるこうげん!", "よぞらから ほしが ふってくるんだ。\nレアな モンスターも いるんだって!"]
      },
      {
        id: "ts_woman", x: 15, y: 5, sprite: "woman",
        dialogue: ["みずろの おとが きこえる むらは\nおちつくでしょう?", "やすんでいきなさいな。"]
      }
    ],
    warps: [
      { x: 7, y: 0, to: "route5", tx: 7, ty: 18 },
      { x: 4, y: 4, to: "center4", tx: 6, ty: 6 },
      { x: 13, y: 4, to: "house4", tx: 5, ty: 5 },
      { x: 5, y: 13, to: "route6", tx: 1, ty: 5 }
    ]
  },

  // ================= モンスターセンター(ツキカゲ) =================
  center4: {
    name: "モンスターセンター",
    music: "center",
    outdoor: false,
    theme: "hospital",
    tiles: [
      "############",
      "#h________t#",
      "#___cc_cc__#",
      "#__________#",
      "#_t______t_#",
      "#__________#",
      "#__________#",
      "#_____E____#",
      "############"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "nurse", x: 6, y: 2, sprite: "nurse",
        dialogue: ["いらっしゃいませ!", "とおくまで よく きましたね。\nゆっくり やすんでください。"],
        heal: true
      },
      {
        id: "clerk", x: 9, y: 3, sprite: "clerk",
        dialogue: ["いらっしゃい!\nめずらしい しなも ありますよ!"],
        shop: ["hypercapsule", "hyperpotion", "fullheal", "revive"]
      }
    ],
    warps: [{ x: 6, y: 7, to: "tsukikage", tx: 4, ty: 5 }]
  },

  // ================= みんか(ツキカゲ) =================
  house4: {
    name: "みんか",
    music: "town",
    outdoor: false,
    tiles: [
      "##########",
      "#bb____tt#",
      "#________#",
      "#__mm____#",
      "#__mm____#",
      "#________#",
      "#____E___#",
      "##########"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "h4_oldman", x: 3, y: 3, sprite: "oldman",
        dialogue: ["わしは わかいころ つきのほこらで\nぎんいろの ひかりを みた。", "ほこらの いりぐちは こもれびのもりの\nひがしの くぼみに かくれておる。", "くさむらの おくじゃ。\nさがして みなされ。"]
      }
    ],
    warps: [{ x: 5, y: 6, to: "tsukikage", tx: 13, ty: 5 }]
  },

  // ================= ほしふるこうげん =================
  route6: {
    name: "ほしふるこうげん",
    music: "route",
    outdoor: true,
    tiles: [
      "TTTTTTTTTTTTTTTTTTTTTTTT",
      "TMMMM..GGG....MMMM..,..T",
      "TMMM...GGG.....MM......T",
      "TM..,..GGG..S......GG..T",
      "T...........SS.....GG..T",
      "PSSSSSSS.....S.....GG..T",
      "T......S....SS.........T",
      "T..GG..SSSSSS...MMMM...T",
      "T..GG.......S...M..M...T",
      "T..GG..,....S...M..M.,.T",
      "T...........SSSSS......T",
      "TTTTTTTTTTTTTTTTTTTTTTTT"
    ],
    encounterRate: 0.15,
    encounters: [
      { species: 30, min: 26, max: 29, weight: 30 },
      { species: 31, min: 26, max: 29, weight: 22 },
      { species: 28, min: 25, max: 28, weight: 20 },
      { species: 16, min: 26, max: 28, weight: 15 },
      { species: 27, min: 26, max: 28, weight: 13 }
    ],
    rareChance: 0.07,
    rareEncounters: [
      { species: 33, min: 28, max: 30, weight: 45 },
      { species: 32, min: 27, max: 29, weight: 35 },
      { species: 34, min: 40, max: 40, weight: 20 }
    ],
    npcs: [
      {
        id: "r6_sign", x: 2, y: 4, sprite: "sign",
        dialogue: ["ほしふるこうげん\nよるに なると ほしが ふる"]
      },
      {
        id: "r6_man", x: 9, y: 6, sprite: "man",
        dialogue: ["ほしの かけらを さがしてるんだ。"],
        trainer: {
          name: "ほしさがしの ガク",
          party: [{ species: 30, level: 27 }, { species: 31, level: 28 }],
          reward: 560,
          introDialogue: ["この こうげんの ぬしは オレ!\nかけらは わたさないぜ!"],
          defeatDialogue: ["ほしが おちてきた きぶんだ……"],
          afterDialogue: ["かみなりぐもが でる よるは\nおうごんの けものが あらわれる らしい。", "この こうげんの くさむらで\nまっていれば あえるかもな……"]
        }
      },
      {
        id: "r6_girl", x: 17, y: 9, sprite: "girl",
        dialogue: ["ほしを みに きたの!"],
        trainer: {
          name: "てんもんずきの ヒカリ",
          party: [{ species: 27, level: 27 }, { species: 22, level: 28 }],
          reward: 540,
          introDialogue: ["ほしの ちからを かりて\nしょうぶよ!"],
          defeatDialogue: ["ながれぼしに ねがっておけば\nよかった〜!"],
          afterDialogue: ["オーロラいろの はくちょうを\nみたことが あるの。ゆめみたいだった……"]
        }
      },
      { id: "r6_item1", x: 21, y: 1, sprite: "ball", item: "revive", hideIfFlag: "item_r6_rv", flagSetOnTalk: "item_r6_rv" },
      { id: "r6_item2", x: 17, y: 8, sprite: "ball", item: "hypercapsule", hideIfFlag: "item_r6_hc", flagSetOnTalk: "item_r6_hc" }
    ],
    warps: [
      { x: 0, y: 5, to: "tsukikage", tx: 5, ty: 12 }
    ]
  },

  // ================= つきのほこら (かくしどうくつ) =================
  kakushi: {
    name: "つきのほこら",
    music: "cave",
    outdoor: false,
    tiles: [
      "MMMMMMMMMMMMM",
      "MMMMCCCCCMMMM",
      "MMCCCCCCCCCMM",
      "MCCCxCCCxCCCM",
      "MCCCCCCCCCCCM",
      "MCCxCCCCCxCCM",
      "MMCCCCCCCCCMM",
      "MMMCCCCCCCMMM",
      "MMMMCCCCCMMMM",
      "MMMMMMCMMMMMM",
      "MMMMMMMMMMMMM"
    ],
    encounterRate: 0,
    encounters: null,
    npcs: [
      {
        id: "tsukinokami", x: 6, y: 3, monster: 35,
        hideIfFlag: "caught_tsukinokami",
        dialogue: ["……ぎんいろの きつねが\nしずかに こちらを みている。", "つきのひかりが あつまっていく……!"],
        wildBattle: {
          species: 35, level: 45,
          flagSet: "caught_tsukinokami",
          caughtDialogue: ["ツキノカミは あなたの こころを\nみとめた ようだ。", "ほこらに あたたかい ひかりが\nみちて いく……"]
        }
      },
      {
        id: "kk_item1", x: 2, y: 6, sprite: "ball", item: "fullheal", hideIfFlag: "item_kk_fh", flagSetOnTalk: "item_kk_fh"
      },
      {
        id: "kk_item2", x: 10, y: 6, sprite: "ball", item: "revive", hideIfFlag: "item_kk_rv", flagSetOnTalk: "item_kk_rv"
      }
    ],
    warps: [
      { x: 6, y: 9, to: "route5", tx: 14, ty: 9 }
    ]
  }
};
