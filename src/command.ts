import {EntityRef} from "./entityRef";

export class Command {
    constructor(type: string, body: any, sender: EntityRef | undefined) {
        this.type = type;
        this.body = body;
        this.sender = sender;
    }

    type: string;
    body: any;
    sender: EntityRef | undefined;
}
