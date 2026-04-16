import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
        this.animationIds = new Map();
        this.renderers = new Map();
    }

    getHTML(data) {
        return (
            `
                <div class="col">
                    <div class="card equipment-card h-100" data-id="${data.id}" style="cursor: pointer;">
                        <div id="preview-${data.id}" class="preview-canvas" style="height: 200px; background-color: #f0f0f0; overflow: hidden; position: relative;"></div>
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text text-muted">${data.type || 'Тип оборудования'}</p>
                            <button class="btn btn-primary w-100" id="click-card-${data.id}" data-id="${data.id}">
                                Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            `
        );
    }

    processModelForPreview(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const targetMaxSize = 7.0;
        const maxDim = Math.max(size.x, size.y, size.z);
        let scale = targetMaxSize / maxDim;

        model.scale.set(scale, scale, scale);

        const newBox = new THREE.Box3().setFromObject(model);
        const newCenter = newBox.getCenter(new THREE.Vector3());

        model.position.x -= newCenter.x;
        model.position.y -= newCenter.y;
        model.position.z -= newCenter.z;

        return { size, maxDim: Math.max(size.x, size.y, size.z) };
    }

    init3DPreview(data) {
        const container = document.getElementById(`preview-${data.id}`);
        if (!container) return;

        const width = container.clientWidth;
        const height = 200;

        if (width === 0) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xf0f0f0, 1);

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(2, 3, 2);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-1, 1, -1);
        scene.add(fillLight);

        let modelObj = null;
        let animationFrameId = null;

        const loader = new GLTFLoader();
        loader.load('./models/equipment.glb', (gltf) => {
            modelObj = gltf.scene;
            const { maxDim: modelMaxDim } = this.processModelForPreview(modelObj);
            scene.add(modelObj);

            const distance = modelMaxDim * 0.5;
            camera.position.set(distance, distance * 0.6, distance);
            camera.lookAt(0, 0, 0);

            function animate() {
                animationFrameId = requestAnimationFrame(animate);
                if (modelObj) {
                    modelObj.rotation.y += 0.008;
                }
                renderer.render(scene, camera);
            }
            animate();
        }, undefined, () => {
            const geometry = new THREE.BoxGeometry(4.0, 4.0, 4.0);
            const material = new THREE.MeshStandardMaterial({ color: 0x2d6a4f });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            camera.position.set(1.0, 0.8, 1.2);
            camera.lookAt(0, 0, 0);

            function animateCube() {
                animationFrameId = requestAnimationFrame(animateCube);
                cube.rotation.y += 0.01;
                cube.rotation.x += 0.005;
                renderer.render(scene, camera);
            }
            animateCube();
        });

        this.animationIds.set(data.id, animationFrameId);
        this.renderers.set(data.id, renderer);

        const resizeObserver = new ResizeObserver(() => {
            const newWidth = container.clientWidth;
            const newHeight = 200;
            if (newWidth > 0) {
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        });
        resizeObserver.observe(container);
    }

    addListeners(data, listener) {
        const button = document.getElementById(`click-card-${data.id}`);
        if (button) {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                listener(e);
            });
        }

        const card = document.querySelector(`.equipment-card[data-id="${data.id}"]`);
        if (card) {
            card.addEventListener("click", (e) => {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    const button = document.getElementById(`click-card-${data.id}`);
                    if (button) button.click();
                }
            });
        }
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
        setTimeout(() => {
            this.init3DPreview(data);
        }, 100);
    }
}
