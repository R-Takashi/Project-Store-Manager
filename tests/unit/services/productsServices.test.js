const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const mocks = require("../../../__tests__/_dataMock");
const productsService = require("../../../services/productsService");
const productsModel = require("../../../models/productsModel");

describe("Test productsService ", () => {

  describe("Retorna todos os produtos", () => {
    describe("Caso não existirem", () => {
      before(function () {
        sinon.stub(productsModel, "getAll").resolves([]);
      });

      after(function () {
        productsModel.getAll.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsService.getAll();
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await productsService.getAll();
        expect(result).to.be.empty;
      });
    });

    describe("Caso existirem", () => {
      before(function () {
        sinon
          .stub(productsModel, "getAll")
          .resolves([...mocks.allProductsResponse]);
      });
      after(function () {
        productsModel.getAll.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsService.getAll();
        expect(result).to.be.an("array");
      });

      it("O array contém itens", async function () {
        const result = await productsService.getAll();
        expect(result).to.not.empty;
      });

      it("O array contém itens do tipo objeto", async function () {
        const result = await productsService.getAll();
        expect(result[0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "id" e "name"', async function () {
        const result = await productsService.getAll();
        expect(result[0]).to.all.keys("id", "name");
      });
    });
  });

  describe("Retorna o produto correto na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        sinon.stub(productsModel, "getById").resolves([{}]);
      });

      after(function () {
        productsModel.getById.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsService.getById(1);
        expect(result).to.be.an("object");
      });

      it("O objeto esteja vazio", async function () {
        const result = await productsService.getById(1);
        expect(result).to.be.empty;
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = [mocks.allProductsResponse[0]];
        sinon.stub(productsModel, "getById").resolves(resultExecute);
      });
      after(function () {
        productsModel.getById.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsService.getById(1);
        expect(result).to.be.an("object");
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        const result = await productsService.getById(1);
        expect(result).to.all.keys("id", "name");
      });

      it("Retorna o produto correto", async function () {
        const result = await productsService.getById(1);
        expect(result).to.eql(mocks.allProductsResponse[0]);
      });
    });
  });

  describe("Adiciona um produto corretamente na rota /product", () => {
    before(function () {
      const resultExecute = mocks.productCreateResponse;
      sinon.stub(productsModel, "add").resolves(resultExecute);
    });

    after(function () {
      productsModel.add.restore();
    });

    it("Retorna um objeto", async function () {
      const result = await productsService.add("Produto1");
      expect(result).to.be.an("object");
    });

    it('O objeto tem as propriedades: "id" e "name"', async function () {
      const result = await productsService.add("Produto1");
      expect(result).to.eql(mocks.productCreateResponse);
    });
  });

  describe("Atualiza o produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 0 };
        sinon.stub(productsModel, "update").resolves(resultExecute);
      });

      after(function () {
        productsModel.update.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsService.update(1, "Produto Teste");
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 0', async function () {
        const result = await productsService.update(1, "Produto Teste");
        expect(result).to.be.eql({ message: "Product not found" });
      });
    });
    describe("Caso existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 1 };
        sinon.stub(productsModel, "update").resolves(resultExecute);
      });

      after(function () {
        productsModel.update.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsService.update(1, "Produto Teste");
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
        const result = await productsService.update(1, "Produto Teste");
        expect(result).to.be.eql({ id: 1, name: "Produto Teste" });
      });
    });
  });

  describe("Remove o produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 0 };
        sinon.stub(productsModel, "remove").resolves(resultExecute);
      });

      after(function () {
        productsModel.remove.restore();
      });

      it("Retorna um objeto", async function () {
        const result = await productsService.remove(1);
        expect(result).to.be.an("object");
      });

      it('O objeto contem a propriedade "message"', async function () {
        const result = await productsService.remove(1);
        expect(result).to.be.eql({ message: "Product not found" });
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = { affectedRows: 1 };
        sinon.stub(productsModel, "remove").resolves(resultExecute);
      });

      after(function () {
        productsModel.remove.restore();
      });

      it("Retorna um booleano 'True'", async function () {
        const result = await productsService.remove(1);
        expect(result).to.be.true;
      });

      // it('O objeto contem a propriedade "affectedRows" com valor 1', async function () {
      //   const result = await productsService.remove(1);
      //   expect(result).to.be.equal(true);
      // });
    });
  });

  describe("Retorna o(s) produto(s) correto(s) na rota /product/search", () => {
    describe("Caso não existir", () => {
      before(function () {
        const resultExecute = [];
        sinon.stub(productsModel, "search").resolves(resultExecute);
      });

      after(function () {
        productsModel.search.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsService.search("Produto Teste");
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await productsService.search("Produto Teste");
        expect(result).to.be.empty;
      });
    });

    describe("Caso existir", () => {
      before(function () {
        const resultExecute = mocks.productSearchNameResponse;
        sinon.stub(productsModel, "search").resolves(resultExecute);
      });

      after(function () {
        productsModel.search.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsService.search("Martelo");
        expect(result).to.be.an("array");
      });

      it("O array contém itens do tipo objeto", async function () {
        const result = await productsService.search("Martelo");
        expect(result).to.be.not.empty;
        expect(result[0]).to.be.an("object");
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        const result = await productsService.search("Martelo");
        expect(result).to.eql(mocks.productSearchNameResponse);
      });
    });

    describe("Caso query esteja vazia", () => {
      before(function () {
        const resultExecute = mocks.allProductsResponse;
        sinon.stub(productsModel, "getAll").resolves(resultExecute);
      });

      after(function () {
        productsModel.getAll.restore();
      });

      it("Retorna um array", async function () {
        const result = await productsService.search("");
        expect(result).to.be.an("array");
      });

      it("O array esteja vazio", async function () {
        const result = await productsService.search("");
        expect(result).to.be.eql(mocks.allProductsResponse);
      });
    });
  });
});
