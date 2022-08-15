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

const update = async (id, name) => { 
    const updatedProduct = await productsModel.update(id, name);
    return updatedProduct;
};

module.exports = {
  getAll,
  getById,
  add,
  update,
};