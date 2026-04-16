import { ProductCardComponent } from "../../components/product-card/index.js";
import { EquipmentPage } from "../equipment/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
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
                    <div id="main-page" class="row g-4"></div>
                </div>
            `
        );
    }

    getData() {
        return [
            // Первый ряд - 3 карточки
            {
                id: 1,
                src: "https://www.microscopy.co.kr/wp-content/uploads/2024/03/BX53_00_Biological_microscope.png",
                title: "Микроскоп",
                text: "",
                type: "Оптический микроскоп",
                magnification: "1000x",
                resolution: "0.2 мкм"
            },
            {
                id: 2,
                src: "https://snablab.ru/assets/images/products/211/2-dm0506-jpg.jpg",
                title: "Центрифуга",
                text: "",
                type: "Лабораторная центрифуга",
                speed: "15000 об/мин",
                capacity: "24 пробирки"
            },
            {
                id: 3,
                src: "https://primelab.com/image/cache/catalog/blog/blog_137-1100x600.jpg",
                title: "Спектрофотометр",
                text: "",
                type: "УФ-видимый спектрофотометр",
                wavelength: "190-1100 нм",
                accuracy: "±0.5 нм"
            },
            {
                id: 4,
                src: "https://algimed.com/upload/iblock/504/file.jpg",
                title: "Термоциклер",
                text: "",
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

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();

        const firstRow = data.slice(0, 3);
        const secondRow = data.slice(3, 4);

        const firstRowContainer = document.createElement('div');
        firstRowContainer.className = 'row row-cols-1 row-cols-md-3 g-4 mb-4';
        this.pageRoot.appendChild(firstRowContainer);

        firstRow.forEach((item) => {
            const productCard = new ProductCardComponent(firstRowContainer);
            productCard.render(item, this.clickCard.bind(this));
        });

        if (secondRow.length > 0) {
            const secondRowContainer = document.createElement('div');
            secondRowContainer.className = 'row';
            this.pageRoot.appendChild(secondRowContainer);

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
