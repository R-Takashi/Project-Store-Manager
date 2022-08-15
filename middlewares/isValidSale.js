const validSale = (req, res, next) => {
  const newSale = req.body;

  switch (true) {
    case newSale.some((item) => item.productId === undefined):
      return res.status(400).json({ message: '"productId" is required' });
    
    case newSale.some((item) => item.quantity === undefined):
      return res.status(400).json({ message: '"quantity" is required' });
    
    case newSale.some((item) => item.quantity < 1):
      return res
        .status(422)
        .json({ message: '"quantity" must be greater than or equal to 1' });
    
    default:
      next();
  }
};

module.exports = { validSale };