
export interface IBaseStage {
    hasBeenSetup: boolean;
    stage: PIXI.Container;

    setup();
    update(dt: number);
    clear();

    isComplete():StageComplete;
}

export class StageComplete { completed: boolean; success?:boolean; }