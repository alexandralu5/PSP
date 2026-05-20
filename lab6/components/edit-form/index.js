export class EditFormComponent {
    constructor(parent, equipmentId = null, isSixthLab = true) {
        this.parent = parent;
        this.equipmentId = equipmentId;
        this.isSixthLab = isSixthLab; // true = 6 лаба (кнопки активны)
    }

    getHTML(data) {
        const isEdit = this.equipmentId !== null;

        const title = isEdit ? `Редактирование: ${data.title}` : 'Добавление нового оборудования';
        const buttonText = isEdit ? '💾 Сохранить изменения' : '➕ Создать';

        return (
            `
                <div class="card mb-4 mt-4">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">${title}</h3>
                    </div>
                    <div class="card-body">
                        <form id="equipment-form">
                            <div class="mb-3">
                                <label for="title" class="form-label">Название *</label>
                                <input type="text" class="form-control" id="title" name="title" value="${this.escapeHtml(data.title || '')}" required>
                            </div>

                            <div class="mb-3">
                                <label for="type" class="form-label">Тип оборудования *</label>
                                <input type="text" class="form-control" id="type" name="type" value="${this.escapeHtml(data.type || '')}" required>
                            </div>

                            <div class="mb-3">
                                <label for="text" class="form-label">Описание</label>
                                <textarea class="form-control" id="text" name="text" rows="3">${this.escapeHtml(data.text || '')}</textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="char1" class="form-label">Характеристика 1</label>
                                    <input type="text" class="form-control" id="char1" name="char1" value="${this.escapeHtml(data.char1 || '')}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="char2" class="form-label">Характеристика 2</label>
                                    <input type="text" class="form-control" id="char2" name="char2" value="${this.escapeHtml(data.char2 || '')}">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="image" class="form-label">URL изображения</label>
                                <input type="url" class="form-control" id="image" name="image" value="${this.escapeHtml(data.src || '')}">
                            </div>

                            <div class="d-flex gap-2 mt-3">
                                <button type="button" class="btn btn-success" id="save-button">
                                    ${buttonText}
                                </button>
                                <button type="button" class="btn btn-info" id="preview-button">
                                    👁️ Предпросмотр
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `
        );
    }

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getFormData() {
        return {
            title: document.getElementById('title')?.value || '',
            type: document.getElementById('type')?.value || '',
            text: document.getElementById('text')?.value || '',
            char1: document.getElementById('char1')?.value || '',
            char2: document.getElementById('char2')?.value || '',
            src: document.getElementById('image')?.value || 'https://cdn.pixabay.com/photo/2016/06/13/12/44/microscope-1454130_640.jpg'
        };
    }

    showPreview(data) {
        const previewHtml = `
            <div class="card mt-4">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">👁️ Предпросмотр карточки</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${data.src}" class="img-fluid rounded" alt="${data.title}" style="max-height: 150px; width: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        </div>
                        <div class="col-md-8">
                            <h5>${data.title || '(без названия)'}</h5>
                            <p class="text-muted">${data.type || '(без типа)'}</p>
                            <p>${data.text || '(без описания)'}</p>
                            <p><strong>Характеристики:</strong> ${data.char1} | ${data.char2}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const oldPreview = document.getElementById('form-preview');
        if (oldPreview) oldPreview.remove();

        const previewContainer = document.createElement('div');
        previewContainer.id = 'form-preview';
        previewContainer.innerHTML = previewHtml;
        const formElement = document.getElementById('equipment-form');
        if (formElement && formElement.parentNode) {
            formElement.parentNode.insertBefore(previewContainer, formElement.nextSibling);
        }
    }

    addListeners(data, onSave, onPreview) {
        const saveButton = document.getElementById('save-button');
        const previewButton = document.getElementById('preview-button');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                if (onSave) onSave(this.getFormData());
            });
        }

        if (previewButton) {
            previewButton.addEventListener('click', () => {
                const formData = this.getFormData();
                this.showPreview(formData);
                if (onPreview) onPreview(formData);
            });
        }
    }

    render(data, onSave, onPreview) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, onSave, onPreview);
    }
}
