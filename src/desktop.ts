// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import { createApp } from "vue";

import {
  PLUGIN_NAME,
  PLUGIN_ID as SYSTEM_PLUGIN_ID,
} from "@/common/const/SystemConst";
import { KintoneEvents } from "@/common/kintone/KintoneEvents";
import {
  getPluginConfig,
  getThisAppId,
} from "@/common/kintone/KintoneJsapiWrapper";
import { verifyLicense } from "@/services/LicenseService";

import DesktopView from "@/views/Desktop.vue";

const PLUGIN_ID = kintone.$PLUGIN_ID;
const DIV_HEADER_PANEL_ELEMENT_ID = "artm-print-report-header-panel";
const DIV_LICENSE_ERROR_ELEMENT_ID = "artm-print-report-license-error";

/**
 * ライセンスを検証し、無効な場合は通知を表示する
 * @param eventType 'index' または 'detail'
 * @returns ライセンスが有効な場合は true, 無効な場合は false
 */
const checkLicense = async (
  eventType: "index" | "detail",
): Promise<boolean> => {
  const errorElementId = `${DIV_LICENSE_ERROR_ELEMENT_ID}-${eventType}`;
  // Clear previous error message
  const prevErrorEl = document.getElementById(errorElementId);
  if (prevErrorEl) {
    prevErrorEl.remove();
  }

  const configStore = getPluginConfig(PLUGIN_ID);
  const settings = configStore.config ? JSON.parse(configStore.config) : {};
  const licenseKey = settings.licenseKey || "";
  console.log("プラグインの設定: ", settings);

  const result = await verifyLicense(licenseKey);

  if (result.status === "valid") {
    return true;
  }

  // Show error message in the appropriate header space
  let headerSpace = null;
  if (eventType === "index") {
    headerSpace = kintone.app.getHeaderSpaceElement();
  } else {
    headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
  }

  if (headerSpace) {
    const errorDiv = document.createElement("div");
    errorDiv.id = errorElementId;
    errorDiv.style.backgroundColor = "#ffcdd2";
    errorDiv.style.border = "1px solid #f44336";
    errorDiv.style.padding = "10px";
    errorDiv.style.textAlign = "center";
    errorDiv.style.color = "#c62828";
    errorDiv.innerHTML = `
      ${PLUGIN_NAME}: ライセンスが無効です。プラグインの機能を利用するには、有効なライセンスを設定してください。
      <a href="/k/admin/app/${getThisAppId()}/plugin/config?pluginId=${SYSTEM_PLUGIN_ID}" style="margin-left: 1em;">プラグイン設定</a>
    `;
    // For index view, prepend to show it at the top
    if (eventType === "index") {
      headerSpace.prepend(errorDiv);
    } else {
      headerSpace.appendChild(errorDiv);
    }
  }

  return false;
};

kintone.events.on(KintoneEvents.Index.Show, async (event: any) => {
  await checkLicense("index");
  return event;
});

kintone.events.on(KintoneEvents.Detail.Show, async (event: any) => {
  const isLicenseValid = await checkLicense("detail");
  if (!isLicenseValid) {
    return event;
  }

  try {
    // Kintone プラグイン設定 読み込み
    const configStore = getPluginConfig(PLUGIN_ID);
    const config = configStore.config ? JSON.parse(configStore.config) : {};

    const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (headerSpace) {
      // Remove header panel if it already exists to prevent duplication
      const existingPanel = document.getElementById(
        DIV_HEADER_PANEL_ELEMENT_ID,
      );
      if (existingPanel) {
        existingPanel.remove();
      }
      const div = document.createElement("div");
      div.id = DIV_HEADER_PANEL_ELEMENT_ID;
      headerSpace.appendChild(div);

      createApp(DesktopView, {
        config,
      }).mount("#" + DIV_HEADER_PANEL_ELEMENT_ID);
    }

    return event;
  } catch (e) {
    console.error(`${PLUGIN_NAME} error:`, e);
    return event;
  }
});
