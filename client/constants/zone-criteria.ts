/**
 * คำอธิบาย: ไฟล์นี้ใช้เก็บค่าคงที่ที่ใช้ในการกำหนดสีของ Zone ตามจำนวน Defects
 * Input: ไม่มี
 * Output: ค่าคงที่ที่ใช้ในการกำหนดสีของ Zone ตามจำนวน Defects
**/

// ค่าคงที่ที่ใช้ในการกำหนดสีของ Zone ตามจำนวน Defects
export const zoneCriteria = [
    { defects: 75, label: "> 75", color: '#B71C1C' },  
    { defects: 65, label: "> 65", color: '#D32F2F' },  
    { defects: 55, label: "> 55", color: '#E53935' },  
    { defects: 45, label: "> 45", color: '#F44336' },  
    { defects: 35, label: "> 35", color: '#FF5C5C' },  
    { defects: 25, label: "> 25", color: '#FF7F7F' },  
    { defects: 10, label: "> 10", color: '#FF9E9E' },  
    { defects: 0,  label: "0", color: '#D3D3D3' }      
];
