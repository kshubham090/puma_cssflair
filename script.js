import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Set up camera
const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

// Set up scene
const scene = new THREE.Scene();
let shoe;

// Load the GLB model
const loader = new GLTFLoader();
loader.load(
    './shoe.glb',
    function (gltf) {
        shoe = gltf.scene;

        // Fix initial orientation
        shoe.rotation.x = 1; // Set upright
        shoe.scale.set(0, 0, 0); // Initial scale
        shoe.position.set(0, 0, 0); // Center the shoe in the scene

        scene.add(shoe);
    },
    function (xhr) {
        console.log(`Model loading: ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
    },
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(1000, 1000, 1000);
scene.add(topLight);

// Render loop
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
};
reRender3D();

// Scroll animation handler
const handleScrollAnimation = () => {
    const page1 = document.getElementById('main');
    const rect= main.getBoundingClientRect();

    if (shoe) {
        // When in view, increase size and rotate based on scroll
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            const scrollProgress = 1 - Math.abs(rect.top / window.innerHeight);

            gsap.to(shoe.scale, {
                x: -2 + scrollProgress * 2,
                y: -2 + scrollProgress * 2,
                z: -2 + scrollProgress * 2,
                duration: 0.1,
                ease: 'power1.out',
            });

            gsap.to(shoe.rotation, {
                x: scrollProgress * Math.PI * 0.5, 
                y: scrollProgress * Math.PI * 2.5,
                z: 3,
                duration: 0.1,
                ease: 'power1.out',
            });

            // Keep the shoe centered during page1 scrolling
            gsap.to(shoe.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.1,
                ease: 'power1.out',
            });
        }

        // When page1 ends, move the shoe off the screen
        if (rect.bottom < 0) {
            gsap.to(shoe.position, {
                x: 0, 
                y: 0, 
                z: -20, 
                duration: 0.1,
                ease: 'power1.out',
            });

            gsap.to(shoe.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 0.1,
                ease: 'power1.out',
            });
        }
    }
};

// Event listeners
window.addEventListener('scroll', handleScrollAnimation);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
