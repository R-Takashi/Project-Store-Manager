const { expect } = require('chai');
const { describe } = require('mocha');
const sinon = require('sinon');
const mocks = require('../../../__tests__/_dataMock');

const connection = require("../../../models/connection");
const productsModel = require("../../../models/productsModel");

describe("Test productsModels - Requisito 2", () => {

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
});