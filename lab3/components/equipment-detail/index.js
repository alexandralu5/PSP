export class EquipmentDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card mb-4 mt-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${data.src}" class="img-fluid rounded-start" alt="${data.title}" style="height: 400px; width: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">${data.title}</h2>
                                <p class="card-text">
                                    <strong>Тип:</strong> ${data.type}<br>
                                    <strong>Мощность:</strong> ${data.magnification || data.speed || data.temperature}<br>
                                    <strong>Вместительность:</strong> ${data.resolution || data.capacity || data.accuracy}<br>
                                    <strong>Описание:</strong> ${data.text}
                                </p>
                                <div class="mt-4">
                                    <h5>Характеристики:</h5>
                                    <ul>
                                        <li>Сертифицированное оборудование</li>
                                        <li>Гарантийное обслуживание</li>
                                        <li>Калибровка включена</li>
                                    </ul>
                                </div>
                                <button class="btn btn-success btn-lg mt-3" id="order-button" data-id="${data.id}">
                                    Заказать оборудование
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    showNotification(message, type = 'success') {
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

        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.style.marginTop = '10px';
        notification.style.minWidth = '300px';
        notification.style.animation = 'slideInRight 0.3s ease';
        notification.style.backgroundColor = '#2e7d64';
        notification.style.color = 'white';
        notification.style.border = 'none';
        notification.style.borderLeft = '4px solid #1a5c48';
        notification.innerHTML = `
            <strong>✓</strong> ${message}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
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
        const orderButton = document.getElementById('order-button');
        if (orderButton) {
            orderButton.addEventListener('click', () => {
                this.showNotification(
                    `Спасибо за интерес к ${data.title}! Наш менеджер свяжется с вами в ближайшее время для оформления заказа.`,
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
