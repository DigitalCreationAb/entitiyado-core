import {Event} from "./event";

export interface Persistence {
    loadEvents: (entityId: string) => Promise<Event[]>;
    storeEvents: (entityId: string, events: Event[]) => Promise<void>;
}
