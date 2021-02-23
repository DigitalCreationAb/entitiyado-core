import {ActorSettings} from "./actorSettings";
import {ActorRef} from "./actorRef";

export class Client {
    private _settings: ActorSettings;

    constructor(settings: ActorSettings) {
        this._settings = settings;
    }

    getActor(identifier: string): ActorRef | undefined {
        return ActorRef.parse(identifier, this._settings.communication);
    }
}
