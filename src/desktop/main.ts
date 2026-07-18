import { PLUGIN_NAME } from "@/common/const/SystemConst";
import { getPluginConfig } from '@/common/kintone/KintoneJsapiWrapper';
import { KintoneEvents } from "@/common/kintone/KintoneEvents";
import { PrintReport } from "./PrintReport";

interface Report {
  name: string;
  html: string;
  enabled: boolean;
}

(function(pluginId: any) {
    'use strict';

    // プラグイン設定読み込み
    const configStore = getPluginConfig(pluginId);
    if (!configStore || !configStore.reports) {
        return;
    }

    try {
        const reports: Report[] = JSON.parse(configStore.reports);

        kintone.events.on(KintoneEvents.Detail.Show, (event: any) => {
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
            return event;
        });

    } catch (e) {
        console.error(`${PLUGIN_NAME} error:`, e);
    }

})(kintone.$PLUGIN_ID);
