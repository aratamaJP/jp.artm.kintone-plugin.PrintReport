declare const kintone: any;

import { PLUGIN_NAME } from "@/common/const/SystemConst";

import { getPluginConfig } from '@/common/kintone/KintoneJsapiWrapper'

import { CONFIG_KEYS } from '@/common/const/ConfigKeys';
import { KintoneEvents } from "@/common/kintone/KintoneEvents";


import { PrintReport } from "./PrintReport";

(function(pluginId) {

    'use strict';

    // プラグイン設定読み込み
    const configStore = getPluginConfig(pluginId);
    const config = configStore.config ? JSON.parse(configStore.config) : null;

    const printReport = new PrintReport();

    /**
    * レコード詳細画面（PC） 表示時
    */
    kintone.events.on(KintoneEvents.Detail.Show, async function(event) {

        console.log("config", config);

        if (config) {
            printReport.onDetailShow(event, config);
        } else {
            const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();

            const messageDiv = document.createElement("div");
            messageDiv.innerText = PLUGIN_NAME + "の設定を行ってください。";

            messageDiv.style.textAlign = "center";
            messageDiv.style.color = "red";
            messageDiv.style.padding = "1.5em 0";

            headerSpace.appendChild(messageDiv);
        }

        return event;
    });


})(kintone.$PLUGIN_ID);
