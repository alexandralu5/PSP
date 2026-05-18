import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class EquipmentDetailComponent {
    constructor(parent) {
        this.parent = parent;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.animationId = null;
    }

    getHTML(data) {
        return (
            `
                <div class="card mb-4 mt-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-6">
                            <div id="detail-3d-container" style="height: 450px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; position: relative;"></div>
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                                <h2 class="card-title">${data.title}</h2>
                                <p class="card-text">
                                    <strong>Тип:</strong> ${data.type}<br>
                                    <strong>Характеристики:</strong> ${data.magnification || data.speed || data.temperature}<br>
                                    <strong>Мощность:</strong> ${data.resolution || data.capacity || data.accuracy}<br>
                                    <strong>Описание:</strong> ${data.text}
                                </p>
                                <div class="mt-4">
                                    <h5>Особенности:</h5>
                                    <ul>
                                        <li>Сертифицированное оборудование</li>
                                        <li>Гарантийное обслуживание</li>
                                        <li>Калибровка включена</li>
                                    </ul>
                                </div>
                                <button class="btn btn-success btn-lg mt-3" id="order-button" data-id="${data.id}">
                                    Заказать оборудование
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    processModel(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const targetMaxSize = 1.8;
        const maxDim = Math.max(size.x, size.y, size.z);
        let scale = targetMaxSize / maxDim;

        model.scale.set(scale, scale, scale);

        const newBox = new THREE.Box3().setFromObject(model);
        const newCenter = newBox.getCenter(new THREE.Vector3());

        model.position.x -= newCenter.x;
        model.position.y -= newCenter.y;
        model.position.z -= newCenter.z;

        const minY = newBox.min.y - newCenter.y;
        const offsetY = -0.8 - minY;
        model.position.y += offsetY;

        return newBox.getSize(new THREE.Vector3());
    }

    setupCameraForModel(size) {
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2.2;
        const cameraHeight = maxDim * 1.2;

        this.camera.position.set(distance, cameraHeight, distance);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    init3DDetail() {
        const container = document.getElementById('detail-3d-container');
        if (!container) return;

        const width = container.clientWidth;
        const height = 450;

        if (width === 0 || height === 0) return;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(3, 2, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xf0f0f0, 1);

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.zoomSpeed = 1.2;
        this.controls.target.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(2, 3, 2);
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-2, 1, -2);
        this.scene.add(fillLight);

        const backLight = new THREE.PointLight(0xffffff, 0.3);
        backLight.position.set(0, 2, 0);
        this.scene.add(backLight);

        const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
        gridHelper.position.y = -0.8;
        this.scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(1.5);
        axesHelper.visible = false;
        this.scene.add(axesHelper);

        const loader = new GLTFLoader();

        loader.load('./models/equipment.glb', (gltf) => {
            this.model = gltf.scene;
            const size = this.processModel(this.model);
            this.scene.add(this.model);
            this.setupCameraForModel(size);
        }, undefined, () => {
            const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const material = new THREE.MeshStandardMaterial({ color: 0x2d6a4f });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.y = -0.4;
            this.scene.add(cube);

            this.camera.position.set(2.5, 2, 3);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        });

        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            if (this.controls) {
                this.controls.update();
            }
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        animate();

        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = 450;
            if (newWidth > 0 && newHeight > 0) {
                this.camera.aspect = newWidth / newHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(newWidth, newHeight);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        resizeObserver.observe(container);

        window.addEventListener('resize', handleResize);
    }

    showNotification(message, type = 'success') {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.marginTop = '10px';
        notification.style.minWidth = '300px';
        notification.style.animation = 'slideInRight 0.3s ease';
        notification.innerHTML = `
            <strong>✓</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 150);
        }, 5000);

        const closeBtn = notification.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    }

    addListeners(data) {
        const orderButton = document.getElementById('order-button');
        if (orderButton) {
            orderButton.addEventListener('click', () => {
                this.showNotification(
                    `Спасибо за интерес к ${data.title}! Наш менеджер свяжется с вами в ближайшее время для оформления заказа.`,
                    'success'
                );
            });
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        this.scene = null;
        this.camera = null;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data);

        setTimeout(() => {
            this.init3DDetail();
        }, 200);
    }
}
