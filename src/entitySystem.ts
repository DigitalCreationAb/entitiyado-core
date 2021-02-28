import {Entity} from "./entity";
import {EntityRef} from "./entityRef";
import {Persistence} from "./persistence";
import {CommunicationProtocol} from "./communicationProtocol";
import {Command} from "./command";
import {Event} from "./event";

export class EntitySystem {
    private readonly _persistence: Persistence;
    private readonly _communication: CommunicationProtocol;

    constructor(persistence: Persistence, communication: CommunicationProtocol) {
        this._persistence = persistence;
        this._communication = communication;
    }

    getProxy(identifier: string): EntityRef | undefined {
        return EntityRef.parse(identifier, this._communication);
    }

    entityOf<TEntity>(identifier: string, createEntity: (self: EntityRef) => TEntity): TEntity | undefined {
        const entityRef = EntityRef.parse(identifier, this._communication);

        if (!entityRef) {
            return undefined;
        }

        return createEntity(entityRef);
    }

    getInputHandler<TEntity extends Entity<TState>, TState>(createEntity: (self: EntityRef) => TEntity): (input: any) => Promise<void> {
        const handleCommands = async (receiver: EntityRef, commands: Command[]): Promise<void> => {
            const entity = this.entityOf<TEntity>(receiver.toString(), createEntity);

            if (!entity) {
                return;
            }

            const events = await this._persistence.loadEvents(receiver.toString());

            entity.applyEvents(events);

            for (const command of commands) {
                const resultEvents = await entity.handleCommand(command);

                await this._persistence.storeEvents(receiver.toString(), resultEvents);
            }
        };

        return async (input): Promise<void> => {
            const commands = this._communication.receive(input);

            await Promise.all(commands.map(x => handleCommands(x.receiver, x.commands)))
        };
    }
}
