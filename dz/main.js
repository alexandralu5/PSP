import { MainPage } from "./pages/main/index.js";

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const mainPage = new MainPage(app);
    mainPage.render();
});
