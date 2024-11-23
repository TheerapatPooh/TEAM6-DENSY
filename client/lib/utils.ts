import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Patrol, FilterPatrol, PatrolResult } from "@/app/type";
const ExcelJS = require("exceljs");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportData = async (patrol: Patrol, result: PatrolResult[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Patrol Report");

    // เพิ่มข้อมูล Patrol ที่ด้านบนของเอกสาร
    worksheet.addRow(["Patrol ID:", patrol.id]);
    worksheet.addRow(["Date:", patrol.date]);
    worksheet.addRow(["Start Time:", patrol.startTime]);
    worksheet.addRow(["End Time:", patrol.endTime]);
    worksheet.addRow(["Status:", patrol.status]);
    worksheet.addRow(["Preset Title:", patrol.preset.title]);
    worksheet.addRow(["Preset Description:", patrol.preset.description]);
    worksheet.addRow([]); // เพิ่มบรรทัดว่าง

    // ตั้งค่าคอลัมน์พร้อมกับหัวข้อและคีย์
    worksheet.columns = [
      { header: "Item Name", key: "itemName", width: 30 },
      { header: "Zone Name", key: "zoneName", width: 20 },
      { header: "Inspector Name", key: "inspectorName", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Number of Defects", key: "defectCount", width: 20 },
    ];

    let totalFails = 0;
    let totalDefects = 0;

    // วนลูปผ่าน patrolChecklist
    for (const patrolChecklist of patrol.patrolChecklist) {
      const inspectorName = patrolChecklist.inspector.profile.name;
      const checklist = patrolChecklist.checklist;

      // เพิ่มชื่อ Checklist
      worksheet.addRow([]);
      worksheet.addRow(["Checklist:", checklist.title]);

      // วนลูปผ่านรายการใน Checklist
      for (const item of checklist.item) {
        // วนลูปผ่าน itemZone
        for (const itemZone of item.itemZone) {
          const zoneName = itemZone.zone.name;

          // หา result ที่ตรงกับ item และ zone นี้
          const resultItem = result.find(
            (r) => r.itemId === item.id && r.zoneId === itemZone.zone.id
          );

          let statusText = "N/A";
          let defectCount = 0;
          if (resultItem) {
            if (resultItem.status === true) {
              statusText = "Pass";
            } else if (resultItem.status === false) {
              statusText = "Fail";
              totalFails++; // เพิ่มจำนวน fail
            }

            if (resultItem.defects && resultItem.defects.length > 0) {
              defectCount = resultItem.defects.length;
              totalDefects += defectCount; // เพิ่มจำนวน defect
            }
          }

          // เพิ่มแถวข้อมูลลงใน worksheet
          worksheet.addRow({
            itemName: item.name,
            zoneName: zoneName,
            inspectorName: inspectorName,
            status: statusText,
            defectCount: defectCount,
          });
        }
      }
    }

    // เพิ่มสรุปที่ด้านล่าง
    worksheet.addRow([]);
    worksheet.addRow(["Summary"]);
    worksheet.addRow(["Total Fails", totalFails]);
    worksheet.addRow(["Total Defects", totalDefects]);

    // เขียน workbook เป็น buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // สร้าง blob และดาวน์โหลดไฟล์
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "patrol_report.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error(
      `Could not export data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};


export const getInitials = (name: string) => {
  if (!name) return "";
  const nameParts = name.split(" ");

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  } else {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  }
};

export const sortData = (patrolData: any, sort: { by: string; order: string }) => {
  const sortedData = [...patrolData];
  if (sort.by === "Doc No.") {
    sortedData.sort((a, b) =>
      sort.order === "Ascending"
        ? a.id - b.id  // เรียงจากน้อยไปมาก 
        : b.id - a.id  // เรียงจากมากไปน้อย 
    );
  } else if (sort.by === "Date") {
    sortedData.sort((a, b) =>
      sort.order === "Ascending"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  return sortedData
}

export function filterPatrol(filter: FilterPatrol | null, patrols: Patrol[]) {
  if (filter?.presetTitle === "All" && JSON.stringify(filter?.patrolStatus) === JSON.stringify(["pending", "on_going", "scheduled"]) && filter?.dateRange.start === null && filter?.dateRange.end === null) {
    return patrols
  }
  else if (filter?.patrolStatus.length === 0) {
    return []
  }
  else {
    const newFilteredPatrolData = patrols.filter((patrol) => {
      // Convert patrol.date from string to ISO string
      const patrolDateISOString = new Date(patrol.date).toISOString();

      // Convert filter dateRange.start and dateRange.end to ISO strings if they exist
      const filterStartISOString = filter?.dateRange.start ? new Date(filter.dateRange.start).toISOString() : null;
      const filterEndISOString = filter?.dateRange.end ? new Date(filter.dateRange.end).toISOString() : null;

      // Check if the presetTitle matches
      let matchesPreset: boolean;
      if (filter?.presetTitle === 'All') {
        matchesPreset = true;
      } else {
        matchesPreset = !filter?.presetTitle || patrol.preset?.title === filter?.presetTitle;
      }

      // Check if the status matches
      const matchesStatus = filter?.patrolStatus.length === 0 || filter?.patrolStatus.includes(patrol.status);

      // Check if the date is within the selected range using ISO string comparison
      const matchesDateRange =
        (!filterStartISOString || patrolDateISOString >= filterStartISOString) &&  // Compare ISO strings
        (!filterEndISOString || patrolDateISOString <= filterEndISOString);        // Compare ISO strings

      // Return true if all conditions match
      return matchesPreset && matchesStatus && matchesDateRange;
    });
    return newFilteredPatrolData
  }
}


// Function to calculate time ago
export function timeAgo(timestamp: string, t: any): string {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const key in intervals) {
    const interval = intervals[key];
    const result = Math.floor(seconds / interval);
    if (result >= 1) {
      return t(`${key}Ago`, { count: result });
    }
  }
  return t('justNow');
}
