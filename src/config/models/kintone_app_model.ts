// import { appGet } from '~/common/kintoneApi/app'
// import { fieldsGet } from '~/common/kintoneApi/fields'
// import { viewsPreviewGet } from '~/common/kintoneApi/views'

/**
 * アプリ情報の取得
 * @param {*} restApiClient
 * @param {*} appId
 * @returns
 */
export async function getAppInfoAsync(restApiClient, appId) {

    return await restApiClient.app.getApp({
        id: appId
    });
}

/**
 * アプリから、フィールド情報を取得
 * @param {*} restApiClient
 * @param {*} appId
 * @param {*} preview true - デプロイ前のプレビュー情報を取得
 * @returns
 */
 export async function getAppFormFields(restApiClient, appId, preview = false) {

    const rslt =  await restApiClient.app.getFormFields({
        app : appId,
        preview
    });

    return rslt.properties;

}


/**
 * アプリにフィールドを追加する
 * @param {*} restApiClient
 * @param {*} appId
 * @param {*} properties
 * @returns
 */
export async function addAppFormFields(restApiClient, appId, properties) {

    const rslt =  await restApiClient.app.addFormFields({
      app : appId,
      properties,
    });

    return rslt;

}

/**
 * アプリをデプロイする
 * @param {*} restApiClient
 * @param {*} appIds
 * @returns
 */
export async function deployAppsAsync(restApiClient, appIds) {

    const apps = appIds.map(appId => {
        return { app : appId }
    });

    const rslt =  await restApiClient.app.deployApp({
        apps
    });

    return rslt;
}

/**
 * カスタマイズビューの一覧を取得
 * @param {*} restApiClient
 * @param {*} appId
 * @returns
 */
export async function getCustomizeViewsAsync(restApiClient, appId) {

    const views = [];

    const rslt =  await restApiClient.app.getViews({
      app : appId
    });

    //-------------------
    // アプリフィールド情報 取得結果
    for(const key of Object.keys(rslt.views)) {

        const view = rslt.views[key];

        if (view.type === 'CUSTOM') {
            // views.push(view);
            views.push({
              id : view.id,
              name : view.name
            });
        }

    }

    return views;
}

