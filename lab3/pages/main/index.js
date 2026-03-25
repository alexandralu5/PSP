import { ProductCardComponent } from "../../components/product-card/index.js";
import { CatPage } from "../cat/index.js";

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
                    <h1 class="text-center mb-4">🐾 Кошкин дом </h1>
                    <p class="text-center text-muted mb-4">Нажмите "Подробнее", чтобы узнать больше о каждой кошке</p>
                    <div id="main-page" class="row row-cols-1 row-cols-md-3 g-4"></div>
                </div>
            `
        );
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://i.pinimg.com/736x/96/91/0c/96910c8a23f6b80db45a9333b1aa9a79.jpg",
                title: "Пуша",
                text: "",
                breed: "Сиамская",
                age: "2 года",
                character: "Ласковая, игривая"
            },
            {
                id: 2,
                src: "https://i.pinimg.com/1200x/b8/59/54/b859544fcc7fdf1a79af2302fec88c62.jpg",
                title: "Барсик",
                text: "",
                breed: "Британский",
                age: "3 года",
                character: "Энергичный, активный"
            },
            {
                id: 3,
                src: "https://i.pinimg.com/1200x/f9/b9/e1/f9b9e1b498d84cb1e4bd3deb99792a9e.jpg",
                title: "Рыжик",
                text: "",
                breed: "Персидский",
                age: "4 месяца",
                character: "Спокойный, ласковый"
            },
            {
                id: 4,
                src: "https://i.pinimg.com/736x/1e/af/80/1eaf80e28f0287bc24dd4b9a884ebda8.jpg",
                title: "Мурка",
                text: "",
                breed: "Абиссинский",
                age: "1 год",
                character: "Общительный, дружелюбный"
            },
            {
                id: 5,
                src: "https://i.pinimg.com/736x/6f/7e/c0/6f7ec079e436a3971572c93abe2d9eb8.jpg",
                title: "Черныш",
                text: "",
                breed: "Бомбейский",
                age: "4 года",
                character: "Грациозный, спокойный"
            },
            {
                id: 6,
                src: "https://i.pinimg.com/1200x/fd/89/c1/fd89c128e3b109f677a45243cdfef80f.jpg",
                title: "Симба",
                text: "",
                breed: "Мейн-кун",
                age: "3 месяца",
                character: "Гордый, независимый"
            }
        ];
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const catPage = new CatPage(this.parent, cardId);
        catPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }
}
