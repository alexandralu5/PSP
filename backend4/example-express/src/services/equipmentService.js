const fileService = require('./fileService');

// Переменная для хранения пути к файлу данных, будет установлена при инициализации
let dataFilePath;

// Функция инициализации сервиса с путем к файлу данных
const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const equipment = fileService.readData(dataFilePath);
    if (title) {
        return equipment.filter(stock =>
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return equipment;
};

const findOne = (id) => {
    const equipment = fileService.readData(dataFilePath);
    return equipment.find(equipment => equipment.id === id);
};

const create = (equipmentData) => {
    const equipment = fileService.readData(dataFilePath);

    // Генерация ID: берем максимальный ID + 1
    const newId = equipment.length > 0
        ? Math.max(...equipment.map(s => s.id)) + 1
        : 1;

    const newStock = { id: newId, ...equipmentData };
    equipment.push(newStock);
    fileService.writeData(dataFilePath, equipment);

    return newStock;
};

const update = (id, equipmentData) => {
    const equipment = fileService.readData(dataFilePath);
    const index = equipment.findIndex(s => s.id === id);

    if (index === -1) return null;

    equipment[index] = { ...equipment[index], ...equipmentData };
    fileService.writeData(dataFilePath, equipment);

    return equipment[index];
};

const remove = (id) => {
    const equipment = fileService.readData(dataFilePath);
    const filteredStocks = equipment.filter(s => s.id !== id);

    if (filteredStocks.length === equipment.length) {
        return false; // Ничего не удалили
    }

    fileService.writeData(dataFilePath, filteredStocks);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
