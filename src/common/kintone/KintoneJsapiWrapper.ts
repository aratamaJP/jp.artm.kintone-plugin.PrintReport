import { KintoneRestAPIClient } from "@kintone/rest-api-client";

/**
 * Get Plugin Config
 * @param {string} pluginId
 * @returns
 */
export function getPluginConfig(pluginId: string) {
  return kintone.plugin.app.getConfig(pluginId);
}

/**
 * モバイルページ または モバイルアプリからの呼び出しかどうかを判定する
 * @returns {boolean}
 */
export async function isMobile() {
  return (await kintone.isMobileApp()) || (await kintone.isMobilePage());
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

/**
 * サブテーブルのフィールド定義をレイアウト順に並べ替えて取得するヘルパー関数
 */
function getFieldDefs(subTblFieldDefs: any, subTblLayout: any): any[] {
  if (!subTblLayout || !subTblLayout.fields) return [];
  const fieldDefs: any[] = [];
  for (const layoutField of subTblLayout.fields) {
    const fieldDef = subTblFieldDefs[layoutField.code];
    if (fieldDef) {
      fieldDefs.push(fieldDef);
    }
  }
  return fieldDefs;
}

/**
 * 全サブテーブルの列フィールド定義情報を取得する
 */
export async function getAppFieldsDefAsync(
  restApiClient: KintoneRestAPIClient,
  appId: string | number,
) {
  const subTblDefs: Record<string, any> = {};

  // アプリのフィールド定義を取得
  const appFields = await restApiClient.app.getFormFields({
    app: appId,
  });

  // アプリのフィールドレイアウトを取得（サブテーブル列の並び順を取得用）
  const layouts = await restApiClient.app.getFormLayout({
    app: appId,
  });

  for (const fieldCode in appFields.properties) {
    const property = appFields.properties[fieldCode];

    if (property.type === "SUBTABLE") {
      // サブテーブルのフィールド定義
      const subTblFieldDefs = property.fields;

      // サブテーブルのフィールドレイアウト
      const subTblLayout = layouts.layout.find(
        (item: any) => item.code === fieldCode,
      );

      const fieldDefs = getFieldDefs(subTblFieldDefs, subTblLayout);
      subTblDefs[fieldCode] = fieldDefs;
    }
  }

  return subTblDefs;
}
