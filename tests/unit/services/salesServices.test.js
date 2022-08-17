const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const mocks = require("../../../__tests__/_dataMock");
const salesService = require("../../../services/salesService");
const salesModel = require("../../../models/salesModel");
const productsModel = require("../../../models/productsModel");

describe("Test salesServices", () => {
  describe("Retorna todas as vendas", () => {
    describe("Caso não existirem", () => {
      before(function () {
        const resultExecute = [];
        sinon.stub(salesModel, "getAll").resolves(resultExecute);
      });
      after(function () {
        salesModel.getAll.restore();
      });

      it("Retorna um array", async function () {
        const result = await salesService.getAll();
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await salesService.getAll();
        expect(result).to.be.empty;
      });
    });

    describe("Caso existirem", () => {
      const sale = [
        {
          saleId: 1,
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2,
        },
        {
          saleId: 1,
          date: "2021-09-09T04:54:54.000Z",
          productId: 2,
          quantity: 2,
        },
      ];

      before(function () {
        const resultExecute = sale;
        sinon.stub(salesModel, "getAll").resolves(resultExecute);
      });

      after(function () {
        salesModel.getAll.restore();
      });

      it("Retorna um array", async function () {
        const result = await salesService.getAll();
        expect(result).to.be.an("array");
      });

      it("O array contém itens", async function () {
        const result = await salesService.getAll();
        expect(result).to.be.not.empty;
      });

      it("O array contém itens do tipo objeto", async function () {
        const result = await salesService.getAll();
        expect(result[0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "saleId", "date", "productId" e "quantity"', async function () {
        const result = await salesService.getAll();
        expect(result[0]).to.include.all.keys(
          "saleId",
          "date",
          "productId",
          "quantity"
        );
      });
    });
  });

  describe("Retorna uma venda pelo id na rota /sales/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [];
        sinon.stub(salesModel, "getById").resolves(resultExecute);
      });

      after(function () {
        salesModel.getById.restore();
      });

      it('Retorna "false"', async function () {
        const result = await salesService.getById(1);
        expect(result).to.be.false;
      });
    });

    describe("Caso existirem", () => {
      const sale = [
        {
          saleId: 1,
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2,
        },
      ];

      before(function () {
        const resultExecute = sale;
        sinon.stub(salesModel, "getById").resolves(resultExecute);
      });

      after(function () {
        salesModel.getById.restore();
      });

      it("Retorna um array", async function () {
        const result = await salesService.getById(1);
        expect(result).to.be.an("array");
      });

      it("O array contém itens", async function () {
        const result = await salesService.getById(1);
        expect(result).to.be.not.empty;
      });

      it("O array contém itens do tipo objeto", async function () {
        const result = await salesService.getById(1);
        expect(result[0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "saleId", "date", "productId" e "quantity"', async function () {
        const result = await salesService.getById(1);
        expect(result[0]).to.include.all.keys(
          "saleId",
          "date",
          "productId",
          "quantity"
        );
      });
    });
  });

  describe("Adiciona uma venda pela rota /sales", () => {
    describe("Caso produto não existir", () => { 
      before(function () {
        const resultExecute = mocks.allProductsResponse;
        sinon.stub(productsModel, "getAll").resolves(resultExecute);
      });
  
      after(function () {
        productsModel.getAll.restore();
      });
  
      it('Retorna "false" caso produto não exista', async function () {
        const result = await salesService.add(
          mocks.nonexistentProductIdBody
        );
        expect(result).to.be.false;
      });
    });

    describe("Caso produto existir", () => { 
      before(function () {
        const resultExecute = 3;
        sinon.stub(salesModel, "addNewSale").resolves(resultExecute);
      });
  
      after(function () {
        salesModel.addNewSale.restore();
      });
  
      it('Retorna um objeto com os dados da venda', async function () {
        const result = await salesService.add(
          mocks.rightSaleBody
        );
        expect(result).to.be.an("object");
        expect(result).to.be.eql(mocks.saleCreateResponse);
      });
    });
  });

  describe("Remove uma venda na rota /sales/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 0 };
        sinon.stub(salesModel, "remove").resolves(resultExecute);
      });

      after(function () {
        salesModel.remove.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await salesService.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "message" com o valor "Sale not found"', async function () {
        const result = await salesService.remove(1);
        expect(result.message).to.be.equal("Sale not found");
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 1 };
        sinon.stub(salesModel, "remove").resolves(resultExecute);
      });

      after(function () {
        salesModel.remove.restore();
      });

      it("Retorna uma string", async function () {
        const result = await salesService.remove(1);
        expect(result).to.be.an("string");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
        const result = await salesService.remove(1);
        expect(result).to.be.equal('removed');
      });
    });
  });

  describe("Atualiza uma venda na rota /sales/:id", () => {
    describe("Caso venda não existir", () => { 
      before(function () {
        const resultExecute = [];
        sinon.stub(salesModel, "getById").resolves(resultExecute);
      });
  
      after(function () {
        salesModel.getById.restore();
      });
  
      it('Retorna objeto com a propriedade "message" com o valor "Sale not found"', async function () {
        const result = await salesService.update(1, mocks.rightSaleBody);
        expect(result.message).to.be.equal("Sale not found");
      });
    });

    describe("Caso produto não existir", () => {
      before(function () {
        const resultExecute = mocks.allProductsResponse;
        sinon.stub(productsModel, "getAll").resolves(resultExecute);
      });

      after(function () {
        productsModel.getAll.restore();
      });

      it('Retorna objeto com a propriedade "message" com o valor "Product not found"', async function () {
        const result = await salesService.update(
          1,
          mocks.nonexistentProductIdBody
        );
        expect(result.message).to.be.equal("Product not found");
      });
    });

    describe("Caso produto existir", () => { 
      it('Retorna um objeto com os dados atualizados', async function () {
        const updatedSale = {
          saleId: 1,
          itemsUpdated: mocks.otherProductIdSaleBody,
        };
        const result = await salesService.update(
          1,
          mocks.otherProductIdSaleBody
        );
        expect(result).to.be.eql(updatedSale);
      });
    });
  });
});