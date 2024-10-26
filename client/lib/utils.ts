import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Patrol, FilterPatrol } from "@/app/type";
const ExcelJS = require("exceljs");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportData = async (data: any) => {
  const dataArray = Array.isArray(data) ? data : [data];

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PatrolReport");
    let passChecklist = 0;
    let failChecklist = 0;

    worksheet.columns = [
      { key: "A", width: 30 },
      { key: "B", width: 40 },
      { key: "C", width: 40 },
      { key: "D", width: 20 },
      { key: "E", width: 20 },
      { key: "F", width: 20 },

    ];

    dataArray.forEach((entry) => {
      const {
        id,
        date,
        startTime,
        endTime,
        status,
        preset,
        checklist,
        result,
      } = entry;
      worksheet.addRow({ A: "Patrol Id:" + id });
      worksheet.addRow({ A: "Preset:" + preset.title });
      worksheet.addRow({ A: "Description:" + preset.description });
      worksheet.addRow({ A: "Schedule Date:" + date });
      worksheet.addRow({ A: "StartTime:" + startTime });
      worksheet.addRow({ A: "EndTime:" + endTime });

      checklist.forEach(
        (checklist: {
          title: any; item: any[]; inspector: { name: string }
        }) => {
          let isFirstItem = true; // Initialize a flag to track the first item
          checklist.item.forEach((item) => {
            if (isFirstItem) {
              worksheet.addRow({
                A: "Checklist:" + checklist.title
              });
              isFirstItem = false;
            }

            item.zone.forEach((zone: { [x: string]: any; name: string }) => {
              const resultItem = result.find(
                (r: { [x: string]: any; itemId: number }) =>
                  r.itemId === item.id && r.zoneId === zone.id
              ) || { status: null, itemId: null };

              const status =
                resultItem.status === true
                  ? "Pass"
                  : resultItem.status === false
                    ? "Fail"
                    : "N/A";

              if (resultItem.status === true) {
                passChecklist++; // Increment pass counter
              } else if (resultItem.status === false) {
                failChecklist++; // Increment fail counter
              }
              worksheet.addRow({
                B: item.name,
                C: zone.name,
                D: status,
                E: "N/A",
              });
            });
          });
        }
      );
      worksheet.addRow({
        A: "Pass Checklist: " + passChecklist,
        B: "Fail Checklist: " + failChecklist,
        C: "Total: " + (passChecklist + failChecklist)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    // Create a blob from the buffer for download in the browser
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "patrol_report.xlsx";

    // Append the link to the document and click it programmatically
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
