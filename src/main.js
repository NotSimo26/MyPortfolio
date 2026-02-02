// Modules
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Functions
async function initViewer() {
    const canvasViewer = document.getElementById('canvasViewer');
    
    try {
        const scene = new THREE.Scene();
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            './../assets/Purple.png',
            (texture) => {
                scene.background = texture;
            },
            undefined,
            (err) => {
                console.error('cant load background:', err);
                scene.background = new THREE.Color(0x030302);
            }
        );

        // Camera di default
        const camera = new THREE.PerspectiveCamera(
            28.1319,
            canvasViewer.clientWidth / canvasViewer.clientHeight,
            0.1,
            10000
        );
    

        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasViewer,
            antialias: true 
        });
        renderer.setSize(canvasViewer.clientWidth, canvasViewer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight1.position.set(100, 200, 100);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight2.position.set(-100, 100, -100);
        scene.add(directionalLight2);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
        backLight.position.set(0, 50, -100);
        scene.add(backLight);
        
        const mtlLoader = new MTLLoader();
        mtlLoader.setResourcePath('./../assets/');
        
        // Carica il file MTL
        mtlLoader.load('./../assets/SimoAvatar.mtl', (materials) => {
            materials.preload();
            
            // fix alpha map 
            for (const key in materials.materials) {
                materials.materials[key].transparent = false;
            }
            
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            
            // Carica il file OBJ
            objLoader.load('./../assets/SimoAvatar.obj', (object) => {
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                scene.add(object);
                camera.position.set(0.68459, 0, -12.1455);
                camera.lookAt(center);
                
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = true;
                controls.minDistance = 5;
                controls.maxDistance = 500;
                controls.target.copy(center);
                
                controls.mouseButtons = {
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                };
                
                let autoRotate = true;
                const rotationSpeed = 0.003;

                controls.addEventListener('start', () => {
                    autoRotate = false;
                });
                controls.addEventListener('end', () => {
                    autoRotate = true;
                });
                
                function animate() {
                    requestAnimationFrame(animate);
                    if (autoRotate) {
                        object.rotation.y += rotationSpeed;
                    }
                    
                    controls.update();
                    renderer.render(scene, camera);
                }
                animate();
                
                console.log("successfully loaded model");
            }, undefined, (err) => {
                console.error('Error loading OBJ:', err);
            });
        }, undefined, (err) => {
            console.error('Error loading MTL:', err);
        });
        
        window.addEventListener('resize', () => {
            camera.aspect = canvasViewer.clientWidth / canvasViewer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasViewer.clientWidth, canvasViewer.clientHeight);
        });
        
    } catch (err) {
        console.log(err);
    }
}

// Main
window.addEventListener('load', () => {
    initViewer();
});