import { EquipmentDetailComponent } from "../../components/equipment-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class EquipmentPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const allEquipment = {
            1: {
                id: 1,
                src: "https://www.microscopy.co.kr/wp-content/uploads/2024/03/BX53_00_Biological_microscope.png",
                title: "Микроскоп",
                text: "Оптический микроскоп для лабораторных исследований. Позволяет наблюдать микроорганизмы и клеточные структуры.",
                type: "Оптический микроскоп",
                magnification: "1000x",
                resolution: "0.2 мкм",
                features: "Встроенная камера, LED подсветка"
            },
            2: {
                id: 2,
                src: "https://snablab.ru/assets/images/products/211/2-dm0506-jpg.jpg",
                title: "Центрифуга",
                text: "Лабораторная центрифуга для разделения жидкостей по плотности. Используется в биохимических исследованиях.",
                type: "Лабораторная центрифуга",
                speed: "15000 об/мин",
                capacity: "24 пробирки",
                features: "Цифровое управление, автоматическая балансировка"
            },
            3: {
                id: 3,
                src: "https://primelab.com/image/cache/catalog/blog/blog_137-1100x600.jpg",
                title: "Спектрофотометр",
                text: "УФ-видимый спектрофотометр для измерения поглощения света растворами. Применяется в аналитической химии.",
                type: "УФ-видимый спектрофотометр",
                wavelength: "190-1100 нм",
                accuracy: "±0.5 нм",
                features: "Сканирование спектра, кюветное отделение"
            },
            4: {
                id: 4,
                src: "https://algimed.com/upload/iblock/504/file.jpg",
                title: "Термоциклер",
                text: "ПЦР-амплификатор для проведения полимеразной цепной реакции. Незаменим в молекулярной биологии.",
                type: "ПЦР-амплификатор",
                temperature: "4-99°C",
                capacity: "96 пробирок",
                features: "Градиентный режим, программируемые протоколы"
            }
        };

        return allEquipment[this.id] || allEquipment[1];
    }

    get pageRoot() {
        return document.getElementById('equipment-page');
    }

    getHTML() {
        return (
            `
                <div id="equipment-page" class="container py-4"></div>
            `
        );
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();
        const equipmentDetail = new EquipmentDetailComponent(this.pageRoot);
        equipmentDetail.render(data);
    }
}
