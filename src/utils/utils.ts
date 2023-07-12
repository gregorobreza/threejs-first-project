import gsap from "gsap";
import * as THREE from "three";



interface PositionProps {
  x: number;
  y: number;
  z: number;
}
interface RotationProps {
  x: number;
  y: number;
  z: number;
}

export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function animateToPosition(
  event: MouseEvent,
  position: PositionProps,
  rotation: RotationProps,
  camera: THREE.PerspectiveCamera
) {
  const cameraAnimation = gsap.timeline()
  cameraAnimation.to(camera.position, {
    duration: 1, // Set the duration of the animation (in seconds)
    z: position.z,
    y: position.y,
    x: position.x,
    ease: "Power2.easeInOut", // Set the easing function
  }, ).to(camera.rotation, {
    duration: 1, // Set the duration of the animation (in seconds)
    x: (Math.PI * rotation.x)/180,
    y:  (Math.PI * rotation.y)/180,
    z:  (Math.PI * rotation.z)/180,
    ease: "Power2.easeInOut", // Set the easing function
  })
  // camera.updateProjectionMatrix()
}
