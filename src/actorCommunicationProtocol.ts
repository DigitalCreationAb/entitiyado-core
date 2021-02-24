import {ActorRef} from "./actorRef";
import {Command} from "./command";
import {Message} from "./message";

export interface ActorCommunicationProtocol {
    send: (to: ActorRef, message: Message, sender: ActorRef) => Promise<void>;
    receive: (input: any) => ({ receiver: ActorRef, commands: Command[] })[];
}
