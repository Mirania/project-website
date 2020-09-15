class Player {
    #directionAngle = 0;
    #movementSpeed = 0;
    #fallSpeed = 0;
    fallingDuration = 0;
    #momentumX = 0;
    #momentumZ = 0;
    #opacity: number;
    #activeRoutine: NodeJS.Timeout;
    isFading: boolean;
    model: THREE.Mesh<THREE.Geometry, THREE.Material>;

    constructor(mesh: THREE.Mesh<THREE.Geometry, THREE.Material>) {
        this.model = mesh;
        this.isFading = false;
        this.#opacity = 0;
        this.model.material.opacity = 0;
    }

    fadeIn(): void {
        if (this.#activeRoutine !== undefined)
            clearInterval(this.#activeRoutine);

        this.isFading = true;

        this.#activeRoutine = setInterval(() => {
            if (this.#opacity < 1) {
                this.#opacity += 0.02;
                this.model.material.opacity += 0.02;
            } else {
                clearInterval(this.#activeRoutine);
                this.#activeRoutine = undefined;
                this.isFading = false;
            }
        }, 1 / 60 * 1000)
    }

    fadeOut(): void {
        if (this.#activeRoutine !== undefined)
            clearInterval(this.#activeRoutine);

        this.isFading = true;

        this.#activeRoutine = setInterval(() => {
            if (this.#opacity > 0) {
                this.#opacity -= 0.02;
                this.model.material.opacity -= 0.02;
            } else {
                clearInterval(this.#activeRoutine);
                this.#activeRoutine = undefined;
                this.isFading = false;
            }
        }, 1 / 60 * 1000)
    }

    set angle(value: number) {
        const normalized = value % 360;
        this.#directionAngle = normalized < 0 ? 360 + normalized : normalized;
    }

    get angle(): number {
        return this.#directionAngle;
    }

    set speed(value: number) {
        this.#movementSpeed = limit(0, value, 0.05);
    }

    get speed(): number {
        return this.#movementSpeed;
    }

    set fallSpeed(value: number) {
        this.#fallSpeed = limit(-0.5, value, 0.5);
    }

    get fallSpeed(): number {
        return this.#fallSpeed;
    }

    set momentumX(value: number) {
        this.#momentumX = value < 0 ? 0 : value;
    }

    get momentumX(): number {
        return this.#momentumX;
    }

    set momentumZ(value: number) {
        this.#momentumZ = value < 0 ? 0 : value;
    }

    get momentumZ(): number {
        return this.#momentumZ;
    }

    /**
     * Calculates current velocity without considering collisions.
     */
    get velocity(): THREE.Vector3 {
        return new THREE.Vector3(this.speed, -this.fallSpeed, 0).applyAxisAngle(axisY, radians(this.angle));
    }

    get position(): THREE.Vector3 {
        return this.model.position;
    }
}