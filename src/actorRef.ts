import {ActorCommunicationProtocol} from "./actorCommunicationProtocol";

export class ActorRef {
    private _communicationProtocol: ActorCommunicationProtocol;

    constructor(
        type: string,
        id: string,
        parent: ActorRef | undefined,
        communicationProtocol: ActorCommunicationProtocol) {
        this.type = type;
        this.id = id;
        this.parent = parent;
        this._communicationProtocol = communicationProtocol;
    }

    type: string;
    id: string;
    parent: ActorRef | undefined;

    tell(message: any): Promise<void> {
        return this._communicationProtocol.send(this.toString(), message);
    }

    toString(): string {
        if (this.parent) {
            return `${this.parent.toString()}/${this.type}-${this.id}`;
        }

        return `${this.type}-${this.id}`;
    }
}
