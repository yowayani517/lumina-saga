<div align="center">

<img src="docs/gif/title-screen.gif" alt="ルミナサーガ タイトル" width="600">

# ルミナサーガ — LUMINA SAGA

**ブラウザだけで動く、本格モンスター収集RPG**
HTML5 Canvas + Vanilla JavaScript / 依存ライブラリ ゼロ / ビルド不要

<p>
<img src="https://img.shields.io/badge/monsters-35-e53935">
<img src="https://img.shields.io/badge/areas-27-2e7d32">
<img src="https://img.shields.io/badge/types-10-1565c0">
<img src="https://img.shields.io/badge/BGM-10_tracks-6a1b9a">
<img src="https://img.shields.io/badge/dependencies-0-444">
<img src="https://img.shields.io/badge/runs_on-file://-orange">
</p>

`index.html` をダブルクリックするだけで起動。サーバーもビルドも要りません。

</div>

---

## 🎬 実際のプレイ画面

<div align="center">
<table>
<tr>
<td align="center"><img src="docs/gif/field-exploration.gif" width="300"><br><sub>🌍 フィールド探索（草むらのルート）</sub></td>
<td align="center"><img src="docs/gif/town-exploration.gif" width="300"><br><sub>🌃 街の探索（ヨゾラシティ）</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/gif/battle.gif" width="300"><br><sub>⚔️ ターン制バトル（こうかはばつぐん）</sub></td>
<td align="center"><img src="docs/gif/catching.gif" width="300"><br><sub>🎯 捕獲（カプセルでなかまに）</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/gif/legendary-encounter.gif" width="300"><br><sub>🌟 でんせつバトル（オーラ演出）</sub></td>
<td align="center"><img src="docs/gif/evolution.gif" width="300"><br><sub>✨ しんか！</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/gif/monster-dex.gif" width="300"><br><sub>📖 モンスターずかん</sub></td>
<td align="center"><img src="docs/gif/title-screen.gif" width="300"><br><sub>🎮 タイトル画面</sub></td>
</tr>
</table>
</div>

---

## 🕹️ 遊び方

`index.html` をブラウザで開くだけ。

| キー | 操作 |
|:---:|:---|
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> / <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> | 移動・カーソル |
| <kbd>Z</kbd> / <kbd>Space</kbd> | けってい・はなす・しらべる |
| <kbd>X</kbd> / <kbd>Esc</kbd> | キャンセル（ホールドでダッシュ） |
| <kbd>Enter</kbd> | メニュー / スタート |

---

## 🧩 ゲーム内容

- 🐉 **オリジナルモンスター 35種** — 2段・3段進化ラインを含む
- 🗺️ **ワールドマップ 27エリア** — 村・街・どうくつ・みずうみ・もり・こうげん
- ⚔️ **戦略的ターン制バトル** — 10タイプの相性表・状態異常・能力ランク変化・急所
- 🏛️ **3つのジム + チャンピオン戦**、ライバル「レン」との計3回の対決
- 🌟 **レア／でんせつのモンスター** — 草むらから低確率で出現、専用の遭遇演出つき
- 🌙 **隠しほこら** — どこかの森に眠る でんせつのモンスターが待つ
- 🎵 **チップチューンBGM 10曲** — WebAudio によるリアルタイム合成（音源ファイル不使用）
- 📖 ずかん・ボックス・ショップ・セーブ（レポート）完備

---

## 📋 作成物の説明

### 目的・背景

趣味プロジェクトとして、**Anthropic の最新モデル Claude Fable 5 を使い、AIコーディングだけでどこまで「遊べる」ゲームを作れるか**を実験した作品。外部ライブラリやゲームエンジンに頼らず、HTML5 Canvas と Vanilla JavaScript のみでモンスター収集 RPG を一から構築することを目標とした。

ポケモンライクなゲームループ（探索 → エンカウント → バトル → 捕獲 → 育成 → ジム攻略）を最小構成で再現しつつ、`index.html` のダブルクリックだけで動作するという制約を最後まで守り抜いた。

---

## 👤 自身が担当した役割

| 工程 | 担当内容 |
|:---|:---|
| **ゲームデザイン** | モンスター35種の能力値・タイプ・技・進化ライン設計、ワールドマップ27エリアのレイアウト・NPC配置・ストーリー進行設計 |
| **エンジン実装** | シーンスタック制ゲームループ、Promiseベース非同期バトルスクリプトエンジン、タイル描画システム、スプライトアニメーション |
| **バトルシステム** | 10タイプ相性表、状態異常（眠り・まひ・やけど等）、能力ランク変化、急所、逃走・捕獲ロジック |
| **サウンド** | WebAudio APIを用いたチップチューンシンセサイザー（矩形波×2・三角波・ノイズ）、BGM10曲の音楽データ設計 |
| **オフライン対応** | 全画像をBase64エンコードしてJSに埋め込む `bundle_assets.js` の設計・実装 |
| **品質保証** | マップ到達可能性をBFSで機械検証する `validate.js` の設計・実装 |
| **素材** | キャラクターポートレート（はかせ・トレーナー等）をAI生成でオリジナル制作 |

---

## 🔧 直面した課題と解決方法

### 課題 1 — `file://` 起動での画像読み込みブロック

ブラウザのCORSセキュリティにより、`file://` プロトコルでは外部ファイルの読み込みが制限される。「サーバー不要でダブルクリック起動」という要件と真っ向から衝突した。

**解決:** `tools/bundle_assets.js` を自作。ビルド時に全画像（モンスター・タイルセット・背景・ポートレート）を Base64 エンコードして `js/data/assets_b64.js` に一括埋め込み。起動時に base64 が存在すれば優先使用し、なければ通常パスにフォールバックする二重構造にした。

---

### 課題 2 — マップの孤立エリア・到達不可タイルの検出

27エリア・数百タイルを手作業で設計すると、壁に囲まれた孤立エリアや、NPCが配置されているのにプレイヤーが絶対に到達できないマスが生まれる。目視確認は限界があった。

**解決:** `tools/validate.js` に BFS（幅優先探索）到達可能性チェックを実装。スタート地点から通行可能タイルを全探索し、到達できないタイルを洗い出す。スプライトファイルの存在チェックも同ツールで一括実行。

---

### 課題 3 — BGMをファイルなしで実装

`file://` 起動かつ依存ゼロという制約上、外部音源ファイル（MP3/OGG）は使えない。無音ゲームにはしたくなかった。

**解決:** WebAudio API で矩形波×2・三角波・ノイズを合成するチップチューンシンセサイザーをスクラッチで実装。音楽データはすべて JS の数値配列（音程・長さ・音色）として記述し、ランタイムでリアルタイム合成する。結果として BGM 10曲・SE 多数をファイルサイズゼロで実現した。

---

### 課題 4 — 非同期バトル演出とゲームループの競合

バトルは「技選択 → アニメーション → ダメージ計算 → 次行動」という複数の非同期ステップが連鎖する。コールバック地獄になりがちな処理を、ゲームループ（requestAnimationFrame）と競合させずに管理する必要があった。

**解決:** Promise チェーンベースのバトルスクリプトエンジンを設計。各演出ステップを Promise として定義し `.then()` で連結。ゲームループは描画のみに専念し、バトルロジックは Promise チェーンが排他的に制御する構造にすることで競合を排除した。

---

## 🛠️ 技術情報

| 項目 | 内容 |
|:---|:---|
| **言語** | Vanilla JavaScript（ES5、`var` のみ、フレームワーク不使用） |
| **描画** | HTML5 Canvas 2D API |
| **アーキテクチャ** | シーンスタック制（push / pop / replace）、Promise ベース非同期バトルスクリプトエンジン |
| **サウンド** | WebAudio API によるチップチューンシンセ（外部音源ファイル不使用） |
| **オフライン対応** | 全画像を Base64 バンドル → `file://` ダブルクリック起動で完全動作 |
| **品質保証** | BFS到達可能性検証・スプライト整合性チェックを `tools/validate.js` で機械化 |
| **コード規模** | 約 **6,700行** の JavaScript（自動生成バンドル除く） |
| **AI モデル** | [Claude Code](https://claude.com/claude-code)（**Fable 5** — Anthropic 最新世代モデル）を使用してほぼ全工程を構築 |
| **ドット絵素材** | Guardian Monsters Artwork by Georg Eckert / lucidtanooki（CC-BY-4.0） |
| **キャラクター立ち絵** | AI生成によるオリジナル制作 |

---

## 🎨 クレジット

- **モンスター・タイルセット・バトル背景（ドット絵）**
  **Guardian Monsters Artwork** by Georg Eckert / lucidtanooki
  ライセンス: [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)
  ※ 上記の素材集を利用しています。

- **キャラクターポートレート（はかせ・トレーナー等）**
  オリジナル制作（AI生成）

- **プログラム・ゲームデザイン・データ設計・BGM作曲**
  [Claude Code](https://claude.com/claude-code)（Fable 5）

ゲーム内エンディングのスタッフロールにも同じクレジットを表記しています。

---

## 🤖 制作について

このプロジェクトは、**ほぼすべての工程を [Claude Code](https://claude.com/claude-code)（Fable 5）で制作**しました。
ゲーム設計・エンジン実装・バトルロジック・35体のモンスターデータ・27エリアのマップ・
10曲のBGM・整合性検証ツールまで、対話を通じて構築しています。
（モンスターやタイルのドット絵は上記 CC-BY-4.0 素材を利用し、キャラクターの立ち絵はオリジナルで用意しました。）

**制作期間はごく短期間**で、AIコーディングだけでどこまで「遊べる」ゲームを組み上げられるかの実験的な作品です。

---

<div align="center">
<sub>© LUMINA TEAM 2026 — Art: Guardian Monsters (CC-BY-4.0) / Built with Claude Code (Fable 5)</sub>
</div>
