export class EquipmentUrls {
    constructor() {
        // ВСЕГДА используем относительные пути, так как бэкенд раздает статику
        this.baseUrl = '';
    }

    getEquipment() {
        return `/equipment`;
    }

    getEquipmentById(id) {
        return `/equipment/${id}`;
    }

    createEquipment() {
        return `/equipment`;
    }

    removeEquipmentById(id) {
        return `/equipment/${id}`;
    }

    updateEquipmentById(id) {
        return `/equipment/${id}`;
    }
}

export const equipmentUrls = new EquipmentUrls();
