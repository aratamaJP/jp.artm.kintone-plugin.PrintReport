
interface Report {
  name: string;
  html: string;
  enabled: boolean;
}

export class DesktopCtrl {

  private report: Report;
  private printButtonId: string;

  constructor(report: Report, index: number) {
    this.report = report;
    this.printButtonId = `print-btn-${index}`;
  }

  public onDetailShow(event: any): void {
    const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (!headerSpace || document.getElementById(this.printButtonId)) {
      return;
    }

    // 印刷ボタン
    const printButton = document.createElement("button");
    printButton.id = this.printButtonId;
    printButton.innerText = this.report.name;
    printButton.classList.add("kintoneplugin-button-normal");
    printButton.onclick = () => {
      const renderedHtml = DesktopCtrl.renderTemplate(this.report.html, event.record);
      DesktopCtrl.print(renderedHtml);
    }

    headerSpace.appendChild(printButton);
  }

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
        return this.escapeHtml(record[fieldCode].value);
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
                    rowHtml = rowHtml.replace(regex, this.escapeHtml(row.value[fieldCode].value));
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
