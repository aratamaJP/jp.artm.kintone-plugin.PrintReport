<template>
    <div id="option-root">
        <form onsubmit="return false">
            <section id="section-app-id">
                <h2>グループを管理するアプリ</h2>
                <p class="annotation">
                    カンバンのグループ情報を管理するために使用するアプリを指定します。<br>
                    空のアプリを指定した場合、自動で必要なフィールドが追加されます。
                </p>
                <p class="appid" >
                    <label for="rslt-app-id" class="require-field">
                        <span class="required">アプリID</span>
                        <KintoneUiText :value="groupMngAppId" @callbackOnChange="grpMngAppId_OnChange" :error="groupMngAppError" />
                    </label>
                </p>
                <p class="app-name">
                    <label>
                        <span>アプリ名</span>
                        {{ groupMngAppName }}
                    </label>
                </p>

            </section>

            <section>
                <h2>対象カスタマイズビュー</h2>
                <div>
                    <div class="annotation">
                        <div>
                            <p>カンバン方式で表示するカスタマイズビューを指定します。</p>
                            <p>表示されるレコードは、カスタマイズ一覧のフィルタ条件が適用されます</p>
                            <p>カスタマイズ一覧の「HTML」には下記のように記述してください。<br>
                                <code>
                                    &lt;div id="kanban-method-panel"&gt;&lt;/div&gt;
                                </code>
                            </p>
                        </div>
                    </div>
                    <KintoneUiButton text="追加" v-on:callbackOnClick="showSelCustomViewDlg"  />
                </div>
                <ul class="ul-target-views">
                    <li v-for="(targetViewId, index) in targetViews" :key="index">
                        <span>
                            {{ customizeViews[targetViewId] }}
                        </span>
                        <span class="span-list-btns">
                            <!-- ビュー削除ボタン -->
                            <button type="button" class="btn-delete" v-on:click.prevent="delTargetView(index)"><img :src="imgDelete" ></button>
                        </span>
                    </li>
                </ul>
            </section>

            <section>
                <h2>カンバンに表示するフィールド</h2>
                <div>
                    <p class="annotation">
                        カンバンに表示するフィールドを指定します。<br>
                    </p>
                    <KintoneUiButton text="追加" v-on:callbackOnClick="showSelAppFieldDlg"  />
                </div>
                <ul class="ul-card-fields">
                    <li v-for="(cardFieldCode, index) in cardFields" :key="index">
                        <span>
                            {{ fieldLabels[cardFieldCode] }}
                        </span>
                        <span class="span-list-btns">
                            <!-- 表示項目 削除ボタン -->
                            <button type="button" class="btn-delete" v-on:click.prevent="delCardField(index)"><img :src="imgDelete" ></button>
                            <!-- 集計項目 上へボタン -->
                            <button type="button" class="btn-move-up" v-on:click.prevent="moveUpCardField(index)" :disabled="index == 0"><img :src="imgArrowUp" ></button>
                            <!-- 集計項目 下へボタン -->
                            <button type="button" class="btn-move-down" v-on:click.prevent="moveDownCardField(index)" :disabled="index == cardFields.length -1"><img :src="imgArrowDown" ></button>
                        </span>
                    </li>
                </ul>
            </section>

            <section>
                <h2>プラグインの動作設定</h2>
                <fieldset id="fset-use-cursor">
                    <legend>一覧検索時のカーソルの使用有無</legend>
                    <p class="not-min-width">
                        <label><input type="radio" value="t" v-model="apiUseCursor" />使用する</label>
                        <label><input type="radio" value="f" v-model="apiUseCursor" />使用しない</label>
                    </p>
                </fieldset>
            </section>

            <section id="save-btns">
                <KintoneUiButton text="キャンセル" v-on:callbackOnClick="cancel" style="margin-right: 0.5em;" />
                <KintoneUiButton text="OK" v-on:callbackOnClick="saveOnClick" type="submit"  />
            </section>

        </form>

        <!-- 追加ビュー選択ダイアログ -->
        <ModalDialog v-show="selCustomViewDlgActive" v-on:close="closeSelCustomViewDlg">

            <template v-slot:header></template>
            <template v-slot:body>
                <form id="edit-group-name-form" onsubmit="return false">
                    <div style="line-height: initial;" class="block-center">
                        <div>カスタマイズビュー</div>
                        <div>
                            <span class="annotation">
                                カンバン方式を表示するカスタマイズビューを選択してください。<br>
                            </span>
                            <select id="select-custom-view" v-model="selCustomViewId">
                                <option v-for="(viewName, viewId) in customizeViews" :key="viewId" :value="viewId">
                                    {{ viewName }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <!-- エンターキーが押されたとき用 -->
                    <button type="submit" @click="applySelCustomViewDlg" style="display:none;">Submit</button>
                </form>
            </template>
            <template v-slot:footer>
                <div class="dialog-buttons">
                    <KintoneUiButton text="キャンセル" v-on:callbackOnClick="closeSelCustomViewDlg" style="margin-right: 0.5em;" />
                    <KintoneUiButton text="追加" v-on:callbackOnClick="applySelCustomViewDlg" type="submit"  />
                </div>
            </template>

        </ModalDialog>

        <!-- 追加フィールド選択ダイアログ -->
        <ModalDialog v-show="selAppFieldDlgActive" v-on:close="closeSelAppFieldDlg">

            <template v-slot:header></template>
            <template v-slot:body>
                <form id="edit-group-name-form" onsubmit="return false">
                    <div style="line-height: initial;" class="block-center">
                        <div>フィールド</div>
                        <div>
                            <span class="annotation">
                                カンバンに表示するフィールドを選択してください。<br>
                            </span>
                            <select id="select-app-field" v-model="selAppFieldCode">
                                <option v-for="field in fieldsForCard" :key="field.value" :value="field.value">
                                {{ field.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <!-- エンターキーが押されたとき用 -->
                    <button type="submit" @click="applySelAppFieldDlg" style="display:none;">Submit</button>
                </form>
            </template>
            <template v-slot:footer>
                <div class="dialog-buttons">
                    <KintoneUiButton text="キャンセル" v-on:callbackOnClick="closeSelAppFieldDlg" style="margin-right: 0.5em;" />
                    <KintoneUiButton text="追加" v-on:callbackOnClick="applySelAppFieldDlg" type="submit"  />
                </div>
            </template>

        </ModalDialog>

        <ConfirmDialog  v-show="confirmDlgVisible"
                    v-on:close="closeConfirmDlg"
                    v-on:apply="confirmApplyClback"
                    cancelText="キャンセル"
                    applyText="はい"
                    :title="confirmDlgTitle"
                    :message="confirmDlgMessage"
                    ></ConfirmDialog>

        <AlertDialog  v-show="alertDlgVisible"
                      v-on:close="closeAlertDlg"
                      :title="alertTitle"
                      :message="alertMessage"
                      okText="OK"
                      ></AlertDialog>

    </div>
</template>

<style scoped>
h2
{
    margin: 1.8em 0 0.3em 0;
    border-top: 1px solid #ccc;
    padding-top: 0.8em;
}

code
{
    font-family: monospace;
    background: #eee;
    color: black;
    padding: 1.3em;
    display: inline-block;
    border-radius: 5px;
    margin: 0.5em 0;
}

#section-app-id label > span
{
    min-width:6em;
    display: inline-block;
}

#save-btns
{
    margin-top: 2.8em;
}

#select-custom-view
{
    width:100%;
}

.annotation::before {
    content: "※";
    padding-right: 5px;
}
.annotation {
    font-size:0.85em;
    display: flex;
    color: indianred;
    margin: 0.5em 0 0.8em 0;
}
.annotation p
{
    margin-bottom: 0.25em;
}

.required::after {
    content: "*";
    color: indianred;
    margin-left: 0.2em;
}

.span-list-btns {
    margin-left:0.2em;
}
.span-list-btns button {
    border-style: none;
    background: transparent;
    cursor: pointer;
}

.span-list-btns button:disabled {
    opacity: 0.25;
    cursor:default;

}

.ul-target-views,
.ul-card-fields
{
    display: inline-block;
    margin-top: 0.8em;
}

.ul-target-views > li,
.ul-card-fields > li
{
    background: #d2ecfc;
    border-radius: 4px;
    margin-bottom: 0.5em;
    padding: 0.8em 0em 0.5em 0.8em;
}

.ul-target-views > li > span:first-child,
.ul-card-fields > li > span:first-child
{
    display: inline-block;
    font-size:1.2em;
}

.ul-target-views > li > span:first-child
{
    width :24em;
}

.ul-card-fields > li > span:first-child
{
    width :12em;
}

#fset-use-cursor
{
    display: inline-block;
    padding: 0.5em 0.8em;
    border:none;
}

#fset-use-cursor input[type="radio"]
{
    margin-right: 0.3em;
}

#fset-use-cursor legend
{
    font-size: 1.2em;
}

#fset-use-cursor label
{
    margin-right: 0.8em;
}

</style>

<script>

import ModalDialog from '@/common/vue/components/modal_dialog.vue'
import AlertDialog from '@/common/vue/components/alert_dialog.vue'
import ConfirmDialog from '@/common/vue/components/confirm_dialog.vue'

import KintoneUiButton from '@/common/vue/components/kintone_ui_button.vue'
import KintoneUiText from '@/common/vue/components/kintone_ui_text.vue'
import KintoneUiDropdown from '@/common/vue/components/kintone_ui_dropdown.vue'

import { CONFIG_KEYS } from "@/common/const/config_keys";

import { Ctrl } from "@/config/controls/preference_ctrl";

import { imgDelete, imgArrowUp, imgArrowDown } from '@/common/const/picture-base64'

export default {
    name: 'PreferenceView',
    components: {
        KintoneUiButton,
        KintoneUiText,
        KintoneUiDropdown,
        ModalDialog,
        AlertDialog,
        ConfirmDialog,
    },
    computed: {
    },
    props: ['config'],
    data: function () {
        return {

            fcodeParentTable : "",
            fcodeChildTable : "",

            // グループ管理アプリ
            groupMngAppId : null,
            groupMngAppName : "",
            groupMngAppError : "",

            // 対象のカスタマイズビュー
            targetViews : null,

            // 表示するフィールド
            cardFields : null,

            // カーソル使用
            apiUseCursor : "",

            selCustomViewDlgActive : false,
            selCustomViewId : "",

            selAppFieldDlgActive : false,
            selAppFieldCode : "",

            // アプリのカスタマイズビュー一覧
            customizeViews : {},
            // カード表示用のフィールド一覧
            fieldsForCard : [],
            fieldLabels : {},

            // アラートダイアログ
            alertDlgVisible : false,
            alertTitle : "",
            alertMessage : "",

            // 確認ダイアログ
            confirmDlgVisible : false,
            confirmDlgTitle : "",
            confirmDlgMessage : "",
            confirmApplyClback : undefined,

            // 画像素材
            imgDelete,
            imgArrowUp,
            imgArrowDown

        };
    },
    mounted : async function() {

        if (this.config) {

            this.groupMngAppId = this.config[CONFIG_KEYS.APP_ID_GROUP_MNG];
            this.targetViews = this.config[CONFIG_KEYS.TARGET_VIEWS];
            this.cardFields = this.config[CONFIG_KEYS.CARD_FIELDS];
            this.apiUseCursor = this.config[CONFIG_KEYS.API_USE_CURSOR];

            try {
                this.groupMngAppName = await Ctrl.getAppNameAsync(this.groupMngAppId);
            } catch(e) {
                this.groupMngAppName = e.message;
            }

        } else {
            this.groupMngAppId = "";
            this.targetViews = [];
            this.cardFields = [];
            this.apiUseCursor = "t";
        }

        this.customizeViews = await Ctrl.getCustomizeViewsAsync();

        const formFields = await Ctrl.getAppFormFieldsAsync();
        this.fieldsForCard = await Ctrl.getFieldsForCardAsync(formFields);

        this.fieldsForCard.forEach(field => {
            this.fieldLabels[field.value] = field.label;
        });

    },
    methods:{

        /**
         * グループ管理アプリID 変更時
         */
        grpMngAppId_OnChange : async function(newValue) {
            try {
                this.groupMngAppId = newValue;
                this.groupMngAppName = await Ctrl.getAppNameAsync(this.groupMngAppId);
            } catch(e) {
                this.groupMngAppName = e.message;
            }
        },

        /**
         * ビュー選択ダイアログ表示
         */
        showSelCustomViewDlg : function() {
            this.selCustomViewId = "";
            this.selCustomViewDlgActive = true;
        },
        /**
         * ビュー選択ダイアログを閉じる
         */
        closeSelCustomViewDlg : function() {
            this.selCustomViewDlgActive = false;
        },

        /**
         * フィールド選択ダイアログ表示
         */
        showSelAppFieldDlg : function() {
            this.selAppFieldCode = "";
            this.selAppFieldDlgActive = true;
        },
        /**
         * フィールド選択ダイアログを閉じる
         */
        closeSelAppFieldDlg : function() {
            this.selAppFieldDlgActive = false;
        },

        /**
         * キャンセルボタン
         */
        cancel : function() {
            // プラグイン一覧画面に戻る
            window.location.href = "./";
        },

        /**
         * 設定を保存ボタンクリック時
         */
        saveOnClick : async function() {

            try {

                // this.spinner = true;
                const _self = this;

                if (await this.validateAsync()) {

                    // 自アプリに追加が必要なフィールドを取得
                    // const nexFiedlsThisApp = await Ctrl.getNotExistsFieldsOfThisApp();

                    // 自アプリに必要なフィールドがあるか確認
                    // const nexFiedlsGrpMng = await Ctrl.getNotExistsFieldsOfGrpMngApp(this.groupMngAppId);

                    // 必要なフィールドがない場合、続行確認のダイアログを表示
                    // if (nexFiedlsThisApp.length > 0 || nexFiedlsGrpMng.length > 0) {

                    //     this.showAddFieldsConfirmDlg(nexFiedlsThisApp, nexFiedlsGrpMng);

                    // } else {
                        await this.saveConfigAsync();
                    // }

                }

            } catch(e) {
                console.error(e);
                this.showAlertDlg('設定の保存に失敗しました', e.message);
            }

        },

        /**
         *
         */
        saveConfigAsync : async function() {

            // 設定保存処理
            await Ctrl.saveConfigAsync(this.fcodeParentTable, this.fcodeChildTable);

            if (Ctrl.autoDeploy) {
                this.showAlertDlg('設定保存完了', 'プラグインの設定が保存されました。');
            } else {
                this.showAlertDlg('設定保存完了', 'プラグインの設定がテスト環境に保存されました。<br><br>設定を運用環境に反映するには、<br>「アプリ設定」画面の「アプリの更新」をクリックしてください。');            }

        },

        /**
         * 入力内容のチェック
         */
        validateAsync : async function() {

            let chkRslt = true;
            // this.groupMngAppError = "";

            // if (this.groupMngAppId) {

            //     try {
            //         // アプリの存在チェック
            //         await Ctrl.getAppNameAsync(this.groupMngAppId);
            //     } catch(e) {
            //         chkRslt = false;
            //         this.groupMngAppError = "値が正しくありません。";
            //     }

            // } else {
            //     chkRslt = false;
            //     this.groupMngAppError = "必須です。";
            // }

            return chkRslt;
        },

        /**
         * カスタマイズビューの追加
         */
        applySelCustomViewDlg : function() {
            if (this.selCustomViewId && !this.targetViews.includes(this.selCustomViewId)) {
                this.targetViews.push(this.selCustomViewId);
            }
            this.closeSelCustomViewDlg();
        },


        /**
         * 対象カスタマイズビューの削除
         */
        delTargetView : function(index) {
            if (index >= 0) {
                this.targetViews.splice(index, 1);
            }
        },

        /**
         * カード表示フィールドの追加
         */
        applySelAppFieldDlg : function() {
            if (this.selAppFieldCode && !this.cardFields.includes(this.selAppFieldCode)) {
                this.cardFields.push(this.selAppFieldCode);
            }
            this.closeSelAppFieldDlg();
        },

        /**
         * カード表示フィールドの削除
         */
        delCardField : function(index) {
            if (index >= 0) {
                this.cardFields.splice(index, 1);
            }
        },

        /**
         * カード表示フィールドを上へ移動
         */
        moveUpCardField : function(index) {
            if (index >= 1) {
                // const groups = targetViewConf.groups;
                this.cardFields.splice(index-1, 2, this.cardFields[index], this.cardFields[index-1]);
            }
        },

        /**
         * カード表示フィールドを下へ移動
         */
        moveDownCardField : function(index) {
            // const groups = targetViewConf.groups;
            if (index < this.cardFields.length - 1) {
                this.cardFields.splice(index, 2, this.cardFields[index + 1], this.cardFields[index]);
            }
        },

        /**
         * プラグインの動作に必要なフィールドをKintoneアプリに追加する
         */
        // addRequireFieldsAsync : async function(nexFiedlsThisApp, nexFiedlsGrpMng) {

        //     // 自アプリに必要なフィールドを追加
        //     await Ctrl.addFieldsOfThisAppAsync(nexFiedlsThisApp);

        //     // グループ管理に必要なフィールドを追加
        //     await Ctrl.addFieldsOfGrpMngAsync(nexFiedlsGrpMng);

        // },

        /**
         * アラートダイアログを表示する
         */
        showAlertDlg : function(title, msg) {
            this.alertTitle = title;
            this.alertMessage = msg;
            this.alertDlgVisible = true;
        },
        /**
         * アラートダイアログを閉じる
         */
        closeAlertDlg : function() {
            this.alertDlgVisible = false;
        },


        /**
         * フィールド追加確認ダイアログを表示
         */
        showAddFieldsConfirmDlg : function(nexFiedlsThisApp, nexFiedlsGrpMng) {

            this.confirmDlgTitle = "フィールドを追加";

            let msg = "";

            if (nexFiedlsThisApp.length > 0 && nexFiedlsGrpMng.length > 0) {
                msg += "このアプリとグループ管理アプリ<br>";
            } else if (nexFiedlsThisApp.length > 0) {
                msg += "自アプリ";
            } else if (nexFiedlsGrpMng.length > 0) {
                msg += "グループ管理アプリ";
            }
            msg += "にプラグインの動作に必要なフィールドが存在していません。<br><br>自動で必要なフィールドを追加します。よろしいですか？";
            this.confirmDlgMessage = msg;

            this.confirmApplyClback = async function() {

                await Ctrl.addFields(nexFiedlsThisApp, this.groupMngAppId, nexFiedlsGrpMng);
                this.closeConfirmDlg();
                // this.showAlertDlg("フィールド追加", "アプリにフィールドを追加しました。");
                this.saveConfigAsync();

            }.bind(this);


            this.confirmDlgVisible = true;

        },

        /**
         * 確認ダイアログで「キャンセル」をクリック
         */
        closeConfirmDlg : function() {
            this.confirmDlgVisible = false;
        },

    },
}
</script>