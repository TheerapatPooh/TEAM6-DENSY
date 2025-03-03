import { Server } from 'socket.io';
import http from 'http';
import { PatrolResult } from '@prisma/client';

let io: Server;

export function initSocketIO(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        },
        path: "/socket.io"
    });

    const patrolResultsMap = new Map<string, PatrolResult[]>();

    io.on('connection', (socket) => {

        socket.on('join_room', (userId: string) => {
            socket.join(userId);
            socket.broadcast.emit("new_user_joined", userId);
        });

        socket.on('join_patrol', (patrolId: string) => {
            socket.join(patrolId);

            // ส่งข้อมูลทั้งหมดใน patrol ให้ผู้ใช้ที่เพิ่งเข้าร่วม
            const currentResults = patrolResultsMap.get(patrolId) || [];
            socket.emit('initial_patrol_data', currentResults);
        });

        socket.on("start_patrol", (data) => {
            const { patrolId, patrolData } = data;
            // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
            socket.broadcast.to(patrolId).emit("patrol_started", {
                patrolId,
                patrolData: patrolData
            });
        });

        socket.on("update_patrol_result", (data) => {
            const { patrolId, result } = data;
            // อัปเดตข้อมูลใน Map
            const currentResults = patrolResultsMap.get(patrolId) || [];
            const existingIndex = currentResults.findIndex(r => r.id === result.id);

            if (existingIndex !== -1) {
                currentResults[existingIndex] = {
                    ...currentResults[existingIndex],
                    ...result
                };
            } else {
                currentResults.push(result);
            }

            patrolResultsMap.set(patrolId, currentResults);
            // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
            socket.broadcast.to(patrolId).emit("patrol_result_update", result);
        });

        socket.on("finish_patrol", (data) => {
            const { patrolId, patrolData } = data;
            // ส่งกลับให้ทุกคนในห้องยกเว้นผู้ส่งเดิม
            socket.broadcast.to(patrolId).emit("patrol_finished", {
                patrolId,
                patrolData: patrolData
            });
        });
    });

    return io;
}

export function getIOInstance() {
    return io;
}
