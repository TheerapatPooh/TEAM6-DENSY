import * as fs from 'fs';
import * as path from 'path';

interface LintResult {
    filePath: string;
    warningCount: number;
    errorCount: number;
    messages: any[];
}

// ฟังก์ชันสรุปผลลัพธ์จากข้อมูลที่อ่านจากไฟล์ JSON
function summarizeLintResults(results: LintResult[]) {
    const totalFiles = results.length;
    const filesWithWarnings = results.filter(file => file.warningCount > 0 || file.errorCount > 0);
    const totalWarnings = results.reduce((sum, file) => sum + file.warningCount, 0);
    const totalErrors = results.reduce((sum, file) => sum + file.errorCount, 0);

    console.log(`\n=============================================`);
    console.log(` สรุปผลการตรวจสอบ ESLint`);
    console.log(`=============================================\n`);
    console.log(` จำนวนไฟล์ที่ตรวจทั้งหมด: ${totalFiles} ไฟล์`);
    console.log(` จำนวนไฟล์ที่พบข้อผิดพลาดหรือคำเตือน: ${filesWithWarnings.length} ไฟล์`);
    console.log(` จำนวนข้อผิดพลาดทั้งหมด: ${totalErrors}`);
    console.log(` จำนวนคำเตือนทั้งหมด: ${totalWarnings}\n`);
    console.log(`---------------------------------------------`);

    if (filesWithWarnings.length > 0) {
        console.log(`\nรายละเอียดไฟล์ที่มีปัญหา:\n`);
        filesWithWarnings.forEach(file => {
            console.log(`---------------------------------------------`);
            console.log(` ไฟล์: ${file.filePath}`);
            console.log(` ข้อผิดพลาด: ${file.errorCount}`);
            console.log(` คำเตือน: ${file.warningCount}`);
            console.log(` รายละเอียดข้อผิดพลาด/คำเตือน:`);
            console.log(`---------------------------------------------`);
            file.messages.forEach((msg, index) => {
                console.log(`   ${index + 1}. [${msg.ruleId || 'unknown'}] ${msg.message}`);
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
    const files = fs.readdirSync(directory)
        .filter(file => file.startsWith('lintReport_') && file.endsWith('.json'))
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(directory, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // เรียงตามเวลาล่าสุด

    return files.length ? path.join(directory, files[0].name) : null;
}

// อ่านผลลัพธ์จากไฟล์ JSON ล่าสุด
const latestFile = getLatestLintReportFile('lintReports');
if (latestFile) {
    fs.readFile(latestFile, 'utf8', (err, data) => {
        if (err) {
            console.error("ไม่สามารถอ่านไฟล์ผลลัพธ์ของ ESLint ได้:", err);
            return;
        }
        const lintResults: LintResult[] = JSON.parse(data);
        summarizeLintResults(lintResults);
    });
} else {
    console.log("ไม่พบไฟล์ lintReport ในโฟลเดอร์ lintReports");
}
