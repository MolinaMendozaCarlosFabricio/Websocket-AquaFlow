import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './infrastructure/socket.io/handlers/SocketHandler';
import { startDependencies } from './infrastructure/dependencies';

const app = express();
const httpServer = createServer(app);
const io = new Server (httpServer, {
    "cors": { "origin": "*" },
});

startDependencies(io)

io.on("connection", (socket) => {
    console.log("Usuario conectandose");

    socket.on('join_room', (room: string) => {
        socket.join(room); // Siendo la room, el ID del usuario
    });

    socketHandler(socket);
});

httpServer.listen(8000, () => {
    console.log("Socket.io on line")
})