import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Получаем ID модели из URL параметров
const urlParams = new URLSearchParams(window.location.search);
const equipmentId = urlParams.get('id');

// Глобальные переменные
let scene, camera, renderer, controls, model;
let isModelLoaded = false;

// Функция центрирования модели
function centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    const minY = box.min.y - center.y;
    const offsetY = -0.8 - minY;
    model.position.y += offsetY;

    return size;
}

// Функция настройки камеры
function setupCameraForModel(size) {
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;
    const cameraHeight = maxDim * 0.8;

    camera.position.set(distance, cameraHeight, distance);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Инициализация 3D сцены
function init3D() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf5f5f5, 1);

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.zoomSpeed = 1.2;
    controls.target.set(0, 0, 0);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 2);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, 1, -2);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0xffffff, 0.3);
    backLight.position.set(0, 2, 0);
    scene.add(backLight);

    // Сетка пола
    const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
    gridHelper.position.y = -0.8;
    scene.add(gridHelper);

    // Загрузка модели
    const loader = new GLTFLoader();
    loader.load('./models/equipment.glb', (gltf) => {
        model = gltf.scene;
        const size = centerModel(model);
        scene.add(model);
        setupCameraForModel(size);
        isModelLoaded = true;

        // Добавляем эффект свечения на модель
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const light = new THREE.PointLight(0x1a7f6b, 0.5);
        light.position.set(center.x, center.y + 1, center.z);
        scene.add(light);

    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x1a7f6b });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = -0.3;
        scene.add(cube);
        camera.position.set(2.5, 2, 3);
        controls.target.set(0, 0, 0);
        controls.update();
    });

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        if (controls) {
            controls.update();
        }
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    animate();

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = 500;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// Функции управления видом
function setView(position, target) {
    if (!camera || !controls) return;
    camera.position.set(position.x, position.y, position.z);
    controls.target.set(target.x, target.y, target.z);
    controls.update();
}

// Загрузка данных оборудования
function loadEquipmentData() {
    if (!equipmentId) return;

    fetch(`http://localhost:3001/equipment/${equipmentId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('model-title').textContent = data.title || 'Лабораторное оборудование';
            document.getElementById('info-title').textContent = data.title || '';
            document.getElementById('info-description').textContent = data.text || 'Описание отсутствует';

            const specsList = document.getElementById('info-specs');
            specsList.innerHTML = '';

            if (data.type) {
                const li = document.createElement('li');
                li.textContent = `Тип: ${data.type}`;
                specsList.appendChild(li);
            }
            if (data.magnification || data.speed || data.temperature) {
                const li = document.createElement('li');
                li.textContent = `Характеристика 1: ${data.magnification || data.speed || data.temperature}`;
                specsList.appendChild(li);
            }
            if (data.resolution || data.capacity || data.accuracy) {
                const li = document.createElement('li');
                li.textContent = `Характеристика 2: ${data.resolution || data.capacity || data.accuracy}`;
                specsList.appendChild(li);
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            document.getElementById('info-title').textContent = 'Ошибка загрузки данных';
        });
}

// Уведомления
function showNotification(message, type = 'success') {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.marginTop = '10px';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideInRight 0.3s ease';
    notification.innerHTML = `
        <strong>${type === 'success' ? '✓' : 'ℹ'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
    }, 5000);

    notification.querySelector('.btn-close')?.addEventListener('click', () => notification.remove());
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    init3D();
    loadEquipmentData();

    // Кнопки управления видом
    document.getElementById('view-front')?.addEventListener('click', () => setView({ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }));
    document.getElementById('view-back')?.addEventListener('click', () => setView({ x: 0, y: 0, z: -5 }, { x: 0, y: 0, z: 0 }));
    document.getElementById('view-left')?.addEventListener('click', () => setView({ x: -5, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }));
    document.getElementById('view-right')?.addEventListener('click', () => setView({ x: 5, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }));

    // Кнопки зума
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        if (camera) camera.position.multiplyScalar(0.9);
    });
    document.getElementById('zoom-out')?.addEventListener('click', () => {
        if (camera) camera.position.multiplyScalar(1.1);
    });

    // Кнопка назад
    document.getElementById('back-button')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Кнопка заказа
    document.getElementById('order-button')?.addEventListener('click', () => {
        showNotification('Спасибо за интерес! Наш менеджер свяжется с вами.', 'success');
    });
});
