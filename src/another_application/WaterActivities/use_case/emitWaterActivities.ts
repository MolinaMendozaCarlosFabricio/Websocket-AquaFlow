import { SocketRepository } from "../../../domain/Socket_repository";
import { WaterActivitiesList } from "../../../domain/WaterActivities/WaterActivitiesList";

export class EmitWaterActivitiesUseCase {
    ws: SocketRepository;

    constructor(ws: SocketRepository){
        this.ws = ws;
    }

    public execute(id_user: string, payload: WaterActivitiesList){
        this.ws.emitWaterActivities(id_user, payload)
    }
}