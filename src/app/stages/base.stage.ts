import { RendererV2 } from "../renderer/renderer-v2";

export interface IBaseStage {
    hasBeenSetup: boolean;
    renderer: RendererV2;

    setup();
    update(dt: number);
    clear();

    isComplete():StageComplete;
}

export class StageComplete { completed: boolean; success?:boolean; }