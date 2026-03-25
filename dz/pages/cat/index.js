import { CatDetailComponent } from "../../components/cat-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { Cat3DModelComponent } from "../../components/cat-3d-model/index.js";
import { MainPage } from "../main/index.js";
import { sumUnique, erase, getAvailableCatAfterTime } from "../../utils/catUtils.js";

export class CatPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.model3d = null;
    }

    getAllCatsData() {
        return [
            {
                id: 1,
                src: "https://i.pinimg.com/736x/96/91/0c/96910c8a23f6b80db45a9333b1aa9a79.jpg",
                title: "Пуша",
                breed: "Сиамская",
                age: 2,
                character: "Ласковая, игривая",
                isAvailable: true,
                chipNumber: 101,
                traits: ['ласковая', 'игривая', 'общительная'],
                modelPath: './models/cat1.glb'
            },
            {
                id: 2,
                src: "https://cdn.pixabay.com/photo/2015/11/16/22/14/cat-1046544_640.jpg",
                title: "Барсик",
                breed: "Британский",
                age: 3,
                character: "Энергичный, активный",
                isAvailable: true,
                chipNumber: 102,
                traits: ['энергичный', 'активный', 'любознательный'],
                modelPath: './models/cat2.glb'
            },
            {
                id: 3,
                src: "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_640.jpg",
                title: "Рыжик",
                breed: "Персидский",
                age: 5,
                character: "Спокойный, ласковый",
                isAvailable: false,
                chipNumber: 103,
                traits: ['спокойный', 'ласковый', 'флегматичный'],
                modelPath: './models/cat3.glb'
            },
            {
                id: 4,
                src: "https://cdn.pixabay.com/photo/2021/10/12/12/07/cat-6701844_640.jpg",
                title: "Мурка",
                breed: "Абиссинский",
                age: 1,
                character: "Общительный, дружелюбный",
                isAvailable: true,
                chipNumber: 104,
                traits: ['общительный', 'дружелюбный', 'энергичный'],
                modelPath: './models/cat4.glb'
            },
            {
                id: 5,
                src: "https://cdn.pixabay.com/photo/2016/11/09/15/27/cat-1811413_640.jpg",
                title: "Черныш",
                breed: "Бомбейский",
                age: 4,
                character: "Грациозный, спокойный",
                isAvailable: true,
                chipNumber: 105,
                traits: ['грациозный', 'спокойный', 'независимый'],
                modelPath: './models/cat5.glb'
            },
            {
                id: 6,
                src: "https://cdn.pixabay.com/photo/2018/03/23/17/26/cat-3254289_640.jpg",
                title: "Симба",
                breed: "Мейн-кун",
                age: 2,
                character: "Гордый, независимый",
                isAvailable: false,
                chipNumber: 106,
                traits: ['гордый', 'независимый', 'сильный'],
                modelPath: './models/cat6.glb'
            }
        ];
    }

    getData() {
        const allCats = this.getAllCatsData();
        return allCats.find(cat => cat.id == this.id) || allCats[0];
    }

    get pageRoot() {
        return document.getElementById('cat-page');
    }

    getHTML() {
        return (
            `
                <div id="cat-page">
                    <div class="container py-4">
                        <div class="row">
                            <div class="col-12">
                                <div id="cat-3d-container" class="model-3d-container">
                                    <div class="camera-controls">
                                        <button id="view-front">Вид спереди</button>
                                        <button id="view-back">Вид сзади</button>
                                        <button id="view-left">Вид слева</button>
                                        <button id="view-right">Вид справа</button>
                                        <button id="view-top">Вид сверху</button>
                                    </div>
                                    <div class="zoom-controls">
                                        <button id="zoom-in">+</button>
                                        <button id="zoom-out">-</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-12">
                                <div id="cat-info-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    clickBack() {
        if (this.model3d) {
            this.model3d.dispose();
        }
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    setupCameraControls() {
        setTimeout(() => {
            const frontBtn = document.getElementById('view-front');
            const backBtn = document.getElementById('view-back');
            const leftBtn = document.getElementById('view-left');
            const rightBtn = document.getElementById('view-right');
            const topBtn = document.getElementById('view-top');
            const zoomInBtn = document.getElementById('zoom-in');
            const zoomOutBtn = document.getElementById('zoom-out');

            if (frontBtn && this.model3d) {
                frontBtn.addEventListener('click', () => this.model3d.setCameraPosition('front'));
                backBtn.addEventListener('click', () => this.model3d.setCameraPosition('back'));
                leftBtn.addEventListener('click', () => this.model3d.setCameraPosition('left'));
                rightBtn.addEventListener('click', () => this.model3d.setCameraPosition('right'));
                topBtn.addEventListener('click', () => this.model3d.setCameraPosition('top'));
                zoomInBtn.addEventListener('click', () => this.model3d.zoom(0.2));
                zoomOutBtn.addEventListener('click', () => this.model3d.zoom(-0.2));
            }
        }, 500);
    }

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot.querySelector('#cat-info-container') || this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();

        this.model3d = new Cat3DModelComponent('cat-3d-container', data.modelPath);
        await this.model3d.init();
        this.setupCameraControls();

        this.demonstrateFunctionsOnPage();

        const catDetail = new CatDetailComponent(document.getElementById('cat-info-container'));
        catDetail.render(data);
    }

    demonstrateFunctionsOnPage() {
        console.log(' Демонстрация на странице кошки ');

        const allCats = this.getAllCatsData();
        const allChipNumbers = allCats.map(cat => cat.chipNumber);
        const uniqueChipSum = sumUnique(allChipNumbers);
        console.log('2.8 Сумма уникальных номеров чипов всех кошек:', uniqueChipSum);

        const agesWithInvalid = [2, 0, 3, null, 1, undefined, '', 5];
        const validAges = erase(agesWithInvalid);
        console.log('1.10 Валидные возраста кошек:', validAges);

        const currentHour = new Date().getHours();
        const availableCat = getAvailableCatAfterTime(allCats, currentHour);
        if (availableCat) {
            console.log(`Цикл с постусловием (${currentHour} ч.): доступная кошка - ${availableCat.title}`);
        } else {
            console.log(`Цикл с постусловием (${currentHour} ч.): доступных кошек нет`);
        }

        console.log('====================================================');
    }
}
