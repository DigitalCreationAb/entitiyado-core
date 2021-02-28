import {EntityRef} from "./entityRef";

export interface EntityContext<TState> {
    state: TState;
    sender: EntityRef | undefined;
}
