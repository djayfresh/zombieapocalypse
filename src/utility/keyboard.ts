export class Keyboard {
    static BoundKeys: number[] = [];

    code: number;
    isDown: boolean = false;
    isUp: boolean = true;

    private onPress: Function[] = [];
    private onRelease: Function[] = [];

    constructor(keyCode: number){
        this.code = keyCode;
        
        //Attach event listeners
        window.addEventListener("keydown", this.downHandler.bind(this), false);
        window.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    onClick(onPress: Function, onRelease: Function){
        this.onPress.push(onPress);
        this.onRelease.push(onRelease);
    }

    private press() {
        this.onPress.forEach((press) => {
            press();
        });
    }

    private release() {
        this.onRelease.forEach((release) => {
            release();
        });
    }

    //The `downHandler`
    private downHandler(event) {
        if (event.keyCode === this.code) {
            if (this.isUp && this.press) 
                this.press();
            
            this.isDown = true;
            this.isUp = false;
        }

        if(Keyboard.BoundKeys.filter(k => k == event.keyCode).length != 0){
            event.preventDefault();
        }
    };
    
      //The `upHandler`
    private upHandler (event) {
        if (event.keyCode === this.code) {
            if (this.isDown && this.release) 
                this.release();

            this.isDown = false;
            this.isUp = true;
        }
        if(Keyboard.BoundKeys.filter(k => k == event.keyCode).length != 0){
            event.preventDefault();
        }
    };
}