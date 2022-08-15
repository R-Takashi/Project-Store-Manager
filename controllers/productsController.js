const productsService = require('../services/productsService');

const ERROR_MESSAGE = 'Server error';

const getAll = async (req, res) => { 
  try {
    const products = await productsService.getAll();
    return res.status(200).json(products);
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const add = async (req, res) => {
  const { name } = req.body;
  
  try {
    const newProduct = await productsService.add(name);

    return res.status(201).json(newProduct);
  } catch (error) { 
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const update = async (req, res) => { 
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedProduct = await productsService.update(id, name);

    if (updatedProduct.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ id, name });
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  update,
};