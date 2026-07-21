/**
 * Get Plugin Config
 * @param {string} pluginId
 * @returns
 */
export function getPluginConfig(pluginId:string) {

    return kintone.plugin.app.getConfig(pluginId);

}

/**
 * モバイルページ または モバイルアプリからの呼び出しかどうかを判定する
 * @returns {boolean}
 */
export async function isMobile()
{
    return await kintone.isMobileApp() || await kintone.isMobilePage();
}

export function getThisAppId() {
    return kintone.app.getId();
}

/**
 * ヘッダースペース取得
 */
export async function getHeaderSpace() {

    if (await isMobile()) {
        return kintone.mobile.app.getHeaderSpaceElement();
    }

    return kintone.app.record.getHeaderMenuSpaceElement();
}
