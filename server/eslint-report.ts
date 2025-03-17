/**
 * คำอธิบาย:
 *   ไฟล์นี้ใช้สำหรับอ่านผลการตรวจสอบ ESLint จากไฟล์ JSON และสรุปผลการตรวจสอบ พร้อมทั้งสร้างรายงานในรูปแบบไฟล์ Excel
 *   โดยฟังก์ชันหลักจะทำการสรุปผลลัพธ์ของไฟล์ที่มีข้อผิดพลาดหรือคำเตือน และนำผลลัพธ์เหล่านั้นมาแสดงในไฟล์ Excel
 *
 * Input:
 *   - ผลลัพธ์จากการตรวจสอบ ESLint ที่ได้จากไฟล์ JSON
 *   - ข้อมูลจากไฟล์ lintReports ที่เก็บไฟล์ผลลัพธ์ ESLint
 * Output:
 *   - ไฟล์ Excel ที่สรุปผลการตรวจสอบ ESLint โดยจัดรูปแบบตามที่กำหนด
**/

import * as fs from "fs";
import * as path from "path";
import ExcelJS from "exceljs";

interface ILintResult {
  filePath: string;
  warningCount: number;
  errorCount: number;
  messages: {
    ruleId: string | null;
    message: string;
    severity: number;
  }[];
}

// ฟังก์ชันสรุปผลลัพธ์จากข้อมูลที่อ่านจากไฟล์ JSON
function summarizeILintResults(results: ILintResult[]) {
  const totalFiles = results.length;
  const filesWithWarnings = results.filter(
    (file) => file.warningCount > 0 || file.errorCount > 0
  );
  const totalWarnings = results.reduce(
    (sum, file) => sum + file.warningCount,
    0
  );
  const totalErrors = results.reduce((sum, file) => sum + file.errorCount, 0);

  console.log(`\n=============================================`);
  console.log(` สรุปผลการตรวจสอบ ESLint`);
  console.log(`=============================================\n`);
  console.log(` จำนวนไฟล์ที่ตรวจทั้งหมด: ${totalFiles} ไฟล์`);
  console.log(
    ` จำนวนไฟล์ที่พบข้อผิดพลาดหรือคำเตือน: ${filesWithWarnings.length} ไฟล์`
  );
  console.log(` จำนวนข้อผิดพลาดทั้งหมด: ${totalErrors}`);
  console.log(` จำนวนคำเตือนทั้งหมด: ${totalWarnings}\n`);
  console.log(`---------------------------------------------`);
  if (filesWithWarnings.length > 0) {
    console.log(`\nรายละเอียดไฟล์ที่มีปัญหา:\n`);
    filesWithWarnings.forEach((file) => {
      console.log(`---------------------------------------------`);
      console.log(` ไฟล์: ${file.filePath}`);
      console.log(` ข้อผิดพลาด: ${file.errorCount}`);
      console.log(` คำเตือน: ${file.warningCount}`);
      console.log(` รายละเอียดข้อผิดพลาด/คำเตือน:`);
      console.log(`---------------------------------------------`);
      file.messages.forEach((msg, index) => {
        console.log(
          `   ${index + 1}. [${msg.ruleId || "unknown"}] ${msg.message}`
        );
        console.log(`      ระดับความรุนแรง: ${msg.severity}`);
      });
      console.log(`\n`);
    });
  } else {
    console.log(`ไม่มีไฟล์ที่มีข้อผิดพลาดหรือคำเตือน\n`);
  }
  console.log(`=============================================\n`);
}

// ฟังก์ชันสำหรับหาไฟล์ล่าสุดในโฟลเดอร์ lintReports
function getLatestLintReportFile(directory: string) {
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.startsWith("lintReport_") && file.endsWith(".json"))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(directory, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  return files.length ? path.join(directory, files[0].name) : null;
}

// ฟังก์ชันสำหรับสร้าง Excel
async function createExcelFromILintResults(
  results: ILintResult[],
  outputPath: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lint Results");

  // 1) สร้างคอลัมน์ (Header) ไว้ที่ row 2
  worksheet.columns = [
    { header: "ไฟล์", key: "file", width: 60 },
    { header: "ข้อผิดพลาด", key: "errors", width: 10 },
    { header: "คำเตือน", key: "warnings", width: 10 },
    { header: "ข้อความ", key: "message", width: 70 },
    { header: "กฎที่เกี่ยวข้อง", key: "rule", width: 20 },
    { header: "ระดับความรุนแรง", key: "severity", width: 20 },
  ];

  // 2) เพิ่มแถว 'วันที่' ไว้ที่ row 1
  const now = new Date();
  const dateTimeString = now.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "medium",
  });

  worksheet.insertRow(1, [`วันที่และเวลาที่ตรวจ: ${dateTimeString}`]);
  worksheet.mergeCells(1, 1, 1, 6);
  const dateRow = worksheet.getRow(1);
  dateRow.height = 20;
  dateRow.eachCell((cell) => {
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true, size: 14 };
    // **ย้ายการตั้งค่าสีฟ้าออกไป** หรือไม่ตั้งค่าสีเลย
    // cell.fill = ... => ลบ/คอมเมนต์ออก
  });

  // ข้อมูลสำหรับ Worksheet (เริ่ม row 3 หลัง Header Row = 2)
  const rowsData: {
    file: string;
    errors: number;
    warnings: number;
    message: string;
    rule: string;
    severity: number;
  }[] = [];

  for (const result of results) {
    const relativePath = result.filePath.includes("server")
      ? result.filePath.split("server").pop()
      : result.filePath;

    for (const msg of result.messages) {
      rowsData.push({
        file: `server${relativePath}`,
        errors: result.errorCount,
        warnings: result.warningCount,
        message: msg.message,
        rule: msg.ruleId || "unknown",
        severity: msg.severity,
      });
    }
  }

  rowsData.forEach((rowData) => {
    worksheet.addRow(rowData);
  });

  // **ตกแต่ง Header (Row 2)** ให้เป็นสีฟ้า
  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE5FF" }, // สีฟ้าอ่อน
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    cell.font = {
      bold: true,
    };
  });

  // ตกแต่ง Data Rows (เริ่มที่ row 3)
  for (let index = 3; index <= worksheet.rowCount; index++) {
    const row = worksheet.getRow(index);
    const isEvenRow = index % 2 === 0;
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEvenRow ? "FFFFFFFF" : "FFF2F2F2" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // สรุปผลรวม
  const totalFiles = results.length;
  const filesWithIssues = results.filter(
    (file) => file.warningCount > 0 || file.errorCount > 0
  ).length;
  const filesWithoutIssues = totalFiles - filesWithIssues;
  const totalWarnings = results.reduce(
    (sum, file) => sum + file.warningCount,
    0
  );
  const totalErrors = results.reduce((sum, file) => sum + file.errorCount, 0);

  const summaryRow = worksheet.addRow({
    file: "สรุปผล",
    errors: totalErrors,
    warnings: totalWarnings,
    message: `จำนวนไฟล์ทั้งหมด: ${totalFiles}, ไฟล์ที่ไม่มีปัญหา: ${filesWithoutIssues}, ไฟล์ที่มีปัญหา: ${filesWithIssues}`,
    rule: "",
    severity: "",
  });

  summaryRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFCC" }, // สีเขียวอ่อน
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  await workbook.xlsx.writeFile(outputPath);
  console.log(`สร้างไฟล์ Excel เรียบร้อย: ${outputPath}`);
}

// อ่านผลลัพธ์จากไฟล์ JSON ล่าสุดและสร้าง Excel
const latestFile = getLatestLintReportFile("lintReports");
if (latestFile) {
  fs.readFile(latestFile, "utf8", (err, data) => {
    if (err) {
      console.error("ไม่สามารถอ่านไฟล์ผลลัพธ์ของ ESLint ได้:", err);
      return;
    }
    const lintResults: ILintResult[] = JSON.parse(data);

    // สรุปผลใน console
    summarizeILintResults(lintResults);

    // สร้างไฟล์ Excel
    const outputPath = path.join(
      "lintReports",
      path.basename(latestFile, path.extname(latestFile)) + ".xlsx"
    );
    createExcelFromILintResults(lintResults, outputPath);
  });
} else {
  console.log("ไม่พบไฟล์ lintReport ในโฟลเดอร์ lintReports");
}
