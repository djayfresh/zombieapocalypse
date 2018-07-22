
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

        if(parent1){
            centerX1 += parent1.x;
            centerY1 += parent1.y;
        }

        if(parent2){
            centerX2 += parent2.x;
            centerY2 += parent2.y;
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
}