const salesService = require('../services/salesService');

const ERROR_MESSAGE = 'Server error';

const add = async (req, res) => {
  const sale = req.body;

  try {
    const newSale = await salesService.add(sale);

    if (!newSale) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(201).json(newSale);
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

module.exports = {
  add,
};