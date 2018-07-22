
export class Vector2 {
    constructor(public x: number, public y: number) {

    }

    magSq(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    unitVector(): Vector2{
        let mag = this.magSq();
        let magSq = Math.sqrt(mag);

        let x = (this.x * magSq) / mag;
        let y = (this.y * magSq) / mag;

        return new Vector2(x, y);
    }

    static sub(x1, y1, x2, y2){
        return new Vector2((x1 - x2), (y1 - y2));
    }
    
    static subtract(v1: Vector2, v2: Vector2){
        return new Vector2((v1.x - v2.x), (v1.y - v2.y));
    }
}