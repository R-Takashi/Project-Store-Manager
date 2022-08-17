const sinon = require("sinon");
const { expect } = require("chai");
const mocks = require("../../../__tests__/_dataMock");
const salesController = require("../../../controllers/salesController");
const salesService = require("../../../services/salesService");

describe("Test salesControllers", () => { 

  describe("Retorna todas as vendas", () => { 
    describe("Caso não existirem", () => {
      const response = {};
      const request = {};
      before(function () {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "getAll").resolves([]);
      });

      after(function () {
        salesService.getAll.restore();
      });

      it("Retorna o status 200", async function () {
        await salesController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array vazio", async function () {
        await salesController.getAll(request, response);
        expect(response.json.args[0][0]).to.be.empty;
        expect(response.json.calledWith([])).to.be.equal(true);
      });
    });

    describe("Caso existirem", () => {
      const sales = [
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
      const response = {};
      const request = {};

      before(function () {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "getAll").resolves(sales);
      });

      after(function () {
        salesService.getAll.restore();
      });

      it("Retorna o status 200", async function () {
        await salesController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array", async function () {
        await salesController.getAll(request, response);
        expect(response.json.calledWith(sales)).to.be.equal(
          true
        );
      });

      it("O array contém itens do tipo objeto", async function () {
        await salesController.getAll(request, response);
        expect(response.json.args[0][0]).to.not.empty;
        expect(response.json.args[0][0][0]).to.be.an("object");
      });

      it('Os objetos tenham as propriedades: "saleId", "date", "productId" e "quantity"', async function () {
        await salesController.getAll(request, response);
        expect(response.json.args[0][0][0]).to.all.keys("saleId", "date", "productId", "quantity");
      });
    });
  });

  describe("Retorna uma venda pelo id na rota /sales/:id", () => {
    describe("Caso não existir", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = 1;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "getById").resolves(false);
      });

      after(function () {
        salesService.getById.restore();
      });

      it("Retorna o status 404", async function () {
        await salesController.getById(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('Retorna um objeto com a chave/valor -> message: "Sale not found"', async function () {
        const message = { message: "Sale not found" };
        await salesController.getById(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe("Caso existir", () => {
      const sales = [
        {
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2,
        },
        {
          date: "2021-09-09T04:54:54.000Z",
          productId: 2,
          quantity: 2,
        },
      ];
      const response = {};
      const request = {};
      before(function () {
        request.params = "1";
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "getById").resolves(sales);
      });

      after(function () {
        salesService.getById.restore();
      });

      it("Retorna o status 200", async function () {
        await salesController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um array", async function () {
        await salesController.getById(request, response);
        expect(response.json.calledWith(sales)).to.be.equal(true);
      });

       it("O array contém itens do tipo objeto", async function () {
         await salesController.getById(request, response);
         expect(response.json.args[0][0]).to.not.empty;
         expect(response.json.args[0][0][0]).to.be.an("object");
       });

       it('Os objetos tenham as propriedades: "date", "productId" e "quantity"', async function () {
         await salesController.getById(request, response);
         expect(response.json.args[0][0][0]).to.all.keys(
           "date",
           "productId",
           "quantity"
         );
       });
    });
  });

  describe("Adiciona uma venda pela rota /sales", () => {
    describe("Caso produto não existir", () => { 
      const response = {};
      const request = {};
      before(function () {
        request.body = "Produto1";
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "add").resolves(false);
      });

      after(function () {
        salesService.add.restore();
      });

      it("Retorna o status 404", async function () { 
        await salesController.add(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('Retorna um objeto com a chave/valor -> message: "Product not found"', async function () {
        const message = { message: "Product not found" };
        await salesController.add(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe("Caso produto existir", () => { 
      const response = {};
      const request = {};
      const sale = mocks.saleCreateResponse;
      before(function () {
        request.body = mocks.rightSaleBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "add").resolves(sale);
      });
  
      after(function () {
        salesService.add.restore();
      });
  
      it("Retorna o status 201", async function () {
        await salesController.add(request, response);
        expect(response.status.calledWith(201)).to.be.equal(true);
      });
  
      it("Retorna um objeto", async function () {
        await salesController.add(request, response);
        expect(response.json.calledWith(sale)).to.be.equal(true);
      });
  
      it('O objeto tem as propriedades: "id" e "itemsSold"', async function () {
        await salesController.add(request, response);
        expect(response.json.args[0][0]).to.all.keys("id", "itemsSold");
      });
  
      it("Retorna o produto Adicionado", async function () {
        await salesController.add(request, response);
        expect(response.json.args[0][0]).to.eql(sale);
      });

    });
  });

  describe("Remove uma venda pela rota /product/:id", () => {
    describe("Caso venda não existir", () => {
      const response = {};
      const request = {};
      const sale = { message: "Sale not found" };

      before(function () {
        request.params = { id: 4 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "remove").resolves(sale);
      });

      after(function () {
        salesService.remove.restore();
      });

      it("Retorna o status 404", async function () {
        await salesController.remove(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await salesController.remove(request, response);
        expect(response.json.calledWith(sale)).to.be.equal(true);
      });

      it('O objeto tem a propriedade: "message', async function () {
        await salesController.remove(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
      });

      it('Retorna o a mensagem "Sale not Found"', async function () {
        await salesController.remove(request, response);
        expect(response.json.args[0][0]).to.eql(sale);
      });
    });

    describe("Caso venda existir", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = { id: 4 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "remove").resolves("removed");
      });

      after(function () {
        salesService.remove.restore();
      });

      it("Retorna o status 204", async function () {
        await salesController.remove(request, response);
        expect(response.status.calledWith(204)).to.be.equal(true);
      });
    });
  });

  describe("Atualiza uma venda pela rota /sales/:id", () => {
  });

  describe("Atualiza uma venda pela rota /sales/:id", () => {
    describe("Caso venda não existir", () => {
      const response = {};
      const request = {};
      const sale = { message: "Sale not found" };

      before(function () {
        request.params = { id: 4 };
        request.body = mocks.rightSaleBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "update").resolves(sale);
      });

      after(function () {
        salesService.update.restore();
      });

      it("Retorna o status 404", async function () {
        await salesController.update(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await salesController.update(request, response);
        expect(response.json.calledWith(sale)).to.be.equal(true);
      });

      it('O objeto tem a propriedade: "message"', async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
      });

      it('Retorna o a mensagem "Sale not Found"', async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0]).to.eql(sale);
      });
    });

    describe("Caso produto não existir", () => {
      const response = {};
      const request = {};
      const product = { message: "Product not found" };

      before(function () {
        request.params = { id: 4 };
        request.body = mocks.nonexistentProductIdBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "update").resolves(product);
      });

      after(function () {
        salesService.update.restore();
      });

      it("Retorna o status 404", async function () {
        await salesController.update(request, response);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await salesController.update(request, response);
        expect(response.json.calledWith(product)).to.be.equal(true);
      });

      it('O objeto tem a propriedade: "message"', async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0]).to.all.keys("message");
      });

      it('Retorna o a mensagem "Product not Found"', async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0]).to.eql(product);
      });
    });

    describe("Caso venda e produto existir", () => {
      const response = {};
      const request = {};
      const updatedSale = {
        saleId: 1,
        itemsUpdated: mocks.rightSaleBody,
      };;
      before(function () {
        request.params = { id: 1 };
        request.body = mocks.rightSaleBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "update").resolves(updatedSale);
      });

      after(function () {
        salesService.update.restore();
      });

      it("Retorna o status 200", async function () {
        await salesController.update(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it("Retorna um objeto", async function () {
        await salesController.update(request, response);
        expect(response.json.calledWith(updatedSale)).to.be.equal(true);
      });

      it('O objeto tem as propriedades: "saleId" e "itemsUpdated"', async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0]).to.all.keys("saleId", "itemsUpdated");
      });

      it("Retorna a venda Atualizada", async function () {
        await salesController.update(request, response);
        expect(response.json.args[0][0].saleId).to.equal(1);
        expect(response.json.args[0][0]).to.eql(updatedSale);
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /sales", () => {
    describe("getAll", () => {
      const response = {};
      const request = {};
      before(function () {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(salesService, "getAll")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        salesService.getAll.restore();
      });

      it("Retorna o status 500", async function () {
        await salesController.getAll(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await salesController.getAll(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
    describe("add", () => {
      const response = {};
      const request = {};
      before(function () {
        request.body = mocks.rightSaleBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, "add").rejects(new Error("Server-error"));
      });
      after(function () {
        salesService.add.restore();
      });

      it("Retorna o status 500", async function () {
        await salesController.add(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await salesController.add(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
  });

  describe("Testa erro de conexão com o banco na rota /sales/:id", () => {
    describe("getById", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = { id: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(salesService, "getById")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        salesService.getById.restore();
      });

      it("Retorna o status 500", async function () {
        await salesController.getById(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await salesController.getById(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });

    describe("update", () => {
      const response = {};
      const request = {};
      before(function () {
        request.params = { id: 1 };
        request.body = mocks.rightSaleBody;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon
          .stub(salesService, "update")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        salesService.update.restore();
      });

      it("Retorna o status 500", async function () {
        await salesController.update(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await salesController.update(request, response);
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
          .stub(salesService, "remove")
          .rejects(new Error("Server-error"));
      });
      after(function () {
        salesService.remove.restore();
      });

      it("Retorna o status 500", async function () {
        await salesController.remove(request, response);
        expect(response.status.calledWith(500)).to.be.equal(true);
      });

      it('Retorna a mensagem de erro "Server error"', async function () {
        const ERROR_MESSAGE = "Server error";
        await salesController.remove(request, response);
        expect(response.json.args[0][0]).to.eql(ERROR_MESSAGE);
      });
    });
  });

});