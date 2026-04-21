import { BackButtonComponent } from "../back-button/index.js";

export class EquipmentDetailComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card mb-4 mt-4" style="width: 100%;">
                    <div class="row g-0">
                        <div class="col-md-6">
                            <img src="${data.src}" class="img-fluid rounded-start" alt="${data.title}" style="height: 400px; width: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                                <h2 class="card-title">${data.title}</h2>
                                <p class="card-text">
                                    <strong>Тип:</strong> ${data.type}<br>
                                    <strong>Характеристики:</strong> ${data.magnification || data.speed || data.temperature}<br>
                                    <strong>Точность/Емкость:</strong> ${data.resolution || data.capacity || data.accuracy}<br>
                                    <strong>Описание:</strong> ${data.text}
                                </p>
                                <div class="mt-4">
                                    <h5>Особенности:</h5>
                                    <ul>
                                        <li>Сертифицированное оборудование</li>
                                        <li>Гарантийное обслуживание</li>
                                        <li>Калибровка включена</li>
                                        <li>Обучение персонала</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
