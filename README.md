# Introduction 

２つのサブテーブルを、親子関係に基づいて
階層表示するためのプラグインです。

# Kintone Plug-in ID



# Getting Started


## 開発環境の構築方法

1. 次のコマンドを実行する
   npm install

2. 次のコマンドを実行する
   copy upload_env_sample.ps1 upload_env.ps1

3. upload_env.ps1の内容を、開発環境の内容で更新する。


2. 次のコマンドを実行して、vue-cliをインストール
   npm install -g vue-cli


## 初めてのパッケージ作成

1. 次のコマンドを実行する
npm run build-dev
kintone-plugin-packer plugin --out dist/artm-print-report-plugin.zip

npm run package

kintone-plugin-packer --ppk ./secret/artm-print-report-plugin.ppk plugin --out dist/artm-print-report-plugin.zip

## ２回目以降のプラグインのパッケージ作成

1. 別途提供された秘密鍵「hierarchy-table-plugin-product.ppk」を
   ./secretフォルダ内に配置

2. パッケージング
   npm run build
   npm run package



■ プラグインのアップロード

   ./upload.ps1


■ テストクラスの実行

   npm test

