import { Vector2 } from "./vector";

export enum CollisionLocation {
    top,
    bottom,
    left,
    right,
    none
}
export class CollisionDetection {
    static hitRectangle(r1, r2, parent1?, parent2?): CollisionLocation {
        let w = 0.5 * (r1.width + r2.width);
        let h = 0.5 * (r1.height + r2.height);

        let centerX1 = r1.x + r1.width / 2;
        let centerY1 = r1.y + r1.height / 2;
        let centerX2 = r2.x + r2.width / 2;
        let centerY2 = r2.y + r2.height / 2;

        var parentVector = CollisionDetection.parentVector(parent1);
        if(parentVector.x != 0 && parentVector.y != 0){
            console.log("Parent Vector1:", parentVector, "Parent", parent1);
            centerX1 += parentVector.x;
            centerY1 += parentVector.y;
        }

        var parentVector2 = CollisionDetection.parentVector(parent2);
        if(parentVector2.x != 0 && parentVector2.y != 0){
            console.log("Parent Vector2:", parentVector2, "Parent", parent2);
            centerX2 += parentVector2.x;
            centerY2 += parentVector2.y;
        }

        let dx = centerX1 - centerX2;
        let dy = centerY1 - centerY2;

        let hit = CollisionLocation.none;
        //console.log("Test", dx, dy, w, h, "Assets", r1.x, r1.y, r2.x, r2.y);

        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            /* collision! */
            let wy = w * dy;
            let hx = h * dx;

            if (wy > hx) {
                if (wy > -hx)
                    /* collision at the top */
                    hit = CollisionLocation.top;
                else
                    /* on the left */
                    hit = CollisionLocation.left;
            }
            else {
                if (wy > -hx)
                    /* on the right */
                    hit = CollisionLocation.right;
                else
                    /* at the bottom */
                    hit = CollisionLocation.bottom;
            }
        }

        // if(hit != CollisionLocation.none){
        //     console.log("Collision", dx, dy, "hit", hit, "depth", w, h);
        // }
        return hit;
    }

    private static parentVector(parent){
        if(parent && parent.x && parent.y){
            return Vector2.add(new Vector2(parent.x, parent.y), this.parentVector(parent.parent));
        }
        return new Vector2(0,0);
    }
}