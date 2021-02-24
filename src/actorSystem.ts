import {Persistence} from "./persistence";
import {ActorCommunicationProtocol} from "./actorCommunicationProtocol";
import {ActorRef} from "./actorRef";
import {Command} from "./command";
import {Actor} from "./actor";
import {Event} from "./event";

export class ActorSystem {
    private readonly _persistence: Persistence;
    private readonly _communication: ActorCommunicationProtocol;

    constructor(persistence: Persistence, communication: ActorCommunicationProtocol) {
        this._persistence = persistence;
        this._communication = communication;
    }

    getProxy(identifier: string): ActorRef | undefined {
        return ActorRef.parse(identifier, this._communication);
    }

    async actorOf<TActor>(identifier: string, createActor: (self: ActorRef, persistence: Persistence, events: Event[]) => TActor): Promise<TActor | undefined> {
        const actorRef = ActorRef.parse(identifier, this._communication);

        if (!actorRef) {
            return undefined;
        }

        const events = await this._persistence.loadEvents(actorRef.toString());

        return createActor(actorRef, this._persistence, events);
    }

    getInputHandler<TActor extends Actor<TState>, TState>(createActor: (self: ActorRef, persistence: Persistence, events: Event[]) => TActor): (input: any, context: any) => Promise<void> {
        const handleCommands = async (receiver: ActorRef, commands: Command[]): Promise<void> => {
            const actor = await this.actorOf<TActor>(receiver.toString(), createActor);

            if (!actor) {
                return;
            }

            const events = await this._persistence.loadEvents(receiver.toString());

            actor.applyEvents(events);

            for (const command of commands) {
                const resultEvents = await actor.handleCommand(command);

                await this._persistence.storeEvents(receiver.toString(), resultEvents);
            }
        };

        return async (input) => {
            const commands = this._communication.receive(input);

            await Promise.all(commands.map(x => handleCommands(x.receiver, x.commands)))
        };
    }
}
