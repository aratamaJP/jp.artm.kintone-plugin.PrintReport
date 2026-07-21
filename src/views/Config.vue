<template>
  <div id="option-root">
    <div class="container">
      <!-- Left: Report List -->
      <div class="report-list-section">
        <h2>帳票一覧</h2>
        <div class="report-list-toolbar">
          <KintoneUiButton text="追加" @callback-on-click="openTemplateDialog" />
        </div>
        <ul class="report-list">
          <li
            v-for="(report, index) in reports"
            :key="index"
            :class="{ selected: index === selectedReportIndex }"
            @click="selectReport(index)"
          >
            <span>{{ report.name }}</span>
            <button class="btn-delete" @click.stop="deleteReport(index)">
              <img :src="imgDelete" alt="削除" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Right: Report Editor -->
      <div class="report-editor-section" v-if="selectedReport">
        <h2>帳票設定</h2>
        <section>
          <label for="report-name" class="require-field">帳票名</label>
          <KintoneUiText
            id="report-name"
            :value="selectedReport.name"
            @callback-on-change="updateSelectedReportName"
          />
        </section>

        <section>
          <label for="report-html">帳票HTML</label>
          <textarea
            id="report-html"
            class="kintoneplugin-textarea"
            v-model="selectedReport.html"
          ></textarea>
        </section>

        <section>
          <label>有効/無効</label>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                v-model="selectedReport.enabled"
                :value="true"
              />
              有効
            </label>
            <label>
              <input
                type="radio"
                v-model="selectedReport.enabled"
                :value="false"
              />
              無効
            </label>
          </div>
        </section>
      </div>
       <div v-else class="report-editor-section placeholder">
        <p>帳票を選択または追加してください。</p>
      </div>
    </div>

    <section id="save-btns">
      <KintoneUiButton
        text="キャンセル"
        style="margin-right: 0.5em"
        @callback-on-click="cancel"
      />
      <KintoneUiButton
        text="保存"
        :is-submit="true"
        @callback-on-click="saveOnClick"
      />
    </section>

    <AlertDialog
      v-if="alertDlgVisible"
      :title="alertTitle"
      :message="alertMessage"
      @close="closeAlertDlg"
    />

    <ModalDialog v-if="showTemplateDialog">
      <template #header>
        <h4>テンプレート選択</h4>
      </template>
      <template #body>
        <div class="template-buttons">
          <KintoneUiButton text="請求書Ａ" @callback-on-click="addReportFromTemplate('invoice')" />
          <KintoneUiButton text="見積書Ａ" @callback-on-click="addReportFromTemplate('quotation')" />
          <KintoneUiButton text="フリーHTML" @callback-on-click="addReportFromTemplate('freehtml')" />
        </div>
      </template>
      <template #footer>
        <KintoneUiButton text="キャンセル" @callback-on-click="closeTemplateDialog" />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

import AlertDialog from "@/common/vue/components/alert_dialog.vue";
import KintoneUiButton from "@/common/vue/components/kintone_ui_button.vue";
import KintoneUiText from "@/common/vue/components/kintone_ui_text.vue";
import ModalDialog from "@/common/vue/components/modal_dialog.vue";

import { imgDelete } from "@/common/const/PictureBase64";
import { pluginSetConfigAsync } from "@/models/ConfigModel";

interface Report {
  name: string;
  html: string;
  enabled: boolean;
}

const TEMPLATES = {
  invoice: {
    name: "請求書A",
    html: `<h1>請求書</h1>
<p>請求書番号: {{record.id.value}}</p>`,
  },
  quotation: {
    name: "見積書A",
    html: `<h1>見積書</h1>
<p>見積書番号: {{record.id.value}}</p>`,
  },
  freehtml: {
    name: "新しい帳票",
    html: "<div>Hello, World!</div>",
  },
};


export default defineComponent({
  name: "ConfigView",
  components: {
    KintoneUiButton,
    KintoneUiText,
    AlertDialog,
    ModalDialog,
  },
  props: ["config"],
  setup(props) {
    const reports = ref<Report[]>([]);
    const selectedReportIndex = ref<number | null>(null);

    const alertDlgVisible = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");

    const showTemplateDialog = ref(false);

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

    const openTemplateDialog = () => {
      showTemplateDialog.value = true;
    };

    const closeTemplateDialog = () => {
      showTemplateDialog.value = false;
    };

    const addReportFromTemplate = (templateType: 'invoice' | 'quotation' | 'freehtml') => {
      const template = TEMPLATES[templateType];
      const newReport: Report = {
        name: `${template.name} ${reports.value.length + 1}`,
        html: template.html,
        enabled: true,
      };
      reports.value.push(newReport);
      selectedReportIndex.value = reports.value.length - 1;
      closeTemplateDialog();
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
      showTemplateDialog,
      openTemplateDialog,
      closeTemplateDialog,
      addReportFromTemplate,
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
.template-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
