// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import { createApp } from "vue";
import { getPluginConfig } from "@/common/kintone/KintoneJsapiWrapper";
import ConfigView from "@/views/Config.vue";

const PLUGIN_ID = kintone.$PLUGIN_ID;
const TARGET_ELEMENT_ID = "div-config-root";

// Kintone プラグイン設定 読み込み
let config;
const configStore = getPluginConfig(PLUGIN_ID);
if (configStore.config) {
  config = JSON.parse(configStore.config);
}

createApp(
  ConfigView,
  {
    config
  }
).mount('#' + TARGET_ELEMENT_ID);


/*
const form = document.querySelector(".js-submit-settings");
const cancelButton = document.querySelector(".js-cancel-button");
const messageInput =
  document.querySelector<HTMLInputElement>(".js-text-message");
if (!(form && cancelButton && messageInput)) {
  throw new Error("Required elements do not exist.");
}
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.message) {
  messageInput.value = config.message;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig({ message: messageInput.value }, () => {
    alert("The plug-in settings have been saved. Please update the app!");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
*/