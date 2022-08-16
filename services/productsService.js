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
  if (updatedProduct.affectedRows === 0) {
    return { message: 'Product not found' };
  }
  return { id, name };
};

const remove = async (id) => { 
  const removedProduct = await productsModel.remove(id);
  if (removedProduct.affectedRows === 0) {
    return { message: 'Product not found' };
  }
  return true;
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