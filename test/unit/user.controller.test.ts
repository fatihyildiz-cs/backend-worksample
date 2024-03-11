import * as sinon from 'sinon';
import { Request, Response } from 'express';
import { faker } from '@faker-js/faker'
import { UserController } from '../../src/app/controllers/user.controller';
import { UserService } from '../../src/app/services/user.service';
import Container from 'typedi';
import { expect } from 'chai';

describe("UserController", function () {

  let res: Partial<Response> = { json: sinon.spy() };
  const userService = Container.get(UserService);
  const userController = Container.get(UserController);

  afterEach(() => {
    sinon.restore();
  });

  describe("userCreate", function () {
    it("should call the create method of the users service and return the created user as response", async function () {
      const userToCreate = {
        id: faker.database.mongodbObjectId().toString(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        createdAt: new Date()
      };
      const req: Partial<Request> = {
        body: {
          name: userToCreate.name,
          email: userToCreate.email,
        }
      };
      const stub = sinon.stub(userService, "create").resolves(userToCreate);
      await userController.userCreate(req as Request, res as Response);
      expect(stub.calledOnce).to.be.true;
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match(userToCreate));
    });
  });

  describe("userList", function () {
    const users = Array(5).fill(0).map(() => ({
      id: faker.database.mongodbObjectId().toString(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createdAt: faker.date.past()
    }));
    it("should return users sorted ascending when 'created' is set to 'asc'", async function () {
      const req: Partial<Request> = {
        query: { created: 'asc' },
      }
      const stub = sinon.stub(userService, "getAllSorted").resolves(users);
      await userController.userList(req as Request, res as Response);
      expect(stub.calledOnceWith(true)).to.be.true;
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match.array.deepEquals(users));
    });
    it("should return users sorted descending when 'created' is set to 'desc'", async function () {
      const req: Partial<Request> = {
        query: { created: 'desc' },
      }
      const stub = sinon.stub(userService, "getAllSorted").resolves(users);
      await userController.userList(req as Request, res as Response);
      expect(stub.calledOnceWith(false)).to.be.true;
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match.array.deepEquals(users));
    });
    it("should return users sorted descending when 'created' query param is not provided", async function () {
      const req: Partial<Request> = {
        query: {},
      }
      const stub = sinon.stub(userService, "getAllSorted").resolves(users);
      await userController.userList(req as Request, res as Response);
      expect(stub.calledOnceWith(false)).to.be.true;
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match.array.deepEquals(users));
    });
  });
});
