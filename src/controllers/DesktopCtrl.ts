import { TEMPLATES } from "@/views/templates";

export class DesktopCtrl {
  public static print(
    report: any,
    record: any,
  ): void {
    let printData = this.createPrintData(report, record);

    const templateDefinition = TEMPLATES[report.template as keyof typeof TEMPLATES];
    if (templateDefinition && 'calculations' in templateDefinition && templateDefinition.calculations) {
        const calculatedData = this.processCalculations(templateDefinition.calculations, printData);
        printData = { ...printData, ...calculatedData };
    }

    let printContent = this.renderTemplate(report.html, printData);


    if (!printContent) {
      alert("印刷する内容がありません。");
      return;
    }

    const printStyle = `
<style type="text/css">
  @media print {
    @page {
      /* 用紙の基本余白を設定 */
      margin: 15mm;

      @top-center {
        content : "";
      }

      /* フッターの中央に「ページ 1 / 3」形式で印字 */
      @bottom-center {
        content: "ページ " counter(page) " / " counter(pages);
        font-size: 9pt;
        color: #333;
      }
    }
    .invoice-box {
      border: none !important;
      box-shadow: none !important;
    }
  }
</style>
`;

    if (printContent.includes("</head>")) {
      printContent = printContent.replace("</head>", `${printStyle}</head>`);
    } else {
      printContent += printStyle;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      //
      // If you want to close the print window automatically after printing, uncomment the following line.
      //
      // printWindow.onafterprint = () => printWindow.close();
      //
      printWindow.print();
    }
  }

  private static processCalculations(calculations: any, printData: any): { [key: string]: any } {
    const sourceTableName = calculations.sourceTable;
    const sourceTableData = printData[sourceTableName];

    if (!sourceTableData || !Array.isArray(sourceTableData)) {
      return {};
    }

    const groupBySourceField = calculations.groupBy;

    const groupedData: { [key: string]: any[] } = {};
    for (const row of sourceTableData) {
      const key = row[groupBySourceField];
      if (key === undefined || key === null) continue;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(row);
    }

    const calculatedRows: any[] = [];
    for (const key in groupedData) {
      const group = groupedData[key];
      const newRow: { [key: string]: any } = {};

      // Pass 1: Handle key and aggregations
      for (const fieldRule of calculations.fields) {
        const targetField = fieldRule.targetField;
        if (fieldRule.source === 'groupKey') {
          newRow[targetField] = key;
        } else if (fieldRule.aggregate === 'sum') {
          const sourceField = fieldRule.sourceField;
          if (!sourceField) continue;

          const sum = group.reduce((acc, groupRow) => {
            const value = parseFloat(groupRow[sourceField] || '0');
            return acc + (isNaN(value) ? 0 : value);
          }, 0);
          newRow[targetField] = sum;
        }
      }

      // Pass 2: Handle formulas
      for (const fieldRule of calculations.fields) {
        if (fieldRule.formula) {
          const targetField = fieldRule.targetField;
          const formula = fieldRule.formula;
          const context = newRow;
          const contextKeys = Object.keys(context);
          const contextValues = contextKeys.map(k => context[k]);

          try {
            const formulaFunc = new Function(...contextKeys, `return ${formula};`);
            const result = formulaFunc(...contextValues);
            newRow[targetField] = result;
          } catch (e) {
            console.error(`Error evaluating formula for ${targetField}:`, e);
            newRow[targetField] = 'ERROR';
          }
        }
      }
      calculatedRows.push(newRow);
    }

    const targetTableName = calculations.targetTable;
    return {
      [targetTableName]: calculatedRows
    };
  }


  private static createPrintData(report: any, record: any): { [key: string]: any } {
    const printData: { [key:string]: any } = {};
    const params = JSON.parse(report.template_params);

    for (const key in params) {
      const param_setting = params[key];
      if(typeof param_setting == 'string') {
        //
        // 通常フィールド
        //
        const fieldCode = param_setting;
        printData[key] = record[fieldCode]?.value ?? '';
      } else if (typeof param_setting === 'object' && param_setting !== null && param_setting.tableCode) {
        //
        // テーブル行
        //
        const tableCode = param_setting.tableCode;
        const mappings = param_setting.mappings;
        if (record[tableCode] && record[tableCode].value) {
          const tableData = record[tableCode].value.map((row: any) => {
            const rowData: { [key: string]: any } = {};
            for (const mapKey in mappings) {
              const fieldCode = mappings[mapKey];
              rowData[mapKey] = row.value[fieldCode]?.value ?? '';
            }
            return rowData;
          });
          printData[key] = tableData;
        }
      }
    }
    return printData;
  }

  public static renderTemplate(
    template: string,
    data: any,
  ): string {
    let renderedHtml = template;

    const tableRegex = /<tbody>([\s\S]*?)<\/tbody>/gi;
    const tableMatches = [...renderedHtml.matchAll(tableRegex)];

    for (const tableMatch of tableMatches) {
      const originalTbody = tableMatch[0];
      const tbodyContent = tableMatch[1];

      const rowTemplateRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/i;
      const rowMatch = tbodyContent.match(rowTemplateRegex);

      if (!rowMatch) continue;

      const rowTemplate = rowMatch[0];
      const placeholdersInRow = [...rowTemplate.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)].map(m => m[1]);

      if (placeholdersInRow.length === 0) continue;

      // Find which table data corresponds to this row
      let tableDataKey: string | null = null;
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          const firstRow = data[key][0];
          if (typeof firstRow === 'object' && placeholdersInRow.every(p => Object.prototype.hasOwnProperty.call(firstRow, p))) {
            tableDataKey = key;
            break;
          }
        }
      }

      if (!tableDataKey) continue;

      const tableData = data[tableDataKey];
      let generatedRows = "";

      tableData.forEach((row: any) => {
        let currentRowHtml = rowTemplate;
        for (const placeholder in row) {
          const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g");
          currentRowHtml = currentRowHtml.replace(
            regex,
            this.escapeHtml(row[placeholder] ?? ""),
          );
        }
        generatedRows += currentRowHtml;
      });

      renderedHtml = renderedHtml.replace(
        originalTbody,
        `<tbody>${generatedRows}</tbody>`,
      );
    }

    // Handle regular field parameters
    for (const placeholder in data) {
      if (!Array.isArray(data[placeholder])) {
        const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g");
        renderedHtml = renderedHtml.replace(
          regex,
          this.escapeHtml(data[placeholder] ?? ""),
        );
      }
    }

    // Replace any unmapped placeholders with an empty string
    renderedHtml = renderedHtml.replace(/\{\{[\s\S]*?\}\}/g, "");

    return renderedHtml;
  }


  private static escapeHtml(str: any): string {
    if (str === null || str === undefined) {
      return "";
    }
    const strValue = String(str);
    return strValue
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
