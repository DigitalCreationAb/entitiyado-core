import {EntityRef} from "./entityRef";
import {Command} from "./command";
import {CommunicationProtocol} from "./communicationProtocol";

export class SplitCommunicationProtocol implements CommunicationProtocol {
    private readonly _receiver: CommunicationProtocol;
    private readonly _sender: CommunicationProtocol;

    constructor(receiver: CommunicationProtocol, sender: CommunicationProtocol) {
        this._receiver = receiver;
        this._sender = sender;
    }

    receive(input: any): { receiver: EntityRef; commands: Command[] }[] {
        return this._receiver.receive(input);
    }

    send(to: EntityRef, command: Command): Promise<void> {
        return this._sender.send(to, command);
    }
}
