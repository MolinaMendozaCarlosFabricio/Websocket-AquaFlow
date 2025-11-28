import { CONFIG } from "../../../../config";
import amqp from "amqplib";
import { PayloadSensorReadingsSchema } from '../../../domain/SensorReadings/Payload_SensorReadings';
import { NotificationsSchema } from '../../../domain/Notifications/Notifications';
import { WaterActivitiesListSchema } from '../../../domain/WaterActivities/WaterActivitiesList';
import { EmitSensorReadingsUseCase } from "../../../another_application/SensorReadings/use_case/emitSensorReading";
import { EmitNotificationUseCase } from "../../../another_application/Notifications/use_case/emitNotification";
import { EmitWaterActivitiesUseCase } from "../../../another_application/WaterActivities/use_case/emitWaterActivities";
import { setSocketServer } from "../../dependencies";

export const startRabbitConsumer = async () => {
    try{
        const socketAdapter = setSocketServer();
        const emitSensorReadingsUseCase = new EmitSensorReadingsUseCase(socketAdapter);
        const emitNotificationUseCase = new EmitNotificationUseCase(socketAdapter);
        const emitWaterActivities = new EmitWaterActivitiesUseCase(socketAdapter);

        const connection = await amqp.connect(CONFIG.rabbitMQUrl);
        const channel = await connection.createChannel();
        await channel.assertExchange(CONFIG.exchange, 'topic', { durable: true });
        const {queue} = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(queue, CONFIG.exchange, CONFIG.topic + ".many_readings");
        await channel.bindQueue(queue, CONFIG.exchange, CONFIG.topic + ".notification");
        await channel.bindQueue(queue, CONFIG.exchange, CONFIG.topic + ".water_activities");

        console.log("Esperando mensajes del tópico:", CONFIG.topic);

        channel.consume(queue, (msg) => {
            if(msg?.content){
                const content = JSON.parse(msg.content.toString());
                const topicKey = msg.fields.routingKey;

                console.log("Mensaje recibido del tópico:", topicKey);
                console.log("Contenido del mensaje:", content)

                try{
                    if (topicKey == CONFIG.topic + ".water_activities"){
                        const waterActivities = WaterActivitiesListSchema.parse(content);
                        emitWaterActivities.execute(waterActivities.user_id, waterActivities);
                    } else if(topicKey == CONFIG.topic + ".many_readings"){
                        const sensorReadings = PayloadSensorReadingsSchema.parse(content);
                        emitSensorReadingsUseCase.execute(sensorReadings.idUser, sensorReadings);
                    } else if(topicKey == CONFIG.topic + ".notification"){
                        const notification = NotificationsSchema.parse(content);
                        emitNotificationUseCase.execute(notification.user_id, notification);
                    } else {
                        console.log("No se encontró una cola conocida");
                    }
                }catch(error){
                    console.log("Error al formatear mensaje recibido:", error);
                    const payload = JSON.parse(msg.content.toString());
                }
            }
        });
    }catch(err){
        console.log("Error al conectar con RabbitMQ:", err)
    }
}