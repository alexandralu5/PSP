class EquipmentUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3001';
    }

    getEquipment() {
        return `${this.baseUrl}/equipment`;
    }

    getEquipmentById(id) {
        return `${this.baseUrl}/equipment/${id}`;
    }

    createEquipment() {
        return `${this.baseUrl}/equipment`;
    }

    removeEquipmentById(id) {
        return `${this.baseUrl}/equipment/${id}`;
    }

    updateEquipmentById(id) {
        return `${this.baseUrl}/equipment/${id}`;
    }
}

export const equipmentUrls = new EquipmentUrls();
