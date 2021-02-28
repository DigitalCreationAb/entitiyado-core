import {EntityRef} from "./entityRef";
import {Command} from "./command";

export interface CommunicationProtocol {
    send: (to: EntityRef, command: Command) => Promise<void>;
    receive: (input: any) => ({ receiver: EntityRef, commands: Command[] })[];
}

