import * as fs from 'fs';
import * as path from 'path';

interface LintResult {
    filePath: string;
    warningCount: number;
}

// ฟังก์ชันสรุปผลลัพธ์จากข้อมูลที่อ่านจากไฟล์ JSON
function summarizeLintResults(results: LintResult[]) {
    const totalFiles = results.length;
    const totalWarnings = results.reduce((sum, file) => sum + (file.warningCount > 0 ? 1 : 0), 0);

    console.log(`จำนวนไฟล์ที่ตรวจทั้งหมด: ${totalFiles}`);
    console.log(`จำนวนไฟล์ที่พบข้อผิดพลาด: ${totalWarnings} ไฟล์`);
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
