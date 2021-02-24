import {ActorRef} from "./actorRef";
import {Command} from "./command";

export interface ActorCommunicationProtocol {
    send: (to: ActorRef, command: Command) => Promise<void>;
    receive: (input: any) => ({ receiver: ActorRef, commands: Command[] })[];
}
