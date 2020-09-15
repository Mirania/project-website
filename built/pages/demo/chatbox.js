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
var _div, _opacity, _targetOpacity, _activeRoutine;
class Chatbox {
    constructor(div, targetOpacity) {
        _div.set(this, void 0);
        _opacity.set(this, void 0);
        _targetOpacity.set(this, void 0);
        _activeRoutine.set(this, void 0);
        __classPrivateFieldSet(this, _div, div);
        __classPrivateFieldSet(this, _opacity, 0);
        __classPrivateFieldGet(this, _div).style.opacity = "0%";
        __classPrivateFieldSet(this, _targetOpacity, targetOpacity);
        this.isActive = false;
    }
    show(text) {
        if (this.isActive)
            return;
        this.isActive = true;
        __classPrivateFieldGet(this, _div).innerHTML = text;
        if (__classPrivateFieldGet(this, _activeRoutine) !== undefined)
            clearInterval(__classPrivateFieldGet(this, _activeRoutine));
        __classPrivateFieldSet(this, _activeRoutine, setInterval(() => {
            if (__classPrivateFieldGet(this, _opacity) < __classPrivateFieldGet(this, _targetOpacity)) {
                __classPrivateFieldSet(this, _opacity, __classPrivateFieldGet(this, _opacity) + 2);
                __classPrivateFieldGet(this, _div).style.opacity = `${__classPrivateFieldGet(this, _opacity)}%`;
            }
            else {
                clearInterval(__classPrivateFieldGet(this, _activeRoutine));
                __classPrivateFieldSet(this, _activeRoutine, undefined);
            }
        }, 1 / 60 * 1000));
    }
    hide() {
        if (!this.isActive)
            return;
        this.isActive = false;
        if (__classPrivateFieldGet(this, _activeRoutine) !== undefined)
            clearInterval(__classPrivateFieldGet(this, _activeRoutine));
        __classPrivateFieldSet(this, _activeRoutine, setInterval(() => {
            if (__classPrivateFieldGet(this, _opacity) > 0) {
                __classPrivateFieldSet(this, _opacity, __classPrivateFieldGet(this, _opacity) - 2);
                __classPrivateFieldGet(this, _div).style.opacity = `${__classPrivateFieldGet(this, _opacity)}%`;
            }
            else {
                clearInterval(__classPrivateFieldGet(this, _activeRoutine));
                __classPrivateFieldSet(this, _activeRoutine, undefined);
            }
        }, 1 / 60 * 1000));
    }
    hideImmediately() {
        if (!this.isActive)
            return;
        if (__classPrivateFieldGet(this, _activeRoutine) !== undefined) {
            clearInterval(__classPrivateFieldGet(this, _activeRoutine));
            __classPrivateFieldSet(this, _activeRoutine, undefined);
        }
        this.isActive = false;
        __classPrivateFieldSet(this, _opacity, 0);
        __classPrivateFieldGet(this, _div).style.opacity = "0%";
    }
}
_div = new WeakMap(), _opacity = new WeakMap(), _targetOpacity = new WeakMap(), _activeRoutine = new WeakMap();
