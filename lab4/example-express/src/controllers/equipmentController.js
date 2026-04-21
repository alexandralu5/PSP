const equipmentService = require('../services/equipmentService');

const getAllEquipment = (req, res) => {
    const { title } = req.query;
    const equipment = equipmentService.findAll(title);
    res.json(equipment);
};

const getEquipmentById = (req, res) => {
    const id = parseInt(req.params.id);
    const equipment = equipmentService.findOne(id);

    if (!equipment) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(equipment);
};

const createEquipment = (req, res) => {
    const { src, title, text } = req.body;

    // Простая валидация
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newStock = equipmentService.create({ src, title, text });
    res.status(201).json(newStock);
};

const updateEquipment = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedEquipment = equipmentService.update(id, req.body);

    if (!updatedEquipment) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(updatedEquipment);
};

const deleteEquipment = (req, res) => {
    const id = parseInt(req.params.id);
    const success = equipmentService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(204).send(); // 204 No Content
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};
