import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosRequestConfig } from "axios";
import { fail } from "assert";
const ExcelJS = require("exceljs");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// tools/api.ts

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchData = async (
  url: string,
  options: AxiosRequestConfig = {}
) => {
  try {
    const response = await axiosInstance(url, options);
    return response.data;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw new Error("Could not get data");
  }
};

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
      worksheet.addRow({A:"Patrol Id:"+ id});
      worksheet.addRow({A:"Preset:"+ preset.title});
      worksheet.addRow({A:"Description:"+ preset.description});
      worksheet.addRow({A:"Schedule Date:"+ date});
      worksheet.addRow({A:"StartTime:"+ startTime});
      worksheet.addRow({A:"EndTime:"+ endTime});

      checklist.forEach(
        (checklist: {
          title: any; item: any[]; inspector: { name: string } 
}) => {
          let isFirstItem = true; // Initialize a flag to track the first item
          checklist.item.forEach((item) => {
            if(isFirstItem){
              worksheet.addRow({
                A:"Checklist:"+checklist.title
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
                D:status,
                E: "N/A",
              });
            });
          });
        }
      );
      worksheet.addRow({A:"Pass Checklist: "+ passChecklist,
        B:"Fail Checklist: " + failChecklist,
        C:"Total: "+(passChecklist+failChecklist)
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
      `Could not export data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Define an interface for Defect data
export interface DefectData {
  title: string;
  note: string;
  type: string;
  status: string;
  users_id: number;
}

// Create the defect function that accepts DefectData type
export const createDefect = async (defectData: DefectData) => {
  try {
    const response = await axiosInstance.post("/defect", defectData);
    return response.data;
  } catch (error) {
    console.error("Error creating defect:", error);
    throw new Error("Could not create defect");
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
