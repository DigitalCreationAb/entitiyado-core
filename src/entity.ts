import {EntityRef} from "./entityRef";
import {EntityContext} from "./entityContext";
import {Command} from "./command";
import {Event} from "./event";

interface CommandHandlers<TState> {
    [key: string]: (command: any, context: EntityContext<TState>) => Promise<void> | void
}

interface RecoveryHandlers<TState> {
    [key: string]: (state: TState, event: any) => TState;
}

export abstract class Entity<TState> {
    private readonly _recoveryHandlers: RecoveryHandlers<TState> = {};
    private readonly _commandHandlers: CommandHandlers<TState> = {};
    private readonly _pendingEvents: Event[] = [];
    private _currentState: TState;

    protected constructor(self: EntityRef) {
        this.self = self;
        this._currentState = this.getInitialState();
    }

    protected self: EntityRef;

    protected abstract getInitialState(): TState;

    protected recover(type: string, handler: (state: TState, event: any) => TState) {
        this._recoveryHandlers[type] = handler;
    }

    protected command(type: string, handler: (command: any, context: EntityContext<TState>) => Promise<void> | void) {
        this._commandHandlers[type] = handler;
    }

    protected persist(type: string, body: any): void {
        this._pendingEvents.push(new Event(type, body));
    }

    public applyEvents(events: Event[]): void {
        let state = this._currentState;

        for (const event of events) {
            if (this._recoveryHandlers[event.type]) {
                state = this._recoveryHandlers[event.type](state, event.body);
            }
        }

        this._currentState = state;
    }

    public async handleCommand(command: Command): Promise<Event[]> {
        if (!this._commandHandlers[command.type]) {
            return [];
        }

        const context = {
            state: this._currentState,
            sender: command.sender
        } as EntityContext<TState>;

        await this._commandHandlers[command.type](command.body, context);

        this.applyEvents(this._pendingEvents);

        return this._pendingEvents.slice(0, this._pendingEvents.length);
    }
}
