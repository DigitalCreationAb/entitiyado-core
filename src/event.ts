export class Event {
    constructor(type: string, body: any) {
        this.type = type;
        this.body = body;
    }

    type: string;
    body: any;
}
