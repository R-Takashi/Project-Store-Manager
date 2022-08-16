const { expect } = require('chai');
const { describe } = require('mocha');
const sinon = require('sinon');
const mocks = require('../../../__tests__/_dataMock');

const connection = require("../../../models/connection");
const productsModel = require("../../../models/productsModel");

describe("Test productsModels", () => {

  describe("Retorna todos os produtos", () => {
    describe("Caso não existirem", () => {
      before(function () {
        const resultExecute = [[], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });
  
      it("Retorna um array", async function () {
        const result = await productsModel.getAll();
        expect(result).to.be.an("array");
      });
  
      it("O array esteja vazio", async function () {
        const result = await productsModel.getAll();
        expect(result).to.be.empty;
      });
    })
    
    describe("Caso existirem", () => {
      before(function () {
        const resultExecute = [[...mocks.allProductsResponse], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsModel.getAll();
        expect(result).to.be.an("array");
      });

      it("O array contém itens", async function () {
        const result = await productsModel.getAll();
        expect(result).to.be.not.empty;
      });
      
      it("O array contém itens do tipo objeto", async function () {
        const result = await productsModel.getAll();
        expect(result[0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "id" e "name"', async function () {
        const result = await productsModel.getAll();
        expect(result[0]).to.include.all.keys("id", "name");
      });
    });

  });

  describe("Retorna o produto correto na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [[], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });
      
      after(function () {
        connection.execute.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsModel.getById(1);
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await productsModel.getById(1);
        expect(result).to.be.empty;
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = [[mocks.allProductsResponse[0]], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsModel.getById(1);
        expect(result).to.be.an("array");
      });

      it("O array contém itens", async function () {
        const result = await productsModel.getById(1);
        expect(result).to.be.not.empty;
      });

      it("O array possui apenas um item do tipo objeto", async function () {
        const result = await productsModel.getById(1);
        expect(result[0]).to.be.an("object");
        expect(result[1]).to.be.undefined;
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        const result = await productsModel.getById(1);
        expect(result).to.eql([mocks.allProductsResponse[0]]);
      });
    });
  })

  describe("Adiciona um produto corretamente na rota /product", () => {
  
    before(function () {
      const resultExecute = [{ affectedRows: 1, insertId: 4 }, []];
      sinon.stub(connection, "execute").resolves(resultExecute);
    });

    after(function () {
      connection.execute.restore();
    });

    it("Retorna um objeto", async function () {
      const result = await productsModel.add("Produto1");
      expect(result).to.be.an("object");
    });

    it('O objeto tem as propriedades: "id" e "name"', async function () {
      const result = await productsModel.add("Produto1");
      expect(result).to.eql(mocks.productCreateResponse);
    });
  });

  describe("Atualiza o produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [{ affectedRows: 0 }, []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsModel.update(1, "Produto Teste");
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 0', async function () {
        const result = await productsModel.update(1, "Produto Teste");
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
        const result = await productsModel.update(1, "Produto Teste");
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
        const result = await productsModel.update(1, "Produto Teste");
        expect(result.affectedRows).to.be.equal(1);
      });
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
        const result = await productsModel.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 0', async function () {
        const result = await productsModel.remove(1);
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
        const result = await productsModel.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
        const result = await productsModel.remove(1);
        expect(result.affectedRows).to.be.equal(1);
      });
    });
  });

  describe("Retorna o(s) produto(s) correto(s) na rota /product/search", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [[], []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsModel.getById("Produto Teste");
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await productsModel.getById("Produto Teste");
        expect(result).to.be.empty;
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = [mocks.productSearchNameResponse, []];
        sinon.stub(connection, "execute").resolves(resultExecute);
      });

      after(function () {
        connection.execute.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsModel.search("Martelo");
        expect(result).to.be.an("array");
      });

      it("O array contém itens do tipo objeto", async function () {
        const result = await productsModel.search("Martelo");
        expect(result).to.be.not.empty;
        expect(result[0]).to.be.an("object");
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        const result = await productsModel.search("Martelo");
        expect(result).to.eql(mocks.productSearchNameResponse);
      });
    });
  });
});