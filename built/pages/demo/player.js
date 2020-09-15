var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _directionAngle, _movementSpeed, _fallSpeed, _momentumX, _momentumZ, _opacity, _activeRoutine;
class Player {
    constructor(mesh) {
        _directionAngle.set(this, 0);
        _movementSpeed.set(this, 0);
        _fallSpeed.set(this, 0);
        this.fallingDuration = 0;
        _momentumX.set(this, 0);
        _momentumZ.set(this, 0);
        _opacity.set(this, void 0);
        _activeRoutine.set(this, void 0);
        this.model = mesh;
        this.isFading = false;
        __classPrivateFieldSet(this, _opacity, 0);
        this.model.material.opacity = 0;
    }
    fadeIn() {
        if (__classPrivateFieldGet(this, _activeRoutine) !== undefined)
            clearInterval(__classPrivateFieldGet(this, _activeRoutine));
        this.isFading = true;
        __classPrivateFieldSet(this, _activeRoutine, setInterval(() => {
            if (__classPrivateFieldGet(this, _opacity) < 1) {
                __classPrivateFieldSet(this, _opacity, __classPrivateFieldGet(this, _opacity) + 0.02);
                this.model.material.opacity += 0.02;
            }
            else {
                clearInterval(__classPrivateFieldGet(this, _activeRoutine));
                __classPrivateFieldSet(this, _activeRoutine, undefined);
                this.isFading = false;
            }
        }, 1 / 60 * 1000));
    }
    fadeOut() {
        if (__classPrivateFieldGet(this, _activeRoutine) !== undefined)
            clearInterval(__classPrivateFieldGet(this, _activeRoutine));
        this.isFading = true;
        __classPrivateFieldSet(this, _activeRoutine, setInterval(() => {
            if (__classPrivateFieldGet(this, _opacity) > 0) {
                __classPrivateFieldSet(this, _opacity, __classPrivateFieldGet(this, _opacity) - 0.02);
                this.model.material.opacity -= 0.02;
            }
            else {
                clearInterval(__classPrivateFieldGet(this, _activeRoutine));
                __classPrivateFieldSet(this, _activeRoutine, undefined);
                this.isFading = false;
            }
        }, 1 / 60 * 1000));
    }
    set angle(value) {
        const normalized = value % 360;
        __classPrivateFieldSet(this, _directionAngle, normalized < 0 ? 360 + normalized : normalized);
    }
    get angle() {
        return __classPrivateFieldGet(this, _directionAngle);
    }
    set speed(value) {
        __classPrivateFieldSet(this, _movementSpeed, limit(0, value, 0.05));
    }
    get speed() {
        return __classPrivateFieldGet(this, _movementSpeed);
    }
    set fallSpeed(value) {
        __classPrivateFieldSet(this, _fallSpeed, limit(-0.5, value, 0.5));
    }
    get fallSpeed() {
        return __classPrivateFieldGet(this, _fallSpeed);
    }
    set momentumX(value) {
        __classPrivateFieldSet(this, _momentumX, value < 0 ? 0 : value);
    }
    get momentumX() {
        return __classPrivateFieldGet(this, _momentumX);
    }
    set momentumZ(value) {
        __classPrivateFieldSet(this, _momentumZ, value < 0 ? 0 : value);
    }
    get momentumZ() {
        return __classPrivateFieldGet(this, _momentumZ);
    }
    /**
     * Calculates current velocity without considering collisions.
     */
    get velocity() {
        return new THREE.Vector3(this.speed, -this.fallSpeed, 0).applyAxisAngle(axisY, radians(this.angle));
    }
    get position() {
        return this.model.position;
    }
}
_directionAngle = new WeakMap(), _movementSpeed = new WeakMap(), _fallSpeed = new WeakMap(), _momentumX = new WeakMap(), _momentumZ = new WeakMap(), _opacity = new WeakMap(), _activeRoutine = new WeakMap();
