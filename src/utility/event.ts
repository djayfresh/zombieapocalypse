
export function GameEvent(name: string) {
    return (target: any) => {
        target.eventName = `Event.Game.${name}`;
    };
}

export class BaseEvent<T> {
    static eventName: string;
    date: number;
    data: T;
    eventName: string;
    constructor(data: T) {
        this.data = data;
        this.date = Date.now();
        this.eventName = (<typeof BaseEvent>this.constructor).eventName;
    }
}

export declare type TypeOfBaseEvent<T extends BaseEvent<any>> = {
    new(data: any): T;
};

export interface BaseEventCallback<T extends BaseEvent<any>> {
    (event: T);
}

@GameEvent('Test')
export class TestEvent extends BaseEvent<string> {
}