import { Measurements } from "../../../domain/SensorReadings/Measurements";
import { PayloadSensorReadings } from "../../../domain/SensorReadings/Payload_SensorReadings";
import { SocketRepository } from "../../../domain/Socket_repository";

export class EmitSensorReadingsUseCase {
    ws: SocketRepository;
    
    constructor(ws: SocketRepository){
        this.ws = ws;
    }

    public execute(user_id: string, payload: PayloadSensorReadings) {
        console.log(user_id);
        console.log(payload);

        let measurements: Measurements = {
            filtrer_id: payload.idFiltrer,
            ph: payload.sensorReadings[0],
            tds: payload.sensorReadings[1],
            temperature: payload.sensorReadings[2],
            turbidity: payload.sensorReadings[3],
        };
        this.ws.emitSensorReadings(user_id, measurements);
    }
}