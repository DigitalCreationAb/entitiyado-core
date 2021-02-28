import {CommunicationProtocol} from "./communicationProtocol";
import {Command} from "./command";

export class EntityRef {
    private _communicationProtocol: CommunicationProtocol;

    constructor(
        id: string,
        type: string,
        parent: EntityRef | undefined,
        communicationProtocol: CommunicationProtocol) {
        this.id = id;
        this.type = type;
        this.parent = parent;
        this._communicationProtocol = communicationProtocol;
    }

    id: string;
    type: string;
    parent: EntityRef | undefined;

    tell(type: string, body: any, sender: EntityRef): Promise<void> {
        return this._communicationProtocol.send(this, new Command(type, body, sender));
    }

    toString(): string {
        if (this.parent) {
            return `${this.parent.toString()}/${this.id}@${this.type}`;
        }

        return this.id;
    }

    static parse(identifier: string, communication: CommunicationProtocol): EntityRef | undefined {
        const hierarchy = identifier.split('/');

        let ref: EntityRef | undefined = undefined;

        for (const item of hierarchy) {
            const parts = item.split('@');
            ref = new EntityRef(parts[0], parts[1], ref, communication);
        }

        return ref;
    }
}
