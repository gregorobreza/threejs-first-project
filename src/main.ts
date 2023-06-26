import "./style.css";

import * as THREE from "three";
import { getRandomArbitrary } from "./utils/utils";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(
  window.innerWidth / 2,
  window.innerHeight / 2
);
const boxes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>[] = [];
const spheres: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>[] = [];

const xMovementConstant = getRandomArbitrary(0.001, 0.1).toFixed(2);
const yMovementConstant = getRandomArbitrary(0.001, 0.1).toFixed(2);
const zMovementConstant = parseFloat(getRandomArbitrary(0.001, 0.1).toFixed(2));

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg") || undefined,
    antialias: true,
  });
  // renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(100);

  renderer.render(scene, camera);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  // const material = [
  //   new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red color for the front side
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green color for the back side
  //   new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue color for the top side
  //   new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow color for the bottom side
  //   new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta color for the right side
  //   new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Cyan color for the left side
  // ];

  const material = new THREE.MeshNormalMaterial();

  for (let i = 0; i < 200; i++) {
    const object = new THREE.Mesh(boxGeometry, material);
    object.position.x = Math.random() * (280 - 140);
    object.position.y = Math.random() * (280 - 140);
    object.position.z = Math.random() * (200 - 100);
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    scene.add(object);
    boxes.push(object);
  }

  const sphereGeometry = new THREE.SphereGeometry(15, 32, 16);
  const sphere = new THREE.Mesh(sphereGeometry, material);

  scene.add(sphere);

  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("wheel", onMouseWheel, false);
  window.addEventListener("resize", onResize, false);

  // document.addEventListener('mousewheel', onMouseWheelSmooth, false);
  // document.addEventListener('DOMMouseScroll', onMouseWheelSmooth, false);

  // document.addEventListener( 'mousemove', onMouseMove, false );
  //   document.addEventListener( 'wheel', onMouseWheel, false );
  // 	window.addEventListener( 'resize', onResize, false );
}

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({
//   color: 0xff6347,
// });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

// const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
// const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

// function addStar() {
//   const star = new THREE.Mesh(starGeometry, starMaterial);

//   const [x, y, z] = Array(3)
//     .fill(0)
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(200).fill(0).forEach(addStar);

// const spaceColor = new THREE.Color("skyblue");
// scene.background = spaceColor;

function onMouseMove(event: MouseEvent) {
  mouse.x = event.clientX - windowHalf.x;
  mouse.y = event.clientY - windowHalf.x;
}

function onMouseWheel(event: WheelEvent) {
  camera.position.z += event.deltaY * 0.01; // move camera along z-axis
}

// function onMouseWheelSmooth(event: any) {
//   // camera.position.z += event.deltaY * 0.02; // move camera along z-axis
// console.log(event)
//   const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))); // Get scroll direction and speed
//   const targetPosition = {z: camera.position.z + delta * 0.02}
//   console.log(targetPosition)
//   // Animate the camera position
//   cameraTween.stop(); // Stop any ongoing tween
//   cameraTween.to(targetPosition, 200).start(); // Adjust the duration (200) to match the tween object's duration
//   renderer.render(scene, camera);
// }

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  windowHalf.set(width / 2, height / 2);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  const timer = 0.0001 * Date.now();

  for (let i = 0, il = boxes.length; i < il; i++) {
    const box = boxes[i];

    box.position.x = 30 * Math.cos(timer * 0.03 + i);
    box.position.y = 30 * Math.sin(timer * 0.05 + i * 1.1);

    box.rotation.x = 30 * Math.cos(timer * 0.05 + i);
    box.rotation.y = 30 * 1.2 * Math.sin(timer * 0.05 + i);
    box.rotation.z = 30 * Math.cos(timer * 0.05 + i);
  }

  target.x = (1 - mouse.x) * 0.0002;
  target.y = (1 - mouse.y) * 0.0002;

  camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
  camera.rotation.y += 0.05 * (target.x - camera.rotation.y);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
