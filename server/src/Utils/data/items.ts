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

    // item ภายใน checklist Maintenance Inspection id 7 สำหรับ quality control
    { id: 19, name: 'Electrical Panel Inspection', type: 'maintenance', checklistId: 7 },
    { id: 20, name: 'Air Conditioning System Check', type: 'maintenance', checklistId: 7 },
    { id: 21, name: 'Lighting System Check', type: 'maintenance', checklistId: 7 }, 

    //item ภายใน checklist Equipment Inspection id 8 สำหรับ quality control
    
    //item ภายใน checklist Safety Inspection id 9 สำหรับ quality control
];
