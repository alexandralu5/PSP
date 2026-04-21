import { MainPage } from "./pages/main/index.js";
import { EquipmentPage } from "./pages/equipment/index.js";

let currentPage = null;

export function navigateTo(page, params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch(page) {
        case 'main':
            currentPage = new MainPage(app);
            break;
        case 'equipment':
            currentPage = new EquipmentPage(app, params.equipmentId);
            break;
    }

    if (currentPage && currentPage.render) {
        currentPage.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('main');
});
