export class NotificationComponent {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        if (!document.querySelector('.notification-toast-container')) {
            const container = document.createElement('div');
            container.className = 'notification-toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '1080';
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.querySelector('.notification-toast-container');
        }
    }

    getHTML(message, type) {
        const bgColor = {
            'success': 'bg-success',
            'info': 'bg-info',
            'warning': 'bg-warning',
            'error': 'bg-danger'
        }[type] || 'bg-primary';

        const icon = {
            'success': '✅',
            'info': 'ℹ️',
            'warning': '⚠️',
            'error': '❌'
        }[type] || '📢';

        const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        return `
            <div id="${id}" class="toast align-items-center text-white ${bgColor} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="5000">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${icon}</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
    }

    show(message, type = 'info', duration = 5000) {
        const html = this.getHTML(message, type);
        this.container.insertAdjacentHTML('beforeend', html);

        const toastElement = this.container.lastElementChild;

        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: duration
            });
            toast.show();
        } else {
            toastElement.classList.add('show');
            setTimeout(() => {
                toastElement.remove();
            }, duration);
        }

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}
