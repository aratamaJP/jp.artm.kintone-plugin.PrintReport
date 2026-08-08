export const invoiceATemplate = {
  name: "請求書A (インボイス対応)",
  html: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>請求書</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif;
            font-size: 14px;
            line-height: 1.6;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .company-details {
            text-align: right;
        }
        .bill-to {
            margin-bottom: 20px;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .invoice-table th {
            background-color: #f2f2f2;
        }
        .total-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .total-table {
            border-collapse: collapse;
            width: 50%;
        }
        .total-table th, .total-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
        }
        .total-table th {
            background-color: #f2f2f2;
        }
        .total-amount-row th {
            text-align: right;
        }
        .total-amount-row td {
            font-weight: bold;
        }
        .notes {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <h1 class="header">請求書</h1>
        <table style="width: 100%;">
            <tr>
                <td class="bill-to">
                    <strong>請求先:</strong><br>
                    {{to_company_name}}<br>
                    {{to_address}}<br>
                    担当者: {{to_contact_person}}
                </td>
                <td class="company-details">
                    <strong>発行元:</strong><br>
                    {{ from_company_name }}<br>
                    登録番号: {{ from_registration_number }}<br>
                    {{ from_postcode }}<br>
                    {{ from_address }}<br>
                    {{ from_tel }}<br>
                </td>
            </tr>
        </table>

        <p><strong>請求日:</strong> {{issue_date}}</p>
        <p><strong>支払期限:</strong> {{due_date}}</p>
        <p><strong>件名:</strong> {{title}}</p>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>品目</th>
                    <th>数量</th>
                    <th>単価</th>
                    <th>金額</th>
                    <th>税率</th>
                </tr>
            </thead>
            <tbody>
                <!-- ここに明細が繰り返し表示されます -->
                <tr>
                    <td>{{item_name}}</td>
                    <td>{{quantity}}</td>
                    <td>{{price}}</td>
                    <td>{{amount}}</td>
                    <td>{{tax_rate}}</td>
                </tr>
            </tbody>
        </table>
        <div class="total-section">
            <table class="total-table">
                <thead>
                    <tr>
                        <th>税率</th>
                        <th>対象合計</th>
                        <th>消費税額</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- ここに税率毎の合計が繰り返し表示されます -->
                    <tr>
                        <td>{{tax_summary_rate}}</td>
                        <td>{{tax_summary_subtotal}}</td>
                        <td>{{tax_summary_tax}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="total-amount-row">
                        <th colspan="2">合計金額</th>
                        <td>{{total}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="notes">
            <strong>備考:</strong><br>
            <p>{{notes}}</p>
        </div>
    </div>
</body>
</html>`,
  params: [
    { name: "to_company_name", label: "請求先会社名", type: "field-select" },
    { name: "to_address", label: "請求先住所", type: "field-select" },
    { name: "to_contact_person", label: "請求先担当者", type: "field-select" },
    { name: "from_company_name", label: "発行元会社名", type: "field-select" },
    { name: "from_registration_number", label: "登録番号", type: "field-select" },
    { name: "from_postcode", label: "発行元郵便番号", type: "field-select" },
    { name: "from_address", label: "発行元住所", type: "field-select" },
    { name: "from_tel", label: "発行元電話番号", type: "field-select" },
    { name: "issue_date", label: "請求日", type: "field-select" },
    { name: "due_date", label: "支払期限", type: "field-select" },
    { name: "title", label: "件名", type: "field-select" },
    {
      name: "details_table",
      label: "明細テーブル",
      type: "table-select",
      params: [
        { name: "item_name", label: "品目", type: "field-select" },
        { name: "quantity", label: "数量", type: "field-select" },
        { name: "price", label: "単価", type: "field-select" },
        { name: "amount", label: "金額", type: "field-select" },
        { name: "tax_rate", label: "税率", type: "field-select" },
      ],
    },
    {
      name: "tax_summary_table",
      label: "税率毎の合計テーブル",
      type: "table-select",
      params: [
        { name: "tax_summary_rate", label: "税率", type: "field-select" },
        { name: "tax_summary_subtotal", label: "対象合計", type: "field-select" },
        { name: "tax_summary_tax", label: "消費税額", type: "field-select" },
      ],
    },
    { name: "total", label: "合計金額", type: "field-select" },
    { name: "notes", label: "備考", type: "field-select" },
  ],
};
