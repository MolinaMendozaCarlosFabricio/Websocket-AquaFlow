import { Socket } from "socket.io";
import { EmitSensorReadingsUseCase } from "../../../another_application/SensorReadings/use_case/emitSensorReading";
import { setSocketServer } from "../../dependencies";
import { EmitNotificationUseCase } from "../../../another_application/Notifications/use_case/emitNotification";
import { PayloadSensorReadings } from "../../../domain/SensorReadings/Payload_SensorReadings";
import { EmitWaterActivitiesUseCase } from "../../../another_application/WaterActivities/use_case/emitWaterActivities";
import { WaterActivitiesList } from "../../../domain/WaterActivities/WaterActivitiesList";
import { Notifications } from "../../../domain/Notifications/Notifications";

export const socketHandler = (socket: Socket) => {
    const socketAdapter = setSocketServer();
    const emitSensorReadingsUseCase = new EmitSensorReadingsUseCase(socketAdapter);
    const emitNotificationUseCase = new EmitNotificationUseCase(socketAdapter);
    const emitWaterActivities = new EmitWaterActivitiesUseCase(socketAdapter);

    socket.on('new_many_sensor_readings', ({ userID, sensorReadings }: { userID: string, sensorReadings: PayloadSensorReadings }) => {
        emitSensorReadingsUseCase.execute(userID, sensorReadings);
    });

    socket.on('new_notification', ({ userID, notification }: { userID: string, notification: Notifications }) => {
        emitNotificationUseCase.execute(userID, notification);
    });

    socket.on('new_water_activities', ({userID, waterActivitiesList}: {userID: string, waterActivitiesList: WaterActivitiesList}) => {
        emitWaterActivities.execute(userID, waterActivitiesList)
    });
}