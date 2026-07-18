/**
 * Get Plugin Config
 * @param {*} pluginId
 * @returns
 */
export function getPluginConfig(pluginId) {

    return kintone.plugin.app.getConfig(pluginId);

}