import {Persistence} from "./persistence";
import {ActorCommunicationProtocol} from "./actorCommunicationProtocol";

export class ActorSettings {
    constructor(persistence: Persistence, communication: ActorCommunicationProtocol) {
        this.persistence = persistence;
        this.communication = communication;
    }

    persistence: Persistence;
    communication: ActorCommunicationProtocol;
}
