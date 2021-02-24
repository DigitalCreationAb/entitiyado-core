import {ActorRef} from "./actorRef";

export interface ActorContext<TState> {
    state: TState;
    sender: ActorRef | undefined;
}
