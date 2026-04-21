export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
                <button class="btn btn-secondary mb-4" id="back-button">
                    ← Назад к списку оборудования
                </button>
            `
        );
    }

    addListeners(listener) {
        document
            .getElementById('back-button')
            .addEventListener('click', listener);
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
