npm run package

./upload_env.ps1
# ↑
# set-item "env:KINTONE_BASE_URL" https://<サブドメイン>.cybozu.com
# set-item "env:KINTONE_USERNAME" <ログイン名>
# set-item "env:KINTONE_PASSWORD" <パスワード>
# set-item "env:HTTPS_PROXY or HTTP_PROXY" <プロキシサーバ設定>

kintone-plugin-uploader dist/artm-print-report-plugin.zip
