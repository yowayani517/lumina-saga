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

# 🎬 実際のプレイ画面

<div align="center">
<table>
<tr>
<td align="center"><img src="docs/gif/field-exploration.gif" width="300"><br><sub>🌍 フィールド探索（草むらの ルート）</sub></td>
<td align="center"><img src="docs/gif/town-exploration.gif" width="300"><br><sub>🌃 街の探索（ヨゾラシティ）</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/gif/battle.gif" width="300"><br><sub>⚔️ ターン制バトル（こうかは ばつぐん）</sub></td>
<td align="center"><img src="docs/gif/catching.gif" width="300"><br><sub>🎯 捕獲（カプセルで なかまに）</sub></td>
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
| <kbd>X</kbd> / <kbd>Esc</kbd> | キャンセル（ホールドで ダッシュ） |
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

## 🛠️ 技術的なこだわり

| 項目 | 内容 |
|:---|:---|
| **構成** | 純粋な HTML5 Canvas + Vanilla JS、**依存ライブラリ ゼロ** |
| **コード規模** | 約 **6,700行** の JavaScript（自動生成バンドルを除く） |
| **アーキテクチャ** | シーンスタック制、Promiseベースの非同期バトルスクリプトエンジン |
| **サウンド** | 矩形波×2 + 三角波 + ノイズを WebAudio で合成するチップチューンシンセ |
| **オフライン動作** | 全画像を base64 で同梱し、**`file://` のダブルクリック起動でも完全動作** |
| **品質保証** | `tools/validate.js` がマップ整合性・**BFS到達可能性**・スプライト整合性を機械検証 |

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
