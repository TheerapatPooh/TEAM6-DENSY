import { Checklist } from "@prisma/client"

export const checklists: Checklist[] = [
    //assembly
    { id: 1, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 2, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },
    { id: 3, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },

    //raw
    { id: 4, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 5, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },
    { id: 6, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },

    //maintenance 
    { id: 7, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },
    { id: 8, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 9, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //storage
    { id: 10, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 11, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 12, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },

    //warehour
    { id: 13, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 14, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 15, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },

    //quality 
    { id: 16, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 17, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 18, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },

    //server room
    { id: 19, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 20, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 21, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },

    //testing
    { id: 22, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 23, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },
    { id: 24, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //work station a
    { id: 25, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 26, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 27, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //work station  b
    { id: 28, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 29, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 30, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //Training
    { id: 31, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 32, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 33, title: 'Structural Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },

    //engineering
    { id: 34, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },
    { id: 35, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 36, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //prototype zone 
    { id: 37, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 38, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 39, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },

    //it zone
    { id: 40, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 41, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 42, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },

    //customer 
    { id: 43, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 44, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 45, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },

    //manager
    { id: 46, title: 'Cleanliness Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:15.000'), updatedBy: 1 },
    { id: 47, title: 'Security Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:25.000'), updatedBy: 1 },
    { id: 48, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },

    //water supply
    { id: 49, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },
    { id: 50, title: 'Maintenance Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:10.000'), updatedBy: 1 },
    { id: 51, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },

    //electrical 
    { id: 52, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
    { id: 53, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 54, title: 'Structural Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },

    //r&d
    { id: 55, title: 'Equipment Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:43.000'), updatedBy: 1 },
    { id: 56, title: 'Environmental Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:45.000'), updatedBy: 1 },
    { id: 57, title: 'Safety Inspection', version: 1, latest: true, updatedAt: new Date('2024-10-06 17:05:09.000'), updatedBy: 1 },
];
