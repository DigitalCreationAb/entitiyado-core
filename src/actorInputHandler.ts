import {ActorSettings} from "./actorSettings";
import {ActorContextImpl} from "./actorContextImpl";
import {ActorRef} from "./actorRef";
import {Command} from "./command";
import {Actor} from "./actor";

const actorInputHandler = <TState>(settings: ActorSettings, actor: Actor<TState>) : (input: any) => Promise<void> => {
    const handleCommands = async (receiver: ActorRef, commands: Command[]): Promise<void> => {
        const events = await settings.persistence.loadEvents(receiver.toString());

        let state = actor.applyEvents(actor.getInitialState(), events);

        for (const command of commands) {
            const context = new ActorContextImpl<TState>(receiver, state, command.sender, settings.persistence);

            await actor.handleCommand(command, context);

            const storedEvents = await context.commit();

            state = actor.applyEvents(state, storedEvents);
        }
    };

    return async (input) => {
        const commands = settings.communication.receive(input);

        await Promise.all(commands.map(x => handleCommands(x.receiver, x.commands)))
    };
};

export { actorInputHandler };
