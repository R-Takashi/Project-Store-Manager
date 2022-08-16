const { Router } = require('express');
const salesController = require('../controllers/salesController');

const isValid = require('../middlewares/isValidSale');

const salesRoute = Router();

salesRoute.post('/', isValid.validSale, salesController.add);

salesRoute.get('/', salesController.getAll);

salesRoute.get('/:id', salesController.getById);

salesRoute.delete('/:id', salesController.remove);

salesRoute.put('/:id', isValid.validSale, salesController.update);

module.exports = salesRoute;