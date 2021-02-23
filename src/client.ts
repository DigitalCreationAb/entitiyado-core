import {ActorSettings} from "./actorSettings";
import {ActorRef} from "./actorRef";

export class Client {
    private _settings: ActorSettings;

    constructor(settings: ActorSettings) {
        this._settings = settings;
    }

    getActor(type: string, id: string): ActorRef {
        return new ActorRef(type, id, undefined, this._settings.communication);
    }
}
