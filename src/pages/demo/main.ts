declare var THREE: typeof import("three");

let player: Player;
let stage: Stage;
let canvas: HTMLCanvasElement;
let chatbox: Chatbox;

init();

function init(): void {
	const aspect = window.innerWidth / window.innerHeight;
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 1, 1000);
	const loader = new THREE.TextureLoader();
	const renderer = new THREE.WebGLRenderer({
		alpha: true
	});

	camera.position.set(5, 5, 5);
	camera.lookAt(scene.position);

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const platformMaterial = new THREE.MeshBasicMaterial({
		map: loader.load("/demo/assets/glass.jpg"),
		transparent: true,
		opacity: 0.66
	});

	const goalMaterial = new THREE.MeshBasicMaterial({
		map: loader.load("/demo/assets/goal.jpg")
	});

	const playerGeometry = new THREE.IcosahedronGeometry(2);
	const playerMaterial = new THREE.MeshBasicMaterial({
		map: loader.load("/demo/assets/glass.jpg"),
		transparent: true
	});

	player = new Player(new THREE.Mesh(playerGeometry, playerMaterial));
	player.model.scale.set(0.1, 0.1, 0.1);
	scene.add(player.model);

	stage = new DemoStage(camera, scene, platformMaterial, goalMaterial);
	stage.reset(player);

	const animate = () => {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	};

	animate();
	window.addEventListener('resize', () => onWindowResize(renderer, camera), false);
	canvas = document.getElementsByTagName("canvas")[0];
	chatbox = new Chatbox(document.getElementsByClassName("chatbox")[0], 70);
	setInterval(frame, 1 / 60 * 1000);
}

// directional light is a thing - better than gradient texture

function onWindowResize(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera) {
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Applies all user inputs given in the current frame.
 */
function applyInputs(player: Player): void {
	if (keymap[Key.Left] && keymap[Key.Up])
		snapToAngle(180);
	else if (keymap[Key.Left] && keymap[Key.Down])
		snapToAngle(270);
	else if (keymap[Key.Right] && keymap[Key.Up])
		snapToAngle(90);
	else if (keymap[Key.Right] && keymap[Key.Down])
		snapToAngle(0);
	else if (keymap[Key.Left])
		snapToAngle(225);
	else if (keymap[Key.Up])
		snapToAngle(135);
	else if (keymap[Key.Right])
		snapToAngle(45);
	else if (keymap[Key.Down])
		snapToAngle(315);

	if (anyMovementInput()) player.speed += 0.001;
}

/**
 * Modifies the player's velocity based on the angle of the platform being collided with.
 */
function handleRampVelocity(collision: Collision): THREE.Vector3 {
	if (collision.angle === 0) 
		return player.velocity;
	if (collision.axis === Axis.Z)
		return player.velocity.applyAxisAngle(axisX, radians(collision.angle));
	if (collision.axis === Axis.X)
		return player.velocity.applyAxisAngle(axisZ, radians(-collision.angle));
}

/**
 * Modifies the player's velocity based on momentum acquired from ramps.
 */
function applyMomentum(velocity: THREE.Vector3, collision: Collision): void {
	const rads = radians(collision.collided ? collision.angle : 0);
	const negX = isMovingTowardsNegativeX(player);
	const negZ = isMovingTowardsNegativeZ(player);

	if (collision.axis === Axis.Z) {
		player.momentumZ = negZ ? 0.005 : player.momentumZ + 0.0015; 
	} else if (collision.axis === Axis.X) {
		player.momentumX = negX ? 0.005 : player.momentumX + 0.0015; 
	} else {
		player.momentumZ = negZ ? player.momentumZ - 0.002 : player.momentumZ - 0.0005;
		player.momentumX = negX ? player.momentumX - 0.002 : player.momentumX - 0.0005;
	}

	const momentumZ = new THREE.Vector3(0, 0, player.momentumZ).applyAxisAngle(axisX, rads);
	velocity.y += momentumZ.y, velocity.z += momentumZ.z;
	const momentumX = new THREE.Vector3(player.momentumX, 0, 0).applyAxisAngle(axisZ, -rads);
	velocity.y += momentumX.y, velocity.x += momentumX.x;
}

/**
 * Checks whether the player is colliding with a platform in the current frame.
 */
function detectCollisions(player: Player, stage: Stage): Collision {
	const ray0 = new THREE.Raycaster(player.model.position, negAxisY, 0, 0.25);
	const ray30AxisZ = new THREE.Raycaster(player.model.position, neg30AxisZ, 0, 0.25);
	const ray30AxisX = new THREE.Raycaster(player.model.position, neg30AxisX, 0, 0.25);

	const dict: { [angle: number]: { [axis: number]: THREE.Raycaster } } = {
		30: { [Axis.X]: ray30AxisX, [Axis.Z]: ray30AxisZ }
	};

	for (let i = 0; i < stage.platforms.length; i++) {
		const platform = stage.platforms[i];
		let ray = platform.angle === 0 ? ray0 : dict[platform.angle][platform.axis];
		let collisionResults = ray.intersectObject(platform.p);
		if (collisionResults.length > 0) {
			if (collisionResults[0].distance <= 0.2) player.model.position.y += 0.025;
			return { collided: true, angle: platform.angle, axis: platform.axis, trigger: platform.trigger };
		}
	}

	return { collided: false };
}

/**
 * Calculates one frame worth of movement where it attempts to follow the target direction.
 */
function snapToAngle(targetAngle: number): void {
	const opposite = (targetAngle + 180) % 360;
	const turnRate = player.speed <= 0.015 ? 8 : player.speed <= 0.025 ? 6 : 4;

	if (player.speed <= 0.01 || isEquivalentAngle(player.angle, targetAngle, 1.25)) 
		player.angle = targetAngle;
	else if (targetAngle >= 180 && player.angle > opposite && player.angle < targetAngle) 
		player.angle += turnRate;
	else if (targetAngle < 180 && (player.angle > opposite || player.angle < targetAngle)) 
		player.angle += turnRate;
	else
		player.angle -= turnRate;
    }

/**
 * Performs one frame worth of movement based on current velocity.
 */
function movePlayer(adjustedVelocity: THREE.Vector3): void {
	player.model.position.x += adjustedVelocity.x;
	player.model.position.y += adjustedVelocity.y;
	player.model.position.z += adjustedVelocity.z;

	player.model.rotation.x += 10 * adjustedVelocity.z;
	player.model.rotation.z -= 10 * adjustedVelocity.x;
} let y = 50;

function adjustCanvas(): void {
	canvas.style.backgroundPosition = `${50-player.position.z}% ${50+player.position.y}%`;
}

/**
 * Handles player physics calculations and the user interface.
 */
function frame(): void {
	if (keymap[Key.Space]) {
		stage.reset(player);
		chatbox.hideImmediately();
		return;
	}

	// get user inputs
	applyInputs(player);

	// calculate velocity
	const collision = detectCollisions(player, stage);
	let velocity: THREE.Vector3;

	if (collision.collided) {
		player.fallSpeed = 0;
		player.fallingDuration = 0;
		velocity = handleRampVelocity(collision);
		if (collision.trigger) {
			const message = collision.trigger.message;
			chatbox.show(typeof message === "function" ? message(stage) : message);
		} else {
			chatbox.hide();
		}
	} else {
		player.fallSpeed += 0.002;
		player.fallingDuration++;
		if (player.fallingDuration > 120 && !player.isFading) {
			player.fadeOut(); 
		}
		if (player.fallingDuration > 170) {
			stage.reset(player);
			chatbox.hideImmediately();
			return;
		}
		velocity = player.velocity;
		chatbox.hide();
	}

	// appply ramp momentum
	applyMomentum(velocity, collision);

	// apply velocity
	movePlayer(velocity);
	
	// make camera and canvas follow movement
	stage.focusCamera(player);
	adjustCanvas();
	
	// inertia
	if (collision.collided) player.speed -= 0.0005;
}