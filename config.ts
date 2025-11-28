import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
    rabbitMQUrl: process.env.RABBITMQ_URL!,
    queue: process.env.QUEUE_NAME!,
    exchange: process.env.EXCHANGE_NAME!,
    topic: process.env.TOPIC_NAME!,
    websocketUrl: process.env.SOCKET_SERVER_URL! || "http://localhost:8000",
}