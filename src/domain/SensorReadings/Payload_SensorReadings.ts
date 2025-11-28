import { SensorReadingsSchema } from "./SensorReadings";
import * as z from "zod/v4"; 

export const PayloadSensorReadingsSchema = z.object({
    idUser: z.string(),
    idFiltrer: z.string(),
    sensorReadings: z.array(SensorReadingsSchema),
});

export type PayloadSensorReadings = z.infer<typeof PayloadSensorReadingsSchema>;