import { EquipmentDetailComponent } from "../../components/equipment-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import {ajax} from "../../modules/ajax.js";
import {equipmentUrls} from "../../modules/equipmentUrls.js";

export class EquipmentPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

     getData() {
        ajax.get(equipmentUrls.getEquipmentById(this.id), (data) => {
            this.renderData(data);
        })
    }

    renderData(item) {
        const product = new EquipmentDetailComponent(this.pageRoot)
        product.render(item)
    }

    get pageRoot() {
        return document.getElementById('equipment-page');
    }

    getHTML() {
        return (
            `
                <div id="equipment-page"></div>
            `
        );
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        this.getData()
    }
}
