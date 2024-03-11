import sinon from 'sinon'
// Unfortunately this old style import was needed to make this library work. Kind of regretted using it after it was too late :)
require("sinon-mongoose");
import * as sinongMongoose from "sinon-mongoose";
import { faker } from '@faker-js/faker'
import User from '../../src/app/models/user.model';
import { UserRepository } from '../../src/app/repositories/user.repository';
import Container from 'typedi';
import { expect } from 'chai';
import { BadRequestError } from '../../src/app/exceptions/app-error';
describe("UserRepository", function () {

  const userRepository = Container.get(UserRepository);

  afterEach(() => {
    sinon.restore();
  });

  const stubUsers = Array(5).fill(0).map(() => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past()
  }));

  describe("create", function () {
    const stubUser = stubUsers[0];

    it("should add a new user to the db and return it", async function () {
      const stub = sinon.stub(User.prototype, "save").returns(stubUser);
      const user = await userRepository.create({ name: stubUser.name, email: stubUser.email });
      expect(stub.calledOnce).to.be.true;
      expect(user.id).to.equal(stubUser._id);
      expect(user.name).to.equal(stubUser.name);
      expect(user.email).to.equal(stubUser.email);
      expect(user.createdAt).to.equal(stubUser.createdAt);
    });

    it("should handle unique constraint violation (e.g., duplicate email)", async function () {
      const duplicateEmailError: any = new Error(`E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "${stubUser.email}" }`);
      duplicateEmailError.code = 11000;
      duplicateEmailError.keyValue = { email: stubUser.email };

      sinon.stub(User.prototype, "save").rejects(duplicateEmailError);
      try {
        await userRepository.create({ name: stubUser.name, email: stubUser.email });
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.include("Unique constraint failed while creating the user");
        expect(error.context).to.deep.equal({ email: stubUser.email });
      }
    });
  });

  describe("getAll", function () {

    it("should return all users sorted by createdAt in ascending order", async function () {
      const usersSortedAsc = stubUsers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const userMock = sinon.mock(User);
      userMock
        .expects('find')
        .chain('sort').withArgs({ createdAt: -1 })
        .resolves(usersSortedAsc);
      const users = await userRepository.getAllSorted(false);
      expect(users.length).to.equal(usersSortedAsc.length);
      expect(users[0].id).to.equal(usersSortedAsc[0]._id.toString());
      userMock.verify();
    });

    it("should return all users sorted by createdAt in descending order", async function () {
      const usersSortedDesc = stubUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const userMock = sinon.mock(User);
      userMock
        .expects('find')
        .chain('sort').withArgs({ createdAt: 1 })
        .resolves(usersSortedDesc);
      const users = await userRepository.getAllSorted(true);
      expect(users.length).to.equal(usersSortedDesc.length);
      expect(users[0].id).to.equal(usersSortedDesc[0]._id.toString());
      userMock.verify();
    });
  });

});