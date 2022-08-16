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

const getAll = async (req, res) => { 
  try {
    const sales = await salesService.getAll();

    return res.status(200).json(sales);
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const getById = async (req, res) => { 
  const { id } = req.params;

  try {
    const sale = await salesService.getById(id);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    return res.status(200).json(sale);
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const remove = async (req, res) => { 
  const { id } = req.params;

  try {
    const sale = await salesService.remove(id);

    if (sale.affectedRows === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    return res.status(204).end();
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

const update = async (req, res) => { 
  const { id } = req.params;
  const sale = req.body;

  try {
    const updatedSale = await salesService.update(id, sale);

    if (updatedSale.message) {
      return res.status(404).json(updatedSale);
    }

    return res.status(200).json(updatedSale);
  } catch (error) {
    // console.log(error);
    return res.status(500).json(ERROR_MESSAGE);
  }
};

module.exports = {
  add,
  getAll,
  getById,
  remove,
  update,
};