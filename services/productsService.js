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

const remove = async (id) => { 
  const removedProduct = await productsModel.remove(id);
  return removedProduct;
};

const search = async (q) => { 
  if (q === '') {
    const products = await productsModel.getAll();
    return products;
  }

  const products = await productsModel.search(q);
  return products;
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
  search,
};