import os from 'os';
import cluster from 'cluster';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './src/infrastructure/socket.io/handlers/SocketHandler';
import { startDependencies } from './src/infrastructure/dependencies';
import { startRabbitConsumer } from './src/infrastructure/rabbitMQ/adapters/RabbitMQ';

const app = express();
const httpServer = createServer(app);
const io = new Server (httpServer, {
    "cors": { "origin": "*" },
});

startDependencies(io)

const CPUsAvailable = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Cantidad de CPU's: ${CPUsAvailable}`);
    console.log(`PID del proceso padre: ${process.pid}`);

    for (let i = 0; i < CPUsAvailable; i++)
        cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} terminado`);
        console.log("Creando nuevo worker");
        cluster.fork();
    });
} else {
    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on('join_room', (room: string) => {
            socket.join(room); // Siendo la room, el ID del usuario
        });

        socketHandler(socket);
    });

    startRabbitConsumer();

    httpServer.listen(8000, () => {
        console.log("Socket.io en línea");
    });
}