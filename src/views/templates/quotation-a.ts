export const quotationATemplate = {
  name: "見積書A",
  html: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>見積書</title>
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
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
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
        .total {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <h1 class="header">見積書</h1>
        <table style="width: 100%;">
            <tr>
                <td class="bill-to">
                    <strong>宛名:</strong><br>
                    {{company_name}}<br>
                    {{address}}<br>
                    担当者: {{contact_person}}
                </td>
                <td class="company-details">
                    <strong>発行元:</strong><br>
                    株式会社〇〇<br>
                    〒123-4567 東京都〇〇区〇〇1-2-3<br>
                    TEL: 03-1234-5678
                </td>
            </tr>
        </table>

        <p><strong>発行日:</strong> {{issue_date}}</p>
        <p><strong>有効期限:</strong> {{expiry_date}}</p>
        <p><strong>件名:</strong> {{title}}</p>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>品目</th>
                    <th>数量</th>
                    <th>単価</th>
                    <th>金額</th>
                </tr>
            </thead>
            <tbody>
                <!-- ここに明細が繰り返し表示されます -->
                <tr>
                    <td>{{item_name}}</td>
                    <td>{{quantity}}</td>
                    <td>{{price}}</td>
                    <td>{{amount}}</td>
                </tr>
            </tbody>
        </table>
        <div class="total">
            <p><strong>小計:</strong> {{subtotal}}</p>
            <p><strong>消費税:</strong> {{tax}}</p>
            <p><strong>合計金額:</strong> {{total}}</p>
        </div>
        <div class="notes">
            <strong>備考:</strong><br>
            <p>{{notes}}</p>
        </div>
    </div>
</body>
</html>`,
  params: [
    { name: "company_name", label: "宛名", type: "field-select" },
    { name: "address", label: "住所", type: "field-select" },
    { name: "contact_person", label: "担当者", type: "field-select" },
    { name: "issue_date", label: "発行日", type: "field-select" },
    { name: "expiry_date", label: "有効期限", type: "field-select" },
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
      ],
    },
    { name: "subtotal", label: "小計", type: "field-select" },
    { name: "tax", label: "消費税", type: "field-select" },
    { name: "total", label: "合計金額", type: "field-select" },
    { name: "notes", label: "備考", type: "text-area" },
  ],
};
