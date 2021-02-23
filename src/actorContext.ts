import {Event} from "./event";
import {ActorRef} from "./actorRef";

export interface ActorContext<TState> {
    state: TState;
    sender: ActorRef | undefined;
    persist: (event: Event) => void;
}
