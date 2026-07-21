<template>
  <div id="option-root">
    <KintoneUiButton text="帳票印刷" @callback-on-click="addReport" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

import AlertDialog from "@/common/vue/components/alert_dialog.vue";
import KintoneUiButton from "@/common/vue/components/kintone_ui_button.vue";
import KintoneUiText from "@/common/vue/components/kintone_ui_text.vue";

import { getThisAppId } from "@/common/kintone/KintoneJsapiWrapper";
import { imgDelete } from "@/common/const/PictureBase64";

import { pluginSetConfigAsync } from "@/models/ConfigModel";
import { ConfigCtrl } from "@/controllers/ConfigCtrl"

interface Report {
  name: string;
  html: string;
  enabled: boolean;
}

export default defineComponent({
  name: "PreferenceView",
  components: {
    KintoneUiButton,
    KintoneUiText,
    AlertDialog,
  },
  props: ["config"],
  setup(props) {
    const reports = ref<Report[]>([]);
    const selectedReportIndex = ref<number | null>(null);

    const alertDlgVisible = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");

    const selectedReport = computed(() => {
      if (selectedReportIndex.value !== null) {
        return reports.value[selectedReportIndex.value];
      }
      return null;
    });

    const loadConfig = () => {
      if (props.config && props.config.reports) {
        reports.value = JSON.parse(props.config.reports);
        if (reports.value.length > 0) {
          selectedReportIndex.value = 0;
        }
      }
    };

    onMounted(loadConfig);

    const addReport = () => {
      const newReport: Report = {
        name: `新しい帳票 ${reports.value.length + 1}`,
        html: "<div>Hello, World!</div>",
        enabled: true,
      };
      reports.value.push(newReport);
      selectedReportIndex.value = reports.value.length - 1;
    };

    const deleteReport = (index: number) => {
      reports.value.splice(index, 1);
      if (selectedReportIndex.value === index) {
        selectedReportIndex.value = reports.value.length > 0 ? 0 : null;
      } else if (selectedReportIndex.value !== null && selectedReportIndex.value > index) {
        selectedReportIndex.value--;
      }
    };

    const selectReport = (index: number) => {
      selectedReportIndex.value = index;
    };

    const updateSelectedReportName = (newName: string) => {
      if (selectedReport.value) {
        selectedReport.value.name = newName;
      }
    };

    const showAlertDlg = (title: string, msg: string) => {
      alertTitle.value = title;
      alertMessage.value = msg;
      alertDlgVisible.value = true;
    };

    const closeAlertDlg = () => {
      alertDlgVisible.value = false;
    };

    const saveOnClick = async () => {
      try {
        await pluginSetConfigAsync({
          reports: JSON.stringify(reports.value),
        });
        showAlertDlg("設定保存完了", "プラグインの設定が保存されました。");
      } catch (e: any) {
        showAlertDlg("エラー", `設定の保存に失敗しました: ${e.message}`);
      }
    };

    const cancel = () => {
      window.location.href = "./";
    };

    return {
      reports,
      selectedReportIndex,
      selectedReport,
      addReport,
      deleteReport,
      selectReport,
      updateSelectedReportName,
      saveOnClick,
      cancel,
      imgDelete,
      alertDlgVisible,
      alertTitle,
      alertMessage,
      closeAlertDlg,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
}
.report-list-section {
  width: 250px;
  border-right: 1px solid #ccc;
  padding-right: 20px;
}
.report-editor-section {
  flex-grow: 1;
}
.report-list-toolbar {
  margin-bottom: 10px;
}
.report-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}
.report-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}
.report-list li:hover {
  background-color: #f5f5f5;
}
.report-list li.selected {
  background-color: #e3f2fd;
}
.btn-delete {
  background: transparent;
  border: none;
  cursor: pointer;
}
.report-editor-section section {
  margin-bottom: 20px;
}
.report-editor-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.kintoneplugin-textarea {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  padding: 5px;
}
.radio-group label {
  margin-right: 15px;
  font-weight: normal;
}
#save-btns {
  margin-top: 2.8em;
  padding-top: 1em;
  border-top: 1px solid #ccc;
}
.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
}
</style>
