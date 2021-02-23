import {ActorContext} from "./actorContext";

export interface CommandHandlers<TState> {
    [key: string]: (command: any, context: ActorContext<TState>) => Promise<void> | void
}
