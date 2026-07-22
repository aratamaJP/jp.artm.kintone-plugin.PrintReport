import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getThisAppId } from '@/common/kintone/KintoneJsapiWrapper';
import { deployAppsAsync } from '@/models/kintone_app_model';
import { pluginSetConfigAsync } from '@/models/ConfigModel';

import { CONFIG_KEYS } from "@/common/const/ConfigKeys";

export class ConfigCtrl {

    private readonly appId: number;
    private readonly restApiClient: KintoneRestAPIClient;

    // 設定保存後に自動でデプロイするかどうか
    public autoDeploy: boolean = true;

    constructor() {
        const appId = getThisAppId();
        if (appId === null) {
            throw new Error("kintone App ID could not be retrieved.");
        }
        this.appId = appId;
        this.restApiClient = new KintoneRestAPIClient();
    }

    /**
     * アプリ名の取得
     * @param {*} appId
     * @returns
     */
    public async getAppNameAsync(appId: any) {
        // const appInfo = await getAppInfoAsync(this.restApiClient, appId);
        // return appInfo.name;
    }

    /**
     * カスタマイズビューの一覧を取得
     * @returns
     */
    public async getCustomizeViewsAsync() {

        // const searchRslt = await getCustomizeViewsAsync(this.restApiClient, this.appId);

        // const views = {};
        // searchRslt.forEach(view => {
        //     views[view.id] = view.name;
        // });

        // return views;
    }

    /**
     *
     * @returns
     */
     public async getAppFormFieldsAsync() {
        // return await getAppFormFields(this.restApiClient, this.appId);
    }

    /**
     * カード表示に使用できるフィールド一覧の取得
     * @returns
     */
    public async getFieldsForCardAsync(formFields: any) {

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
    }

    /**
     * 自アプリに追加が必要なフィールドを取得
     * @returns
     */
    public async getNotExistsFieldsOfThisApp() {

        // const formFields = await getAppFormFields(this.restApiClient, this.appId, true); // テスト環境のフィールドを取得
        // const formFieldCodes = Object.keys(formFields).map(function (key) { return formFields[key].code; });

        // //-------------------
        // // フィールドを絞り込む
        // const rslt = REQUIRED_FIELD_CODES.filter(fieldCode => !formFieldCodes.includes(fieldCode));

        // return rslt;

    }

    /**
     *
     * @returns
     */
    public async getNotExistsFieldsOfGrpMngApp(appIdGrpMng: any) {

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

    }

    /**
     *
     * @param {*} fields
     * @returns
     */
     public sortFields(fields: any) {
        // return fields.sort(function(first, second){
        //     if (first.label > second.label){
        //         return 1;
        //     }else if (first.label < second.label){
        //         return -1;
        //     }else{
        //         return 0;
        //     }
        // });
    }

    /**
     * 動作に必要なフィールドを追加する
     * @param {*} nexFiedlsThisApp
     * @param {*} groupMngAppId
     * @param {*} nexFiedlsGrpMng
     */
    public async addFields(nexFiedlsThisApp: any, groupMngAppId: any, nexFiedlsGrpMng: any) {

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
    }

    /**
     * 自アプリに必要なフィールドを追加
     * @param {*} nexFiedlsThisApp
     */
    public async addFieldsOfThisAppAsync(nexFiedlsThisApp: any) {
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

    }

    /**
     * グループ管理に必要なフィールドを追加
     * @param {*} nexFiedlsGrpMng
     */
    public async addFieldsOfGrpMngAsync(appIdGrpMng: any, nexFiedlsGrpMng: any) {

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

    }


    /**
     * 設定値を保存する
     */
    public async saveConfigAsync(reports: any[]) {
        await pluginSetConfigAsync({
            [CONFIG_KEYS.REPORTS] : JSON.stringify(reports),
        });

        if (this.autoDeploy) {
            await deployAppsAsync(this.restApiClient, [ this.appId ]);
        }
    }
}