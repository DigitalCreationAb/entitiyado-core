import {ActorRef} from "./actorRef";
import {Command} from "./command";

export interface ActorCommunicationProtocol {
    send: (id: string, message: any) => Promise<void>;
    receive: (input: any) => ({ receiver: ActorRef, commands: Command[] })[];
}
