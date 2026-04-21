import { ProductCardComponent } from "../../components/product-card/index.js";
import { EquipmentPage } from "../equipment/index.js";
import {ajax} from "../../modules/ajax.js";
import {equipmentUrls} from "../../modules/equipmentUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.searchTerm = '';      // ← переменная для хранения поискового запроса
        this.equipmentData = [];
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

    getData() {
        ajax.get(equipmentUrls.getEquipment(), (data) => {
            this.renderData(data);
        })
    }

    renderData(items) {
        items.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const equipmentPage = new EquipmentPage(this.parent, cardId);
        equipmentPage.render();
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.filterAndRenderCards();
        this.setupSearch();
        this.getData()
    }
}
