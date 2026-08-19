<template>
  <div id="option-root">
    <div class="tabs">
      <button :class="{ active: currentTab === 'reports' }" @click="switchTab('reports')">
        帳票一覧
      </button>
      <button :class="{ active: currentTab === 'license' }" @click="switchTab('license')">
        ライセンス設定
      </button>
    </div>

    <!-- Reports Tab -->
    <div v-if="currentTab === 'reports'" class="tab-content">
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
              :class="{ selected: Number(index) === selectedReportIndex }"
              @click="selectReport(index)"
            >
              <span>{{ report.name }}</span>
              <div class="report-list-buttons">
                <button class="btn-reorder" @click.stop="moveReportUp(index)" :disabled="Number(index) === 0">↑</button>
                <button class="btn-reorder" @click.stop="moveReportDown(index)" :disabled="Number(index) === reports.length - 1">↓</button>
                <button class="btn-delete" @click.stop="deleteReport(index)">
                  <img :src="imgDelete" alt="削除" />
                </button>
              </div>
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
            <div class="template-name-container">
              <label>テンプレート</label>
              <span>{{ templateDefinition.name }}</span>
            </div>
            <div class="template-name-container" v-if="templateDefinition && templateDefinition.version" style="margin-top: 5px">
              <label>テンプレートバージョン</label>
              <span>{{ templateDefinition.version }}</span>
            </div>
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
            <div v-for="param in templateDefinition.params" :key="param.name">
              <!-- 'text' type parameter -->
              <section v-if="param.type === 'text'">
                <label :for="`param-${param.name}`">{{ param.label }}</label>
                <KintoneUiText
                  :id="`param-${param.name}`"
                  :value="templateParamsData[param.name]"
                  @callback-on-change="updateParam(param.name)($event)"
                />
              </section>

              <!-- 'text-area' type parameter -->
              <section v-if="param.type === 'text-area'">
                <label :for="`param-${param.name}`">{{ param.label }}</label>
                <textarea
                  :id="`param-${param.name}`"
                  class="kintoneplugin-textarea"
                  v-model="templateParamsData[param.name]"
                ></textarea>
              </section>

              <!-- 'field-select' type parameter -->
              <section v-if="param.type === 'field-select'">
                  <label :for="`param-${param.name}`">{{ param.label }}</label>
                  <KintoneUiDropdown
                      :id="`param-${param.name}`"
                      :value="String(templateParamsData[param.name] ?? '')"
                      :options="appFields"
                      @callback-on-change="updateParam(param.name)($event)"
                  />
              </section>

              <!-- 'table-select' type parameter -->
              <div v-if="param.type === 'table-select'" class="table-param-section">
                  <h4>{{ param.label }}</h4>
                  <section>
                      <label :for="`param-${param.name}-table`">対象テーブル</label>
                      <KintoneUiDropdown
                          :id="`param-${param.name}-table`"
                          :value="String(templateParamsData[param.name]?.tableCode ?? '')"
                          :options="appTables"
                          @callback-on-change="updateTableParam(param.name, 'tableCode', null)($event)"
                      />
                  </section>
                  <div v-if="templateParamsData[param.name]?.tableCode" class="table-sub-params">
                      <section v-for="subParam in param.params" :key="subParam.name">
                          <label :for="`param-${param.name}-${subParam.name}`">{{ subParam.label }}</label>
                          <KintoneUiDropdown
                              :id="`param-${param.name}-${subParam.name}`"
                              :value="String(templateParamsData[param.name]?.mappings?.[subParam.name] ?? '')"
                              :options="getTableFields(templateParamsData[param.name]?.tableCode)"
                              @callback-on-change="updateTableParam(param.name, 'mappings', subParam.name)($event)"
                          />
                      </section>
                  </div>
              </div>
            </div>
          </div>



          <section>
            <label>有効/無効</label>
            <div class="radio-group">
              <label>
                <input
                  type="radio"
                  name="report-enabled"
                  :checked="selectedReport.enabled"
                  @change="selectedReport.enabled = true"
                />
                有効
              </label>
              <label>
                <input
                  type="radio"
                  name="report-enabled"
                  :checked="!selectedReport.enabled"
                  @change="selectedReport.enabled = false"
                />
                無効
              </label>
            </div>
          </section>

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
        </div>
        <div v-else class="report-editor-section">
          <div class="placeholder">
            <p>帳票を選択または追加してください。</p>
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
        </div>
      </div>
    </div>

    <!-- License Tab -->
    <div v-if="currentTab === 'license'" class="tab-content">
      <div class="license-section">
        <h2>ライセンス設定</h2>
        <section>
          <label for="license-key">ライセンスキー</label>
          <div class="license-input-container">
            <KintoneUiText
              id="license-key"
              :value="licenseKey"
              @callback-on-change="updateLicenseKey"
            />
            <KintoneUiButton text="認証" @callback-on-click="verifyLicenseKey" />
          </div>
          <p class="license-purchase-link">
            ライセンスキーをお持ちでない場合は、<a :href="purchaseUrl" target="_blank">こちら</a>からご購入ください。
          </p>
        </section>
      </div>
    </div>

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

    <ConfirmDialog
      v-if="confirmDlgVisible"
      :title="confirmTitle"
      :message="confirmMessage"
      @ok="onConfirmOk"
      @cancel="onConfirmCancel"
    />

    <ConfirmDialog
      v-if="deleteConfirmVisible"
      title="帳票の削除"
      :message="deleteConfirmMessage"
      @ok="handleDeleteConfirmOk"
      @cancel="handleDeleteConfirmCancel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, PropType } from "vue";

import AlertDialog from "@/common/vue/components/alert_dialog.vue";
import ConfirmDialog from "@/common/vue/components/confirm_dialog.vue";
import KintoneUiButton from "@/common/vue/components/kintone_ui_button.vue";
import KintoneUiText from "@/common/vue/components/kintone_ui_text.vue";
import KintoneUiDropdown from "@/common/vue/components/kintone_ui_dropdown.vue";
import ModalDialog from "@/common/vue/components/modal_dialog.vue";

import { imgDelete } from "@/common/const/PictureBase64";
import { pluginSetConfigAsync } from "@/models/ConfigModel";
import { getThisAppId } from "@/common/kintone/KintoneJsapiWrapper";
import { TEMPLATES } from "./templates";
import { verifyLicense, getPurchaseUrl } from "@/services/LicenseService";

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
    KintoneUiDropdown,
    AlertDialog,
    ConfirmDialog,
    ModalDialog,
  },
  props: {
    config: {
      type: Object as PropType<{ [key: string]: string }>,
      required: true,
    },
  },
  setup(props) {
    const reports = ref<Report[]>([]);
    const selectedReportIndex = ref<number | null>(null);

    const licenseKey = ref("");
    const purchaseUrl = ref("");

    const alertDlgVisible = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");

    const confirmDlgVisible = ref(false);
    const confirmTitle = ref("");
    const confirmMessage = ref("");
    let confirmOkAction: (() => void) | null = null;

    const deleteConfirmVisible = ref(false);
    const deleteConfirmMessage = ref("");
    const indexToDelete = ref<number | null>(null);

    const showTemplateDialog = ref(false);

    const currentTab = ref("reports");

    const initialState = ref<string>("");

    const isDirty = computed(() => {
      const currentState = JSON.stringify({
        reports: reports.value,
        licenseKey: licenseKey.value,
      });
      return initialState.value !== currentState;
    });

    const resetConfirm = () => {
      confirmDlgVisible.value = false;
      confirmTitle.value = "";
      confirmMessage.value = "";
      confirmOkAction = null;
    };

    const onConfirmOk = () => {
      reloadState(); // Re-load the state to discard changes
      if (confirmOkAction) {
        confirmOkAction();
      }
      resetConfirm();
    };

    const onConfirmCancel = () => {
      resetConfirm();
    };

    const confirmIfNeeded = (action: () => void) => {
      if (isDirty.value) {
        confirmTitle.value = "未保存の変更があります";
        confirmMessage.value = "変更を破棄して続行しますか？";
        confirmOkAction = action;
        confirmDlgVisible.value = true;
      } else {
        action();
      }
    };

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

    const templateParamsData = ref<Record<string, any>>({});

    const appFields = ref<{ value: string; label: string }[]>([]);
    const appTables = ref<
      { value: string; label: string; fields: { value: string; label: string }[] }[]
    >([]);

    const fetchKintoneFields = async () => {
      const kintoneAppId = getThisAppId();
      if(!kintoneAppId) {
        //
        // Configuration page is opened on the global settings page.
        //
        return;
      }
      const resp = await kintone.api(
        kintone.api.url("/k/v1/form.json", true),
        "GET",
        { app: kintoneAppId }
      );
      const fields: { value: string; label: string }[] = [{ value: "", label: "（未選択）" }];
      const tables: { value: string; label: string; fields: { value: string; label: string }[] }[] = [{ value: "", label: "（未選択）", fields: [] }];

      // Using any to avoid creating full type definitions for kintone API response
      for (const prop of Object.values<any>(resp.properties)) {
        fields.push({ value: prop.code, label: `${prop.label} (${prop.code})` });
        if (prop.type === "SUBTABLE") {
          const tableSubFields: { value: string; label: string }[] = [{ value: "", label: "（未選択）" }];
          for (const subField of Object.values<any>(prop.fields)) {
            tableSubFields.push({
              value: subField.code,
              label: `${subField.label} (${subField.code})`,
            });
          }
          tables.push({
            value: prop.code,
            label: `${prop.label} (${prop.code})`,
            fields: tableSubFields,
          });
        }
      }
      appFields.value = fields;
      appTables.value = tables;
    };

    const getTableFields = (tableCode: string): { value: string; label: string }[] => {
      if (!tableCode) return [];
      const table = appTables.value.find((t) => t.value === tableCode);
      return table ? table.fields : [];
    };

    const updateParam = (paramName: string) => (value: any) => {
      templateParamsData.value = {
        ...templateParamsData.value,
        [paramName]: value,
      };
    };

    const updateTableParam = (
      paramName: string,
      key: "tableCode" | "mappings",
      subParamName: string | null
    ) => (value: string) => {
      const currentParam = { ...(templateParamsData.value[paramName] || { tableCode: "", mappings: {} }) };

      if (key === "tableCode") {
        currentParam.tableCode = value;
        currentParam.mappings = {};
      } else if (key === "mappings" && subParamName) {
        currentParam.mappings = {
          ...(currentParam.mappings || {}),
          [subParamName]: value
        };
      }

      templateParamsData.value = {
        ...templateParamsData.value,
        [paramName]: currentParam,
      };
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
      reports.value = [];
      selectedReportIndex.value = null;

      if (props.config) {
        if (props.config.reports && props.config.reports.length > 0) {
          reports.value = JSON.parse(props.config.reports);
          if (reports.value.length > 0) {
            selectedReportIndex.value = 0;
          }
        }
        if (props.config.licenseKey) {
          licenseKey.value = props.config.licenseKey;
        }
      }
    };

    const reloadState = () => {
      loadConfig();
      initialState.value = JSON.stringify({
        reports: reports.value,
        licenseKey: licenseKey.value,
      });
    };

    onMounted(() => {
      reloadState();
      fetchKintoneFields();
      purchaseUrl.value = getPurchaseUrl();
    });

    const openTemplateDialog = () => {
      confirmIfNeeded(() => {
        showTemplateDialog.value = true;
      });
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
      indexToDelete.value = index;
      const reportName = reports.value[index]?.name || "";
      deleteConfirmMessage.value = `帳票「${reportName}」を削除しますか？`;
      deleteConfirmVisible.value = true;
    };

    const handleDeleteConfirmOk = () => {
      if (indexToDelete.value !== null) {
        const index = indexToDelete.value;
        reports.value.splice(index, 1);
        if (selectedReportIndex.value === index) {
          selectedReportIndex.value = reports.value.length > 0 ? 0 : null;
        } else if (selectedReportIndex.value !== null && selectedReportIndex.value > index) {
          selectedReportIndex.value--;
        }
      }
      deleteConfirmVisible.value = false;
      indexToDelete.value = null;
    };

    const handleDeleteConfirmCancel = () => {
      deleteConfirmVisible.value = false;
      indexToDelete.value = null;
    };

    const selectReport = (index: number) => {
      if (index === selectedReportIndex.value) return;
      confirmIfNeeded(() => {
        selectedReportIndex.value = index;
      });
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

    const saveConfig = async (showSuccessAlert = true) => {
      try {
        // 保存前に、現在選択されている帳票のテンプレートからHTMLを更新
        if (selectedReport.value && selectedReport.value.template && TEMPLATES[selectedReport.value.template]) {
          selectedReport.value.html = TEMPLATES[selectedReport.value.template].html;
        }

        const configToSave = {
          reports: JSON.stringify(reports.value),
          licenseKey: licenseKey.value,
        };
        console.log("保存するプラグイン設定: ", configToSave);
        await pluginSetConfigAsync(configToSave);
        initialState.value = JSON.stringify({
          reports: reports.value,
          licenseKey: licenseKey.value,
        });
        if (showSuccessAlert) {
          showAlertDlg("設定保存完了", "プラグインの設定を更新しました。<br>アプリの動作に反映するためには、アプリの設定画面で「アプリの更新」の実行が必要です。");
        }
      } catch (e: any) {
        showAlertDlg("エラー", `設定の保存に失敗しました: ${e.message}`);
      }
    };

    const saveOnClick = () => saveConfig(true);

    const cancel = () => {
      confirmIfNeeded(() => {
        window.location.href = "./";
      });
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

    const verifyLicenseKey = async () => {
      const result = await verifyLicense(licenseKey.value);
      showAlertDlg(`ライセンス認証結果 (${result.status})`, result.message);
      if (result.status === "valid") {
        await saveConfig(false);
      }
    };

    const updateLicenseKey = (v: string) => {
      licenseKey.value = v;
    };

    const switchTab = (tabName: "reports" | "license") => {
      if (tabName === currentTab.value) return;
      confirmIfNeeded(() => {
        currentTab.value = tabName;
      });
    };

    const moveReportUp = (index: number) => {
      if (index > 0) {
        const report = reports.value.splice(index, 1)[0];
        reports.value.splice(index - 1, 0, report);
        if (selectedReportIndex.value === index) {
          selectedReportIndex.value = index - 1;
        } else if (selectedReportIndex.value === index - 1) {
          selectedReportIndex.value = index;
        }
      }
    };

    const moveReportDown = (index: number) => {
      if (index < reports.value.length - 1) {
        const report = reports.value.splice(index, 1)[0];
        reports.value.splice(index + 1, 0, report);
        if (selectedReportIndex.value === index) {
          selectedReportIndex.value = index + 1;
        } else if (selectedReportIndex.value === index + 1) {
          selectedReportIndex.value = index;
        }
      }
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
      appFields,
      appTables,
      getTableFields,
      updateTableParam,
      licenseKey,
      purchaseUrl,
      verifyLicenseKey,
      updateLicenseKey,
      currentTab,
      switchTab,
      moveReportUp,
      moveReportDown,
      confirmDlgVisible,
      confirmTitle,
      confirmMessage,
      onConfirmOk,
      onConfirmCancel,
      deleteConfirmVisible,
      deleteConfirmMessage,
      handleDeleteConfirmOk,
      handleDeleteConfirmCancel,
    };
  },
});
</script>

<style scoped>
.tabs {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 3px solid transparent;
}
.tabs button.active {
  border-bottom-color: #3498db;
  color: #3498db;
}
.tab-content {
  /*
  padding: 20px;
  border: 1px solid #ddd;
  border-top: none;
  */
}
.report-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.report-editor-header h2 {
  margin-bottom: 0;
}
.template-name-container {
  display: flex;
  align-items: center;
}
.template-name-container label {
  margin-bottom: 0;
  margin-right: 1em;
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
  display: flex;
  flex-direction: column;
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
.report-list-buttons {
  display: flex;
  align-items: center;
}
.btn-reorder {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}
.btn-reorder:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
    flex-grow: 1;
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
.table-param-section {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}
.table-param-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.table-sub-params {
  padding-left: 15px;
  border-left: 3px solid #eee;
  margin-top: 10px;
}
.license-section {
  /*
  border-top: 1px solid #ccc;
  margin-top: 2em;
  padding-top: 1.5em;
  */
}
.license-section h2 {
  margin-bottom: 1em;
}
.license-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.license-purchase-link {
  margin-top: 1em;
  font-size: 0.9em;
  color: #555;
}
</style>
