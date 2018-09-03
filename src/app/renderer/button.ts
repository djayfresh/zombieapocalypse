import { Graphics, Text, interaction } from "pixi.js";
import { Game } from "../game";
import { GameObject, AssetType } from "./game-object";
import { Observable, Subject, Observer } from "rxjs";


export class Button extends GameObject {
    button: Graphics;
    buttonText: Text;

    onClick: Observable<interaction.InteractionEvent>;
    private onClickSubject: Subject<interaction.InteractionEvent>;

    constructor(x: number, y: number, w: number, h: number, text: string) {
        super(0, new Graphics(), AssetType.Container);
        this.button = <Graphics>this.asset;

        this.onClick = Observable.create((observer: Observer<interaction.InteractionEvent>) => {
            this.onClickSubject = new Subject();
            this.onClickSubject.subscribe(observer);
        });
        
        this.button.beginFill(0xf2edb0);
        this.button.drawRect(0, 0, w, h);
        this.button.endFill();

        this.buttonText = new Text(text, { align: 'center' });
        this.buttonText.anchor.set(0.5, 0.5);
        this.button.addChild(this.buttonText);

        this.setPosition(x, y);

        this.button.interactive = true;
        this.button.addListener('mousedown', (event) => {
            this.onClickSubject.next(event);
        });
    }

    setPosition(x: number, y:number){

        this.button.x = x; //Game.center.x - (this.button.width * 2);
        this.button.y = y; //Game.center.y - (this.button.height/2);

        this.buttonText.x = this.button.width/2;
        this.buttonText.y = this.button.height/2;
    }
}