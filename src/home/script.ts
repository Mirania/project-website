import { EffectComposer } from "../global/three/examples/jsm/postprocessing/EffectComposer.js";
import { GlitchPass } from "../global/three/examples/jsm/postprocessing/GlitchPass.js";
import { RenderPass } from "../global/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../global/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as THREE from "../global/three/src/Three.js";

let homeCanvas: HTMLCanvasElement;
let fadeRoutine: NodeJS.Timeout;

homeInit();

function homeInit(): void {
    const aspect = window.innerWidth / window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 1, 1000);
    const loader = new THREE.TextureLoader();
    const renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.65);
    scene.add(light);

    const earth = createEarth(loader);
    const clouds = createEarthClouds();  
    earth.add(clouds);
    scene.add(earth);

    earth.position.set(0, -4.3, 0);
    earth.rotateY(radians(15));
    earth.rotateZ(radians(-20));

    homeCanvas = document.getElementsByTagName("canvas")[0];

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 0.2, 0.5, 0
    );
    composer.addPass(bloomPass);

    const glitchPass = new GlitchPass();
    composer.addPass(glitchPass);

    fadeObjectsIn(earth, clouds, 0.6);

    // each frame
    setInterval(() => {
        earth.rotateX(radians(0.025));
        clouds.rotateX(radians(0.035));
        composer.render();
    }, 1 / 30 * 1000);

    window.addEventListener('resize', () => onResize(camera, renderer, composer), false);
}

function onResize(camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, composer: EffectComposer) {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function adjustHomeCanvas(): void {
    homeCanvas.style.backgroundPosition = `50% ${50}%`;
}

function fadeObjectsIn(
    earth: THREE.Mesh<THREE.Geometry, THREE.Material>,
    clouds: THREE.Mesh<THREE.Geometry, THREE.Material>,
    cloudsTargetOpacity: number
): void {
    let fadeFrame = 0, fadeDuration = 15;
    fadeRoutine = setInterval(() => {
        if (fadeFrame <= fadeDuration) {
            earth.material.opacity = fadeFrame / fadeDuration;
            clouds.material.opacity = fadeFrame / fadeDuration * cloudsTargetOpacity;
            fadeFrame++;
        }
        if (fadeFrame === fadeDuration) clearInterval(fadeRoutine);
    }, 1 / 30 * 1000);
}

// adapted from https://github.com/jeromeetienne/threex.planets/
function createEarth(loader: THREE.TextureLoader): THREE.Mesh<THREE.Geometry, THREE.Material> {
    const geometry = new THREE.SphereGeometry(0.5* 7, 128, 128)
    const material = new THREE.MeshPhongMaterial({
        map: loader.load("/assets/map.jpg"),
        bumpMap: loader.load("/assets/bump.jpg"),
        bumpScale: 0.05,
        specularMap: loader.load("/assets/spec.jpg"),
        specular: new THREE.Color('grey'),
        transparent: true,
        opacity: 0
    })
    return new THREE.Mesh(geometry, material);
}

// adapted from https://github.com/jeromeetienne/threex.planets/
function createEarthClouds(): THREE.Mesh<THREE.Geometry, THREE.Material> {
    // create destination canvas
    const canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
    const contextResult = canvasResult.getContext('2d');

    // load earthcloudmap
    const imageMap = new Image();
    imageMap.addEventListener("load", function () {

        // create dataMap ImageData for earthcloudmap
        const canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        const contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        const imageTrans = new Image();
        imageTrans.addEventListener("load", function () {
            // create dataTrans ImageData for earthcloudmaptrans
            const canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            const contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            const dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for (let y = 0, offset = 0; y < imageMap.height; y++) {
                for (let x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0);
            material.map.needsUpdate = true;
        })
        imageTrans.src = "assets/clouds_t.jpg";
    }, false);
    imageMap.src = "assets/clouds.jpg";

    const geometry = new THREE.SphereGeometry(0.505*7, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
    });
    return new THREE.Mesh(geometry, material);
}