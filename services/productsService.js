const productsModel = require('../models/productsModel');

const getAll = async () => {
  const products = await productsModel.getAll();
  return products;
};

const getById = async (id) => { 
    const product = await productsModel.getById(id);
    return product[0];
};

const add = async (name) => { 
    const newProduct = await productsModel.add(name);
    return newProduct;
};

module.exports = {
  getAll,
  getById,
  add,
};