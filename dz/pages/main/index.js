import { ProductCardComponent } from "../../components/product-card/index.js";
import { EquipmentPage } from "../equipment/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.searchTerm = '';
        this.equipmentData = this.getData();
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return (
            `
                <div class="container py-4">
                    <h1 class="text-center mb-4">Лабораторное оборудование</h1>
                    <p class="text-center text-muted mb-4">Нажмите "Подробнее", чтобы узнать больше об оборудовании</p>

                    <div class="search-container">
                        <input type="text" class="search-input" id="search-input" placeholder="Поиск оборудования..." autocomplete="off">
                    </div>

                    <div id="main-page" class="row g-4"></div>

                    <div id="task-results" class="task-results mt-5"></div>
                </div>
            `
        );
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://cdn.pixabay.com/photo/2016/06/13/12/44/microscope-1454130_640.jpg",
                title: "Микроскоп",
                text: "Оптический микроскоп для лабораторных исследований",
                type: "Оптический микроскоп",
                magnification: "1000x",
                resolution: "0.2 мкм"
            },
            {
                id: 2,
                src: "https://cdn.pixabay.com/photo/2018/02/21/13/17/centrifuge-3169758_640.jpg",
                title: "Центрифуга",
                text: "Лабораторная центрифуга для разделения жидкостей",
                type: "Лабораторная центрифуга",
                speed: "15000 об/мин",
                capacity: "24 пробирки"
            },
            {
                id: 3,
                src: "https://cdn.pixabay.com/photo/2016/11/29/09/08/beaker-1869024_640.jpg",
                title: "Спектрофотометр",
                text: "УФ-видимый спектрофотометр",
                type: "УФ-видимый спектрофотометр",
                wavelength: "190-1100 нм",
                accuracy: "±0.5 нм"
            },
            {
                id: 4,
                src: "https://cdn.pixabay.com/photo/2019/10/15/14/43/thermal-cycler-4552717_640.jpg",
                title: "Термоциклер",
                text: "ПЦР-амплификатор для проведения ПЦР",
                type: "ПЦР-амплификатор",
                temperature: "4-99°C",
                capacity: "96 пробирок"
            }
        ];
    }

    // ============ ЗАДАНИЕ 1.1 (1 уровень) ============
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

    // ============ ЗАДАНИЕ 1.10 (1 уровень) ============
    erase(array) {
        const result = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== false && array[i] !== undefined && array[i] !== '' && array[i] !== 0 && array[i] !== null) {
                result.push(array[i]);
            }
        }
        return result;
    }

    // ============ ЗАДАНИЕ 2.8 (2 уровень) ============
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

    // ============ ЗАДАНИЕ 3.1 (3 уровень) ============
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

            <p><strong>Задание 1.1 (concatenate):</strong><br>
            Массив: [${equipmentNames.join(', ')}]<br>
            Результат склейки с разделителем ' → ': "${concatenated}"</p>

            <p><strong>Задание 1.10 (erase):</strong><br>
            Исходный массив: [${mixedData.map(v => v === '' ? "''" : v).join(', ')}]<br>
            Очищенный массив: [${cleanedData.join(', ')}]</p>

            <p><strong>Задание 2.8 (sumUnique):</strong><br>
            Массив ID оборудования: [${equipmentIds.join(', ')}]<br>
            Сумма уникальных элементов: ${uniqueSum}</p>

            <p><strong>Задание 3.1 (merge):</strong><br>
            Объект 1 (Микроскоп): ${JSON.stringify(microscopeSpecs)}<br>
            Объект 2 (Центрифуга): ${JSON.stringify(centrifugeSpecs)}<br>
            Объект 3 (Спектрофотометр): ${JSON.stringify(spectrophotometerSpecs)}<br>
            Результат слияния: ${JSON.stringify(mergedSpecs)}</p>
        `;
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const equipmentPage = new EquipmentPage(this.parent, cardId);
        equipmentPage.render();
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndRenderCards();
            });
        }
    }

    filterAndRenderCards() {
        const filteredData = this.equipmentData.filter(item =>
            item.title.toLowerCase().includes(this.searchTerm) ||
            item.type.toLowerCase().includes(this.searchTerm) ||
            (item.text && item.text.toLowerCase().includes(this.searchTerm))
        );

        const cardsContainer = this.pageRoot;
        if (cardsContainer) {
            cardsContainer.innerHTML = '';

            const firstRow = filteredData.slice(0, 3);
            const secondRow = filteredData.slice(3, 4);

            if (firstRow.length > 0) {
                const firstRowContainer = document.createElement('div');
                firstRowContainer.className = 'row row-cols-1 row-cols-md-3 g-4 mb-4';
                cardsContainer.appendChild(firstRowContainer);

                firstRow.forEach((item) => {
                    const productCard = new ProductCardComponent(firstRowContainer);
                    productCard.render(item, this.clickCard.bind(this));
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
                    productCard.render(item, this.clickCard.bind(this));
                });
            }
        }
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.filterAndRenderCards();

        const taskResultsDiv = document.getElementById('task-results');
        if (taskResultsDiv) {
            taskResultsDiv.innerHTML = this.displayTaskResults();
        }

        this.setupSearch();
    }
}
