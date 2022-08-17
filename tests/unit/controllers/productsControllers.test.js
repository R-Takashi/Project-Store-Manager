const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../../__tests__/_dataMock");
const productsController = require("../../../controllers/productsController");
const productsService = require("../../../services/productsService");


describe("Test productsControllers ", () => {

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

  describe("Adiciona um produto corretamente na rota /product", () => {
    const response = {};
    const request = {};
    const product = mocks.productCreateResponse;
    before(function () {
      request.body = "Produto1";
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      sinon.stub(productsService, "add").resolves(product);
    });

    after(function () {
      productsService.add.restore();
    });

    it("Retorna o status 201", async function () {
      await productsController.add(request, response);
      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it("Retorna um objeto", async function () {
      await productsController.add(request, response);
      expect(response.json.calledWith(product)).to.be.equal(true);
    });

    it('O objeto tem as propriedades: "id" e "name"', async function () {
      await productsController.add(request, response);
      expect(response.json.args[0][0]).to.all.keys("id", "name");
    });

    it("Retorna o produto Adicionado", async function () {
      await productsController.add(request, response);
      expect(response.json.args[0][0]).to.eql(product);
    });
  });
  
  describe("Atualiza um produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => { 
      const response = {};
      const request = {};
      const product = { message: "Product not found" };

      before(function () {
        request.params = { id: 4 };
        request.body = { name: "Produto1" };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "update").resolves(product);
      });

      after(function () {
        productsService.update.restore();
      });

      it("Retorna o status 404", async function () {
        await productsController.update(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await productsController.update(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it('O objeto tem a propriedade: "message', async function () {
        await productsController.update(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
      });

      it('Retorna o a mensagem "Product not Found"', async function () {
        await productsController.update(request, response);
        expect(response.json.args[0][0]).to.eql(product);
      });
    });

    describe("Caso existir", () => {

      const response = {};
      const request = {};
      const product = mocks.productCreateResponse;
      before(function () {
        request.params = { id: 4 };
        request.body = { name: 'Produto1' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "update").resolves(product);
      });

      after(function () {
        productsService.update.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.update(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await productsController.update(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it('O objeto tem as propriedades: "id" e "name"', async function () {
        await productsController.update(request, response);
        expect(response.json.args[0][0]).to.all.keys("id", "name");
      });

      it("Retorna o produto Atualizado", async function () {
        await productsController.update(request, response);
        expect(response.json.args[0][0]).to.eql(product);
      });
    });
  });

  describe("Remove um produto corretamente na rota /product/:id", () => {
    describe("Caso não existir", () => {
      const response = {};
      const request = {};
      const product = { message: "Product not found" };

      before(function () {
        request.params = { id: 4 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "remove").resolves(product);
      });

      after(function () {
        productsService.remove.restore();
      });

      it("Retorna o status 404", async function () {
        await productsController.remove(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await productsController.remove(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it('O objeto tem a propriedade: "message', async function () {
        await productsController.remove(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
      });

      it('Retorna o a mensagem "Product not Found"', async function () {
        await productsController.remove(request, response);
        expect(response.json.args[0][0]).to.eql(product);
      });
    });

    describe("Caso existir", () => {
      const response = {};
      const request = {};
      const product = mocks.productCreateResponse;
      before(function () {
        request.params = { id: 4 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "remove").resolves(product);
      });

      after(function () {
        productsService.remove.restore();
      });

      it("Retorna o status 204", async function () {
        await productsController.remove(request, response);
        expect(response.status.calledWith(204)).to.be.equal(true);
      });
    });
  });

  describe("Retorna o produto pesquisado na rota /product/search", () => {
    describe("Caso não existirem", () => {
      const response = {};
      const request = {};
      const product = { message: "Product not found" };
      before(function () {
        request.query = { q: "Produto1" };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "search").resolves(product);
      });

      after(function () {
        productsService.search.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.search(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um objeto com a propriedade message", async function () {
        await productsController.search(request, response);
        expect(response.json.args[0][0]).to.be.eql(product);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });
    });

    describe("Caso existirem", () => {
      const response = {};
      const request = {};
      const product = mocks.productSearchNameResponse;
      before(function () {
        request.query = { q: "Produto1" };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productsService, "search").resolves(product);
      });

      after(function () {
        productsService.search.restore();
      });

      it("Retorna o status 200", async function () {
        await productsController.search(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array", async function () {
        await productsController.search(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it("O array contém itens do tipo objeto", async function () {
        await productsController.search(request, response);
        expect(response.json.args[0][0]).to.not.empty;
        expect(response.json.args[0][0][0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "id" e "name"', async function () {
        await productsController.search(request, response);
        expect(response.json.args[0][0][0]).to.all.keys("id", "name");
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /product", () => {
    describe("getAll", () => { 
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
    })
    describe("add", () => {
      const response = {};
      const request = {};
      before(function () {
        request.body = "Produto1";
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(productsService, "add")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        productsService.add.restore();
      });

      it("Retorna o status 500", async function () {
        await productsController.add(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await productsController.add(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /product/:id", () => {
    describe('getById', () => { 
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

    describe("update", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = { id: 1 };
        request.body = { name: "Produto1" };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(productsService, "update")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        productsService.update.restore();
      });

      it("Retorna o status 500", async function () {
        await productsController.update(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await productsController.update(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });

    describe("remove", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = { id: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(productsService, "remove")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        productsService.remove.restore();
      });

      it("Retorna o status 500", async function () {
        await productsController.remove(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await productsController.remove(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /product/search", () => { 
    describe("search", () => {
      const response = {};
      const request = {};
      before(function () {
        request.query = { q: "Produto1" };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(productsService, "search")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        productsService.search.restore();
      });

      it("Retorna o status 500", async function () {
        await productsController.search(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await productsController.search(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
  });
});