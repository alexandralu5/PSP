import { ProductCardComponent } from "../../components/product-card/index.js";
import { EquipmentPage } from "../equipment/index.js";
import {ajax} from "../../modules/ajax.js";
import {equipmentUrls} from "../../modules/equipmentUrls.js";

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

        this.getData()
    }
}
