declare const kintone: any;

import { createApp } from "vue";
import PreferenceView from '@/config/views/preference_view.vue'

(function(PLUGIN_ID) {

    'use strict';

    const TARGET_ELEMENT_ID = "div-config-root";

    let config;

    // Kintone プラグイン設定 読み込み
    const configStore = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (configStore.config) {
        config = JSON.parse(configStore.config);
    }

    createApp(
        PreferenceView,
        {
            config
        }
    ).mount('#' + TARGET_ELEMENT_ID);

})(kintone.$PLUGIN_ID);
