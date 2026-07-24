export const invoiceATemplate = {
  name: "請求書A",
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
        <h1 class="header">請求書</h1>
        <table style="width: 100%;">
            <tr>
                <td class="bill-to">
                    <strong>請求先:</strong><br>
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
    { name: "company_name", label: "請求先会社名", type: "text" },
    { name: "address", label: "請求先住所", type: "text" },
    { name: "contact_person", label: "請求先担当者", type: "text" },
    { name: "issue_date", label: "請求日", type: "text" },
    { name: "due_date", label: "支払期限", type: "text" },
    { name: "title", label: "件名", type: "text" },
    { name: "item_name", label: "品目", type: "text" },
    { name: "quantity", label: "数量", type: "text" },
    { name: "price", label: "単価", type: "text" },
    { name: "amount", label: "金額", type: "text" },
    { name: "subtotal", label: "小計", type: "text" },
    { name: "tax", label: "消費税", type: "text" },
    { name: "total", label: "合計金額", type: "text" },
    { name: "notes", label: "備考", type: "text-area" },
  ],
};
