export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="col">
                    <div class="card cat-card h-100" data-id="${data.id}" style="cursor: pointer;">
                        <img src="${data.src}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text text-muted">${data.breed || 'Порода'}</p>
                            <p class="card-text">${data.text}</p>
                            <button class="btn btn-primary w-100" id="click-card-${data.id}" data-id="${data.id}">
                                Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            `
        );
    }

    addListeners(data, listener) {
        // Обработчик для кнопки
        const button = document.getElementById(`click-card-${data.id}`);
        if (button) {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                listener(e);
            });
        }

        // Обработчик для всей карточки 
        const card = document.querySelector(`.cat-card[data-id="${data.id}"]`);
        if (card) {
            card.addEventListener("click", (e) => {
                // Если клик не по кнопке, эмулируем клик по кнопке
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    const button = document.getElementById(`click-card-${data.id}`);
                    if (button) button.click();
                }
            });
        }
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}
