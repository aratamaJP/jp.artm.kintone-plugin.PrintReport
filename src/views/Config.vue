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
        <div class="report-editor-header">
          <h2>帳票設定</h2>
          <KintoneUiButton text="プレビュー" @callback-on-click="preview" />
        </div>
        <section>
          <label>テンプレート</label>
          <div class="template-name-display">{{ templateDefinition.name }}</div>
        </section>
        <section>
          <label for="report-name" class="require-field">帳票名</label>
          <KintoneUiText
            id="report-name"
            :value="selectedReport.name"
            @callback-on-change="updateSelectedReportName"
          />
        </section>

        <!-- Template Parameters Section -->
        <div v-if="templateDefinition && templateDefinition.params" class="template-params-section">
          <h3>テンプレート設定</h3>
          <section v-for="param in templateDefinition.params" :key="param.name">
            <label :for="`param-${param.name}`">{{ param.label }}</label>
            <KintoneUiText
              v-if="param.type === 'text'"
              :id="`param-${param.name}`"
              :value="templateParamsData[param.name]"
              @callback-on-change="updateParam(param.name)"
            />
            <textarea
              v-if="param.type === 'text-area'"
              :id="`param-${param.name}`"
              class="kintoneplugin-textarea"
              v-model="templateParamsData[param.name]"
            ></textarea>
          </section>
        </div>



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
import { defineComponent, ref, onMounted, computed, watch } from "vue";

import AlertDialog from "@/common/vue/components/alert_dialog.vue";
import KintoneUiButton from "@/common/vue/components/kintone_ui_button.vue";
import KintoneUiText from "@/common/vue/components/kintone_ui_text.vue";
import ModalDialog from "@/common/vue/components/modal_dialog.vue";

import { imgDelete } from "@/common/const/PictureBase64";
import { pluginSetConfigAsync } from "@/models/ConfigModel";
import { TEMPLATES } from "./templates";

interface Report {
  name: string;
  html: string;
  enabled: boolean;
  template: keyof typeof TEMPLATES;
  template_params: string; // JSON string
}


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

    const templateDefinition = computed(() => {
      if (selectedReport.value && selectedReport.value.template) {
        return TEMPLATES[selectedReport.value.template];
      }
      return null;
    });

    const templateParamsData = ref<Record<string, string>>({});

    const updateParam = (paramName: string) => (value: string) => {
      templateParamsData.value[paramName] = value;
    };

    watch(selectedReport, (newReport) => {
      if (newReport && newReport.template_params) {
        try {
          templateParamsData.value = JSON.parse(newReport.template_params);
        } catch (e) {
          console.error("Failed to parse template_params", e);
          templateParamsData.value = {};
        }
      } else {
        templateParamsData.value = {};
      }
    }, { immediate: true });

    watch(templateParamsData, (newParams) => {
      if (selectedReport.value) {
        selectedReport.value.template_params = JSON.stringify(newParams);
      }
    }, { deep: true });


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
        template: templateType,
        template_params: '{}',
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

    const preview = () => {
      if (!selectedReport.value) return;

      const report = {
        ...selectedReport.value,
        template_params: JSON.stringify(templateParamsData.value),
      };

      localStorage.setItem("print-report-preview-mode", "true");
      localStorage.setItem("print-report-preview-data", JSON.stringify(report));
      
      const message = "設定をプレビューします。レコード詳細画面を開いてください。";
      showAlertDlg("プレビュー", message);
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
      templateDefinition,
      templateParamsData,
      updateParam,
      preview,
    };
  },
});
</script>

<style scoped>
.report-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.report-editor-header h2 {
  margin-bottom: 0;
}
.template-name-display {
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 5px;
}
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
  height: 150px;
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
.template-params-section {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.template-params-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
</style>
