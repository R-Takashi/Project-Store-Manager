const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../../__tests__/_dataMock");
const productsController = require("../../../controllers/productsController");
const productsService = require("../../../services/productsService");


describe("Test productsControllers - Requisito 2", () => {

  describe("Retorna todos os produtos", () => {
    describe("Caso não existirem", () => {
      const response = {};
      const request = {};
      before(function () {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "getAll").resolves([]);
      });

      after(function () {
        productsService.getAll.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array vazio", async function () {
        await productsController.getAll(request, response);
        expect(response.json.args[0][0]).to.be.empty;
        expect(response.json.calledWith([])).to.be.equal(true);
      });
    });

    describe("Caso existirem", () => {
      const response = {};
      const request = {};
      before(function () {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "getAll").resolves(mocks.allProductsResponse);
      });

      after(function () {
        productsService.getAll.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array", async function () {
        await productsController.getAll(request, response);
        expect(response.json.calledWith(mocks.allProductsResponse)).to.be.equal(true);
      });

      it("O array contém itens do tipo objeto", async function () {
        await productsController.getAll(request, response);
        expect(response.json.args[0][0]).to.not.empty;
        expect(response.json.args[0][0][0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "id" e "name"', async function () {
        await productsController.getAll(request, response);
        expect(response.json.args[0][0][0]).to.all.keys("id", "name");
      })
    });
  });

  describe("Retorna o produto correto na rota /product/:id", () => {
    describe("Caso não existir", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = 1;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "getById").resolves();
      });
      
      after(function () {
        productsService.getById.restore();
      });
      
      it("Retorna o status 404", async function () {
        await productsController.getById(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('Retorna um objeto com a chave/valor -> message: "Product not found"', async function () {
        const message = { message: "Product not found" };
        await productsController.getById(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe("Caso existir", () => {
      const response = {};
      const request = {};
      const product = mocks.allProductsResponse[0];
      before(function () {
        request.params = '1';
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "getById").resolves(product);
      });

      after(function () {
        productsService.getById.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await productsController.getById(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        await productsController.getById(request, response);
        expect(response.json.args[0][0]).to.all.keys("id", "name");
      });

      it("Retorna o produto correto", async function () {
        await productsController.getById(request, response);
        expect(response.json.args[0][0]).to.eql(product);
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /product", () => {
    const response = {};
    const request = {};
    before(function () {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, "getAll").rejects(new Error('Server-error'));
    })
    after(function () {
      productsService.getAll.restore();
    })

    it("Retorna o status 500", async function () {
      await productsController.getAll(request, response);
      expect(response.status.calledWith(500)).to.be.equal(true);
    })

    it('Retorna a mensagem de erro "Server error"', async function () {
      const ERROR_MESSAGE = "Server error";
      await productsController.getAll(request, response);
      expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
    });
  });

  describe("Testa erro de conexão com o banco na rota /product/:id", () => {
    const response = {};
    const request = {};
    before(function () {
      request.params = "1";
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, "getById").rejects(new Error("Server-error"));
    });
    after(function () {
      productsService.getById.restore();
    });

    it("Retorna o status 500", async function () {
      await productsController.getById(request, response);
      expect(response.status.calledWith(500)).to.be.equal(true);
    });

    it('Retorna a mensagem de erro "Server error"', async function () {
      const ERROR_MESSAGE = "Server error";
      await productsController.getById(request, response);
      expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
    });
  });
});