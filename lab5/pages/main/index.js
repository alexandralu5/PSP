import { ProductCardComponent } from "../../components/product-card/index.js";
import { EquipmentPage } from "../equipment/index.js";
import { ajax } from "../../modules/ajax.js";
import { equipmentUrls } from "../../modules/equipmentUrls.js";
import { navigateTo } from "../../main.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.searchTerm = '';
        this.allData = [];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return (
            `
                <div class="container py-4">
                    <h1 class="text-center mb-4">Лабораторное оборудование</h1>

                    <!-- ФОРМА ДОБАВЛЕНИЯ ОБОРУДОВАНИЯ -->
                    <div class="add-form-container mb-4 p-3 border rounded bg-light">
                        <h5 class="mb-3">Добавить новое оборудование</h5>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <input type="text" id="equipment-title" class="form-control form-control-sm" placeholder="Название">
                            </div>
                            <div class="col-md-3">
                                <input type="text" id="equipment-type" class="form-control form-control-sm" placeholder="Тип">
                            </div>
                            <div class="col-md-3">
                                <input type="text" id="equipment-text" class="form-control form-control-sm" placeholder="Описание">
                            </div>
                            <div class="col-md-2">
                                <input type="text" id="equipment-src" class="form-control form-control-sm" placeholder="URL фото">
                            </div>
                            <div class="col-md-1">
                                <button id="save-equipment-btn" class="btn btn-success btn-sm w-100">Добавить</button>
                            </div>
                        </div>
                    </div>

                    <!-- ПОИСК -->
                    <div class="search-container mb-4">
                        <div class="row g-2 align-items-center">
                            <div class="col-md-8">
                                <input type="text" class="search-input form-control" id="search-input" placeholder="Поиск..." autocomplete="off">
                            </div>
                            <div class="col-md-2">
                                <button id="search-btn" class="btn btn-primary w-100">🔍 Найти</button>
                            </div>
                            <div class="col-md-2">
                                <button id="reset-btn" class="btn btn-secondary w-100">🔄 Сбросить</button>
                            </div>
                        </div>
                    </div>

                    <div id="main-page" class="row g-4"></div>

                    <div id="task-results" class="task-results mt-5"></div>
                </div>
            `
        );
    }

    getData() {
        ajax.get(equipmentUrls.getEquipment(), (data) => {
            if (data && Array.isArray(data)) {
                this.allData = data;
                this.renderData(data);
            }
        });
    }

    renderData(items) {
        const cardsContainer = this.pageRoot;
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';

        if (!items || items.length === 0) {
            cardsContainer.innerHTML = '<div class="col-12 text-center">Нет данных</div>';
            return;
        }

        const firstRow = items.slice(0, 3);
        const secondRow = items.slice(3, 4);

        if (firstRow.length > 0) {
            const firstRowContainer = document.createElement('div');
            firstRowContainer.className = 'row row-cols-1 row-cols-md-3 g-4 mb-4';
            cardsContainer.appendChild(firstRowContainer);

            firstRow.forEach((item) => {
                const productCard = new ProductCardComponent(firstRowContainer);
                productCard.render(item, this.clickCard.bind(this), this.editCard.bind(this), this.deleteCard.bind(this));
            });
        }

        if (secondRow.length > 0) {
            const secondRowContainer = document.createElement('div');
            secondRowContainer.className = 'row';
            cardsContainer.appendChild(secondRowContainer);

            const leftCol = document.createElement('div');
            leftCol.className = 'col-md-4';
            secondRowContainer.appendChild(leftCol);

            secondRow.forEach((item) => {
                const productCard = new ProductCardComponent(leftCol);
                productCard.render(item, this.clickCard.bind(this), this.editCard.bind(this), this.deleteCard.bind(this));
            });
        }
    }

    performSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.searchTerm = searchInput.value.toLowerCase();
            const filtered = this.allData.filter(item =>
                item.title.toLowerCase().includes(this.searchTerm) ||
                (item.type && item.type.toLowerCase().includes(this.searchTerm))
            );
            this.renderData(filtered);
        }
    }

    resetSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
            this.renderData(this.allData);
        }
    }

    concatenate(strings, separator) {
        let result = '';
        for (let i = 0; i < strings.length; i++) {
            result += strings[i];
            if (i < strings.length - 1) {
                result += separator;
            }
        }
        return result;
    }

    erase(array) {
        const result = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== false && array[i] !== undefined && array[i] !== '' && array[i] !== 0 && array[i] !== null) {
                result.push(array[i]);
            }
        }
        return result;
    }

    sumUnique(array) {
        const uniqueValues = [];
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            let isDuplicate = false;
            for (let j = 0; j < uniqueValues.length; j++) {
                if (uniqueValues[j] === array[i]) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                uniqueValues.push(array[i]);
                sum += array[i];
            }
        }
        return sum;
    }

    merge(...objects) {
        const result = {};
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            for (let key in obj) {
                if (obj.hasOwnProperty(key) && result[key] === undefined) {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }

    displayTaskResults() {
        const equipmentNames = ['Микроскоп', 'Центрифуга', 'Спектрофотометр', 'Термоциклер', 'Автоклав'];
        const concatenated = this.concatenate(equipmentNames, ' → ');
        const mixedData = [0, 1, false, 2, undefined, '', 3, null, 4, 'pH-метр', 5];
        const cleanedData = this.erase(mixedData);
        const equipmentIds = [101, 102, 103, 101, 104, 102, 105, 103, 106];
        const uniqueSum = this.sumUnique(equipmentIds);
        const microscopeSpecs = { magnification: '1000x', resolution: '0.2 мкм', type: 'оптический' };
        const centrifugeSpecs = { speed: '15000 об/мин', capacity: '24 пробирки', type: 'лабораторный' };
        const spectrophotometerSpecs = { wavelength: '190-1100 нм', accuracy: '±0.5 нм', type: 'УФ-видимый' };
        const mergedSpecs = this.merge(microscopeSpecs, centrifugeSpecs, spectrophotometerSpecs);

        return `
            <h5>Результаты выполнения заданий</h5>
            <p><strong>Задание 1.1 (concatenate):</strong><br>Результат: "${concatenated}"</p>
            <p><strong>Задание 1.10 (erase):</strong><br>Очищенный массив: [${cleanedData.join(', ')}]</p>
            <p><strong>Задание 2.8 (sumUnique):</strong><br>Сумма уникальных элементов: ${uniqueSum}</p>
            <p><strong>Задание 3.1 (merge):</strong><br>Результат слияния: ${JSON.stringify(mergedSpecs)}</p>
        `;
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const equipmentPage = new EquipmentPage(this.parent, cardId);
        equipmentPage.render();
    }

    editCard(equipmentId) {
        navigateTo('edit', { equipmentId: equipmentId });
    }

    deleteCard(equipmentId) {
        if (confirm(`Вы уверены, что хотите удалить оборудование?`)) {
            ajax.delete(equipmentUrls.removeEquipmentById(equipmentId), (data, status) => {
                if (status === 200 || status === 204) {
                    this.getData();
                }
            });
        }
    }

    setupSearch() {
        const searchBtn = document.getElementById('search-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSearch();
            });
        }
    }

    setupAddButton() {
        const saveButton = document.getElementById('save-equipment-btn');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const newEquipment = {
                    title: document.getElementById('equipment-title').value,
                    type: document.getElementById('equipment-type').value,
                    text: document.getElementById('equipment-text').value,
                    src: document.getElementById('equipment-src').value || 'https://cdn.pixabay.com/photo/2016/06/13/12/44/microscope-1454130_640.jpg'
                };

                ajax.post(equipmentUrls.createEquipment(), newEquipment, (data, status) => {
                    if (status === 201 || status === 200) {
                        this.getData();
                        document.getElementById('equipment-title').value = '';
                        document.getElementById('equipment-type').value = '';
                        document.getElementById('equipment-text').value = '';
                        document.getElementById('equipment-src').value = '';
                    }
                });
            });
        }
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.getData();
        this.setupSearch();
        this.setupAddButton();

        const taskResultsDiv = document.getElementById('task-results');
        if (taskResultsDiv) {
            taskResultsDiv.innerHTML = this.displayTaskResults();
        }
    }
}
