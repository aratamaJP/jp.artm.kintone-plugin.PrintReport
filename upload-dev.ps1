#パッケージを作成し、開発環境へアップロードする

npm run build-dev

npm run package

./upload_env.ps1

kintone-plugin-uploader dist/artm-print-report-plugin.zip
