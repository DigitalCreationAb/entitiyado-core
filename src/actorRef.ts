import {ActorCommunicationProtocol} from "./actorCommunicationProtocol";

export class ActorRef {
    private _communicationProtocol: ActorCommunicationProtocol;

    constructor(
        id: string,
        parent: ActorRef | undefined,
        communicationProtocol: ActorCommunicationProtocol) {
        this.id = id;
        this.parent = parent;
        this._communicationProtocol = communicationProtocol;
    }

    id: string;
    parent: ActorRef | undefined;

    tell(message: any): Promise<void> {
        return this._communicationProtocol.send(this.toString(), message);
    }

    toString(): string {
        if (this.parent) {
            return `${this.parent.toString()}/${this.id}`;
        }

        return this.id;
    }

    static parse(identifier: string, communication: ActorCommunicationProtocol): ActorRef | undefined {
        const hierarchy = identifier.split('/');

        let actor: ActorRef | undefined = undefined;

        for (const item of hierarchy) {
            actor = new ActorRef(item, actor, communication);
        }

        return actor;
    }
}
