import { CatDetailComponent } from "../../components/cat-detail/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class CatPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const allCats = {
            1: {
                id: 1,
                src: "https://i.pinimg.com/736x/96/91/0c/96910c8a23f6b80db45a9333b1aa9a79.jpg",
                title: "Пуша",
                text: "Ласковая кошка, любит играть с клубком ниток. Очень дружелюбна к детям и другим животным.",
                breed: "Сиамская",
                age: "2 года",
                character: "Ласковая, игривая"
            },
            2: {
                id: 2,
                src: "https://i.pinimg.com/1200x/b8/59/54/b859544fcc7fdf1a79af2302fec88c62.jpg",
                title: "Барсик",
                text: "Энергичный кот, обожает охотиться за игрушками. Нуждается в активных играх и внимании.",
                breed: "Британский",
                age: "3 года",
                character: "Энергичный, активный"
            },
            3: {
                id: 3,
                src: "https://i.pinimg.com/1200x/f9/b9/e1/f9b9e1b498d84cb1e4bd3deb99792a9e.jpg",
                title: "Рыжик",
                text: "Спокойный и мудрый кот, любит спать на солнышке. Идеален для спокойной обстановки.",
                breed: "Персидский",
                age: "4 месяца",
                character: "Спокойный, ласковый"
            },
            4: {
                id: 4,
                src: "https://i.pinimg.com/736x/1e/af/80/1eaf80e28f0287bc24dd4b9a884ebda8.jpg",
                title: "Мурка",
                text: "Очень общительный кот, всегда рад новым знакомствам. Любит сидеть на руках.",
                breed: "Абиссинский",
                age: "1 год",
                character: "Общительный, дружелюбный"
            },
            5: {
                id: 5,
                src: "https://i.pinimg.com/736x/6f/7e/c0/6f7ec079e436a3971572c93abe2d9eb8.jpg",
                title: "Черныш",
                text: "Таинственный и грациозный кот. Предпочитает спокойную обстановку без шума.",
                breed: "Бомбейский",
                age: "4 года",
                character: "Грациозный, спокойный"
            },
            6: {
                id: 6,
                src: "https://i.pinimg.com/1200x/fd/89/c1/fd89c128e3b109f677a45243cdfef80f.jpg",
                title: "Симба",
                text: "Королевская осанка и гордый характер. Требует уважения и заботы.",
                breed: "Мейн-кун",
                age: "3 месяца",
                character: "Гордый, независимый"
            }
        };

        return allCats[this.id] || allCats[1];
    }

    get pageRoot() {
        return document.getElementById('cat-page');
    }

    getHTML() {
        return (
            `
                <div id="cat-page"></div>
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
        const catDetail = new CatDetailComponent(this.pageRoot);
        catDetail.render(data);
    }
}
