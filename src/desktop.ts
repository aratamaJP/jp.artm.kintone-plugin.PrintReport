// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import { createApp } from "vue";

import { PLUGIN_NAME } from "@/common/const/SystemConst";
import { KintoneEvents } from "@/common/kintone/KintoneEvents";
import { getPluginConfig, getHeaderSpace } from '@/common/kintone/KintoneJsapiWrapper';
// import { PrintReport } from "./PrintReport";

import DesktopView from "@/views/Desktop.vue";

const PLUGIN_ID = kintone.$PLUGIN_ID;
const DIV_HEADER_PANEL_ELEMENT_ID = "artm-print-report-header-panel";

kintone.events.on(KintoneEvents.Detail.Show, async (event: any) => {

  try {

    // Kintone プラグイン設定 読み込み
    let config;
    const configStore = getPluginConfig(PLUGIN_ID);
    if (configStore.config) {
      config = JSON.parse(configStore.config);
    }

    const headerSpace = await getHeaderSpace();
    if (headerSpace) {
      const div = document.createElement("div");
      div.id = DIV_HEADER_PANEL_ELEMENT_ID;
      headerSpace.appendChild(div);
    }

    createApp(
      DesktopView,
      {
        config
      }
    ).mount('#' + DIV_HEADER_PANEL_ELEMENT_ID);

    /*
    const reports: Report[] = JSON.parse(configStore.reports);
    const enabledReports = reports.filter(report => report.enabled);

    if (enabledReports.length > 0) {
        enabledReports.forEach((report, index) => {
            const printReport = new PrintReport(report, index);
            printReport.onDetailShow(event);
        });
    } else {
        const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
        if (headerSpace) {
            const messageDiv = document.createElement("div");
            messageDiv.innerText = `${PLUGIN_NAME}: 利用できる帳票がありません。プラグイン設定を確認してください。`;
            messageDiv.style.textAlign = "center";
            messageDiv.style.color = "red";
            messageDiv.style.padding = "1.5em 0";
            headerSpace.appendChild(messageDiv);
        }
    }
    */

    return event;

  } catch (e) {
      console.error(`${PLUGIN_NAME} error:`, e);
  }

});
