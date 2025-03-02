import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPatrol, IPatrolResult, defectStatus, patrolStatus, itemType, IToast, role } from "@/app/type";
import { badgeVariants } from "@/components/badge-custom";
import { LoginSchema } from '@/app/type';
import axios, { AxiosRequestConfig } from "axios";
import { z } from "zod";


const ExcelJS = require("exceljs");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: "Invalid field!" }
  }
  try {
    const csrfResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, { withCredentials: true });
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`,
      values,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true
      })
    return response.data
  } catch (error: any) {
    return { error: error.response?.data?.message || "Login failed" };
  }
}

export async function logout() {
  try {
    const csrfResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, { withCredentials: true });
    const csrfToken = csrfResponse.data.csrfToken;
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true
    })
  } catch (error: any) {
    throw new Error("Logout failed", error);
  }
}

export async function fetchData(
  type: "get" | "delete" | "post" | "put",
  endpoint: string,
  credential: boolean,
  value?: any,
  form?: boolean
) {
  try {
    const csrfResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, { withCredentials: true });
    const csrfToken = csrfResponse.data.csrfToken;
    const config: AxiosRequestConfig = {
      withCredentials: credential,
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": form ? "multipart/form-data" : "application/json",
      },
    };

    let response;
    if (type === "get" || type === "delete") {
      response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
    } else if (type === "post" || type === "put") {
      response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, value, config);
    }

    return response?.data; // Return the response body
  } catch (error: any) {
    console.error("Failed to fetch data:", error);

    // Return more detailed error information
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data,
      };
    }

    // For unexpected errors
    return {
      error: true,
      message: error.message || "Unexpected error occurred",
    };
  }
}

export const exportData = async (patrol: IPatrol, result: IPatrolResult[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Patrol Report");

    const formatDateTime = (dateTime) => {
      const date = new Date(dateTime);
      // ฟอร์แมตวันที่
      const formattedDate = date.toLocaleDateString('en-GB');
      // ฟอร์แมตเวลา
      const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${formattedDate} ${formattedTime}`;
    };

    // Funtion สำหรับการจัดรูปแบบของข้อมูลชื่อโซน เช่น quality_control_zone จัดรูปแบบเป็น Quality Control Zone
    const formatZoneName = (zoneName) => {
      return zoneName
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // เพิ่มข้อมูล Patrol ที่ด้านบนของเอกสาร
    const rows = [
      ["Date:", formatDateTime(patrol.date)],
      ["Start Time:", formatDateTime(patrol.startTime)],
      ["End Time:", formatDateTime(patrol.endTime)],
      ["Status:", patrol.status],
      ["Preset Title:", patrol.preset.title],
      ["Preset Version:", patrol.preset.version],
      ["Preset Description:", patrol.preset.description],
      [] // เพิ่มบรรทัดว่าง
    ];

    // เพิ่มข้อมูลทีละแถว และตั้งค่า alignment
    rows.forEach((data) => {
      const row = worksheet.addRow(data);
      row.font = { size: 12 }
      row.alignment = { horizontal: "left" }; // จัดให้เซลล์แรกชิดซ้าย
    });

    // ขนาดของ Column
    worksheet.columns = [
      { width: 30 },
      { width: 25 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
    ];

    let totalFails = 0;
    let totalComments = 0;
    let totalDefects = 0;
    let totalPass = 0;

    // วนลูปผ่าน patrolChecklist
    for (const patrolChecklist of patrol.patrolChecklists) {
      const inspectorName = patrolChecklist.inspector.profile.name;
      const checklist = patrolChecklist.checklist;

      // เพิ่มชื่อ Checklist
      const titleRow = worksheet.addRow([checklist.title + " By " + inspectorName]);
      // หาตำแหน่งของโรวปัจจุบัน
      const titleRowIdx = worksheet.rowCount;
      // Merge โดยใส่ค่า (ตน.ปัจจุบัน, ตน.เริ่มต้น, ตน.ปัจจุบัน, ตน.สิ้นสุด)
      worksheet.mergeCells(titleRowIdx, 0, titleRowIdx, 3);
      // ตั้งค่าโรวให้ตัวหนา จัดกึ่งกลาง และเพิ่มขอบ
      titleRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
      titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      titleRow.getCell(1).border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
      // ตั้งค่าสีพื้นหลังให้แถวหัว
      titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } }; // พื้นหลังสีแดง

      // ตั้งค่าคอลัมน์พร้อมกับหัวข้อและคีย์
      const headerRow = worksheet.addRow(["Item Name", "Zone Name", "Status"]);

      // จัดกึ่งกลางหัวตาราง ตัวหนา มีกรอบ
      headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { bold: true, size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F1F1' } };  // พื้นหลังสีเทาอ่อน
      });

      // วนลูปผ่านรายการใน Checklist
      for (const item of checklist.items) {
        // วนลูปผ่าน itemZone
        for (const itemZone of item.itemZones) {
          const zoneName = formatZoneName(itemZone.zone.name);
          // หา result ที่ตรงกับ item และ zone นี้
          const resultItem = result.find(
            (r) => r.itemId === item.id && r.zoneId === itemZone.zone.id
          );

          let statusText = "N/A";
          let defectCount = 0;
          if (resultItem) {
            if (resultItem.status === true) {
              statusText = "Passed";
              totalPass++;
            } else if (resultItem.status === false) {
              statusText = "Commented";
              totalFails++; // เพิ่มจำนวน fail
              totalComments++; // เพิ่มจำนวน comment
            }

            if (resultItem.defects && resultItem.defects.length > 0) {
              statusText = "Defected";
              defectCount = resultItem.defects.length;
              totalDefects += defectCount; // เพิ่มจำนวน defect
              totalComments -= defectCount; // ลดจำนวน comment
            }
          }

          // เพิ่มแถวข้อมูลลงใน worksheet
          const dataRow = worksheet.addRow([item.name, zoneName, statusText]);
          dataRow.font = { size: 12 };

          dataRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };

            cell.border = {
              left: { style: 'thin' },
              right: { style: 'thin' }
            };
          });



          dataRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };

            cell.border = {
              left: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }
      }
      const columnCount = headerRow.cellCount;
      const blankRow = worksheet.addRow(Array(columnCount).fill("")); // แถวว่างเพื่อเว้นช่อง
      blankRow.eachCell((cell) => {
        cell.border = { top: { style: 'thin' } };
      });
    }

    // เพิ่มสรุปที่ด้านล่าง
    const sumRow = worksheet.addRow(["Summary"]);
    // หาตำแหน่งของโรวปัจจุบัน
    const sumRowIdx = worksheet.rowCount;
    // Merge โดยใส่ค่า (ตน.ปัจจุบัน, ตน.เริ่มต้น, ตน.ปัจจุบัน, ตน.สิ้นสุด)
    worksheet.mergeCells(sumRowIdx, 0, sumRowIdx, 4);
    // ตั้งค่าโรวให้ตัวหนา จัดกึ่งกลาง และเพิ่มขอบ
    sumRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    sumRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    sumRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    sumRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '008000' } }; // พื้นหลังสีเขียว

    // สร้าง Array เพื่อเก็บข้อมูลจำนวนของแต่ละสถานะในแต่ละโซน
    const zoneStatusCount = [];

    // สร้างตัวแปรสำหรับผลรวมของทุกโซน
    let totalPassed = 0;
    let totalCommented = 0;
    let totalDefected = 0;

    // วนลูปผ่าน Zone Name และ Status เพื่อเก็บข้อมูลใน zoneStatusCount
    for (const patrolChecklist of patrol.patrolChecklists) {
      for (const item of patrolChecklist.checklist.items) {
        for (const itemZone of item.itemZones) {
          const zoneName = formatZoneName(itemZone.zone.name);
          const resultItem = result.find(
            (r) => r.itemId === item.id && r.zoneId === itemZone.zone.id
          );

          let statusText = "N/A"; // กำหนดค่าเริ่มต้น
          if (resultItem) {
            if (resultItem.status === true) {
              statusText = "Passed";
            } else if (resultItem.status === false) {
              statusText = "Commented";
            }

            if (resultItem.defects && resultItem.defects.length > 0) {
              statusText = "Defected";
            }
          }

          // หาโซนใน zoneStatusCount หรือเพิ่มใหม่
          let zoneEntry = zoneStatusCount.find(entry => entry.zoneName === zoneName);
          if (!zoneEntry) {
            zoneEntry = { zoneName, Passed: 0, Commented: 0, Defected: 0, "N/A": 0 };
            zoneStatusCount.push(zoneEntry);
          }

          // เพิ่มจำนวนสถานะในโซนที่กำหนด
          zoneEntry[statusText] += 1;

          // เพิ่มผลรวมสำหรับทุกโซน
          if (statusText === "Passed") totalPassed += 1;
          if (statusText === "Commented") totalCommented += 1;
          if (statusText === "Defected") totalDefected += 1;
        }
      }
    }

    // เพิ่มส่วนหัวของตารางสำหรับสรุปผล
    const zoneSummaryHeaderRow = worksheet.addRow(["Zone Name", "Passed", "Commented", "Defected"]);
    zoneSummaryHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 }; // ทำให้หัวตารางตัวหนา
      cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลาง
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F1F1' } };  // พื้นหลังสีเทาอ่อน
    });

    // เพิ่มข้อมูลสรุปของแต่ละโซนลงในตาราง
    zoneStatusCount.forEach(zoneEntry => {
      const summaryRow = worksheet.addRow([
        zoneEntry.zoneName,
        zoneEntry.Passed,
        zoneEntry.Commented,
        zoneEntry.Defected,
      ]);

      summaryRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลาง
        cell.font = { size: 12 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // เพิ่มแถวผลรวมของทุกโซน
    const totalRow = worksheet.addRow([
      "Total",
      totalPassed,
      totalCommented,
      totalDefected
    ]);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 }; // ทำให้ผลรวมตัวหนา
      cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลาง
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F1F1' } };  // พื้นหลังสีเทาอ่อน
    });

    worksheet.addRow([]);

    // เพิ่มสรุปที่ด้านล่าง
    const resultRow = worksheet.addRow(["Result"]);
    // หาตำแหน่งของโรวปัจจุบัน
    const resultRowIdx = worksheet.rowCount;
    // Merge โดยใส่ค่า (ตน.ปัจจุบัน, ตน.เริ่มต้น, ตน.ปัจจุบัน, ตน.สิ้นสุด)
    worksheet.mergeCells(resultRowIdx, 0, resultRowIdx, 2);
    // ตั้งค่าโรวให้ตัวหนา จัดกึ่งกลาง และเพิ่มขอบ
    resultRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    resultRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    resultRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    resultRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '00008B' } };  // พื้นหลังสีน้ำเงิน

    // เพิ่มแถวสำหรับคำว่า Pass และ Fail
    const passFailHeaderRow = worksheet.addRow(["Pass", "Fail"]);
    passFailHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 }; // ทำให้ตัวหนา
      cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลาง
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F1F1' } };  // พื้นหลังสีเทาอ่อน
    });

    // เพิ่มแถวตัวเลขสำหรับ Pass และ Fail
    const passFailCountRow = worksheet.addRow([
      totalPassed, // จำนวน Pass
      totalCommented + totalDefected, // รวมจำนวน Fail
    ]);

    passFailCountRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" }; // จัดกึ่งกลาง
      cell.font = { size: 12 };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // เขียน workbook เป็น buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // สร้าง blob และดาวน์โหลดไฟล์
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Patrol_Inspection_Report_" + patrol.date.toString().split('T')[0] + ".xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error(
      `Could not export data: ${error instanceof Error ? error.message : "Unknown error"
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

export const sortData = (data: any, sort: { by: string; order: string }) => {
  const sortedData = [...data];
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
  } else if (sort.by === "Status") {
    sortedData.sort((a, b) =>
      sort.order === "Ascending"
        ? String(a.status).localeCompare(String(b.status)) // เรียงจาก "false" -> "true"
        : String(b.status).localeCompare(String(a.status)) // เรียงจาก "true" -> "false"
    );
  } else if (sort.by === "DefectDate") {
    sortedData.sort((a, b) =>
      sort.order === "Ascending"
        ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        : new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } else if (sort.by === "CommentDate") {
    sortedData.sort((a, b) =>
      sort.order === "Ascending"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  return sortedData
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

export const getPatrolStatusVariant = (status: patrolStatus) => {
  let iconName: string
  let variant: keyof typeof badgeVariants
  switch (status) {
    case "completed":
      iconName = "check";
      variant = "green";
      break;
    case "on_going":
      iconName = "cached";
      variant = "purple";
      break;
    case "scheduled":
      iconName = "event_available";
      variant = "yellow";
      break;
    default:
      iconName = "hourglass_top";
      variant = "blue";
      break;
  }
  return { iconName, variant };
};

export const getDefectStatusVariant = (status: defectStatus) => {
  let iconName: string
  let variant: keyof typeof badgeVariants
  switch (status) {
    case "completed":
      iconName = 'check'
      variant = 'green'
      break;
    case "resolved":
      iconName = 'published_with_changes'
      variant = 'blue'
      break;
    case "in_progress":
      iconName = 'cached'
      variant = 'yellow'
      break;
    case "pending_inspection":
      iconName = 'pending_actions'
      variant = 'red'
      break;
    default:
      iconName = 'campaign'
      variant = 'orange'
      break;
  }
  return { iconName, variant };
};

export const getItemTypeVariant = (type: itemType) => {
  let iconName: string
  let variant: keyof typeof badgeVariants
  switch (type) {
    case "safety":
      iconName = 'verified_user'
      variant = 'green'
      break;
    case "environment":
      iconName = 'psychiatry'
      variant = 'blue'
      break;
    default:
      iconName = 'build'
      variant = 'red'
      break;
  }
  return { iconName, variant };
};

export const getUserVariant = (role: role) => {
  let iconName: string
  let variant: keyof typeof badgeVariants
  let variantName: string

  switch (role) {
    case "supervisor":
      iconName = 'engineering'
      variant = 'yellow'
      variantName = 'supervisor'
      break;
    case "inspector":
      iconName = 'person_search'
      variant = 'red'
      variantName = 'inspector'
      break;
    default:
      iconName = 'manage_accounts'
      variant = 'blue'
      variantName = 'admin'
      break;
  }
  return { iconName, variant, variantName };
};

export function formatTime(timestamp: string, locale: string, showTime: boolean = true) {
  let language = locale === "th" ? "th-TH" : "en-GB";

  const date = new Date(timestamp).toLocaleDateString(language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!showTime) return date;

  const time = new Date(timestamp).toLocaleTimeString(language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${date} ${time}`;
}
export function formatPatrolId(id: number): string {
  let newId = id.toString().padStart(4, '0'); // ทำให้เป็นเลข 4 หลัก เติมศูนย์ข้างหน้า
  return `P${newId}`; // ใส่ P ด้านหน้า
}

export function getNotificationToast(key: string): IToast | null {
  switch (key) {
    case "patrol_assigned":
      return {
        variant: "default",
        title: "PatrolAssignTitle",
        description: "PatrolAssignDescription",
      };
    case "report_defect":
      return {
        variant: "default",
        title: "DefectReceiveTitle",
        description: "DefectReceiveDescription",
      };
    case "new_comment":
      return {
        variant: "default",
        title: "CommentReceiveTitle",
        description: "CommentReceiveDescription",
      };
    case "update_supervisor":
      return {
        variant: "default",
        title: "UpdateSupervisorTitle",
        description: "UpdateSupervisorDescription",
      };
    case "start_patrol":
      return {
        variant: "default",
        title: "StartPatrolTitle",
        description: "StartPatrolDescription",
      };
    case "finish_patrol":
      return {
        variant: "default",
        title: "FinishPatrolTitle",
        description: "FinishPatrolDescription",
      };
    case "defect_resolved":
      return {
        variant: "default",
        title: "DefectResolveInfoTitle",
        description: "DefectResolveInfoDescription",
      };
    case "defect_accept":
      return {
        variant: "default",
        title: "DefectAcceptInfoTitle",
        description: "DefectAcceptInfoDescription",
      };
    case "defect_completed":
      return {
        variant: "default",
        title: "DefectCompleteTitle",
        description: "DefectCompleteDescription",
      };
    case "defect_pending_inspection":
      return {
        variant: "default",
        title: "DefectPendingInspectionTitle",
        description: "DefectPendingInspectionDescription",
      };
    default:
      return null;
  }
}

const today = new Date();

export const getMonthRange = (month: string) => {
  if (month === "AllTime") return { startDate: undefined, endDate: undefined };

  const dateParts = month.split(" ");
  const year = parseInt(dateParts[1]);
  const monthIndex = new Date(`${dateParts[0]} 1, ${year}`).getMonth();

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export const monthOptions = ["AllTime", ...Array.from({ length: 12 }, (_, i) => {
  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
  return monthFormatter.format(date);
})];