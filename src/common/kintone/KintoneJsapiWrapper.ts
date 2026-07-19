/**
 * Get Plugin Config
 * @param {string} pluginId
 * @returns
 */
export function getPluginConfig(pluginId:string) {

    return kintone.plugin.app.getConfig(pluginId);

}

export function getThisAppId() {
    return kintone.app.getId();
}