const salesModel = require('../models/salesModel');
const productsModel = require('../models/productsModel');

const add = async (sale) => {
  const productsList = await productsModel.getAll();

  const allValids = sale.every((item) =>
    productsList.some((product) => product.id === item.productId));

  if (allValids === false) {
    return false;
  }

  const createNewSale = await salesModel.addNewSale(sale);

  const listSold = {
    id: createNewSale,
    itemsSold: sale,
  };

  return listSold;
};

const getAll = async () => { 
  const sales = await salesModel.getAll();
  return sales;
};

const getById = async (id) => { 
  const sale = await salesModel.getById(id);

  if (sale.length === 0) { 
    return false;
  }
  return sale;
};

const remove = async (id) => { 
  const removedSale = await salesModel.remove(id);
  if (removedSale.affectedRows === 0) { 
    return { message: 'Sale not found' };
  }

  return 'removed';
};

const update = async (id, sale) => {
  const validSale = await salesModel.getById(id);
  
  if (validSale.length === 0) {
    return { message: 'Sale not found' };
  }

  const productsList = await productsModel.getAll();

  const allValids = sale.every((item) =>
    productsList.some((product) => product.id === item.productId));

  if (allValids === false) {
    return { message: 'Product not found' };
  }

  await salesModel.update(id, sale);

  return {
    saleId: id,
    itemsUpdated: sale,
  };
};

module.exports = {
  add,
  getAll,
  getById,
  remove,
  update,
};