import { Item } from "@prisma/client";

export const items: Item[] = [
    // item ภายใน checklist Safety Inspection id 1 สำหรับ assembly 
    { id: 1, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 1 },
    { id: 2, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 1 },
    { id: 3, name: 'First Aid Kit Check', type: 'safety', checklistId: 1 },

    // item ภายใน checklist Maintenance Inspection id 2 สำหรับ assembly 
    { id: 4, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 2 },
    { id: 5, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 2 },
    { id: 6, name: 'Lighting System Check', type: 'maintenance', checklistId: 2 },

    // item ภายใน checklist Cleanliness Inspection id 3 สำหรับ assembly 
    { id: 7, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 3 },
    { id: 8, name: 'Trash Disposal Check', type: 'environment', checklistId: 3 },
    { id: 9, name: 'Water Quality Inspection', type: 'environment', checklistId: 3 },

    //---------------------------------------------------------------------------------//

    // item ภายใน checklist Safety Inspection id 4 สำหรับ raw
    { id: 10, name: 'CCTV Functionality Check', type: 'safety', checklistId: 4 },
    { id: 11, name: 'Access Control System Check', type: 'safety', checklistId: 4 },
    { id: 12, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 4 },

    // item ภายใน checklist Environmental Inspection id 5 สำหรับ raw
    { id: 13, name: 'Work Area Inspection', type: 'environment', checklistId: 5 },
    { id: 14, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 5 },
    { id: 15, name: 'Ventilation System Inspection', type: 'environment', checklistId: 5 },

    // item ภายใน checklist Cleanliness Inspection id 6 สำหรับ raw
    { id: 16, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 6 },
    { id: 17, name: 'Trash Disposal Check', type: 'environment', checklistId: 6 },
    { id: 18, name: 'Water Quality Inspection', type: 'environment', checklistId: 6 },

    //---------------------------------------------------------------------------------//

    // item ภายใน checklist Maintenance Inspection id 7 สำหรับ  //maintenance 
    { id: 19, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 7 },
    { id: 20, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 7 },
    { id: 21, name: 'Lighting System Check', type: 'maintenance', checklistId: 7 },

    //item ภายใน checklist Equipment Inspection id 8 สำหรับ  //maintenance
    { id: 22, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 8 },
    { id: 23, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 8 },
    { id: 24, name: 'Dust and Contamination Check', type: 'environment', checklistId: 8 },

    //item ภายใน checklist Safety Inspection id 9 สำหรับ  //maintenance 
    { id: 25, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 9 },
    { id: 26, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 9 },
    { id: 27, name: 'First Aid Kit Check', type: 'safety', checklistId: 9 },

    //---------------------------------------------------------------------------------//

    // item ภายใน checklist Cleanliness Inspection id 10 สำหรับ storage
    { id: 28, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 10 },
    { id: 29, name: 'Trash Disposal Check', type: 'environment', checklistId: 10 },
    { id: 30, name: 'Water Quality Inspection', type: 'environment', checklistId: 10 },

    // item ภายใน checklist Security Inspection id 11 สำหรับ storage
    { id: 31, name: 'CCTV Functionality Check', type: 'safety', checklistId: 11 },
    { id: 32, name: 'Access Control System Check', type: 'safety', checklistId: 11 },
    { id: 33, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 11 },

    // item ภายใน checklist Environmental Inspection id 12 สำหรับ storage
    { id: 34, name: 'Work Area Inspection', type: 'environment', checklistId: 12 },
    { id: 35, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 12 },
    { id: 36, name: 'Ventilation System Inspection', type: 'environment', checklistId: 12 },

    //---------------------------------------------------------------------------------//

    // item ภายใน checklist Security Inspection id 13 สำหรับ warehour
    { id: 37, name: 'CCTV Functionality Check', type: 'safety', checklistId: 13 },
    { id: 38, name: 'Access Control System Check', type: 'safety', checklistId: 13 },
    { id: 39, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 13 },

    // item ภายใน checklist Equipment Inspection id 14 สำหรับ warehour
    { id: 40, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 14 },
    { id: 41, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 14 },
    { id: 42, name: 'Dust and Contamination Check', type: 'environment', checklistId: 14 },

    // item ภายใน checklist Cleanliness Inspection id 15 สำหรับ warehour
    { id: 43, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 15 },
    { id: 44, name: 'Trash Disposal Check', type: 'environment', checklistId: 15 },
    { id: 45, name: 'Water Quality Inspection', type: 'environment', checklistId: 15 },

    // item ภายใน checklist Security Inspection id 16 สำหรับ quality 
    { id: 46, name: 'CCTV Functionality Check', type: 'safety', checklistId: 16 },
    { id: 47, name: 'Access Control System Check', type: 'safety', checklistId: 16 },
    { id: 48, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 16 },

    // item ภายใน checklist Equipment Inspection id 17 สำหรับ quality 
    { id: 49, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 17 },
    { id: 50, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 17 },
    { id: 51, name: 'Dust and Contamination Check', type: 'environment', checklistId: 17 },

    // item ภายใน checklist Environmental Inspection id 18 สำหรับ quality 
    { id: 52, name: 'Work Area Inspection', type: 'environment', checklistId: 18 },
    { id: 53, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 18 },
    { id: 54, name: 'Ventilation System Inspection', type: 'environment', checklistId: 18 },

    // item ภายใน checklist Security Inspection id 19 สำหรับ server
    { id: 55, name: 'CCTV Functionality Check', type: 'safety', checklistId: 19 },
    { id: 56, name: 'Access Control System Check', type: 'safety', checklistId: 19 },
    { id: 57, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 19 },

    // item ภายใน checklist Equipment Inspection id 20 สำหรับ server
    { id: 58, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 20 },
    { id: 59, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 20 },
    { id: 60, name: 'Dust and Contamination Check', type: 'environment', checklistId: 20 },

    // item ภายใน checklist Maintenance Inspection id 21 สำหรับ server
    { id: 61, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 21 },
    { id: 62, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 21 },
    { id: 63, name: 'Lighting System Check', type: 'maintenance', checklistId: 21 },

    // item ภายใน checklist Equipment Inspection id 22 สำหรับ testing
    { id: 64, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 22 },
    { id: 65, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 22 },
    { id: 66, name: 'Dust and Contamination Check', type: 'environment', checklistId: 22 },

    // item ภายใน checklist Environmental Inspection id 23 สำหรับ testing
    { id: 67, name: 'Work Area Inspection', type: 'environment', checklistId: 23 },
    { id: 68, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 23 },
    { id: 69, name: 'Ventilation System Inspection', type: 'environment', checklistId: 23 },

    // item ภายใน checklist Safety Inspection id 24 สำหรับ testing
    { id: 70, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 24 },
    { id: 71, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 24 },
    { id: 72, name: 'First Aid Kit Check', type: 'safety', checklistId: 24 },

    //---------------------------------------------------------------------------------//

    // item ภายใน checklist Cleanliness Inspection id 25 สำหรับ work A
    { id: 73, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 25 },
    { id: 74, name: 'Trash Disposal Check', type: 'environment', checklistId: 25 },
    { id: 75, name: 'Water Quality Inspection', type: 'environment', checklistId: 25 },

    // item ภายใน checklist Equipment Inspection id 26 สำหรับ work A
    { id: 76, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 26 },
    { id: 77, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 26 },
    { id: 78, name: 'Dust and Contamination Check', type: 'environment', checklistId: 26 },

    // item ภายใน checklist Safety Inspection id 27 สำหรับ work A
    { id: 79, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 27 },
    { id: 80, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 27 },
    { id: 81, name: 'First Aid Kit Check', type: 'safety', checklistId: 27 },

    // item ภายใน checklist Cleanliness Inspection id 28 สำหรับ work B
    { id: 82, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 28 },
    { id: 83, name: 'Trash Disposal Check', type: 'environment', checklistId: 28 },
    { id: 84, name: 'Water Quality Inspection', type: 'environment', checklistId: 28 },

    // item ภายใน checklist Equipment Inspection id 29 สำหรับ work B
    { id: 85, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 29 },
    { id: 86, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 29 },
    { id: 87, name: 'Dust and Contamination Check', type: 'environment', checklistId: 29 },

    // item ภายใน checklist Safety Inspection id 30 สำหรับ work B
    { id: 88, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 30 },
    { id: 89, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 30 },
    { id: 90, name: 'First Aid Kit Check', type: 'safety', checklistId: 30 },

    // item ภายใน checklist Safety Inspection id 31 สำหรับ Training
    { id: 91, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 31 },
    { id: 92, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 31 },
    { id: 93, name: 'First Aid Kit Check', type: 'safety', checklistId: 31 },

    // item ภายใน checklist Equipment Inspection id 32 สำหรับ Training
    { id: 94, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 32 },
    { id: 95, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 32 },
    { id: 96, name: 'Dust and Contamination Check', type: 'environment', checklistId: 32 },

    // item ภายใน checklist Structural Inspection id 33 สำหรับ Training
    { id: 97, name: 'Wall Integrity Check', type: 'safety', checklistId: 33 },
    { id: 98, name: 'Floor Foundation Inspection', type: 'safety', checklistId: 33 },
    { id: 99, name: 'Ceiling Structure Check', type: 'safety', checklistId: 33 },

    // item ภายใน checklist Maintenance Inspection id 34 สำหรับ Engineering
    { id: 100, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 34 },
    { id: 101, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 34 },
    { id: 102, name: 'Lighting System Check', type: 'maintenance', checklistId: 34 },

    // item ภายใน checklist Equipment Inspection id 35 สำหรับ Engineering
    { id: 103, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 35 },
    { id: 104, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 35 },
    { id: 105, name: 'Dust and Contamination Check', type: 'environment', checklistId: 35 },

    // item ภายใน checklist Safety Inspection id 36 สำหรับ Engineering
    { id: 106, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 36 },
    { id: 107, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 36 },
    { id: 108, name: 'First Aid Kit Check', type: 'safety', checklistId: 36 },

    // item ภายใน checklist Safety Inspection id 37 สำหรับ Prototype
    { id: 109, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 37 },
    { id: 110, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 37 },
    { id: 111, name: 'First Aid Kit Check', type: 'safety', checklistId: 37 },

    // item ภายใน checklist Equipment Inspection id 38 สำหรับ Prototype
    { id: 112, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 38 },
    { id: 113, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 38 },
    { id: 114, name: 'Dust and Contamination Check', type: 'environment', checklistId: 38 },

    // item ภายใน checklist Environmental Inspection id 39 สำหรับ Prototype
    { id: 115, name: 'Work Area Inspection', type: 'environment', checklistId: 39 },
    { id: 116, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 39 },
    { id: 117, name: 'Ventilation System Inspection', type: 'environment', checklistId: 39 },

    // item ภายใน checklist Security Inspection id 40 สำหรับ it zone
    { id: 118, name: 'CCTV Functionality Check', type: 'safety', checklistId: 40 },
    { id: 119, name: 'Access Control System Check', type: 'safety', checklistId: 40 },
    { id: 120, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 40 },

    // item ภายใน checklist Equipment Inspection id 41 สำหรับ it zone
    { id: 121, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 41 },
    { id: 122, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 41 },
    { id: 123, name: 'Dust and Contamination Check', type: 'environment', checklistId: 41 },

    // item ภายใน checklist Maintenance Inspection id 42 สำหรับ it zone
    { id: 124, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 42 },
    { id: 125, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 42 },
    { id: 126, name: 'Lighting System Check', type: 'maintenance', checklistId: 42 },

    // item ภายใน checklist Cleanliness Inspection id 43 สำหรับ customer
    { id: 127, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 43 },
    { id: 128, name: 'Trash Disposal Check', type: 'environment', checklistId: 43 },
    { id: 129, name: 'Water Quality Inspection', type: 'environment', checklistId: 43 },

    // item ภายใน checklist Security Inspection id 44 สำหรับ customer
    { id: 130, name: 'CCTV Functionality Check', type: 'safety', checklistId: 44 },
    { id: 131, name: 'Access Control System Check', type: 'safety', checklistId: 44 },
    { id: 132, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 44 },

    // item ภายใน checklist Equipment Inspection id 45 สำหรับ customer
    { id: 133, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 45 },
    { id: 134, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 45 },
    { id: 135, name: 'Dust and Contamination Check', type: 'environment', checklistId: 45 },

    // item ภายใน checklist Cleanliness Inspection id 46 สำหรับ manager
    { id: 136, name: 'Floor Cleanliness Check', type: 'environment', checklistId: 46 },
    { id: 137, name: 'Trash Disposal Check', type: 'environment', checklistId: 46 },
    { id: 138, name: 'Water Quality Inspection', type: 'environment', checklistId: 46 },

    // item ภายใน checklist Security Inspection id 47 สำหรับ manager
    { id: 139, name: 'CCTV Functionality Check', type: 'safety', checklistId: 47 },
    { id: 140, name: 'Access Control System Check', type: 'safety', checklistId: 47 },
    { id: 141, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 47 },

    // item ภายใน checklist Equipment Inspection id 48 สำหรับ manager
    { id: 142, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 48 },
    { id: 143, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 48 },
    { id: 144, name: 'Dust and Contamination Check', type: 'environment', checklistId: 48 },

    // item ภายใน checklist Environmental Inspection id 49 สำหรับ water supply
    { id: 145, name: 'Work Area Inspection', type: 'environment', checklistId: 49 },
    { id: 146, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 49 },
    { id: 147, name: 'Ventilation System Inspection', type: 'environment', checklistId: 49 },

    // item ภายใน checklist Maintenance Inspection id 50 สำหรับ water supply
    { id: 148, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 50 },
    { id: 149, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 50 },
    { id: 150, name: 'Lighting System Check', type: 'maintenance', checklistId: 50 },

    // item ภายใน checklist Safety Inspection id 51 สำหรับ water supply
    { id: 151, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 51 },
    { id: 152, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 51 },
    { id: 153, name: 'First Aid Kit Check', type: 'safety', checklistId: 51 },

    // item ภายใน checklist Safety Inspection id 52 สำหรับ electrical
    { id: 154, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 52 },
    { id: 155, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 52 },
    { id: 156, name: 'First Aid Kit Check', type: 'safety', checklistId: 52 },

    // item ภายใน checklist Equipment Inspection id 53 สำหรับ electrical
    { id: 157, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 53 },
    { id: 158, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 53 },
    { id: 159, name: 'Dust and Contamination Check', type: 'environment', checklistId: 53 },

    // item ภายใน checklist Structural Inspection id 54 สำหรับ electrical
    { id: 160, name: 'Wall Integrity Check', type: 'safety', checklistId: 54 },
    { id: 161, name: 'Floor Foundation Inspection', type: 'safety', checklistId: 54 },
    { id: 162, name: 'Ceiling Structure Check', type: 'safety', checklistId: 54 },

    // item ภายใน checklist Equipment Inspection id 55 สำหรับ r&d
    { id: 163, name: 'Heat and Temperature Control Check', type: 'environment', checklistId: 55 },
    { id: 164, name: 'Humidity and Moisture Exposure Check', type: 'environment', checklistId: 55 },
    { id: 165, name: 'Dust and Contamination Check', type: 'environment', checklistId: 55 },

    // item ภายใน checklist Environmental Inspection id 56 สำหรับ r&d
    { id: 166, name: 'Work Area Inspection', type: 'environment', checklistId: 56 },
    { id: 167, name: 'Machinery Safety Inspection', type: 'environment', checklistId: 56 },
    { id: 168, name: 'Ventilation System Inspection', type: 'environment', checklistId: 56 },

    // item ภายใน checklist Safety Inspection id 57 สำหรับ r&d
    { id: 169, name: 'Fire Extinguisher Check', type: 'safety', checklistId: 57 },
    { id: 170, name: 'Emergency Exit Sign Check', type: 'safety', checklistId: 57 },
    { id: 171, name: 'First Aid Kit Check', type: 'safety', checklistId: 57 },
    //---------------------------------------------------------------------------------//

];
