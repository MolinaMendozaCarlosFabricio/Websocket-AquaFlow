import { Notifications } from "./Notifications/Notifications";
import { Measurements } from "./SensorReadings/Measurements";
import { WaterActivitiesList } from "./WaterActivities/WaterActivitiesList";

export interface SocketRepository{
    emitSensorReadings(user_id: string, payload: Measurements): void
    emitNotification(user_id: string, payload: Notifications): void
    emitWaterActivities(user_id: string, payload: WaterActivitiesList): void
}