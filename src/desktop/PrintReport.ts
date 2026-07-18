declare const kintone: any;
declare const getAlertDlgElement: any;
declare const showAlertDialog: any;
declare const moment: any;
declare const formatDecimal: any;
declare const formatCurrency: any;

// import * as styles from './PrintReport.css'

const BTN_ID_PRINT_REPORT = "artm-btn-print-report";

export class PrintReport {

    config = null;

    /**
     * レコード詳細画面（PC） 表示時
     */
    onDetailShow (event : any, config : any) : void {

        try {

            if (document.getElementById(BTN_ID_PRINT_REPORT) !== null ) {
                return;
            }

            var divBtnArea = document.createElement('div');
            divBtnArea.id = 'div-btn-area';
            divBtnArea.classList.add('text-right');

            // 印刷ボタン
            var btnPrintout = document.createElement('button');
            btnPrintout.id = BTN_ID_PRINT_REPORT;
            btnPrintout.innerHTML = '帳票出力';
            btnPrintout.onclick = this.btnPrintOut_OnClick.bind(this);
            divBtnArea.appendChild(btnPrintout);

            var br = document.createElement('br');
            divBtnArea.appendChild(br);

            // アラートダイアログ領域作成
            let divDialog = getAlertDlgElement(document);
            divBtnArea.appendChild(divDialog);
            kintone.app.record.getHeaderMenuSpaceElement().appendChild(divBtnArea);

            // 印刷データ
            let divPrintData = this.makeReport(event.record);
            divPrintData.id = 'print-invoice-data';
            kintone.app.record.getHeaderMenuSpaceElement().appendChild(divPrintData);

        } catch (e : any) {
            console.error(e);
            showAlertDialog('エラー', e.message);
        }
    }

   /**
    * 「印刷」ボタンクリック
    */
    btnPrintOut_OnClick() {

        if (this.isSaffari()) {
            // 前回のプリント結果をクリア
            document.getElementById('print')?.remove();
            document.querySelectorAll('.print-off').forEach(el => el.classList.remove('print-off'));
        }

        //プリントしたいエリアの取得
        let printPage : string = document.getElementById('print-invoice-data')?.innerHTML || "";

        //プリント用の要素「#print」を作成
        document.body.insertAdjacentHTML('beforeend', '<div id="print"></div>');

        const printElement = document.getElementById('print') as HTMLElement;
        printElement.innerHTML = printPage;

        //「#print」以外の要素に非表示用のclass「print-off」を指定
        document.querySelectorAll('body > :not(#print)').forEach(el => el.classList.add('print-off'));
        window.print();

        if (!this.isSaffari()) {
            // プリント結果をクリア
            document.getElementById('print')?.remove();
            document.querySelectorAll('.print-off').forEach(el => el.classList.remove('print-off'));
        }
    }

    /**
     * 帳票作成
     */
    makeReport(record: any) {

        let divSheet = document.createElement('div');
        divSheet.classList.add('sheet');

        let divSheetDiv = document.createElement('div');
        divSheet.appendChild(divSheetDiv);

        let html = '';

        // ヘッダ部分
        moment.locale('ja');
        let created_at = moment(record.作成日時.value);

        html += `
            <p class="page-title text-center">購入明細</p>
            <div class="made-date">` + created_at.format('YYYY年 M月 D日（ddd） HH:mm') + `</div>
        `;

        // 顧客情報
        html += `
            <div id="report-header">
                <!-- 顧客情報 -->
                <ul id="ul-customer-info" class="flex flex-col">
                    <li>
                        <label>電話番号<span style="font-size:2mm;margin-left:0.5em;">(管理番号)</span></label>
                        ` + record.顧客電話番号.value + `
                    </li>
                    <li>
                        <label>住所</label>
                        ` + record.住所.value + `
                    </li>
                    <li>
                        <label>氏名</label>
                        ` + record.顧客名.value + `
                        様
                    </li>
                    <li>
                        <label>ふりがな</label>
                        ` + record.ふりがな.value + `
                    </li>
                </ul>
                <!-- 発行者情報 -->
                <ul id="ul-company-info" class="flex flex-col">
                    <li>株式会社はくすい</li>
                    <li>
                        <label>登録番号</label>
                        T6290001024303
                    </li>
                </ul>
            </div>
            `;


        // 明細情報
        html += `
            <table id="tbl-detail">
                <tr>
                    <th>商品名</th>
                    <th>規格</th>
                    <th>数量</th>
                    <th>税抜金額</th>
                    <!--<th>税込金額</th>-->
                </tr>
        `;

        record.購入明細.value.forEach(function(sub_record : any, index : number){

            let newTaxMark = "";
            if (sub_record.value.購入明細_消費税率.value == 8) {
                newTaxMark = "（※）";
            }

            html += `
                <tr>
                    <td>` + sub_record.value.商品名.value + newTaxMark + `</td>
                    <td>` + sub_record.value.規格.value + `</td>
                    <td class="td-count text-right">` + formatDecimal(sub_record.value.数量.value) + `</td>
                    <td class="td-price text-right">` + formatCurrency(sub_record.value.税抜価格.value) + `</td>
                    <!--<td class="td-price text-right">` + formatCurrency(sub_record.value.税込価格.value) + `</td>-->
                </tr>
            `;


        });

        html += `
            </table>
        `;

        html += '<div>※軽減税率運用商品（税率８％）</div>';

        // 税率別合計額 非表示化 BGN
        // html += `
        //     <table id="sum-reduced-tax-table" class="text-right horizontal-right-block">
        //         <tr>
        //             <td>10%対象税込合計 </td>
        //             <td> ` + formatCurrency(sumBy10per) + `</td>
        //         </tr>
        //         <tr>
        //             <td>8%対象税込合計 </td>
        //             <td> ` + formatCurrency(sumBy08per) + `</td>
        //         </tr>
        //     </table>`;
        // 税率別合計額 非表示化 END

        // 消費税率毎の合計額
        html += `
            <ul id="ul-taxrate-summary">
                <li>
                    <div>&nbsp;</div>
                    <div>税抜金額</div>
                    <div>消費税</div>
                    <div>税込金額</div>
                </li>
                <li>
                    <div>8%対象</div>
                    <div>` + formatCurrency(record.税抜合計_08per.value) + `</div>
                    <div>` + formatCurrency(record.消費税額_08per.value) + `</div>
                    <div>` + formatCurrency(record.税込合計_08per.value) + `</div>
                </li>
                <li>
                    <div>10%対象</div>
                    <div>` + formatCurrency(record.税抜合計_10per.value) + `</div>
                    <div>` + formatCurrency(record.消費税額_10per.value) + `</div>
                    <div>` + formatCurrency(record.税込合計_10per.value) + `</div>
                </li>
            </ul>
        `;

        // 集計
        html += `
            <ul id="ul-summary" class="flex flex-jc-end">
                <li>
                    <label>税込合計</label>
                    <span class="sum-price">` + formatCurrency(record.税込合計.value) + `</span>
                </li>
                <li>
                    <label>金券使用</label>
                    <span class="sum-price">` + formatCurrency(record.金券使用.value) + `</span>
                </li>
                <li>
                    <label>お支払い額</label>
                    <span class="sum-price">` + formatCurrency(record.本日のお会計.value) + `</span>
                </li>
            </ul>
            <div id="div-summary" class="text-right">
                <label>金券交付額</label>
                <span class="sum-price">` + record.本日の金券発行.value + `</span>
            </div>
        `;

        // 備考
        html += `
            <div id="biko">
                <label>備考</label>
                <div><pre>` + record.備考.value + `</pre></div>
            </div>
        `;

        // フッタ
        // html += `
        // `;

        divSheetDiv.innerHTML = html;


        let divPrint = document.createElement('div');
        divPrint.appendChild(divSheet);

        return divPrint;
    }

    /**
     * ヘルプ表示
     */
    aHelpPrintout_OnClick() {
        showAlertDialog('', `<div style="font-size:0.8em;">
        ブラウザによってデフォルトで印字される
        ヘッダー及びフッター（日付、ページタイトル、サイトのURLなど）は、ブラウザの印刷設定で非印字に設定してください。</div>
        <br>
        Internet Explorer：<br>
        <div style="font-size:0.8em;">
        ツール（右上の歯車ボタン）→印刷→ページ設定から、ヘッダとフッタの項目を“-空-”に。</div>
        <br>
        Firefox：<br>
        <div style="font-size:0.8em;">
        ファイル→ページ設定→余白とヘッダ/フッタから、ヘッダとフッタの項目を“–なし–”に。<br>
        ※ツールバーが消えてる場合はAltキーを押すと表示されます。</div><br>
        Google Chrome：<br>
        <div style="font-size:0.8em;">
        ページ上で右クリックか右上の設定（三本棒のボタン）→印刷→詳細設定（左に開くメニューの下の方）を展開し、ヘッダとフッタのチェックボックスを外す。</div>`);
    }

    isSaffari() {
        var userAgent = window.navigator.userAgent.toLowerCase();

        if(userAgent.indexOf('safari') != -1) {
            return true;
        }
        return false;
    }
};
