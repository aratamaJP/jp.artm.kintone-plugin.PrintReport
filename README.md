# Introduction 

２つのサブテーブルを、親子関係に基づいて
階層表示するためのプラグインです。

# Kintone Plug-in ID
pnelkinkgaljjkpiblinoknnnekjhgbo


# Getting Started


■ 開発環境の構築方法

1. Node.jsをインストール

2. 次のコマンドを実行して、vue-cliをインストール
   npm install -g vue-cli

3. 次のコマンドを実行して、Kintone Plugin Packerをインストール
   npm install -g @kintone/plugin-packer

4. 次のコマンドを実行して、Kintone Plugin Uploaderをインストール
   npm install -g @kintone/plugin-uploader

4. 依存モジュールをインストールする
   cd actual-management-plugin
   npm install


■ プラグインのパッケージ作成

1. 別途提供された秘密鍵「hierarchy-table-plugin-product.ppk」を
   ./secretフォルダ内に配置

2. パッケージング
   npm run build
   npm run package



■ プラグインのアップロード

   ./upload.ps1


■ テストクラスの実行

   npm test

