import { Server } from 'socket.io';
import http from 'http';
import corsMiddleware from './cors';


export function initSocketIO(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    });


    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("message", (body) => {
            io.emit("message", body);
        });


        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}
