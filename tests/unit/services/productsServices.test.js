const { expect } = require("chai");
const { describe } = require("mocha");
const sinon = require("sinon");
const mocks = require("../../../__tests__/_dataMock");
const productsService = require("../../../services/productsService");
const productsModel = require("../../../models/productsModel");

describe("Test productsService - Requisito 2", () => {

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
});
