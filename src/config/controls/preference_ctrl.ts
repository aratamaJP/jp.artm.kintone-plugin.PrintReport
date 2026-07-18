import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getThisAppId } from '@/common/kintone/KintoneJsapiWrapper';
import { getAppInfoAsync, getAppFormFields, addAppFormFields, deployAppsAsync, getCustomizeViewsAsync } from '@/config/models/kintone_app_model';
import { pluginSetConfigAsync } from '@/config/models/preference_model';

import { CONFIG_KEYS } from "@/common/const/ConfigKeys";
// // import { FCD_COMMON } from "@/common/const/fcd_common"
// import { FCD_KANBAN_ITEMS } from "@/common/const/fcd_kanban_items";
// import { FCD_KANBAN_GROUP_MNG } from "@/common/const/fcd_kanban_group_mng";
// import { CONFIG_KEYS } from "@/common/const/config_keys";

// const REQUIRED_FIELD_CODES = [
//     FCD_KANBAN_ITEMS.ITEM_ID,
//     FCD_KANBAN_ITEMS.ITEM_GROUP_NAME,
//     FCD_KANBAN_ITEMS.ITEM_ID_PREV,
//     FCD_KANBAN_ITEMS.ITEM_ID_NEXT,
// ];

export const Ctrl = {

    appId : getThisAppId(),
    restApiClient : new KintoneRestAPIClient(),

    // 設定保存後に自動でデプロイするかどうか
    autoDeploy : true,

    /**
     * アプリ名の取得
     * @param {*} appId
     * @returns
     */
    getAppNameAsync : async function(appId) {
        // const appInfo = await getAppInfoAsync(this.restApiClient, appId);
        // return appInfo.name;
    },

    /**
     * カスタマイズビューの一覧を取得
     * @returns
     */
    getCustomizeViewsAsync : async function() {

        // const searchRslt = await getCustomizeViewsAsync(this.restApiClient, this.appId);

        // const views = {};
        // searchRslt.forEach(view => {
        //     views[view.id] = view.name;
        // });

        // return views;
    },

    /**
     *
     * @returns
     */
     getAppFormFieldsAsync : async function() {
        // return await getAppFormFields(this.restApiClient, this.appId);
    },

    /**
     * カード表示に使用できるフィールド一覧の取得
     * @returns
     */
    getFieldsForCardAsync : async function(formFields) {

        // const fields = [];

        // // 表示できるフィールドタイプ定義
        // const INCLUDE_FIELD_TYPE = [
        //     "RECORD_NUMBER",
        //     "CREATOR",
        //     "CREATED_TIME",
        //     "MODIFIER",
        //     "UPDATED_TIME",
        //     "SINGLE_LINE_TEXT",
        //     "MULTI_LINE_TEXT",
        //     "NUMBER",
        //     "CALC",
        //     "CHECK_BOX",
        //     "RADIO_BUTTON",
        //     "MULTI_SELECT",
        //     "DROP_DOWN",
        //     "USER_SELECT",
        //     "DATE",
        //     "TIME",
        //     "DATETIME",
        //     "ORGANIZATION_SELECT",
        //     "GROUP_SELECT",
        // ];

        // //-------------------
        // // フィールドを絞り込む
        // for(const key of Object.keys(formFields)) {

        //     const formField = formFields[key];

        //     if (INCLUDE_FIELD_TYPE.includes(formField.type) && !REQUIRED_FIELD_CODES.includes(formField.code)){
        //         fields.push({
        //             label : formField.label,
        //             value : formField.code,
        //         });;
        //     }
        // }

        // return this.sortFields(fields);
    },

    /**
     * 自アプリに追加が必要なフィールドを取得
     * @returns
     */
    getNotExistsFieldsOfThisApp : async function() {

        // const formFields = await getAppFormFields(this.restApiClient, this.appId, true); // テスト環境のフィールドを取得
        // const formFieldCodes = Object.keys(formFields).map(function (key) { return formFields[key].code; });

        // //-------------------
        // // フィールドを絞り込む
        // const rslt = REQUIRED_FIELD_CODES.filter(fieldCode => !formFieldCodes.includes(fieldCode));

        // return rslt;

    },

    /**
     *
     * @returns
     */
    getNotExistsFieldsOfGrpMngApp : async function(appIdGrpMng) {

        // const fieldCodes = [
        //     FCD_KANBAN_GROUP_MNG.KANBAN_APP_ID,
        //     FCD_KANBAN_GROUP_MNG.GROUP_TBL,
        // ];

        // const formFields = await getAppFormFields(this.restApiClient, appIdGrpMng, true); // テスト環境のフィールドを取得
        // const formFieldCodes = Object.keys(formFields).map(function (key) { return formFields[key].code; });

        // //-------------------
        // // フィールドを絞り込む
        // const rslt = fieldCodes.filter(fieldCode => !formFieldCodes.includes(fieldCode));

        // return rslt;

    },

    /**
     *
     * @param {*} fields
     * @returns
     */
     sortFields : function(fields) {
        // return fields.sort(function(first, second){
        //     if (first.label > second.label){
        //         return 1;
        //     }else if (first.label < second.label){
        //         return -1;
        //     }else{
        //         return 0;
        //     }
        // });
    },

    /**
     * 動作に必要なフィールドを追加する
     * @param {*} nexFiedlsThisApp
     * @param {*} groupMngAppId
     * @param {*} nexFiedlsGrpMng
     */
    addFields : async function(nexFiedlsThisApp, groupMngAppId, nexFiedlsGrpMng) {

        // // 自アプリに必要なフィールドを追加
        // const deployAppIds = [];
        // if (nexFiedlsThisApp.length > 0) {
        //     await this.addFieldsOfThisAppAsync(nexFiedlsThisApp);
        //     if (!this.autoDeploy) {
        //         deployAppIds.push(this.appId);
        //     }
        // }

        // // グループ管理に必要なフィールドを追加
        // if(groupMngAppId && nexFiedlsGrpMng.length > 0) {
        //     await this.addFieldsOfGrpMngAsync(groupMngAppId, nexFiedlsGrpMng);
        //     deployAppIds.push(groupMngAppId);
        // }

        // // デプロイ
        // if (deployAppIds.length > 0) {
        //     await deployAppsAsync(this.restApiClient, deployAppIds);
        // }
    },

    /**
     * 自アプリに必要なフィールドを追加
     * @param {*} nexFiedlsThisApp
     */
    addFieldsOfThisAppAsync : async function(nexFiedlsThisApp) {
        // const propertiese = {};

        // if(nexFiedlsThisApp.includes(FCD_KANBAN_ITEMS.ITEM_ID)) {
        //     propertiese[FCD_KANBAN_ITEMS.ITEM_ID] = {
        //         "code": FCD_KANBAN_ITEMS.ITEM_ID,
        //         "label": FCD_KANBAN_ITEMS.ITEM_ID,
        //         "type": "SINGLE_LINE_TEXT",
        //         // "required": true,
        //         "unique": true,
        //         "maxLength": "64",
        //     };
        // }

        // if(nexFiedlsThisApp.includes(FCD_KANBAN_ITEMS.ITEM_GROUP_NAME)) {
        //     propertiese[FCD_KANBAN_ITEMS.ITEM_GROUP_NAME] = {
        //         "code": FCD_KANBAN_ITEMS.ITEM_GROUP_NAME,
        //         "label": FCD_KANBAN_ITEMS.ITEM_GROUP_NAME,
        //         "type": "SINGLE_LINE_TEXT",
        //     };
        // }

        // if(nexFiedlsThisApp.includes(FCD_KANBAN_ITEMS.ITEM_ID_PREV)) {
        //     propertiese[FCD_KANBAN_ITEMS.ITEM_ID_PREV] = {
        //         "code": FCD_KANBAN_ITEMS.ITEM_ID_PREV,
        //         "label": FCD_KANBAN_ITEMS.ITEM_ID_PREV,
        //         "type": "SINGLE_LINE_TEXT",
        //         "maxLength": "64",
        //     };
        // }

        // if(nexFiedlsThisApp.includes(FCD_KANBAN_ITEMS.ITEM_ID_NEXT)) {
        //     propertiese[FCD_KANBAN_ITEMS.ITEM_ID_NEXT] = {
        //         "code": FCD_KANBAN_ITEMS.ITEM_ID_NEXT,
        //         "label": FCD_KANBAN_ITEMS.ITEM_ID_NEXT,
        //         "type": "SINGLE_LINE_TEXT",
        //         "maxLength": "64",
        //     };
        // }



        // return await addAppFormFields(this.restApiClient, this.appId, propertiese);

    },

    /**
     * グループ管理に必要なフィールドを追加
     * @param {*} nexFiedlsGrpMng
     */
    addFieldsOfGrpMngAsync : async function(appIdGrpMng, nexFiedlsGrpMng) {

        // const propertiese = {};

        // if(nexFiedlsGrpMng.includes(FCD_KANBAN_GROUP_MNG.KANBAN_APP_ID)) {
        //     propertiese[FCD_KANBAN_GROUP_MNG.KANBAN_APP_ID] = {
        //         "code": FCD_KANBAN_GROUP_MNG.KANBAN_APP_ID,
        //         "label": "アプリID",
        //         "type": "NUMBER",
        //         "required": true,
        //         "unique": true,
        //     };
        // }

        // if(nexFiedlsGrpMng.includes(FCD_KANBAN_GROUP_MNG.GROUP_TBL)) {
        //     propertiese[FCD_KANBAN_GROUP_MNG.GROUP_TBL] = {
        //         "code": FCD_KANBAN_GROUP_MNG.GROUP_TBL,
        //         "label": "カンバンのグループ",
        //         "type": "SUBTABLE",
        //         "fields": {
        //             [FCD_KANBAN_GROUP_MNG.GROUP_TBL_NAME]: {
        //                 "code": FCD_KANBAN_GROUP_MNG.GROUP_TBL_NAME,
        //                 "label": "グループ名",
        //                 "type": "SINGLE_LINE_TEXT",
        //             }
        //         }
        //     };
        // }



        // return await addAppFormFields(this.restApiClient, appIdGrpMng, propertiese);

    },


    /**
     * 設定値を保存する
     */
    saveConfigAsync : async function(fcodeParentTable, fcodeChildTable, fcodeParentTableUniqueKey, fcodeChildTableParentKey) {

        // debug
        fcodeParentTable = "大項目テーブル";
        fcodeChildTable = "明細テーブル";
        fcodeParentTableUniqueKey = "大項目ID";
        fcodeChildTableParentKey = "親大項目ID";

        await pluginSetConfigAsync({
            [CONFIG_KEYS.FCODE_PARENT_TABLE] : fcodeParentTable,
            [CONFIG_KEYS.FCODE_CHILD_TABLE] : fcodeChildTable,
            [CONFIG_KEYS.FCODE_PARENT_TABLE_UNIQUE_KEY] : fcodeParentTableUniqueKey,
            [CONFIG_KEYS.FCODE_CHILD_TABLE_PARENT_KEY] : fcodeChildTableParentKey,
        });

        if (this.autoDeploy) {
            await deployAppsAsync(this.restApiClient, [ this.appId ]);
        }
    },
};