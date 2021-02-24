import {ActorCommunicationProtocol} from "./actorCommunicationProtocol";
import {Command} from "./command";

export class ActorRef {
    private _communicationProtocol: ActorCommunicationProtocol;

    constructor(
        id: string,
        type: string,
        parent: ActorRef | undefined,
        communicationProtocol: ActorCommunicationProtocol) {
        this.id = id;
        this.type = type;
        this.parent = parent;
        this._communicationProtocol = communicationProtocol;
    }

    id: string;
    type: string;
    parent: ActorRef | undefined;

    tell(type: string, body: any, sender: ActorRef): Promise<void> {
        return this._communicationProtocol.send(this, new Command(type, body, sender));
    }

    toString(): string {
        if (this.parent) {
            return `${this.parent.toString()}/${this.id}@${this.type}`;
        }

        return this.id;
    }

    static parse(identifier: string, communication: ActorCommunicationProtocol): ActorRef | undefined {
        const hierarchy = identifier.split('/');

        let actor: ActorRef | undefined = undefined;

        for (const item of hierarchy) {
            const parts = item.split('@');
            actor = new ActorRef(parts[0], parts[1], actor, communication);
        }

        return actor;
    }
}
