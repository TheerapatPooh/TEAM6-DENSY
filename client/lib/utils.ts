import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPatrol, IPatrolResult, defectStatus, patrolStatus, itemType, IToast } from "@/app/type";
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, values, { withCredentials: true })
    return response.data
  } catch (error: any) {
    return { error: error.response?.data?.message || "Login failed" };
  }
}


export async function logout() {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
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
    const config: AxiosRequestConfig = {
      withCredentials: credential,
      headers:
        form ? {
          "Content-Type": "multipart/form-data",
        }
          : {
            'Content-Type': 'application/json',
          }
    };

    let response;
    if (type === "get" || type === "delete") {
      response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);
    } else if (type === "post" || type === "put") {
      response = await axios[type](`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, value, config);
    }

    return response?.data; // response.data will contain the response body
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null; // Returning null on error
  }
}


export const exportData = async (patrol: IPatrol, result: IPatrolResult[]) => {
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
    for (const patrolChecklist of patrol.patrolChecklists) {
      const inspectorName = patrolChecklist.inspector.profile.name;
      const checklist = patrolChecklist.checklist;

      // เพิ่มชื่อ Checklist
      worksheet.addRow([]);
      worksheet.addRow(["Checklist:", checklist.title]);

      // วนลูปผ่านรายการใน Checklist
      for (const item of checklist.items) {
        // วนลูปผ่าน itemZone
        for (const itemZone of item.itemZones) {
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

export function formatTime(timestamp: string) {
  const date = new Date(timestamp).toLocaleDateString(
    "th-TH",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const time = new Date(timestamp).toLocaleTimeString(
    "th-TH",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );
  return date + " " + time
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
    default:
      return null;
  }
}
