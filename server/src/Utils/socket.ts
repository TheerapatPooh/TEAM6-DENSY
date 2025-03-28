/**
 * คำอธิบาย:
 * ไฟล์นี้ใช้สำหรับตั้งค่าและจัดการการเชื่อมต่อของ Socket.IO ในแอพพลิเคชัน
 * โดยมีการจัดการกับเหตุการณ์ต่างๆ ที่เกิดขึ้นในห้อง (room) เช่น การเข้าร่วมห้อง,
 * การเริ่มต้นและอัปเดตผลการลาดตระเวน, การเสร็จสิ้นการลาดตระเวน, และการลบผลการลาดตระเวน
 * ข้อมูลผลการลาดตระเวนจะถูกเก็บใน Map และสามารถส่งข้อมูลไปยังผู้ใช้ที่เกี่ยวข้องในห้องที่เชื่อมต่อ
 *
 * ฟังก์ชันหลักที่ใช้ในไฟล์นี้:
 * - initSocketIO: ใช้ในการตั้งค่าและเชื่อมต่อกับ Socket.IO
 * - getIOInstance: ใช้ในการดึงอินสแตนซ์ของ Socket.IO ที่ถูกสร้างขึ้น
 *
 * Input:
 * - server (http.Server): เซิร์ฟเวอร์ที่ Socket.IO จะเชื่อมต่อ
 *
 * Output:
 * - io (Server): อินสแตนซ์ของ Socket.IO ที่สามารถใช้งานได้ในส่วนอื่นๆ ของแอพพลิเคชัน
**/
import { Server } from "socket.io";
import http from "http";
import { PatrolResult } from "@prisma/client";

let io: Server;

export function initSocketIO(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
    path: "/socket.io",
  });

  const patrolResultsMap = new Map<string, PatrolResult[]>();

  io.on("connection", (socket) => {
    socket.on("join_room", (userId: string) => {
      if (!userId) return; // ป้องกันการ join ห้องที่ไม่มี userId
      const notifRoom = `notif_${userId}`;
      socket.join(notifRoom);
      socket.to(notifRoom).emit("new_user_joined", userId);
    });

    socket.on("join_patrol", (patrolId: string) => {
      const patrolRoom = `patrol_${patrolId}`;
      socket.join(patrolRoom);

      // ส่งข้อมูลทั้งหมดใน patrol ให้ผู้ใช้ที่เพิ่งเข้าร่วม
      const currentResults = patrolResultsMap.get(patrolId) || [];
      socket.emit("initial_patrol_data", currentResults);
    });

    socket.on("start_patrol", (data) => {
      const { patrolId, patrolData } = data;
      const patrolRoom = `patrol_${patrolId}`;
      // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
      socket.broadcast.to(patrolRoom).emit("patrol_started", {
        patrolId,
        patrolData: patrolData,
      });
    });

    socket.on("update_patrol_result", (data) => {
      const { patrolId, result } = data;
      const patrolRoom = `patrol_${patrolId}`;

      // อัปเดตข้อมูลใน Map
      const currentResults = patrolResultsMap.get(patrolId) || [];
      const existingIndex = currentResults.findIndex((r) => r.id === result.id);

      if (existingIndex !== -1) {
        currentResults[existingIndex] = {
          ...currentResults[existingIndex],
          ...result,
        };
      } else {
        currentResults.push(result);
      }

      patrolResultsMap.set(patrolId, currentResults);
      // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
      socket.broadcast.to(patrolRoom).emit("patrol_result_update", result);
    });

    socket.on("finish_patrol", (data) => {
      const { patrolId, patrolData } = data;
      const patrolRoom = `patrol_${patrolId}`;
      // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
      socket.broadcast.to(patrolRoom).emit("patrol_finished", {
        patrolId,
        patrolData: patrolData,
      });
    });

    socket.on("delete_patrol", (patrolId) => {
      io.emit("patrol_deleted", patrolId);
    });
  });

  return io;
}

export function getIOInstance() {
  return io;
}
