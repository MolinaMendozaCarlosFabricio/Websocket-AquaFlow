import { SocketRepository } from "../../../domain/Socket_repository";
import { Notifications } from "../../../domain/Notifications/Notifications";

export class EmitNotificationUseCase {
    ws!: SocketRepository;

    constructor(ws: SocketRepository){
        this.ws = ws;
    }

    public execute(user_id: string, notification: Notifications){
        this.ws.emitNotification(user_id, notification);
    }
}