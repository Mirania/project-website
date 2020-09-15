var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
    Axis[Axis["Z"] = 2] = "Z";
})(Axis || (Axis = {}));
var Key;
(function (Key) {
    Key[Key["Up"] = 38] = "Up";
    Key[Key["Down"] = 40] = "Down";
    Key[Key["Left"] = 37] = "Left";
    Key[Key["Right"] = 39] = "Right";
    Key[Key["Space"] = 32] = "Space";
})(Key || (Key = {}));
var TriggerType;
(function (TriggerType) {
    TriggerType[TriggerType["Chat"] = 0] = "Chat";
    TriggerType[TriggerType["Goal"] = 1] = "Goal";
})(TriggerType || (TriggerType = {}));
class PrismGeometry extends THREE.ExtrudeGeometry {
    constructor(vertices, height) {
        super(new THREE.Shape(vertices), { depth: height, bevelEnabled: false });
    }
}
const keymap = { [Key.Up]: false, [Key.Down]: false, [Key.Left]: false, [Key.Right]: false, [Key.Space]: false };
function onKeyDown(event) {
    const key = window.event ? event.keyCode : event.which;
    if (keymap[key] === undefined)
        return;
    keymap[key] = true;
}
function onKeyUp(event) {
    const key = window.event ? event.keyCode : event.which;
    if (keymap[key] === undefined)
        return;
    keymap[key] = false;
}
function anyMovementInput() {
    for (const key in keymap) {
        if (key !== Key.Space.toString() && keymap[key])
            return true;
    }
    return false;
}
function limit(min, value, max) {
    return value < min ? min : value > max ? max : value;
}
const radians = (angle) => angle * Math.PI / 180;
// ex: 719 <=> -1
function isEquivalentAngle(angle, targetAngle, delta = 0.01) {
    const normalizedAngle = angle < 0 ? 360 + (angle % 360) : angle % 360;
    const normalizedTarget = targetAngle < 0 ? 360 + (targetAngle % 360) : targetAngle % 360;
    return normalizedAngle >= normalizedTarget - delta && normalizedAngle <= normalizedTarget + delta;
}
// ex: 315 vs 0 -> 45
function angleDifference(angle1, angle2) {
    const rawDiff = Math.abs(angle1 - angle2);
    return rawDiff > 180 ? 360 - rawDiff : rawDiff;
}
function isMovingTowardsNegativeX(player) {
    return player.angle > 90 && player.angle < 270 && ((keymap[Key.Up] && keymap[Key.Left]) ||
        keymap[Key.Up] ||
        keymap[Key.Left]);
}
function isMovingTowardsNegativeZ(player) {
    return player.angle > 0 && player.angle < 180 && ((keymap[Key.Up] && keymap[Key.Right]) ||
        keymap[Key.Up] ||
        keymap[Key.Right]);
}
function timeDifference(initialTime) {
    return (new Date().getTime() - initialTime) / 1000;
}
function highlight(text) {
    return `<span style="color: grey">${text}</span>`;
}
const axisX = new THREE.Vector3(1, 0, 0);
const axisY = new THREE.Vector3(0, 1, 0);
const axisZ = new THREE.Vector3(0, 0, 1);
const negAxisY = new THREE.Vector3(0, -1, 0);
const neg30AxisZ = new THREE.Vector3(0, -Math.cos(radians(30)), Math.sin(radians(30)));
const neg30AxisX = new THREE.Vector3(Math.sin(radians(30)), -Math.cos(radians(30)), 0);
