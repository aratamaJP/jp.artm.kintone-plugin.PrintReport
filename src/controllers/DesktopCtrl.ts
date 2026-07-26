export class DesktopCtrl {
  public static print(html: string): void {
    let printContent = html;
    if (!printContent) {
      alert("印刷する内容がありません。");
      return;
    }

    const printStyle = `
<style type="text/css">
  @media print {
    @page {
      margin: 0;
    }
    body {
      margin: 1.6cm !important;
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
      printWindow.print();
      printWindow.close();
    }
  }

  public static renderTemplate(
    template: string,
    record: any,
    params: any,
  ): string {
    let renderedHtml = template;

    // Process all parameters from the config
    for (const placeholder in params) {
      if (!Object.prototype.hasOwnProperty.call(params, placeholder)) {
        continue;
      }

      const mappingInfo = params[placeholder];

      // Handle table parameters
      if (
        typeof mappingInfo === "object" &&
        mappingInfo.tableCode &&
        mappingInfo.mappings
      ) {
        const tableCode = mappingInfo.tableCode;
        const tableMappings = mappingInfo.mappings;
        const tableData = record[tableCode]?.value;

        if (!tableData || !Array.isArray(tableData)) {
          continue;
        }
        const tableRegex = /<tbody>[\s\S]*?<\/tbody>/i;
        const tableMatch = renderedHtml.match(tableRegex);

        if (!tableMatch) {
          continue;
        }

        const originalTbody = tableMatch[0];
        const rowTemplateRegex = /<tr.*?>([\s\S]*?)<\/tr>/i;
        const rowMatch = originalTbody.match(rowTemplateRegex);

        if (!rowMatch) {
          continue;
        }

        const rowTemplate = rowMatch[0];
        let generatedRows = "";

        tableData.forEach((row) => {
          let currentRowHtml = rowTemplate;
          for (const subPlaceholder in tableMappings) {
            if (
              !Object.prototype.hasOwnProperty.call(
                tableMappings,
                subPlaceholder,
              )
            ) {
              continue;
            }

            const subFieldCode = tableMappings[subPlaceholder];
            const cellValue = row.value[subFieldCode]?.value;

            const regex = new RegExp(`\\{\\{${subPlaceholder}\\}\\}`, "g");
            currentRowHtml = currentRowHtml.replace(
              regex,
              DesktopCtrl.escapeHtml(cellValue ?? ""),
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
      else if (typeof mappingInfo === "string") {
        const fieldCode = mappingInfo;
        const fieldValue = record[fieldCode]?.value;
        const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g");
        renderedHtml = renderedHtml.replace(
          regex,
          DesktopCtrl.escapeHtml(fieldValue ?? ""),
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
