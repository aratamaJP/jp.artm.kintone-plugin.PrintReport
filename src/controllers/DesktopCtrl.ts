
interface Report {
  name: string;
  html: string;
  enabled: boolean;
}

export class DesktopCtrl {

  public static print(html: string): void {
    const printContent = html;
    if (!printContent) {
      alert("印刷する内容がありません。");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  public static renderTemplate(template: string, record: any): string {
    let renderedHtml = template;

    // {{field_code}} の置換
    renderedHtml = renderedHtml.replace(/\{\{([^}]+)\}\}/g, (match, fieldCode) => {
      if (record[fieldCode] && record[fieldCode].value) {
        return DesktopCtrl.escapeHtml(record[fieldCode].value);
      }
      return match; // 一致するフィールドがない場合はそのまま
    });

    // {{#subtable_code}}...{{/subtable_code}} の置換
    renderedHtml = renderedHtml.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, tableCode, innerHtml) => {
        if (record[tableCode] && record[tableCode].value.length > 0) {
            let tableRows = '';
            record[tableCode].value.forEach((row: any) => {
                let rowHtml = innerHtml;
                for (const fieldCode in row.value) {
                    const regex = new RegExp(`\{\{${fieldCode}\}\}`, 'g');
                    rowHtml = rowHtml.replace(regex, DesktopCtrl.escapeHtml(row.value[fieldCode].value));
                }
                tableRows += rowHtml;
            });
            return tableRows;
        }
        return ''; // サブテーブルが空の場合はなにも表示しない
    });

    return renderedHtml;
  }

  private static escapeHtml(str: any): string {
    if (typeof str !== 'string') {
        return String(str);
    }
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
