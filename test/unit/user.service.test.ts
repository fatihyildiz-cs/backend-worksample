import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import { UserRepository } from '../../src/app/repositories/user.repository';
import { expect } from 'chai';
import { UserService } from '../../src/app/services/user.service';
import Container from 'typedi';

describe("UserService", function () {

  const userRepository = Container.get(UserRepository);
  const userService = Container.get(UserService);

  const stubUsers = Array(5).fill(0).map(() => ({
    id: faker.database.mongodbObjectId().toString(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past()
  }));

  afterEach(() => {
    sinon.restore();
  });

  describe("create", function () {
    it("should call the create method of users repository and return the created user", async function () {
      const stubUser = stubUsers[0]
      const stub = sinon.stub(userRepository, "create").resolves(stubUser);
      const user = await userService.create({ name: stubUser.name, email: stubUser.email });
      expect(stub.calledOnce).to.be.true;
      expect(user.id).to.equal(stubUser.id);
      expect(user.name).to.equal(stubUser.name);
      expect(user.email).to.equal(stubUser.email);
      expect(user.createdAt).to.equal(stubUser.createdAt);
    });
  });

  describe("getAll", function () {
    it("should call the list method of users repository with correct parameter and return the list of users sorted ascending", async function () {
      const usersSorted = stubUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const stub = sinon.stub(userRepository, "getAllSorted").resolves(usersSorted);
      const users = await userService.getAllSorted(true);
      expect(users).to.deep.equal(usersSorted);
      expect(stub.calledOnceWith(true)).to.be.true;
    });

    it("should call the list method of users repository with correct parameter and return the list of users sorted descending", async function () {
      const usersSorted = stubUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const stub = sinon.stub(userRepository, "getAllSorted").resolves(usersSorted);
      const users = await userService.getAllSorted(false);
      expect(users).to.deep.equal(usersSorted);
      expect(stub.calledOnceWith(false)).to.be.true;
    });
  })
});