import { EffectComposer } from "../global/three/examples/jsm/postprocessing/EffectComposer.js";
import { GlitchPass } from "../global/three/examples/jsm/postprocessing/GlitchPass.js";
import { RenderPass } from "../global/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../global/three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "../global/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "../global/three/examples/jsm/shaders/FXAAShader.js";
import * as THREE from "../global/three/src/Three.js";
let homeCanvas;
let fadeRoutine;
let curtainRoutine;
let progressRoutine;
let bloomStrength;
let bloomIncreasing;
let bgSlider;
let loadingProgress;
let curtain;
let progressBarContainer;
let progressBar;
let earth;
let clouds;
let cloudsTargetOpacity;
homeInit();
function homeInit() {
    const aspect = window.innerWidth / window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1 * aspect, 1 * aspect, 1, -1, 1, 1000);
    const loader = new THREE.TextureLoader();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);
    renderer.setPixelRatio(getAdjustedPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    bgSlider = 0, loadingProgress = 25;
    homeCanvas = document.getElementsByTagName("canvas")[0];
    curtain = document.getElementById("curtain");
    progressBarContainer = document.getElementById("progress-container");
    progressBar = document.getElementById("progress");
    adjustProgressBar();
    const light = new THREE.DirectionalLight(0xffffff, 0.65);
    scene.add(light);
    earth = createEarth(loader);
    loadingProgress = 60;
    clouds = createEarthClouds();
    loadingProgress = 80;
    cloudsTargetOpacity = 0.5;
    earth.add(clouds);
    scene.add(earth);
    earth.position.set(0, -4.3, 0);
    earth.rotateY(radians(15));
    earth.rotateZ(radians(-20));
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    loadingProgress = 85;
    bloomStrength = 0.2, bloomIncreasing = true;
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomStrength, 0.75, 0);
    composer.addPass(bloomPass);
    loadingProgress = 90;
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (homeCanvas.offsetWidth);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (homeCanvas.offsetHeight);
    composer.addPass(fxaaPass);
    loadingProgress = 95;
    const glitchPass = new GlitchPass();
    composer.addPass(glitchPass);
    loadingProgress = 100;
    //liftCurtain(earth, clouds, 0.4);
    //fadeObjectsIn(earth, clouds, 0.4);
    // each frame, at 30 fps
    setInterval(() => {
        earth.rotateX(radians(0.025));
        clouds.rotateX(radians(0.045));
        adjustBloomStrength(bloomPass);
        adjustHomeCanvas();
        composer.render();
    }, 1 / 30 * 1000);
    window.addEventListener('resize', () => onResize(camera, renderer, composer), false);
}
function onResize(camera, renderer, composer) {
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(getAdjustedPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
function getAdjustedPixelRatio() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixels = width * height;
    if (pixels <= 360 * 720)
        return 0.75;
    if (pixels <= 768 * 1024)
        return 0.9;
    if (pixels <= 1500 * 1000)
        return 1;
    if (pixels <= 2000 * 1100)
        return 1;
    if (pixels <= 3000 * 2000)
        return 0.8;
    if (pixels <= 4000 * 3000)
        return 0.65;
    return 0.5;
}
function adjustBloomStrength(bloomPass) {
    if (bloomStrength >= 0.3)
        bloomIncreasing = false;
    else if (bloomStrength <= 0.2)
        bloomIncreasing = true;
    bloomStrength = bloomIncreasing ? bloomStrength + 0.00025 : bloomStrength - 0.00025;
    bloomPass.strength = bloomStrength;
}
function adjustHomeCanvas() {
    bgSlider = window.innerHeight > 1000 ? bgSlider - 0.3 : bgSlider + 0.15;
    homeCanvas.style.backgroundPosition = `50% ${bgSlider}%`;
}
function adjustProgressBar() {
    let current = 15;
    progressRoutine = setInterval(() => {
        if (current <= 100) {
            if (current <= loadingProgress) {
                progressBar.style.width = `${current++}%`;
            }
        }
        else {
            progressBarContainer.style.visibility = "hidden";
            liftCurtain();
            clearInterval(progressRoutine);
        }
    }, 1 / 60 * 1000);
}
function liftCurtain() {
    let fadeFrame = 0, fadeDuration = 15;
    earth.material.opacity = 1;
    clouds.material.opacity = cloudsTargetOpacity;
    curtainRoutine = setInterval(() => {
        if (fadeFrame <= fadeDuration) {
            curtain.style.opacity = (1 - fadeFrame / fadeDuration).toString();
            fadeFrame++;
        }
        if (fadeFrame === fadeDuration) {
            curtain.style.visibility = "hidden";
            clearInterval(curtainRoutine);
        }
    }, 1 / 30 * 1000);
}
// unused
function fadeObjectsIn() {
    let fadeFrame = 0, fadeDuration = 15;
    fadeRoutine = setInterval(() => {
        if (fadeFrame <= fadeDuration) {
            earth.material.opacity = fadeFrame / fadeDuration;
            clouds.material.opacity = fadeFrame / fadeDuration * cloudsTargetOpacity;
            fadeFrame++;
        }
        if (fadeFrame === fadeDuration)
            clearInterval(fadeRoutine);
    }, 1 / 30 * 1000);
}
// adapted from https://github.com/jeromeetienne/threex.planets/
function createEarth(loader) {
    const geometry = new THREE.SphereGeometry(0.5 * 7, 128, 128);
    const material = new THREE.MeshPhongMaterial({
        map: loader.load("/assets/map.jpg"),
        bumpMap: loader.load("/assets/bump.jpg"),
        bumpScale: 0.05,
        specularMap: loader.load("/assets/spec.jpg"),
        specular: new THREE.Color('grey'),
        transparent: true,
        opacity: 0
    });
    return new THREE.Mesh(geometry, material);
}
// adapted from https://github.com/jeromeetienne/threex.planets/
function createEarthClouds() {
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
        });
        imageTrans.src = "assets/clouds_t.jpg";
    }, false);
    imageMap.src = "assets/clouds.jpg";
    const geometry = new THREE.SphereGeometry(0.505 * 7, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
    });
    return new THREE.Mesh(geometry, material);
}
