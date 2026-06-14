# ルミナサーガ 開発仕様書 (v1.0)

完全オリジナルのモンスター収集RPG。ブラウザで動く(HTML+Canvas+JS、ビルド不要、file://でも動くよう非モジュールのscriptタグ読み込み)。
ゲーム内テキストは**ひらがな・カタカナのみ(漢字禁止)**。レトロ調。

## ファイル構成と担当

```
lumina-saga/
  index.html              … リード
  css/style.css           … リード
  js/data/typechart.js    … リード   (TYPES, TYPE_CHART)
  js/data/moves.js        … キャラデザ担当 (MOVES)
  js/data/monsters.js     … キャラデザ担当 (MONSTERS)
  js/data/items.js        … リード   (ITEMS)
  js/data/music.js        … サウンド担当 (MUSIC_TRACKS)
  js/data/maps.js         … ワールド担当 (MAPS, GAME_START)
  js/engine/*.js, js/scenes/*.js, js/main.js … リード
```

各データファイルは `var 変数名 = {...};` 形式でグローバル定義(`const`不可、`export`不可)。
**自分の担当ファイル以外は絶対に書かない。**

## タイプ (10種、キーは英語)

normal(ノーマル), fire(ほのお), water(みず), grass(くさ), electric(でんき),
fighting(かくとう), flying(ひこう), psychic(エスパー), rock(いわ), ghost(ゴースト)

相性表はリードが typechart.js に実装する。データ担当はキーだけ使えばよい。

## ステータスと計算式(参考、実装はリード)

- baseStats: hp, atk, def, spa, spdef, spe (種族値)
- 実数値: HP = floor(base*2*L/100)+L+10、他 = floor(base*2*L/100)+5
- ダメージはGB世代準拠の簡易式。STAB1.5、タイプ相性、乱数0.85-1.0、急所1.5。
- 状態異常: psn(どく), brn(やけど), par(まひ), slp(ねむり)

## MOVES スキーマ (moves.js)

```js
var MOVES = {
  "tackle": {
    name: "たいあたり",          // カナのみ、7文字以内推奨
    type: "normal",
    category: "physical",        // "physical" | "special" | "status"
    power: 40,                   // statusは0
    accuracy: 100,               // 必中は 100
    pp: 35,
    priority: 0,                 // でんこうせっか等は 1
    effect: null,                // 下記参照
    desc: "からだごと ぶつかって こうげきする"
  }
};
```

effect は null または以下のいずれか1つ:
- `{ kind:"status", status:"psn"|"brn"|"par"|"slp", chance:30 }` (chance:100で確定。status技は確定が基本)
- `{ kind:"stat", target:"self"|"foe", stat:"atk"|"def"|"spa"|"spdef"|"spe", stages:1, chance:100 }` (stagesは-2〜+2)
- `{ kind:"drain", ratio:0.5 }` (与ダメの50%回復)
- `{ kind:"recoil", ratio:0.25 }`
- `{ kind:"heal", ratio:0.5 }` (自分の最大HPの50%回復、power0のstatus技で使う)

必要技数: 約40種。各タイプに物理/特殊の打点があり、威力帯は 40/65/90/120(命中低め)。
状態異常技(どくのこな系/でんじは系/さいみん系/おにび系)、積み技(つるぎのまい系/かたくなる系)、
デバフ技(なきごえ系)、吸収技、反動技、先制技、自己回復技を含めること。
キー名は英小文字(例: "emberblast")。**技名・説明は本家ポケモンと同名にしない**(にたものは可)。

## MONSTERS スキーマ (monsters.js)

```js
var MONSTERS = {
  1: {
    id: 1,
    name: "????",                // カタカナ、6文字以内、完全オリジナル名
    types: ["grass"],            // 1〜2個
    baseStats: { hp:45, atk:49, def:49, spa:65, spdef:65, spe:45 },
    catchRate: 45,               // 3(伝説)〜255(雑魚)
    expYield: 60,                // 倒したときの経験値係数 50〜220
    evolvesTo: 2,                // 進化先id、なければ null
    evolveLevel: 16,             // なければ null
    learnset: [                  // レベル順。lv1に最低1つ攻撃技
      { level: 1, move: "tackle" },
      { level: 7, move: "..." }
    ],
    desc: "ずかんの せつめいぶん。カナのみ 30もじ ていど。",
    sprite: {
      palette: { "1":"#1d4a2f", "2":"#4caf50", "3":"#a5d6a7", "4":"#222222", "5":"#ffffff" },
      pixels: [
        "........................",   // 24行 x 24文字。"."=透明
        // 文字はpaletteのキー。輪郭は濃色、2段階の陰影をつけ、
        // 正面向き・接地・中央寄せでシルエットが明快なこと。
      ]
    }
  }
};
```

### 図鑑構成 (id固定、これに従う)

| id | 役割 | タイプ | 進化 | BST目安 |
|----|------|--------|------|---------|
| 1-3 | くさ御三家 | grass → grass → grass/flying | 16, 34 | 310/410/525 |
| 4-6 | ほのお御三家 | fire → fire → fire/fighting | 16, 34 | 310/410/525 |
| 7-9 | みず御三家 | water → water → water/psychic | 16, 34 | 310/410/525 |
| 10-11 | じゅうるい(ねずみ系) | normal | 18 | 250/420 |
| 12-13 | とり | normal/flying | 20 | 260/430 |
| 14-15 | むしっぽい草 | grass | 14 | 220/380 |
| 16-17 | いわ | rock → rock/fighting | 25 | 300/470 |
| 18-19 | でんき | electric | 26 | 300/460 |
| 20-21 | ゴースト | ghost | 28 | 290/470 |
| 22 | エスパー単独 | psychic | なし | 480 |
| 23 | かくとう単独 | fighting | なし | 460 |
| 24 | みずうみのぬし | water | なし | 490 |
| 25 | いわ/エスパーのかせき風 | rock/psychic | なし | 495 |
| 26 | でんせつ | flying/psychic | なし | 580, catchRate 5 |

learnsetはlv1〜lv40の間に4〜8個、3〜6レベルおき。進化後は進化前の学習を引き継ぐ前提
(エンジンが進化前のlearnsetを参照しないため、進化後にも序盤技を含めてよい)。
名前・デザインは本家ポケモンに似すぎないこと。

## ITEMS (リード実装、参照用)

capsule(モンスターカプセル), greatcapsule(スーパーカプセル), hypercapsule(ハイパーカプセル),
potion(キズぐすり30), superpotion(いいキズぐすり80), hyperpotion(すごいキズぐすり200),
fullheal(なんでもなおし), revive(げんきのかけら)

## MAPS スキーマ (maps.js)

```js
var GAME_START = { map: "home", x: 4, y: 6 };  // ゲーム開始位置(しゅじんこうのへや)

var MAPS = {
  "hajimari": {
    name: "ハジマリむら",
    music: "town",        // town|route|cave|center|gym のいずれか
    outdoor: true,
    tiles: [
      "TTTTTTTTTTTTTTTT",  // 全行同じ長さの文字列。下記タイル凡例
      "T..............T"
    ],
    encounterRate: 0.15,   // Gタイル1歩あたりのエンカウント率(なければ0)
    encounters: [          // null可
      { species: 10, min: 2, max: 4, weight: 40 }
    ],
    npcs: [ /* 下記 */ ],
    warps: [ { x: 7, y: 0, to: "route1", tx: 5, ty: 22 } ]
  }
};
```

### タイル凡例 (この文字のみ使用)

| 文字 | 内容 | 通行 |
|---|---|---|
| `.` | くさち/じめん | ○ |
| `,` | はなばたけ | ○ |
| `G` | くさむら(エンカウント) | ○ |
| `P` | みち | ○ |
| `S` | すなはま | ○ |
| `C` | どうくつのゆか | ○ |
| `_` | しつない ゆか | ○ |
| `m` | じゅうたん | ○ |
| `D` | ドア(通常warpを置く) | ○ |
| `E` | でぐちマット(warpを置く) | ○ |
| `W` | みず | × |
| `T` | き | × |
| `F` | さく | × |
| `M` | いわやま | × |
| `R` | やね | × |
| `B` | たてものかべ | × |
| `#` | しつないかべ | × |
| `b` | ほんだな | × |
| `c` | カウンター | × |
| `t` | つくえ/きかい | × |
| `h` | かいふくマシン | × |
| `x` | おおきないし | × |

建物は外観を R(屋根)+B(壁)+D(ドア) で表現。ドアタイルに warp を置く。
屋内マップは `#` で外周を囲い、`E` の出口マットに warp。

### NPC スキーマ

```js
{
  id: "lab_prof",            // マップ内ユニーク
  x: 5, y: 3,
  sprite: "prof",            // 下記の名前のみ: boy,girl,man,woman,oldman,oldwoman,
                             //   prof,rival,nurse,clerk,leader1,leader2,leader3,champ,sign,ball
  dialogue: ["こんにちは!", "いい てんきだね。"],   // 1要素=1ページ。1ページ最大3ぎょう改行は\n
  altDialogue: null,         // {flag:"badge1", lines:[...]} フラグ成立後はこちらを表示
  trainer: null,             // 下記トレーナー定義
  heal: false,               // true: 会話後パーティ全回復(ママ・ナースに)
  shop: null,                // ["capsule","potion"] 販売リスト(クラークに)
  starter: false,            // true: 御三家選択イベント(はかせ専用、flag "starter"が立つ)
  item: null,                // "potion" など。sprite:"ball"の落ちアイテム。取ると消える
  flagRequired: null,        // このフラグが立つまで非表示
  hideIfFlag: null           // このフラグが立ったら消える(通せんぼ解除や取得済みアイテム)
}
```

### トレーナー定義

```js
trainer: {
  name: "たんパンこぞうの ゴロタ",
  party: [ { species: 10, level: 4 }, { species: 12, level: 5 } ],
  reward: 120,                       // 賞金
  introDialogue: ["めが あったら しょうぶ!"],
  defeatDialogue: ["つよすぎる〜!"],   // 敗北時セリフ(戦闘画面に出る)
  afterDialogue: ["きみは ほんものだ。"],  // 再話時
  flagSet: null                      // 勝利後に立てるフラグ ("badge1"等)
}
```

ライバル戦の手持ちは特殊指定可: `{ rival: true, stage: 1, level: 5 }`
(stage1=御三家基本形, 2=中間, 3=最終。種はエンジンがプレイヤーの選択と相性有利になるよう解決)

### フラグ一覧(エンジンが特別扱いするもの)

- `starter` … 御三家入手済み
- `badge1` `badge2` `badge3` … バッジ。メニューに表示
- `champion` … これが trainer.flagSet で立つとエンディングへ
- その他 `rival1` などは自由に定義してよい

## ワールド構成 (ワールド担当はこの通り作る)

主人公:ユウ / ライバル:レン / はかせ:カエデはかせ / ちほう:ルミナちほう

| マップid | 内容 |
|---|---|
| home | しゅじんこうのいえ(ママ heal:true)。GAME_STARTはここ |
| hajimari | ハジマリむら。いえ、けんきゅうじょ |
| lab | カエデはかせ(starter:true)。ライバル レン(flagRequired:"starter", hideIfFlag:"rival1", rival戦1 lv5, flagSet:"rival1") |
| route1 | 1ばんどうろ。くさむら、トレーナー2人 |
| ishizue | イシズエタウン。センター、ジム1 |
| center1/gym1 | ジム1=いわ(リーダー ゴロウ: 16 lv10, 17 lv12, flagSet:"badge1", sprite:"leader1") |
| route2 | 2ばんどうろ(badge1の通せんぼ)。トレーナー3人、レン戦2(stage1 lv9 + 12 lv8) |
| cave | ホタルどうくつ。2フロア相当の迷路、アイテム数個 |
| raiden | ライデンシティ。センター、ジム2 |
| center2/gym2 | ジム2=でんき(リーダー デンマ: 18 lv16, 18 lv16, 19 lv19, flagSet:"badge2", sprite:"leader2") |
| route3 | 3ばんどうろ(badge2の通せんぼ)。みずうみぞい、トレーナー3人 |
| yozora | ヨゾラシティ。センター、ジム3 |
| center3/gym3 | ジム3=ゴースト(リーダー レイカ: 20 lv23, 20 lv24, 21 lv26, flagSet:"badge3", sprite:"leader3") |
| route4 | 4ばんどうろ(badge3の通せんぼ)。トレーナー3人、終盤にレン戦3(12→13 lv27, stage2 lv26, stage3 lv29) |
| hall | ルミナホール。チャンピオン リュウオウ(13 lv30, 17 lv31, 19 lv31, 22 lv32, 26 lv34, flagSet:"champion", sprite:"champ") |

### エンカウントテーブル指針

- route1: 10(lv2-4,w40), 12(lv2-4,w35), 14(lv3-5,w25)
- route2: 10(lv6-9), 12(lv6-9), 14(lv7-9), 15(lv10,w5), 18(lv8,w10)
- cave: 16(lv12-15,w45), 20(lv13-15,w35), 25(lv14,w5), 26(lv30,w1), 23(lv14,w14)
- route3: 13(lv18-21), 18(lv17-20), 22(lv19,w10), 24(lv20,w5), 11(lv19)
- route4: 13(lv25-28), 17(lv25-27), 19(lv25-27), 21(lv26-28), 23(lv26,w10)

賞金=だいたい 平均Lv×20。ジムは×60。せかいの NPC セリフは あたたかく、ヒント・せかいかん(ルミナのでんせつ=id26 が ほしぞらから まいおりた はなし)を ちりばめること。
タイトル画面やエンディングはエンジン側。マップは余白なく丁寧に装飾(花、木、柵、水)すること。
各マップの大きさ目安: 街20x18前後、どうろ16x28前後、屋内10x9前後。warpは必ず双方向に対応を取ること。

## MUSIC_TRACKS スキーマ (music.js)

```js
var MUSIC_TRACKS = {
  title:   { tempo: 120, loop: true,
    pulse1:   [ ["E5",2], ["G5",2], [null,4] ],  // [音名, 16分音符いくつ分] null=休符
    pulse2:   [ ... ],     // ハモり/対旋律 (省略可)
    triangle: [ ... ],     // ベース (省略可)
    noise:    [ ["k",2],["h",2],["s",2],["h",2] ]  // k=キック s=スネア h=ハット
  },
  ...
};
```

- 音名は "C2"〜"C7"、シャープは "F#4" 形式。
- **1トラック内の全チャンネルは合計デュレーションを一致させる**(ループが揃うため)。
- 必要トラック: title(壮大), town(ほのぼの), route(冒険), cave(神秘), center(やすらぎ),
  gym(緊張), battle(疾走感・野生戦), trainerbattle(熱い・対人戦), victory(勝利ファンファーレ短め),
  ending(感動)。各8〜16小節、tempo 80-160。
- コード進行を意識し、pulse1=主旋律、pulse2=3度下ハモりや分散和音、triangle=ルート中心のベースライン。
