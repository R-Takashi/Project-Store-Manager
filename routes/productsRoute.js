const { Router } = require('express');
const productsController = require('../controllers/productsController');

const isValid = require('../middlewares/isValidProduct');

const productsRoute = Router();

productsRoute.get('/', productsController.getAll);

productsRoute.get('/:id', productsController.getById);

productsRoute.post('/', isValid.validName, productsController.add);

productsRoute.put('/:id', isValid.validName, productsController.update);

module.exports = productsRoute;