const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const mocks = require("../../../__tests__/_dataMock");

const connection = require("../../../models/connection");
const salesModel = require("../../../models/salesModel");

describe("Test salesModels", () => {
  describe("Retorna todas as vendas", () => {
    describe("Caso não existirem", () => {
      before(function () {
        const resultExecute = [[], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });
      after(function () {
        connection.execute.restore();
      });
      it("Retorna um array", async function () {
        const result = await salesModel.getAll();
        expect(result).to.be.an("array");
      });
      it("O array esteja vazio", async function () {
        const result = await salesModel.getAll();
        expect(result).to.be.empty;
      });
    });

    describe("Caso existirem", () => {
      const sale = [
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:29.000Z",
          "productId": 1,
          "quantity": 2
        },
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:54.000Z",
          "productId": 2,
          "quantity": 2
        }
      ];

      before(function () {
        const resultExecute = [[...sale], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });
      after(function () {
        connection.execute.restore();
      });
      it("Retorna um array", async function () {
        const result = await salesModel.getAll();
        expect(result).to.be.an("array");
      });
      it("O array contém itens", async function () {
        const result = await salesModel.getAll();
        expect(result).to.be.not.empty;
      });
      it("O array contém itens do tipo objeto", async function () {
        const result = await salesModel.getAll();
        expect(result[0]).to.be.an("object");
      });
      it('Os objetos tenham as propriedades: "saleId", "date", "productId" e "quantity"', async function () {
        const result = await salesModel.getAll();
        expect(result[0]).to.include.all.keys("saleId", "date", "productId", "quantity");
      });
    });
  });
  
  describe("Retorna uma venda por id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [[], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });
      after(function () {
        connection.execute.restore();
      });
      it("Retorna um array", async function () {
        const result = await salesModel.getById(1);
        expect(result).to.be.an("array");
      });
      it("O array esteja vazio", async function () {
        const result = await salesModel.getById(1);
        expect(result).to.be.empty;
      });
    });
    describe("Caso existirem", () => {
      const sale = [
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:29.000Z",
          "productId": 1,
          "quantity": 2
        }
      ];
      before(function () {
        const resultExecute = [[...sale], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });
      after(function () {
        connection.execute.restore();
      });
      it("Retorna um array", async function () {
        const result = await salesModel.getById(1);
        expect(result).to.be.an("array");
      });
      it("O array contém itens", async function () {
        const result = await salesModel.getById(1);
        expect(result).to.be.not.empty;
      });
      it("O array contém itens do tipo objeto", async function () {
        const result = await salesModel.getById(1);
        expect(result[0]).to.be.an("object");
      });
      it('Os objetos tenham as propriedades: "saleId", "date", "productId" e "quantity"', async function () {
        const result = await salesModel.getById(1);
        expect(result[0]).to.include.all.keys("saleId", "date", "productId", "quantity");
      });
    });
  });

  describe("Adiciona uma venda", () => { 
    before(function () {
      const resultExecute = [{ insertId: 4 }, []];
      sinon.stub(connection, "execute").resolves(resultExecute);
    });

    after(function () {
      connection.execute.restore();
    });

    it('Retorna uma string contendo o "id" da venda', async function () {
      const result = await salesModel.addNewSale(mocks.rightSaleBody);
      expect(result).to.be.an("number");
    });
  });

  describe("Remove o produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [{ affectedRows: 0 }, []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await salesModel.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 0', async function () {
        const result = await salesModel.remove(1);
        expect(result.affectedRows).to.be.equal(0);
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = [{ affectedRows: 1 }, []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await salesModel.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
        const result = await salesModel.remove(1);
        expect(result.affectedRows).to.be.equal(1);
      });
    });
  });

  // describe("Atualiza uma venda", () => {
  //   before(function () {
  //     const resultExecute = [[], []];
  //     sinon.stub(connection, "execute").resolves(resultExecute);
  //   });

  //   after(function () {
  //     connection.execute.restore();
  //   });

  //   it('Chama a função', async function () {
  //     await salesModel.update(1, mocks.rightSaleBody);
  //     expect(salesModel.update).to.called(1, mocks.rightSaleBody);
  //     // expect(connection.execute).to.be.calledOnce;
  //   });
  // });
});