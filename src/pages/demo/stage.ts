abstract class Stage {
    #startPosition: THREE.Vector3;
    #camera: THREE.Camera;
    #scene: THREE.Scene;
    #platformMaterial: THREE.Material;
    #goalMaterial: THREE.Material;
    startingTime: number;
    platforms: { p: THREE.Mesh<THREE.Geometry, THREE.Material>, angle: number, axis?: Axis, trigger?: Trigger }[] = [];
    medals: { gold: number, silver: number, bronze: number };

    constructor(camera: THREE.Camera, scene: THREE.Scene, platform: THREE.Material, goal: THREE.Material) {
        this.#camera = camera;
        this.#scene = scene;
        this.#platformMaterial = platform;
        this.#goalMaterial = goal;
        this.#startPosition = this.startingPosition();
        this.medals = this.timeTrials();
        this.build();
        this.platforms.sort((a, b) => a.angle - b.angle);
    }

    focusCamera(player: Player): void {
        this.#camera.position.x = 50 + player.model.position.x;
        this.#camera.position.y = 50 + player.model.position.y;
        this.#camera.position.z = 50 + player.model.position.z;
    }

    reset(player: Player): void {
        player.model.position.x = this.#startPosition.x;
        player.model.position.y = this.#startPosition.y;
        player.model.position.z = this.#startPosition.z;
        player.speed = 0;
        player.fallSpeed = 0;
        player.fallingDuration = 0;
        player.momentumX = 0;
        player.momentumZ = 0;
        player.fadeIn();
        this.focusCamera(player);
        this.startingTime = new Date().getTime();
    }

    /**
     * The starting position, which is also used for respawns.
     */
    abstract startingPosition(): THREE.Vector3;

    /**
     * The times to beat for gold/silver/bronze medals, in seconds.
     */
    abstract timeTrials(): { gold: number, silver: number, bronze: number };

    /**
     * Spawns platforms in the stage.
     */
    abstract build(): void;

    /**
     * A simple platform with no inclination.
     */
    spawnPlatform(from: Point, to: Point, y: number, trigger?: Trigger): void {
        const xdiff = Math.abs(from.x - to.x), zdiff = Math.abs(from.z - to.z);

        const p = new THREE.Mesh(
            new THREE.BoxGeometry(xdiff, 0.1, zdiff), 
            trigger?.type === TriggerType.Goal ? this.#goalMaterial : this.#platformMaterial
        );
        p.position.x = (from.x + to.x) / 2, p.position.y = y, p.position.z = (from.z + to.z) / 2;
        this.platforms.push({ p, angle: 0, trigger }), this.#scene.add(p);
    }

    /**
     * A south-west facing ramp with 30º inclination. It drops towards positive Z.
     * @returns Y value of the ramp's bottom, if `top` was provided; Y value of the ramp's top otherwise.
     */
    spawnRampZ(from: Point, to: Point, y: { top: number } | { bottom: number }): number {
        const xdiff = Math.abs(from.x - to.x), zdiff = Math.abs(from.z - to.z), rads = radians(30);
        const yref = "top" in y ? y.top : y.bottom, isTopY = "top" in y;
        const length = zdiff / Math.cos(rads), h = length / 2;

        // visible platform
        const p = new THREE.Mesh(new THREE.BoxGeometry(xdiff, 0.1, length), this.#platformMaterial);
        p.position.x = (from.x + to.x) / 2, p.position.z = Math.min(from.z, to.z) + h * Math.cos(rads);
        p.position.y = isTopY ? yref - h * Math.sin(rads) : yref + h * Math.sin(rads);
        p.rotateX(rads);

        // platform hitbox
        const pInvis = new THREE.Mesh(new THREE.BoxGeometry(xdiff, 0.1, length + 0.3), this.#platformMaterial);
        pInvis.position.x = p.position.x, pInvis.position.y = p.position.y, pInvis.position.z = p.position.z;
        pInvis.rotateX(rads);
        pInvis.visible = false;

        this.platforms.push({ p: pInvis, angle: 30, axis: Axis.Z }), this.#scene.add(p, pInvis);
        return isTopY ? p.position.y - (yref - p.position.y) : p.position.y + (p.position.y - yref);
    }

    /**
     * A south-east facing ramp with 30º inclination. It drops towards positive X.
     * @returns Y value of the ramp's bottom, if `top` was provided; Y value of the ramp's top otherwise.
     */
    spawnRampX(from: Point, to: Point, y: { top: number } | { bottom: number }): number {
        const xdiff = Math.abs(from.x - to.x), zdiff = Math.abs(from.z - to.z), rads = radians(30);
        const yref = "top" in y ? y.top : y.bottom, isTopY = "top" in y;
        const length = xdiff / Math.cos(rads), h = length / 2;

        // visible platform
        const p = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, zdiff), this.#platformMaterial);
        p.position.x = Math.min(from.x, to.x) + h * Math.cos(rads), p.position.z = (from.z + to.z) / 2;
        p.position.y = isTopY ? yref - h * Math.sin(rads) : yref + h * Math.sin(rads);
        p.rotateZ(-rads);

        // platform hitbox
        const pInvis = new THREE.Mesh(new THREE.BoxGeometry(length + 0.3, 0.1, zdiff), this.#platformMaterial);
        pInvis.position.x = p.position.x, pInvis.position.y = p.position.y, pInvis.position.z = p.position.z;
        pInvis.rotateZ(-rads);
        pInvis.visible = false;

        this.platforms.push({ p: pInvis, angle: 30, axis: Axis.X }), this.#scene.add(p, pInvis);
        return isTopY ? p.position.y - (yref - p.position.y) : p.position.y + (p.position.y - yref);
    }

    /**
     * A triangle platform (triangular prism).
     */
    spawnTriangle(p1: Point, p2: Point, p3: Point, y: number): void {
        const geometry = new PrismGeometry([
            new THREE.Vector2(p1.x, -p1.z),
            new THREE.Vector2(p2.x, -p2.z),
            new THREE.Vector2(p3.x, -p3.z)
        ], 0.08);

        const p = new THREE.Mesh(geometry, this.#platformMaterial);
        p.position.y = y;
        p.rotateX(radians(270));

        this.platforms.push({ p, angle: 0 }), this.#scene.add(p);
    }
}

class DemoStage extends Stage {
    startingPosition(): THREE.Vector3 {
        return new THREE.Vector3(0, 4, 0);
    }

    timeTrials(): { gold: number, silver: number, bronze: number } {
        return {
            gold: 9.5,
            silver: 12,
            bronze: 17
        }
    }

    build(): void {
        let yref: number, divergeref: number, mergeref: number;

        const t1 = { type: TriggerType.Chat, message: `Welcome! Use the ${highlight("arrow keys")} to move.` };
        const t2 = { type: TriggerType.Chat, message: `Press ${highlight("Space")} if you want to restart the level.`};
        const t3 = { type: TriggerType.Chat, message: `Your performance will be graded at the end of the level.`};
        const t4 = { type: TriggerType.Chat, message: `There are some shortcuts you can take.`};
        const g = { type: TriggerType.Goal, message: (stage: Stage) => {
            const time = timeDifference(stage.startingTime);
            let text = `Good job! You took ${time.toFixed(3)} seconds. `;
            if (time <= stage.medals.gold) text += "(Gold medal)";
            else if (time <= stage.medals.silver) text += "(Silver medal)";
            else if (time <= stage.medals.bronze) text += "(Bronze medal)";
            return text;
        } };

        this.spawnPlatform({ x: -2, z: -2 }, { x: 2, z: 2 }, 0, t1);
        this.spawnPlatform({ x: -1, z: -2 }, { x: 1, z: -6 }, 0);
        this.spawnPlatform({ x: -1, z: -6 }, { x: 4, z: -8 }, 0, t2);
        this.spawnPlatform({ x: 4, z: -8 }, { x: 6, z: -4 }, 0);
        this.spawnTriangle({ x: 0.25, z: -8 }, { x: 1.25, z: -8 }, { x: 1.25, z: -9 }, 0);
        this.spawnPlatform({ x: 1.25, z: -8 }, { x: 3.25, z: -9 }, 0);
        this.spawnTriangle({ x: 3.25, z: -9 }, { x: 3.25, z: -8 }, { x: 4.25, z: -8 }, 0);
        yref = this.spawnRampZ({ x: 6, z: 0 }, { x: 4, z: -4 }, { top: 0 });
        this.spawnPlatform({ x: 4, z: 0 }, { x: 6, z: 4 }, yref, t3);
        this.spawnTriangle({ x: 4, z: 6 }, { x: 4, z: 4 }, { x: 6, z: 4 }, yref);
        this.spawnPlatform({ x: 0, z: 4 }, { x: 4, z: 6 }, yref);
        yref = this.spawnRampX({ x: 0, z: 4 }, { x: -2, z: 6 }, { bottom: yref });
        this.spawnPlatform({ x: -2, z: 4 }, { x: -4, z: 6 }, yref, t4);
        divergeref = this.spawnRampZ({ x: -2, z: 6 }, { x: -4, z: 9 }, { top: yref });
        this.spawnPlatform({ x: -6, z: 9 }, { x: 0, z: 11 }, divergeref);
        this.spawnTriangle({ x: -8, z: 11 }, { x: -6, z: 11 }, { x: -6, z: 9 }, divergeref);
        this.spawnTriangle({ x: 0, z: 11 }, { x: 2, z: 11 }, { x: 0, z: 9 }, divergeref);

        // left path
        yref = this.spawnRampZ({ x: -8, z: 11 }, { x: -6, z: 13 }, { top: divergeref });
        this.spawnPlatform({ x: -8, z: 13 }, { x: -5, z: 14 }, yref);
        yref = this.spawnRampZ({ x: -6, z: 14 }, { x: -5, z: 14.5 }, { top: yref });
        this.spawnPlatform({ x: -7, z: 14.5 }, { x: -5, z: 15.5 }, yref);
        yref = this.spawnRampZ({ x: -7, z: 15.5 }, { x: -6, z: 16 }, { top: yref });
        this.spawnPlatform({ x: -7, z: 16 }, { x: -6, z: 17 }, yref);
        yref = this.spawnRampX({ x: -6, z: 16 }, { x: -4, z: 17 }, { top: yref });
        this.spawnTriangle({ x: -4, z: 17 }, { x: -4, z: 16 }, { x: -3, z: 17 }, yref);
        mergeref = this.spawnRampZ({ x: -4, z: 17 }, { x: -3, z: 21 }, { top: yref });

        // right path
        yref = this.spawnRampZ({ x: 0, z: 11 }, { x: 2, z: 13 }, { top: divergeref });
        this.spawnPlatform({ x: 0, z: 13 }, { x: -1.5, z: 14.5 }, yref);
        this.spawnPlatform({ x: 0, z: 14.5 }, { x: 1.5, z: 16 }, yref);
        this.spawnPlatform({ x: 1.5, z: 16 }, { x: 3, z: 17.5 }, yref);
        yref = this.spawnRampZ({ x: 1.5, z: 17.5 }, { x: 3, z: 19.5 }, { top: yref });

        // merged paths
        this.spawnPlatform({ x: -4, z: 21 }, { x: 4, z: 23 }, mergeref);
        this.spawnTriangle({ x: 4, z: 23 }, { x: 4, z: 21 }, { x: 6, z: 23 }, mergeref);
        yref = this.spawnRampZ({ x: -0.5, z: 23 }, { x: 1.5, z: 25 }, { top: mergeref });
        this.spawnPlatform({ x: -0.5, z: 25 }, { x: 1.5, z: 27 }, yref);
        this.spawnPlatform({ x: -1.5, z: 27 }, { x: 2.5, z: 29.5 }, yref, g);
    }    
}