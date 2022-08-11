const productsService = require('../services/productsService');

const ERROR_MESSAGE = 'Server error';

const getAll = async (req, res) => { 
  try {
    const products = await productsService.getAll();
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const getById = async (req, res) => { 
  const { id } = req.params;

  try {
    const product = await productsService.getById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

module.exports = {
  getAll,
  getById,
};