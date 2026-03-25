import {
    concatenate,
    merge
} from "../../utils/catUtils.js";

export class CatDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const traitsString = data.traits ? concatenate(data.traits, ' • ') : '';

        return (
            `
                <div class="card mb-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-12">
                            <div class="card-body">
                                <h2 class="card-title">🐱 ${data.title} </h2>
                                <p class="card-text">
                                    <strong>Порода:</strong> ${data.breed}<br>
                                    <strong>Возраст:</strong> ${data.age} ${data.age === 1 ? 'год' : (data.age < 5 ? 'года' : 'лет')}<br>
                                    <strong>Характер:</strong> ${data.character}<br>
                                    <strong>Особенности:</strong> ${traitsString || '—'}<br>
                                    <strong>Номер чипа:</strong> ${data.chipNumber || 'не указан'}
                                </p>
                                <div class="mt-4">
                                    <h5> Информация о здоровье:</h5>
                                    <ul>
                                        <li>✅ Привита</li>
                                        <li>✅ Стерилизована</li>
                                        <li>✅ Имеет ветеринарный паспорт</li>
                                        <li>✅ Приучена к лотку</li>
                                    </ul>
                                </div>
                                <button class="btn btn-success btn-lg mt-3" id="adopt-button" data-id="${data.id}">
                                    🏠 Забрать домой
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="attribution text-center">
                    3D модели: "Dingus the cat" by alwayshasbean
                    <a href="https://poly.pizza/m/Dingus-the-cat" target="_blank" rel="noopener noreferrer">[CC-BY] via Poly Pizza</a>
                </div>
            `
        );
    }

    showNotification(message, type = 'success') {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            <strong>${type === 'success' ? '✅' : 'ℹ️'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 150);
        }, 5000);

        const closeBtn = notification.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    }

    addListeners(data) {
        const adoptButton = document.getElementById('adopt-button');
        if (adoptButton) {
            adoptButton.addEventListener('click', () => {
                const basicInfo = {
                    name: data.title,
                    breed: data.breed,
                    age: data.age
                };
                const extraInfo = {
                    character: data.character,
                    chipNumber: data.chipNumber
                };
                const fullProfile = merge(basicInfo, extraInfo);

                this.showNotification(
                    ` Спасибо за интерес к ${fullProfile.name}! Наш менеджер свяжется с вами! `,
                    'success'
                );
            });
        }
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data);
    }
}
