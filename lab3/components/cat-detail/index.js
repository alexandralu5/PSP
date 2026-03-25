export class CatDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card mb-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${data.src}" class="img-fluid rounded-start" alt="${data.title}" style="height: 400px; width: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">🐱 ${data.title}</h2>
                                <p class="card-text">
                                    <strong>Порода:</strong> ${data.breed}<br>
                                    <strong>Возраст:</strong> ${data.age}<br>
                                    <strong>Характер:</strong> ${data.character}<br>
                                </p>
                                <div class="mt-4">
                                    <h5>Информация о здоровье:</h5>
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
            `
        );
    }

    showNotification(message, type = 'success') {
        // Создаем контейнер для уведомлений, если его нет
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.marginTop = '10px';
        notification.style.minWidth = '300px';
        notification.style.animation = 'slideInRight 0.3s ease';
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

        // Добавляем обработчик для кнопки закрытия
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
                this.showNotification(
                    `Спасибо за интерес к ${data.title}! Наш менеджер свяжется с вами!`,
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
