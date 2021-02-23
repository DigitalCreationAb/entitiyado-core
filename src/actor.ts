import {RecoveryHandlers} from "./recoveryHandlers";
import {CommandHandlers} from "./commandHandlers";
import {ActorContext} from "./actorContext";
import {Event} from "./event";
import {Command} from "./command";

export abstract class Actor<TState> {
    private _recoveryHandlers: RecoveryHandlers<TState> = {};
    private _commandHandlers: CommandHandlers<TState> = {};

    protected constructor() {
        this.init();
    }

    abstract init(): void;

    abstract getInitialState(): TState;

    protected recover(type: string, handler: (state: TState, event: any) => TState) {
        this._recoveryHandlers[type] = handler;
    }

    protected command(type: string, handler: (command: any, context: ActorContext<TState>) => Promise<void> | void) {
        this._commandHandlers[type] = handler;
    }

    applyEvents(state: TState, events: Event[]): TState {
        for (const event of events) {
            if (this._recoveryHandlers[event.type]) {
                state = this._recoveryHandlers[event.type](state, event.body);
            }
        }

        return state;
    }

    handleCommand(command: Command, context: ActorContext<TState>): Promise<void> | void {
        if (this._commandHandlers[command.type]) {
            return this._commandHandlers[command.type](command, context);
        }
    }
}
