import os from 'os';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cluster from 'cluster';
import { setupMaster, setupWorker } from '@socket.io/sticky';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { socketHandler } from './src/infrastructure/socket.io/handlers/SocketHandler';
import { startDependencies } from './src/infrastructure/dependencies';
import { startRabbitConsumer } from './src/infrastructure/rabbitMQ/adapters/RabbitMQ';

const nCpus = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Worker maestro ${process.pid} en ejecución`);
    const app = express();
    const httpServer = createServer(app);
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection"
    });
    setupPrimary();

    cluster.setupPrimary({
        serialization: "advanced"
    });

    httpServer.listen(8000, () => {
        console.log("Socket.io en línea");
    });

    for (let i = 0; i < nCpus; i++)
        cluster.fork();

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} terminado`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} inicializado`);

    const app = express();
    const httpServer = createServer(app);

    const io = new Server (httpServer, {
        "cors": { "origin": "*" },
    });

    io.adapter(createAdapter());

    setupWorker(io);

    startDependencies(io)

    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on('join_room', (room: string) => {
            socket.join(room); // Siendo la room, el ID del usuario
        });

        socketHandler(socket);
    });

    startRabbitConsumer();
}