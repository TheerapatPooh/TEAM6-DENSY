import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export function initSocketIO(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        },
        path: "/socket.io"
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join_room', (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined room: ${userId}`);
            socket.broadcast.emit("new_user_joined", userId);

        });

        socket.on('patrol_result_update', (updatedResults, patrolId) => {
            io.to(patrolId).emit('patrol_result_update', updatedResults);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIOInstance() {
    return io;
}
