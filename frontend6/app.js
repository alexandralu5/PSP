import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getAllModels, saveModel, deleteModel } from './idb.js';


const previewScenes = new Map();

export function createPreview(container, modelPath, onLoadCallback) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 2.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);


    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 2);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-1, 1, -1);
    scene.add(fillLight);

    const loader = new GLTFLoader();

    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;


        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;

        scene.add(model);


        function animate() {
            requestAnimationFrame(animate);
            model.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        if (onLoadCallback) onLoadCallback(true);
    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">3D модель недоступна</div>';
        if (onLoadCallback) onLoadCallback(false);
    });

    const resizeObserver = new ResizeObserver(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return { scene, camera, renderer, resizeObserver };
}
