const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/equipment');
const stocksService = require('./services/equipmentService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '..', 'public')));

const DATA_FILE_PATH = path.join(__dirname, 'data/equipment.json');

stocksService.init(DATA_FILE_PATH);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/equipment', stocksRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
