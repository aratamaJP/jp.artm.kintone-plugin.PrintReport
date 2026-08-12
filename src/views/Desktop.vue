<template>
  <div id="option-root">
    <KintoneUiButton text="帳票印刷" @callback-on-click="openPrintDialog" />

    <ModalDialog v-if="showPrintDialog">
      <template #header>
        <h4>帳票印刷</h4>
      </template>
      <template #body>
        <KintoneUiDropdown
          :value="selectedReportName"
          :options="enabledReportOptions"
          @callback-on-change="selectReportForPrint"
        />
      </template>
      <template #footer>
        <div class="footer-buttons">
          <KintoneUiButton text="印刷" :is-submit="true" @callback-on-click="printReport" />
          <KintoneUiButton text="キャンセル" @callback-on-click="closePrintDialog" />
        </div>
      </template>
    </ModalDialog>

    <AlertDialog
      v-if="alertDlgVisible"
      :title="alertTitle"
      :message="alertMessage"
      @close="closeAlertDlg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

import { DesktopCtrl } from "@/controllers/DesktopCtrl";

import AlertDialog from "@/common/vue/components/alert_dialog.vue";
import KintoneUiButton from "@/common/vue/components/kintone_ui_button.vue";
import KintoneUiDropdown from "@/common/vue/components/kintone_ui_dropdown.vue";
import ModalDialog from "@/common/vue/components/modal_dialog.vue";

interface Report {
  name: string;
  html: string;
  enabled: boolean;
  template_params: string;
}

export default defineComponent({
  name: "DesktopView",
  components: {
    KintoneUiButton,
    KintoneUiDropdown,
    AlertDialog,
    ModalDialog,
  },
  props: ["config"],
  setup(props) {
    const reports = ref<Report[]>([]);
    const showPrintDialog = ref(false);
    const selectedReportName = ref<string | null>(null);

    const alertDlgVisible = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");

    const enabledReports = computed(() => {
      return reports.value.filter(report => report.enabled);
    });

    const enabledReportOptions = computed(() => {
      return enabledReports.value.map(report => ({
        value: report.name,
        label: report.name,
      }));
    });

    const loadConfig = () => {
      if (props.config && props.config.reports) {
        reports.value = JSON.parse(props.config.reports);
      }

      for (const report of reports.value) {
        console.log(report.name);
        console.log(report.html);
        console.log(report.enabled);
        console.log(report.template_params);
      }

    };

    onMounted(loadConfig);

    const openPrintDialog = () => {
      if (enabledReports.value.length === 0) {
        showAlertDlg("帳票なし", "利用可能な帳票がありません。");
        return;
      }
      selectedReportName.value = enabledReports.value[0]?.name;
      showPrintDialog.value = true;
    };

    const closePrintDialog = () => {
      showPrintDialog.value = false;
    };



    const selectReportForPrint = (reportName: string) => {
      selectedReportName.value = reportName;
    };

    const printReport = () => {
      const report = reports.value.find(r => r.name === selectedReportName.value);
      if (!report) {
        showAlertDlg("エラー", "選択された帳票が見つかりません。");
        return;
      }

      const kintoneRecord = kintone.app.record.get();
      if (!kintoneRecord || !kintoneRecord.record) {
        showAlertDlg("エラー", "レコードデータが取得できません。");
        return;
      }

      DesktopCtrl.print(report, kintoneRecord.record);

      closePrintDialog();
    };

    const showAlertDlg = (title: string, msg: string) => {
      alertTitle.value = title;
      alertMessage.value = msg;
      alertDlgVisible.value = true;
    };

    const closeAlertDlg = () => {
      alertDlgVisible.value = false;
    };

    return {
      showPrintDialog,
      openPrintDialog,
      closePrintDialog,
      printReport,
      enabledReportOptions,
      selectedReportName,
      selectReportForPrint,
      alertDlgVisible,
      alertTitle,
      alertMessage,
      closeAlertDlg,
    };
  },
});
</script>

<style scoped>
.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
