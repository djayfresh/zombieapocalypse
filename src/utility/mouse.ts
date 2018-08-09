import { Game } from "../app/game";

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

export class Mouse {
    isDown = false;
    isUp = true;
    private moveEvents: OnMove[] = [];
    private pressEvents: Function[] = [];
    private releaseEvents: Function[] = [];
    x = 0;
    y = 0;

    constructor(public button: MouseButton){
        //Attach event listeners
        window.addEventListener(
            "mousedown", this.downHandler.bind(this), false
        );
        window.addEventListener(
            "mouseup", this.upHandler.bind(this), false
        );
        window.addEventListener(
            "mousemove", this.moveHandler.bind(this), false
        );
    }

    onMove(move: OnMove) {
        this.moveEvents.push(move);
    }

    onClick(press: Function, release?: Function){
        this.pressEvents.push(press);

        if(release){
            this.releaseEvents.push(release);
        }
    }

    //The `downHandler`
    private downHandler(event) {
        console.log("Mouse", event);
        if(this.button == event.button){
            if (this.isUp && this.press) this.press();
            this.isDown = true;
            this.isUp = false;

            event.preventDefault();
        }
    }

    //The `upHandler`
    private upHandler(event) {
        if(this.button == event.button){
            if (this.isDown && this.release) this.release();
            this.isDown = false;
            this.isUp = true;
            
            event.preventDefault();
        }
    }

    //The `moveHandler`
    private moveHandler(event: MouseEvent) {
        if(this.move) this.move(event);

        this.x = event.clientX;
        this.y = event.clientY;
    }

    private move(event: MouseEvent) {
        this.moveEvents.forEach((move) => {
            move(event.clientX, event.clientX);
        });
    }

    private press() {
        this.pressEvents.forEach((press) => {
            press();
        });
    }

    private release() {
        this.releaseEvents.forEach((press) => {
            press();
        });
    }
}

export interface OnMove {
    (x: number, y: number): void;
}