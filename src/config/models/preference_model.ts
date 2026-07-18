export async function pluginSetConfigAsync(configObj) {

    return new kintone.Promise((resolve, reject) => {

        try {
            // 設定をJSON文字列化
            const jsonPrefs = JSON.stringify(configObj);

            // 設定保存
            kintone.plugin.app.setConfig({config : jsonPrefs}, function() {
                resolve();
            });
        } catch(e) {
            reject(e.message);
        }
    });

}