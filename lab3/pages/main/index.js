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
                </div>
            `
        );
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://www.microscopy.co.kr/wp-content/uploads/2024/03/BX53_00_Biological_microscope.png",
                title: "Микроскоп",
                text: "Оптический микроскоп для лабораторных исследований",
                type: "Оптический микроскоп",
                magnification: "1000x",
                resolution: "0.2 мкм"
            },
            {
                id: 2,
                src: "https://snablab.ru/assets/images/products/211/2-dm0506-jpg.jpg",
                title: "Центрифуга",
                text: "Лабораторная центрифуга для разделения жидкостей",
                type: "Лабораторная центрифуга",
                speed: "15000 об/мин",
                capacity: "24 пробирки"
            },
            {
                id: 3,
                src: "https://primelab.com/image/cache/catalog/blog/blog_137-1100x600.jpg",
                title: "Спектрофотометр",
                text: "УФ-видимый спектрофотометр",
                type: "УФ-видимый спектрофотометр",
                wavelength: "190-1100 нм",
                accuracy: "±0.5 нм"
            },
            {
                id: 4,
                src: "https://algimed.com/upload/iblock/504/file.jpg",
                title: "Термоциклер",
                text: "ПЦР-амплификатор для проведения ПЦР",
                type: "ПЦР-амплификатор",
                temperature: "4-99°C",
                capacity: "96 пробирок"
            }
        ];
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

        this.setupSearch();
        this.filterAndRenderCards();
    }
}
