const connection = require('./connection');

const addNewSale = async (sale) => {
  const [newSale] = await connection.execute(
    'INSERT INTO StoreManager.sales (date) VALUES (NOW())',
  );

  await sale.forEach(async (product) => {
    await connection.execute(
      'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
      [newSale.insertId, product.productId, product.quantity],
    );
  });

  return newSale.insertId;
};

const getAll = async () => { 
  const [sales] = await connection.execute(
  `
  SELECT 
    s.id AS saleId,
    s.date AS date,
    sp.product_id as productId,
    sp.quantity as quantity
  FROM
    StoreManager.sales AS s
    INNER JOIN
    StoreManager.sales_products AS sp
      ON s.id = sp.sale_id
  `,
  );
  return sales;
};

const getById = async (id) => { 
  const [sale] = await connection.execute(
  `
  SELECT 
    s.date AS date,
    sp.product_id as productId,
    sp.quantity as quantity
  FROM
    StoreManager.sales AS s
    INNER JOIN
    StoreManager.sales_products AS sp
      ON s.id = sp.sale_id
  WHERE
    s.id = ?
  `, [id],
  );
  return sale;
};

const remove = async (id) => { 
  const [sale] = await connection.execute(
  'DELETE FROM StoreManager.sales WHERE id = ?', [id],
  );
  return sale;
};

const update = async (id, sale) => {
  const updateRows = await Promise.all(
    sale.map(async (product) => {
      const [row] = await connection.execute(
        `UPDATE StoreManager.sales_products 
        SET product_id = ?, 
            quantity = ?
        WHERE sale_id = ?
        AND product_id = ?`,
        [product.productId, product.quantity, id, product.productId],
      );
      return row.affectedRows;
    }),
  );
  
  const updateSucessTest = updateRows.every((row) => row === 1);

  return updateSucessTest;
};

module.exports = {
  addNewSale,
  getAll,
  getById,
  remove,
  update,
};