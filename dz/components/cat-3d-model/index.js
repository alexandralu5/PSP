import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Cat3DModelComponent {
    constructor(containerId, modelPath) {
        this.containerId = containerId;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
        this.loader = new GLTFLoader();
    }

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.008);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(2, 1.5, 3);
        this.camera.lookAt(0, 0.5, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        this.addLights();

        this.addGroundPlane();

        this.addGridHelper();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.zoomSpeed = 1.2;
        this.controls.rotateSpeed = 1.0;
        this.controls.target.set(0, 0.5, 0);

        await this.loadModel();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(3, 5, 2);
        mainLight.castShadow = true;
        mainLight.receiveShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        this.scene.add(mainLight);

        const fillLight = new THREE.PointLight(0x8866ff, 0.3);
        fillLight.position.set(0, -1, 0);
        this.scene.add(fillLight);

        const rimLight = new THREE.PointLight(0xffaa66, 0.5);
        rimLight.position.set(-2, 1, -3);
        this.scene.add(rimLight);

        const warmLight = new THREE.PointLight(0xffaa66, 0.4);
        warmLight.position.set(1, 1.5, 2);
        this.scene.add(warmLight);
    }

    addGroundPlane() {
        const planeGeometry = new THREE.PlaneGeometry(5, 5);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3a,
            roughness: 0.5,
            metalness: 0.1,
            transparent: true,
            opacity: 0.3
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.5;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0x444444);
        gridHelper.position.y = -0.5;
        this.scene.add(gridHelper);
    }

    async loadModel() {
        return new Promise((resolve) => {
            this.loader.load(
                this.modelPath,
                (gltf) => {
                    this.model = gltf.scene;

                    const box = new THREE.Box3().setFromObject(this.model);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    const minY = box.min.y;

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const targetSize = 1.2;
                    const scale = targetSize / maxDim;
                    this.model.scale.set(scale, scale, scale);

                    const scaledBox = new THREE.Box3().setFromObject(this.model);
                    const scaledMinY = scaledBox.min.y;
                    const scaledSize = scaledBox.getSize(new THREE.Vector3());

                    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
                    this.model.position.x = -scaledCenter.x;
                    this.model.position.z = -scaledCenter.z;

                    const groundY = -0.5;
                    this.model.position.y = groundY - scaledMinY;

                    this.model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });

                    this.scene.add(this.model);
                    console.log('Модель загружена и отцентрирована:', this.modelPath);
                    resolve();
                },
                (xhr) => {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                    console.log(`Загрузка модели: ${percent}%`);
                },
                (error) => {
                    console.error('Ошибка загрузки модели:', error);
                    this.createFallbackModel();
                    resolve();
                }
            );
        });
    }

    createFallbackModel() {
        const modelId = this.modelPath.split('/').pop() || 'cat';

        const group = new THREE.Group();

        const colors = {
            'cat1.glb': 0xff9966, // рыжий
            'cat2.glb': 0x88aaff, // серый
            'cat3.glb': 0xffdd99, // кремовый
            'cat4.glb': 0xffaa66, // оранжевый
            'cat5.glb': 0x666666, // черный
            'cat6.glb': 0xaa8866  // коричневый
        };
        const color = colors[modelId] || 0xff9966;

        // Тело
        const bodyGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.3 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.set(1.2, 0.8, 0.9);
        body.position.y = 0.2;
        group.add(body);

        // Голова
        const headGeo = new THREE.SphereGeometry(0.45, 32, 32);
        const headMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.3 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0.7, 0.35, 0);
        group.add(head);

        // Уши
        const earGeo = new THREE.ConeGeometry(0.3, 0.4, 32);
        const earMat = new THREE.MeshStandardMaterial({ color: color });

        const leftEar = new THREE.Mesh(earGeo, earMat);
        leftEar.position.set(-0.5, 0.8, 0);
        group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeo, earMat);
        rightEar.position.set(0.5, 0.8, 0);
        group.add(rightEar);

        // Глаза
        const eyeGeo = new THREE.SphereGeometry(0.12, 32, 32);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x44aaff });

        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.2, 0.55, 0.45);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.2, 0.55, 0.45);
        group.add(rightEye);

        // Зрачки
        const pupilGeo = new THREE.SphereGeometry(0.06, 32, 32);
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
        leftPupil.position.set(-0.2, 0.54, 0.56);
        group.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        rightPupil.position.set(0.2, 0.54, 0.56);
        group.add(rightPupil);

        // Нос
        const noseGeo = new THREE.ConeGeometry(0.1, 0.15, 32);
        const noseMat = new THREE.MeshStandardMaterial({ color: 0xff6666 });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.position.set(0, 0.35, 0.55);
        nose.rotation.x = 0.2;
        group.add(nose);

        // Хвост
        const tailGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.6, 8);
        const tailMat = new THREE.MeshStandardMaterial({ color: color });
        const tail = new THREE.Mesh(tailGeo, tailMat);
        tail.position.set(-1, 0.1, -0.3);
        tail.rotation.z = 0.5;
        tail.rotation.x = 0.3;
        group.add(tail);

        this.model = group;
        this.scene.add(this.model);
        console.log('Создана фолбэк-модель для:', modelId);
    }

    setCameraPosition(type) {
        switch(type) {
            case 'front':
                this.camera.position.set(0, 0.5, 3);
                this.controls.target.set(0, 0.5, 0);
                break;
            case 'back':
                this.camera.position.set(0, 0.5, -3);
                this.controls.target.set(0, 0.5, 0);
                break;
            case 'left':
                this.camera.position.set(-3, 0.5, 0);
                this.controls.target.set(0, 0.5, 0);
                break;
            case 'right':
                this.camera.position.set(3, 0.5, 0);
                this.controls.target.set(0, 0.5, 0);
                break;
            case 'top':
                this.camera.position.set(0, 3, 0);
                this.controls.target.set(0, 0.5, 0);
                break;
        }
        this.controls.update();
    }

    zoom(delta) {
        const newZoom = this.camera.zoom + delta;
        if (newZoom >= 0.5 && newZoom <= 3) {
            this.camera.zoom = newZoom;
            this.camera.updateProjectionMatrix();
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        const container = document.getElementById(this.containerId);
        if (container && container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}
