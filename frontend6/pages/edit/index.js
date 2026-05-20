import { EditFormComponent } from "../../components/edit-form/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { equipmentUrls } from "../../modules/equipmentUrls.js";

export class EditPage {
    constructor(parent, equipmentId = null) {
        this.parent = parent;
        this.equipmentId = equipmentId;
        this.equipmentData = null;
    }

    get pageRoot() {
        return document.getElementById('edit-page');
    }

    getHTML() {
        return (
            `
                <div id="edit-page" class="container py-4"></div>
            `
        );
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    // Загрузка данных существующей карточки через AJAX
    loadEquipmentData() {
        return new Promise((resolve, reject) => {
            ajax.get(equipmentUrls.getEquipmentById(this.equipmentId), (data, status) => {
                if (status === 200 && data) {
                    resolve(data);
                } else {
                    reject(new Error('Ошибка загрузки данных'));
                }
            });
        });
    }

    // Сохранение данных (активно для 6 лабораторной)
    saveEquipment(formData) {
        const sendData = {
            title: formData.title,
            type: formData.type,
            text: formData.text,
            char1: formData.char1,
            char2: formData.char2,
            src: formData.src
        };

        if (this.equipmentId) {
            const url = equipmentUrls.updateEquipmentById(this.equipmentId);
            console.log('PUT URL:', url);  // ДОБАВИТЬ
            console.log('PUT Data:', sendData);  // ДОБАВИТЬ

            ajax.put(url, sendData, (data, status) => {
                console.log('PUT Response status:', status);  // ДОБАВИТЬ
                console.log('PUT Response data:', data);  // ДОБАВИТЬ
                if (status === 200) {
                    setTimeout(() => this.clickBack(), 1000);
                }
            });
        } else {
            const url = equipmentUrls.createEquipment();
            console.log('POST URL:', url);  // ДОБАВИТЬ

            ajax.post(url, sendData, (data, status) => {
                console.log('POST Response status:', status);  // ДОБАВИТЬ
                if (status === 201 || status === 200) {
                    setTimeout(() => this.clickBack(), 1000);
                }
            });
        }
    }

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        // Показываем индикатор загрузки
        const loadingHtml = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Загрузка данных с сервера...</p>
            </div>
        `;
        this.pageRoot.insertAdjacentHTML('beforeend', loadingHtml);

        let data = {
            title: '',
            type: '',
            text: '',
            char1: '',
            char2: '',
            src: ''
        };

        // Если это редактирование существующей карточки - загружаем данные
        if (this.equipmentId) {
            try {
                const loadedData = await this.loadEquipmentData();
                if (loadedData) {
                    data = {
                        title: loadedData.title || '',
                        type: loadedData.type || '',
                        text: loadedData.text || '',
                        char1: loadedData.char1 || loadedData.magnification || loadedData.speed || loadedData.temperature || '',
                        char2: loadedData.char2 || loadedData.resolution || loadedData.capacity || loadedData.accuracy || '',
                        src: loadedData.src || loadedData.image || ''
                    };
                }
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        }

        // Удаляем индикатор загрузки
        const loadingDiv = this.pageRoot.querySelector('.text-center');
        if (loadingDiv) loadingDiv.remove();

        // 6 лабораторная: isSixthLab = true (кнопки АКТИВНЫ)
        const editForm = new EditFormComponent(this.pageRoot, this.equipmentId, true);
        editForm.render(data, this.saveEquipment.bind(this), (formData) => {
            console.log('Preview data:', formData);
        });
    }
}
