import {ActorContext} from "./actorContext";
import {Event} from "./event";
import {Persistence} from "./persistence";
import {ActorRef} from "./actorRef";

export class ActorContextImpl<TState> implements ActorContext<TState> {
    private _pendingEvents: Event[] = [];
    private _persistence: Persistence;

    constructor(self: ActorRef, state: TState, sender: ActorRef | undefined, persistence: Persistence) {
        this.self = self;
        this.state = state;
        this.sender = sender;
        this._persistence = persistence;
    }

    self: ActorRef;
    state: TState;
    sender: ActorRef | undefined;

    persist(event: Event): void {
        this._pendingEvents.push(event);
    }

    async commit(): Promise<Event[]> {
        await this._persistence.storeEvents(this.self.toString(), this._pendingEvents);
        return this._pendingEvents.splice(0, this._pendingEvents.length);
    }
}
