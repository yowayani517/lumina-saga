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

> **「最新・最強の AI を使ったら、JavaScript をほぼ知らない人間でもどこまでのゲームが作れるのか」** という純粋な疑問と好奇心から生まれた作品。

普段は研究用途で Python / C言語 / CUDA を使っており、JavaScript の知識はほぼゼロの状態からスタートした。Anthropic の最新モデル **Claude Fable 5** と **Claude Code** を用いた、いわゆる **バイブコーディング** によって制作。コードは AI が書き、人間はゲームデザインの方向性とクオリティ評価に集中した。

最終的なゲームボリュームは **最短約1時間でクリア可能**だが、レアモンスターのコンプリートや伝説モンスターの捕獲など、やり込み要素で奥深く遊べる設計になっている。

---

## 👤 自身が担当した役割

本プロジェクトにおいて、**コードは一切書いていない**。担当したのは以下のディレクション業務。

| 役割 | 内容 |
|:---|:---|
| **初期プロンプト設計** | 「各エージェントに役割を分担させて実装せよ」と指示し、AI が複数のサブエージェントに分かれて並列開発する構成を最初から設計させた |
| **素材選定** | Claude 単体の画像生成・ローカル AI による画像生成はいずれも品質が低く不採用。[Guardian Monsters Artwork](https://studioshimazu.com/post-618/) の CC-BY-4.0 素材を採用し、AI に画像を見させながらモンスターの名前・タイプ・技構成を考えさせた |
| **QA・品質評価** | 動作を確認しながら問題点を特定し、AI へ改善指示を出す役割を一貫して担当 |
| **ゲームバランス調整** | 遊んで感じた違和感をフィードバックし、AI に調整させた（詳細は下記） |

---

## 🔧 直面した課題と解決方法

コードの技術課題ではなく、**AI をディレクションする上で生じた課題**を記録する。

---

### 課題 1 — AI が指示範囲を超えて実装してしまう

指示した範囲以上のことを AI が勝手に実装し、バランスが崩れたり意図しない挙動が混入したりすることがあった。

**解決:** 都度プレイして問題箇所を特定し、「ここだけ直して、それ以外は触るな」という形で明示的な差分指示を行うようにした。

---

### 課題 2 — キャラクター画像のクロップ・透過処理の品質

キャラクタースプライトの切り抜きが雑で、背景と同化したり、透過されるべき部分が残ったりする問題があった。

**解決:** 問題のある画像を特定して AI に修正指示を出した。また、素材自体の選定を見直し、透過処理が適切に行われている Guardian Monsters のドット絵素材に統一することで根本解決した。

---

### 課題 3 — キャラクターデザインの品質

最初は Claude 単体で画像生成を試みたが品質が低かった。次に無料のローカル AI（ComfyUI）を導入して画像生成を行ったが、こちらも求めるキャラクターデザインの品質には届かなかった。

**解決:** CC-BY-4.0 で配布されている **Guardian Monsters Artwork** の素材を採用する方針に切り替えた。AI にスプライト画像を見せながら、各モンスターに合った名前・タイプ・技構成を考えさせることで、ビジュアルとゲームデータの整合性を取った。

---

### 課題 4 — ゲームの操作感・テンポの悪さ

初期実装はレベルアップが遅く、キャラクターの移動速度も体感的に鈍かった。また、フィールド移動時に**キャラクターが逆方向に歩く「ムーンウォーク現象」**が発生していた。

**解決:** 経験値テーブルとダッシュ機能のパラメータ調整を指示。ムーンウォーク問題はスプライトの向き反転ロジックの誤りと特定し、修正を指示した。

---

### 課題 5 — ゲームとしての遊び心・奥深さの不足

通常モンスターしか出現しない状態ではゲームとして単調だった。

**解決:** 以下の要素を追加するよう指示した。
- レアモンスターが低確率で出現するエンカウントシステム
- 隠しほこらに伝説モンスターが待機するステージ
- 遭遇時の専用演出（オーラエフェクト）

これにより「クリアだけ」でなく「全モンスター収集」という長期的なやり込み軸が生まれた。

---

## 🛠️ 技術情報

| 項目 | 内容 |
|:---|:---|
| **言語** | Vanilla JavaScript（ES5、フレームワーク不使用） |
| **描画** | HTML5 Canvas 2D API |
| **アーキテクチャ** | シーンスタック制（push / pop / replace）、Promise ベース非同期バトルスクリプトエンジン |
| **サウンド** | WebAudio API によるチップチューンシンセ（外部音源ファイル不使用） |
| **オフライン対応** | 全画像を Base64 バンドル → `file://` ダブルクリック起動で完全動作 |
| **品質保証** | BFS 到達可能性検証・スプライト整合性チェックを `tools/validate.js` で機械化 |
| **コード規模** | 約 **6,700行** の JavaScript（自動生成バンドル除く） |
| **開発スタイル** | バイブコーディング（コードは全て AI が生成、人間はディレクションのみ） |
| **使用 AI** | [Claude Code](https://claude.com/claude-code)（**Fable 5**） |
| **ドット絵素材** | Guardian Monsters Artwork by Georg Eckert / lucidtanooki（CC-BY-4.0） |
| **キャラクター立ち絵** | AI生成によるオリジナル制作 |

> **Note:** Fable 5 は米国以外での一般公開が停止されたため、実際に使用できた期間は約3日間。その後は下位モデルでの追加調整を試みたが、思い通りの品質調整には至らなかった部分もある。Fable 5 の再公開後にさらなるブラッシュアップを予定している。

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

## 🤖 制作を通じて感じたこと

AI がコードを書く時代において、**人間の役割はデバッグと評価と改善指示**だと強く感じた。AI は指示した以上のことをやりすぎたり、細部のクオリティが基準に達しなかったりする。それを見抜いて正確にフィードバックする能力こそが、AI 時代に求められるスキルだと実感した。

JavaScript をほぼ知らない状態でも、最新 AI との対話だけでここまでの完成度のゲームが作れたことは、純粋に驚きだった。

---

<div align="center">
<sub>© LUMINA TEAM 2026 — Art: Guardian Monsters (CC-BY-4.0) / Built with Claude Code (Fable 5)</sub>
</div>
