import {ActorRef} from "./actorRef";

export class Command {
    constructor(type: string, body: any, sender: ActorRef | undefined) {
        this.type = type;
        this.body = body;
        this.sender = sender;
    }

    type: string;
    body: any;
    sender: ActorRef | undefined;
}
