import { MainPage } from "./pages/main/index.js";
import { CatPage } from "./pages/cat/index.js";

let currentPage = null;

export function navigateTo(page, params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch(page) {
        case 'main':
            currentPage = new MainPage(app);
            break;
        case 'cat':
            currentPage = new CatPage(app, params.catId);
            break;
    }

    if (currentPage && currentPage.render) {
        currentPage.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('main');
});
