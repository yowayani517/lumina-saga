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
<img src="https://img.shields.io/badge/code-~6.7k_LOC-555">
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

- 🐉 **モンスター 35種** — 2段・3段進化ラインを含む
- 🗺️ **ワールドマップ 27エリア** — 村・街・どうくつ・みずうみ・もり・こうげん
- ⚔️ **戦略的ターン制バトル** — 10タイプの相性表・状態異常・能力ランク変化・急所
- 🏛️ **3つのジム + チャンピオン戦**、ライバル「レン」との計3回の対決
- 🌟 **レア／でんせつのモンスター** — 草むらから低確率で出現、専用の遭遇演出つき
- 🌙 **隠しほこら** — どこかの森に眠る でんせつのモンスターが待つ
- 🎵 **チップチューンBGM 10曲** — WebAudio によるリアルタイム合成（音源ファイル不使用）
- 📖 ずかん・ボックス・ショップ・セーブ（レポート）完備

---

## 🛠️ 技術アーキテクチャ

フレームワークやゲームエンジンを一切使わず、**HTML5 Canvas と Vanilla JavaScript のみ**で構築している。`index.html` を開くだけで動作し、サーバー・ビルド・依存ライブラリを必要としない。

| 項目 | 設計 |
|:---|:---|
| **シーン管理** | スタックベースのシーン管理（push / pop / replace）。タイトル・フィールド・バトル・メニューを階層的に切り替え |
| **バトルエンジン** | 演出ステップを **Promise チェーン**で連結する非同期バトルスクリプトエンジン。描画ループ（requestAnimationFrame）とゲームロジックを分離し、処理の競合を排除 |
| **サウンド** | WebAudio API で矩形波×2・三角波・ノイズを**リアルタイム合成**するチップチューンシンセ。音源ファイル不使用で BGM 10曲＋SE を実装 |
| **オフライン動作** | 全画像を **Base64 でバンドル**して JS に同梱し、`file://` 起動時の CORS 制約を回避（ダブルクリックで完全動作） |
| **品質保証** | `tools/validate.js` がマップの **BFS 到達可能性**・スプライト整合性を機械検証 |
| **描画** | HTML5 Canvas 2D API。ドット絵向けにスムージングを無効化 |
| **規模** | Vanilla JavaScript 約 **6,700 行**（自動生成バンドルを除く）、依存ライブラリ **0** |

---

## 🔧 設計・実装上の課題と解決

| 課題 | 解決 |
|:---|:---|
| `file://` 起動ではブラウザの CORS 制約で画像が読み込めない | 全アセットを Base64 エンコードして JS に同梱するバンドル処理を用意し、サーバー不要のダブルクリック起動を実現 |
| 27エリアの手作業設計で、到達不可能なマスや孤立エリアが発生 | スタート地点からの **BFS 全探索**で通行可能タイルを検証する整合性チェックツールを導入 |
| 非同期のバトル演出と描画ループが競合し、処理が破綻 | 各演出を Promise として定義し `.then()` で連結。描画は描画のみ、ロジックは Promise チェーンが排他制御する構造に整理 |
| フィールド移動でキャラクターが逆方向に歩く不具合 | スプライトの向き反転ロジックの誤りを特定し修正 |
| 通常モンスターのみで単調なゲーム性 | 低確率のレアエンカウント、隠しステージの伝説モンスター、専用遭遇演出を設計し、収集のやり込み軸を追加 |

---

## 🎨 クレジット

- **モンスター・タイルセット・バトル背景（ドット絵）**
  [Guardian Monsters Artwork](https://creativecommons.org/licenses/by/4.0/) by Georg Eckert / lucidtanooki（CC-BY-4.0 / 利用）

- **キャラクターポートレート（はかせ・トレーナー等）**
  オリジナル制作（AI生成）

- **プログラム・ゲームデザイン・データ設計・BGM**
  AIコーディング（[Claude Code](https://claude.com/claude-code)）を活用して構築

ゲーム内エンディングのスタッフロールにも同じクレジットを表記しています。

---

<div align="center">
<sub>© LUMINA TEAM 2026 — Art: Guardian Monsters (CC-BY-4.0)</sub>
</div>
